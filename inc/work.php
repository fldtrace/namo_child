<?php
/*
Work Shortcode function
*/
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

/**************************************
		WORK FOCUS SECTION
**************************************/
if (!function_exists('mgad_work_focus')) {
	function mgad_work_focus() {
		global $post;
		$post = get_field('focus');
		$output = '';
		if ($post) {
			global $post;
			setup_postdata( $post );
			ob_start();
			
			$attachment_id = get_field('project_hero_image');
			$attachment = wp_get_attachment_image_src($attachment_id, 'work-focus');
			?>
			<div class="work_focus" style="background-image: url(<?php echo $attachment[0];?>)">
				<div class="focus_details">
					<h2 class="focus_label">Focus</h2>
					<h3 class="focus_title"><a href="<?php the_permalink();?>"><?php the_title();?> <span class="second_title"><?php the_field('project_title_2');?></span></a></h3>
					<a class="focus_button be-button mediumbtn" href="<?php the_permalink();?>">See Project</a>
				</div>
			</div>
			<?php
			$output = ob_get_clean();
		}
		wp_reset_postdata();
		return $output;
	}
	add_shortcode( 'mgad_work_focus' , 'mgad_work_focus' );
}

/**************************************
		FULL WIDTH WORK SECTION
**************************************/
if (!function_exists('mgad_work')) {
	function mgad_work( $atts ) {
		extract( shortcode_atts( array (
			'items_per_page' => '12'
	    ) , $atts ) );
			
		$output = '';
		$output .= '<div class="work-container" data-showposts="'.$items_per_page.'" data-filter="" data-orderby="" data-order="asc">';
		
		$output .= '<div class="page-title">';
		$output .= '<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
		$output .= '<h1>Work</h1>';
		$output .= '<a class="toggle-filters mediumbtn be-button transbtn expanded" href="#"><span>Filter</span><i class="icon-plus"></i><i class="icon-cancel"></i></a>';
		$output .= '</div></div>';
		
		
		$services = get_terms('portfolio_service');
		if( ! empty( $services ) ) {
			$output .='<div class="work-filters-container expanded">';
			$output .='<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
			$output .='<ul class="work-filters">';
			$output .= '<li class="service-open"><i class="icon-down-open"></i><i class="icon-up-open"></i></li>';
			$output .= '<li><a class="filter filter-service featured" data-filter=".wkitem" href="#">'.__('Featured').'</a>';
			foreach ($services as $service) {
				$output .= '<li class="clearfix"><a class="filter filter-service '.$service->slug.'" data-filter=".'.$service->slug.'" href="#">'.$service->name.'</a>';    		
				
				$sectors = get_field('sectors', $service);
				if ($sectors) { 
					$output .= '<div class="sector-filters">';
					$output .= '<div class="filters-label">'.__('Sector').'</div>';
					$output .= '<ul>';
					$output .= '<li><a class="filter" data-filter="" href="#">'.__('All').'</a></li>'; 
					foreach ($sectors as $sector) {
						$output .= '<li><a class="filter" data-filter=".'.$sector->slug.'" href="#">'.$sector->name.'</a></li>'; 
					}
					$output .= '</ul></div>';
				}
				
				// only show "types" as "sectors" if the service is brand
				if ($service->slug == 'branding') :
					$types = get_terms('portfolio_type');
					if (!empty($types) && !is_wp_error($types)) {
						$output .= '<div class="sector-filters type-filters">';
						$output .= '<ul>';
						$output .= '<li><a class="filter" data-filter="" href="#">'.__('All').'</a></li>'; 
						foreach ($types as $type) {
							$output .= '<li><a class="filter" data-filter=".'.$type->slug.'" href="#">'.$type->name.'</a></li>'; 
						}
						$output .= '</ul></div>';
					}
				endif;
				
				$locations = get_field('locations', $service);
				if ($locations) { 
					$output .= '<div class="location-filters">';
					$output .= '<div class="filters-label">'.__('Location').'</div>';
					$output .= '<ul>';
					$output .= '<li><a class="filter" data-filter="" href="#">'.__('All').'</a></li>'; 
					foreach ($locations as $location) {
						$output .= '<li><a class="filter" data-filter=".'.$location->slug.'" href="#">'.$location->name.'</a></li>'; 
					}
					$output .= '</ul></div>';
				}
				
				$output .= '</li>';
			}
			
			$output .= '</ul>';
			$output .= '<div class="work-filters-buttons">';
			$output .= '<a class="apply-filters mediumbtn transbtn be-button" href="#">Apply</a>';
			$output .= '<a class="clear-filters mediumbtn transbtn be-button" href="#">Clear Filters</a>';
			$output .= '</div></div></div>';
		}
		
		
		$output .= '
		<div class="work-grid-container">
			<div class="">
				<div class="work-grid-info clearfix">
					<div class="work-breadcrumbs"></div>
					<div class="work-results-count"></div>
					<div class="work-views">
						<div class="work-search"><input class="work-search-input" type="text" name="s" placeholder="Search Work" autocomplete="off"><a href="#"><i></i></a></div>
						<a class="work-view-grid work-view-button is-active" href="#" data-view="grid"><i></i></a>
						<a class="work-view-list work-view-button" href="#" data-view="list"><i></i></a>
					</div>
				</div>
				
				<div class="work-table-head clearfix">
					<span class="wkitem-title"><a class="sort" data-order="" data-orderby="title" href="#">Project <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
					<span class="wkitem-service"><a class="sort" data-order="" data-orderby="service" href="#">Service <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
					<span class="wkitem-sectors">Type</span>
					<span class="wkitem-location"><a class="sort" data-order="" data-orderby="location" href="#">Location <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
				</div>';
		
		$output .='<div class="work-grid clearfix">';
		$args = array(
			'post_type' => 'project',
			'status' => 'publish',
			'posts_per_page' => -1				
		);

		$the_query = new WP_Query( $args );
		while ( $the_query->have_posts() ) : $the_query->the_post();
			$filter_classes = '';
			$permalink = '';
			
			$services = mgad_get_terms('portfolio_service');
			$sectors = mgad_get_terms('portfolio_sector');
			$types = mgad_get_terms('portfolio_type');
			$location = mgad_get_terms('portfolio_location');
			
			$location2 = get_field('project_location');
			$large_client_story = get_field('large_client_story');
			
			$all_slugs = array_merge($services[1], $sectors[1], $location[1]);
			$filter_classes = join(' ', $all_slugs);
			
			
			$attachment_id = get_post_thumbnail_id(get_the_ID());
			$image_size = $large_client_story?'work-masonry-wide':'work-masonry';
			$image_size_class = $large_client_story?'wide':'';
			
			$attachment_thumb=wp_get_attachment_image_src( $attachment_id, $image_size);
			
			$visit_site_url = get_post_meta( get_the_ID(), 'be_themes_portfolio_external_url', true );
			$link_to = get_post_meta( get_the_ID(), 'be_themes_portfolio_link_to', true );
			$permalink = ( $link_to == 'external_url' ) ? $visit_site_url : get_permalink() ; 
			
			$second_title = get_field('project_title_2');
			
			$featured_class = get_field('project_featured')?'featured':'';
					
			$output .='<div class="wkitem '.$filter_classes.' '.$featured_class.' '.$image_size_class.'">';
			$output .= '<div class="wkitem-inner clearfix">';
			$output .= '<a class="wkitem-img-wrap" href="'.$permalink.'"><img class="wkitem-img" src="" data-src="'.$attachment_thumb[0].'" width="'. $$attachment_thumb[1] .'" height="'.$attachment_thumb[2].'" alt /></a>';
			$output .= '<h3 class="wkitem-title"><a href="'.$permalink.'">'.get_the_title();
			if ($second_title) $output .= '<span class="wkitem-title2">'.$second_title.'</span>';
			$output .= '</a></h3>';
			
			$output .= '
				<div class="wkitem-service">';
			$i = 0;
			foreach ($services[0] as $service_name) :
				if ($i>0) $output .= ', ';
				$output .= '<a href="#" class="wkitem-filter" data-filter=".'.$services[1][$i++].'">'.$service_name.'</a>';
			endforeach;
			$output .= '</div>';
			
			if (!empty($sectors[0])) :
				$output .= '
					<div class="wkitem-sectors">';
				$i = 0;
				foreach ($sectors[0] as $sector_name) :
					if ($i>0) $output .= ', ';
					$output .= '<a href="#" class="wkitem-filter" data-filter=".'.$sectors[1][$i++].'">'.$sector_name.'</a>';
				endforeach;
				$output .= '</div>';
			endif;
			
			if (!empty($types[0])) :
				$output .= '
					<div class="wkitem-sectors">';
				$i = 0;
				foreach ($types[0] as $sector_name) :
					if ($i>0) $output .= ', ';
					$output .= '<a href="#" class="wkitem-filter" data-filter=".'.$types[1][$i++].'">'.$sector_name.'</a>';
				endforeach;
				$output .= '</div>';
			endif;		
			
			if (!empty($location[0])) :
				$output .= '<div class="wkitem-location"><a href="#" class="wkitem-filter" data-filter=".'.join(', ', $location[1]).'">'.join(', ', $location[0]).'</a>';
				if ($location2) $output .= '<div>'.$location2.'</div>';
				$output .='</div>';
			endif;
			$output .= '</div></div>';//end element
		endwhile;
		wp_reset_postdata();
		$output .='</div></div></div>'; //end work-grid
		
		if( $items_per_page != '-1' || $items_per_page == $the_query->found_posts ) {
			$output .='<div class="work-load-more load-hidden"><a class="be-shortcode mediumbtn be-button" href="#">Load More</a></div>';
		}
		$output .='</div>'; //end work-container
		return $output;
	}
	add_shortcode( 'mgad_work' , 'mgad_work' );
}



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

	/* Find all projects that have same title or second title 
		Different weights:
			Title: 20
			Second Title: 10
	*/
	
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