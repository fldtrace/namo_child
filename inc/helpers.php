<?php
/* 
	PRINT A VARIABLE IF IT EXISTS (NOT EMPTY)
*/
function mgad_print($var, $before, $after) {
	if ($var) echo $before . $var . $after;
}

function mgad_get_terms($taxonomy) {
	global $post;
	$terms = get_the_terms($post, $taxonomy);
	$names = array();
	$slugs = array();
	if ( $terms && ! is_wp_error( $terms ) ) : 
    foreach ( $terms as $term ) {
        $names[] = $term->name;
				$slugs[] = $term->slug;
    }
	endif;
	return array($names, $slugs);
}

/*
	FIND A PROJECT'S RELATED PROJECTS, MUST BE USED IN A LOOP
*/
function mgad_get_project_related_projects($posts_num = 2) {
	global $wpdb, $post;
	
	// get cached data
	if ($_GET['refresh'] == 1)
		delete_transient('prj_rel_prj_' . $post->ID);
	else {
		$post_ids = get_transient('prj_rel_prj_' . $post->ID);
		if ($post_ids) return $post_ids;
	}	
	
	$project_title = get_the_title();
	$project_title_2 = get_field('project_title_2');

	/* Find all projects that have same title or second title 
		Different weights:
			Title: 20
			Second Title: 10
	*/
	$post_ids = $wpdb->get_col( $wpdb->prepare( 
		"
		SELECT      posts.ID,
								IF(posts.post_title LIKE %s, 20, 0) + IF(postmeta.meta_value LIKE %s, 10, 0) as weight
		FROM        $wpdb->posts posts
		LEFT OUTER JOIN  $wpdb->postmeta postmeta
								ON posts.ID = postmeta.post_id
								AND postmeta.meta_key = 'project_title_2'
		WHERE       posts.ID <> %s
								AND posts.post_type = 'project'
								AND	posts.post_status = 'publish'
								AND (posts.post_title LIKE %s
								OR postmeta.meta_value LIKE %s)
		ORDER BY		weight DESC, posts.post_date DESC
		LIMIT 0,$posts_num
		",
		'%' . $wpdb->esc_like($project_title) . '%',
		'%' . $wpdb->esc_like($project_title_2) . '%',
		$post->ID,
		'%' . $wpdb->esc_like($project_title) . '%',
		'%' . $wpdb->esc_like($project_title_2) . '%'
	) );

	
	// if not enough projects found, find projects that have same terms
	if (sizeof($post_ids) < $posts_num) :
		$posts_num = $posts_num - sizeof($post_ids);
	
		//find all terms assigned to the current project
		$term_ids = $wpdb->get_col( $wpdb->prepare( 
			"
			SELECT      termtax.term_id
			FROM        $wpdb->posts posts
			INNER JOIN  $wpdb->term_relationships termrel
									ON posts.ID = termrel.object_id
			INNER JOIN  $wpdb->term_taxonomy termtax
									ON termtax.term_taxonomy_id = termrel.term_taxonomy_id						
			WHERE       posts.ID = %s
			",
			$post->ID
		) ); 
		$term_ids = implode(',', $term_ids);
		
		/* Find all projects that have same terms 
			Different weights for taxonomies:
				Service: 20
				Sector, Type, Location, Anecdotal: 5
		*/
		
		$posts_not_in = $post_ids;
		$posts_not_in[] = $post->ID;
		
		$post_ids_2 = $wpdb->get_col( $wpdb->prepare( 
			"
			SELECT      posts.ID,
									posts.post_date,
									SUM(IF(termtax.taxonomy = 'portfolio_service', 20, 0) + IF(termtax.taxonomy IN ('portfolio_sector', 'portfolio_type', 'portfolio_anecdotal'), 5, 0)) as weight
			FROM        $wpdb->posts posts
			INNER JOIN  $wpdb->term_relationships termrel
									ON posts.ID = termrel.object_id
			INNER JOIN  $wpdb->term_taxonomy termtax
									ON termtax.term_taxonomy_id = termrel.term_taxonomy_id						
			WHERE       posts.ID NOT IN %s
									AND posts.post_type = 'project'
									AND	posts.post_status = 'publish'
									AND termtax.term_id IN ($term_ids)
			GROUP BY		posts.ID
			ORDER BY		weight DESC, posts.post_date DESC
			LIMIT 0,%s
			",
			'(' . implode(',', $posts_not_in) . ')',
			$posts_num
		) ); 
		
		$post_ids = array_merge($post_ids, $post_ids_2);
	endif;

	set_transient('prj_rel_prj_' . $post->ID, $post_ids, 60 * 60 * 24 * 2);
	
	return $post_ids;
}

/*
	FIND A PROJECT'S RELATED NEWS, MUST BE USED IN A LOOP
*/
function mgad_get_project_related_news($posts_num = 4) {
	global $wpdb, $post;
	
	
	// get cached data
	if ($_GET['refresh'] == 1)
		delete_transient('prj_rel_news_' . $post->ID);
	else {
		$post_ids = get_transient('prj_rel_news_' . $post->ID);
		if ($post_ids) return $post_ids;
	}
	
	
	
	$project_title = get_the_title();
	$project_title_2 = get_field('project_title_2');

	// search with project title 
	$related_query = new WP_Query( array( 
		's' => '"'.$project_title.'"',
		'post_type' => 'post',
		'posts_per_page' => $posts_num,
		'ignore_sticky_posts' => true,
		'fields' => 'ids'
	));
	
	if (function_exists('relevanssi_do_query'))
		relevanssi_do_query($related_query);
	
	$post_ids = $related_query->posts;
	
	// if not enough posts found, search with project second title 
	if (sizeof($post_ids) < $posts_num) :
		$related_query = new WP_Query( array( 
			's' => '"'.$project_title_2.'"',
			'post_type' => 'post',
			'posts_per_page' => $posts_num - sizeof($post_ids),
			'post__not_in' => $post_ids,
			'ignore_sticky_posts' => true,
			'fields' => 'ids'
		));
		
		if (function_exists('relevanssi_do_query'))
			relevanssi_do_query($related_query);
	
		$post_ids_2 = $related_query->posts;
		$post_ids = array_merge($post_ids, $post_ids_2);
	endif;
	
	
	// if not enough posts found, search with project terms (filters and keywords)
	if (sizeof($post_ids) < $posts_num) :	
		//find all terms assigned to the current project
		$term_slugs = $wpdb->get_col( $wpdb->prepare( 
			"
			SELECT      terms.slug
			FROM        $wpdb->posts posts
			INNER JOIN  $wpdb->term_relationships termrel
									ON posts.ID = termrel.object_id
			INNER JOIN  $wpdb->term_taxonomy termtax
									ON termtax.term_taxonomy_id = termrel.term_taxonomy_id
			INNER JOIN  $wpdb->terms terms
									ON termtax.term_id = terms.term_id	
			WHERE       posts.ID = %s
			",
			$post->ID
		) ); 
		$terms = implode(',', $term_slugs);
		
		$related_query = new WP_Query( array( 
			's' => implode(' ', $term_slugs),
			'operator' => 'OR',
			'post_type' => 'post',
			'posts_per_page' => $posts_num - sizeof($post_ids),
			'post__not_in' => $post_ids,
			'ignore_sticky_posts' => true,
			'fields' => 'ids'
		));
		
		if (function_exists('relevanssi_do_query'))
			relevanssi_do_query($related_query);		
		$post_ids_2 = $related_query->posts;
		$post_ids = array_merge($post_ids, $post_ids_2);
		
	endif;
	

	set_transient('prj_rel_news_' . $post->ID, $post_ids, 60 * 60 * 24 * 2);
	
	return $post_ids;
}


/*
	FIND A PROFILE'S RELATED UPDATES, MUST BE USED IN A LOOP
*/
function mgad_get_profile_related_updates($posts_num = 4) {
	global $wpdb, $post;
	
	
	// get cached data
	if ($_GET['refresh'] == 1)
		delete_transient('profile_rel_updates_' . $post->ID);
	else {
		$post_ids = get_transient('profile_rel_updates_' . $post->ID);
		if ($post_ids) return $post_ids;
	}
	
	$profile_title = get_the_title();


	$related_query = new WP_Query( array( 
		's' => '"'.$profile_title.'"',
		'post_type' => 'post',
		'posts_per_page' => $posts_num,
		'ignore_sticky_posts' => true,
		'fields' => 'ids'
	));
	
	if (function_exists('relevanssi_do_query'))
		relevanssi_do_query($related_query);
	
	$post_ids = $related_query->posts;

	set_transient('profile_rel_updates_' . $post->ID, $post_ids, 60 * 60 * 24 * 2);
	
	return $post_ids;	
}