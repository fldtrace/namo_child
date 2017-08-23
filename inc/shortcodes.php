<?php
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
			<div class="focus-section work-focus" style="background-image: url(<?php echo $attachment[0];?>)">
				<div class="focus-details">
					<h2 class="focus-label">Focus</h2>
					<h3 class="focus-title"><a href="<?php the_permalink();?>"><?php the_title();?> <span class="second_title"><?php the_field('project_title_2');?></span></a></h3>
					<a class="focus-button be-button mediumbtn" href="<?php the_permalink();?>">See Project</a>
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
		FILTERABLE WORK SECTION
**************************************/
if (!function_exists('mgad_work')) {
	function mgad_work( $atts ) {
		extract( shortcode_atts( array (
			'items_per_page' => '12'
	    ) , $atts ) );
			
		$output = '';
		$output .= '<div class="filterable-container work-filterable" data-showposts="'.$items_per_page.'" data-filter="" data-orderby="" data-order="asc">';
		
		$output .= '<div class="breadcrumbs">';
		$output .= '<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
		$output .= '<h1>'.__('Work', 'mgad').'</h1>';
		$output .= '<a class="toggle-filters mediumbtn be-button transbtn expanded" href="#"><span>Filter</span><i class="icon-plus"></i><i class="icon-cancel"></i></a>';
		$output .= '</div></div>';
		
		
		$services = get_terms('project_service');
		if( ! empty( $services ) ) {
			$output .='<div class="filterable-filters-container expanded">';
			$output .='<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
			$output .='<ul class="filterable-filters">';
			$output .= '<li class="lv1-open"><i class="icon-down-open"></i><i class="icon-up-open"></i></li>';
			$output .= '<li><a class="filter filter-lv1 featured" data-filter=".ftitem" href="#">'.__('Featured').'</a>';
			foreach ($services as $service) {
				$output .= '<li class="clearfix"><a class="filter filter-lv1 '.$service->slug.'" data-filter=".'.$service->slug.'" href="#">'.$service->name.'</a>';    		
				
				$sectors = get_field('sectors', $service);
				if ($sectors) { 
					$output .= '<div class="lv2-filters">';
					$output .= '<div class="filters-label">'.__('Sector').'</div>';
					$output .= '<ul>';
					$output .= '<li><a class="filter" data-filter="" href="#">'.__('All').'</a></li>'; 
					foreach ($sectors as $sector) {
						$output .= '<li><a class="filter" data-filter=".'.$sector->slug.'" href="#">'.$sector->name.'</a></li>'; 
					}
					$output .= '</ul></div>';
				}
				
				$locations = get_field('locations', $service);
				if ($locations) { 
					$output .= '<div class="lv3-filters">';
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
			$output .= '<div class="filterable-filters-buttons">';
			$output .= '<a class="apply-filters mediumbtn transbtn be-button" href="#">Apply</a>';
			$output .= '<a class="clear-filters mediumbtn transbtn be-button" href="#">Clear Filters</a>';
			$output .= '</div></div></div>';
		}
		
		
		$output .= '
		<div class="filterable-grid-container">
			<div class="">
				<div class="filterable-grid-info clearfix">
					<div class="filterable-breadcrumbs"></div>
					<div class="filterable-results-count"></div>
					<div class="filterable-views">
						<div class="filterable-search"><input class="filterable-search-input" type="text" name="s" placeholder="Search Work" autocomplete="off"><a href="#"><i></i></a></div>
						<a class="filterable-view-grid filterable-view-button is-active" href="#" data-view="grid"><i></i></a>
						<a class="filterable-view-list filterable-view-button" href="#" data-view="list"><i></i></a>
					</div>
				</div>
				
				<div class="filterable-table-head clearfix">
					<span class="ftitem-title"><a class="sort" data-order="" data-orderby="title" href="#">Project <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
					<span class="ftitem-service"><a class="sort" data-order="" data-orderby="lv1" href="#">Service <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
					<span class="ftitem-sector">Type</span>
					<span class="ftitem-location"><a class="sort" data-order="" data-orderby="lv3" href="#">Location <i class="icon-up-open"></i><i class="icon-down-open"></i></a></span>
				</div>';
		
		$output .='<div class="filterable-grid clearfix">';
		$args = array(
			'post_type' => 'project',
			'status' => 'publish',
			'posts_per_page' => -1				
		);

		$the_query = new WP_Query( $args );
		while ( $the_query->have_posts() ) : $the_query->the_post();
			$filter_classes = '';
			$permalink = '';
			
			$services = mgad_get_terms('project_service');
			$sectors = mgad_get_terms('project_sector');
			$location = mgad_get_terms('project_location');
			
			$location2 = get_field('project_location');
			$large_client_story = get_field('large_client_story');
			
			$all_slugs = array_merge($services[1], $sectors[1], $location[1]);
			$filter_classes = join(' ', $all_slugs);
			
			
			$attachment_id = get_post_thumbnail_id();
			$image_size = $large_client_story?'work-masonry-wide':'work-masonry';
			$image_size_class = $large_client_story?'wide':'';
			
			$attachment_thumb=wp_get_attachment_image_src( $attachment_id, $image_size);
			
			$permalink = get_permalink() ; 
			
			$second_title = get_field('project_title_2');
			
					
			$output .='<div class="ftitem '.$filter_classes.' '.$image_size_class.'">';
			$output .= '<div class="ftitem-inner clearfix">';
			$output .= '<a class="ftitem-img-wrap" href="'.$permalink.'"><img class="ftitem-img" src="" data-src="'.$attachment_thumb[0].'" width="'. $$attachment_thumb[1] .'" height="'.$attachment_thumb[2].'" alt /></a>';
			$output .= '<h3 class="ftitem-title"><a href="'.$permalink.'">'.get_the_title();
			if ($second_title) $output .= '<span class="ftitem-title2">'.$second_title.'</span>';
			$output .= '</a></h3>';
			
			$output .= '
				<div class="ftitem-service">';
			$i = 0;
			foreach ($services[0] as $service_name) :
				if ($i>0) $output .= ', ';
				$output .= '<a href="#" class="ftitem-filter ftitem-filter-lv1" data-filter=".'.$services[1][$i++].'">'.$service_name.'</a>';
			endforeach;
			$output .= '</div>';
			
			if (!empty($sectors[0])) :
				$output .= '
					<div class="ftitem-sector">';
				$i = 0;
				foreach ($sectors[0] as $sector_name) :
					if ($i>0) $output .= ', ';
					$output .= '<a href="#" class="ftitem-filter ftitem-filter-lv2" data-filter=".'.$sectors[1][$i++].'">'.$sector_name.'</a>';
				endforeach;
				$output .= '</div>';
			endif;
			
			if (!empty($location[0])) :
				$output .= '<div class="ftitem-location"><a href="#" class="ftitem-filter ftitem-filter-lv3" data-filter=".'.join(', ', $location[1]).'">'.join(', ', $location[0]).'</a>';
				if ($location2) $output .= '<div>'.$location2.'</div>';
				$output .='</div>';
			endif;
			$output .= '</div></div>';//end element
		endwhile;
		wp_reset_postdata();
		$output .='</div></div></div>'; //end filterable-grid
		
		if( $items_per_page != '-1' || $items_per_page == $the_query->found_posts ) {
			$output .='<div class="filterable-load-more load-hidden"><a class="be-shortcode mediumbtn be-button" href="#">Load More</a></div>';
		}
		$output .='</div>'; //end filterable-container
		return $output;
	}
	add_shortcode( 'mgad_work' , 'mgad_work' );
}



/**************************************
		WORK FOCUS SECTION
**************************************/
if (!function_exists('mgad_updates_focus')) {
	function mgad_updates_focus() {
		global $post;
		$post = get_field('focus');
		$output = '';
		if ($post) {
			global $post;
			setup_postdata( $post );
			ob_start();
			
			$attachment_id = get_post_thumbnail_id();
			$attachment = wp_get_attachment_image_src($attachment_id, 'news-thumbnail-sp');
			?>
			<div class="focus-section updates-focus">
				<div class="focus-bg" style="background-image: url(<?php echo $attachment[0];?>)"></div>
				<div class="focus-details">
					<h3 class="focus-label"><a href="<?php the_permalink();?>"><?php the_title();?></a></h3>
					<div class="focus-author focus-title">By <?php the_author();?></div>
					<a class="focus-button be-button mediumbtn transbtn" href="<?php the_permalink();?>">Read More</a>
				</div>
			</div>
			<?php
			$output = ob_get_clean();
		}
		wp_reset_postdata();
		return $output;
	}
	add_shortcode( 'mgad_updates_focus' , 'mgad_updates_focus' );
}

/**************************************
		FILTERABLE UPDATES SECTION
**************************************/
if (!function_exists('mgad_updates')) {
	function mgad_updates( $atts ) {
		extract( shortcode_atts( array (
			'items_per_page' => '12'
	    ) , $atts ) );
			
		$output = '';
		$output .= '<div class="filterable-container updates-filterable" data-showposts="'.$items_per_page.'" data-filter="" data-orderby="" data-order="asc">';
		
		$output .= '<div class="breadcrumbs">';
		$output .= '<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
		$output .= '<h1>'.__('Updates', 'mgad').'</h1>';
		$output .= '<a class="toggle-filters mediumbtn be-button transbtn expanded" href="#"><span>Filter</span><i class="icon-plus"></i><i class="icon-cancel"></i></a>';
		$output .= '</div></div>';
		
		
		$lv1_terms = get_terms( array(
			'taxonomy' => 'category',
			'hide_empty' => false,
			'parent' => 0
		) );
		
		if( ! empty( $lv1_terms ) ) {
			$output .='<div class="filterable-filters-container expanded">';
			$output .='<div class="be-row clearfix be-wrap zero-bottom be-no-space">';
			$output .='<ul class="filterable-filters">';
			$output .= '<li class="lv1-open"><i class="icon-down-open"></i><i class="icon-up-open"></i></li>';
			$output .= '<li><a class="filter filter-lv1 featured" data-filter=".ftitem" href="#">'.__('Featured').'</a>';
			foreach ($lv1_terms as $lv1_term) {
				if ($lv1_term->slug == 'uncategorized') continue;
				
				$output .= '<li class="clearfix"><a class="filter filter-lv1 '.$lv1_term->slug.'" data-filter=".'.$lv1_term->slug.'" href="#">'.$lv1_term->name.'</a>';    		
				
				$lv2_terms = get_terms( array(
					'taxonomy' => 'category',
					'hide_empty' => false,
					'parent' => $lv1_term->term_id
				) );
				if ($lv2_terms) { 
					$output .= '<div class="lv2-filters">';
					$output .= '<div class="filters-label">'.__('Categories').'</div>';
					$output .= '<ul>';
					$output .= '<li><a class="filter" data-filter="" href="#">'.__('All').'</a></li>'; 
					foreach ($lv2_terms as $lv2_term) {
						$output .= '<li><a class="filter" data-filter=".'.$lv2_term->slug.'" href="#">'.$lv2_term->name.'</a></li>'; 
					}
					$output .= '</ul></div>';
				}
				
				$output .= '</li>';
			}
			
			$output .= '</ul>';
			$output .= '<div class="filterable-filters-buttons">';
			$output .= '<a class="apply-filters mediumbtn transbtn be-button" href="#">Apply</a>';
			$output .= '<a class="clear-filters mediumbtn transbtn be-button" href="#">Clear Filters</a>';
			$output .= '</div></div></div>';
		}
		
		
		$output .= '
		<div class="filterable-grid-container">
			<div class="">
				<div class="filterable-grid-info clearfix">
					<div class="filterable-breadcrumbs"></div>
					<div class="filterable-results-count"></div>
					<div class="filterable-views">
						<div class="filterable-search"><input class="filterable-search-input" type="text" name="s" placeholder="Search Updates" autocomplete="off"><a href="#"><i></i></a></div>
						<a class="filterable-view-grid filterable-view-button is-active" href="#" data-view="grid"><i></i></a>
						<a class="filterable-view-list filterable-view-button" href="#" data-view="list"><i></i></a>
					</div>
				</div>';
		
		$output .='<div class="filterable-grid clearfix">';
		$args = array(
			'post_type' => 'post',
			'status' => 'publish',
			'posts_per_page' => -1			
		);

		$the_query = new WP_Query( $args );
		while ( $the_query->have_posts() ) : $the_query->the_post();
			$filter_classes = '';
			$permalink = '';
			
			$categories = mgad_get_terms('category');
			
			$all_slugs = array_merge($categories[1]);
			$filter_classes = join(' ', $all_slugs);
			
			
			$attachment_id = get_post_thumbnail_id();
			$image_size = 'news-thumbnail-sp';
			
			$attachment_thumb = wp_get_attachment_image_src( $attachment_id, $image_size);
			
			$permalink = get_permalink() ; 
			
			$categories = get_the_category($post_id);
			$lv1_term = null;
			$lv2_term = null;

			foreach ($categories as $category) {
				if (!empty($category->category_parent))	$lv2_term = $category;
				else if ($category->slug != 'uncategorized') $lv1_term = $category;
			}
			
			if (!$lv1_term || !$lv2_term) continue;

			$output .='<div class="ftitem rc-item '.$filter_classes.' '.$image_size_class.'">';
			$output .= '<div class="ftitem-inner clearfix">';
			$output .= '<a class="ftitem-img-wrap" href="'.$permalink.'"><img class="ftitem-img" src="" data-src="'.$attachment_thumb[0].'" width="'. $$attachment_thumb[1] .'" height="'.$attachment_thumb[2].'" alt /></a>';
			$output .= '<div class="ftitem-details">';
			$output .= '<span class="ftitem-filter ftitem-filter-lv1" data-filter=".' . $lv1_term->slug . '"></span>';
			$output .= '<a class="rc-item-cat ftitem-filter ftitem-filter-lv2" data-filter=".' . $lv2_term->slug . '" href="#">' . $lv2_term->name . '</a>';
			$output .= '<span class="rc-item-date">' . get_the_date('m.d.y') . '</span>';
			$output .= '<div class="clear"></div>';
			$output .= '<h3 class="ftitem-title"><a href="'.$permalink.'">'.get_the_title().'</a></h3>';
			
			$author_name = get_field('author_name');
			if ($author_name) {
				$output .= '<div class="ftitem-author">By ' . $author_name . '</div>';
			}

			$output .= '<div class="ftitem-excerpt">' . get_the_excerpt() . '</div>';
			$output .= '</div>';
			
			$output .= '</div></div>';//end element
		endwhile;
		wp_reset_postdata();
		$output .='</div></div></div>'; //end filterable-grid
		
		if( $items_per_page != '-1' || $items_per_page == $the_query->found_posts ) {
			$output .='<div class="filterable-load-more load-hidden"><a class="be-shortcode mediumbtn be-button" href="#">Load More</a></div>';
		}
		$output .='</div>'; //end filterable-container
		return $output;
	}
	add_shortcode( 'mgad_updates' , 'mgad_updates' );
}




/**************************************
		SOCIAL SHARE BOX SHORTCODE
**************************************/
function mgad_social_sharing() { 
	global $post;

	$post_title = urlencode(get_the_title());
	$post_url = urlencode(get_permalink());

	ob_start();
	?>
	<div id="project-sharing" class="social-sharing">
		<a target="_blank" href="http://www.facebook.com/sharer.php?u=<?php echo urlencode($post_url);?>" title="Share on Facebook"><i class="icon-mgad-facebook"></i><i class="icon-mgad-facebook active"></i></a>
		<a target="_blank" href="https://twitter.com/home?status=<?php echo urlencode($post_url);?>"><i class="icon-mgad-twitter"></i><i class="icon-mgad-twitter active"></i></a>
		<a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode($post_url);?>&title=<?php echo urlencode($post_title);?>"><i class="icon-mgad-linkedin"></i><i class="icon-mgad-linkedin active"></i></a>
		<a target="_blank" href="mailto:?&body=<?php echo urlencode($post_url);?>"><i class="icon-mgad-mail"></i><i class="icon-mgad-mail active"></i></a>
	</div>
	<?php

	return ob_get_clean();
}
add_shortcode('mgad_social_sharing', 'mgad_social_sharing');


function mgad_recent_news() {
	ob_start();
	
	$args = array(
		'post_type' => 'post',
		'status' => 'publish',
		'category_name' => 'news',
		'posts_per_page' => 3,
		'orderby' => 'date',
		'order' => 'DESC'
	);

	$the_query = new WP_Query( $args );
	if ( $the_query->have_posts() ) : ?>
		<div class="be-row be-wrap clearfix zero-bottom be-no-space recent-news">
			<div class="one-fourth column-block clearfix">
				<h2><?php _e('News', 'mgad');?></h2>
				<a class="be-button mediumbtn transbtn" href="<?php echo home_url('/updates/#news');?>">More News</a>
			</div>
			<?php
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$categories = get_the_category();
				$cat = NULL;

				foreach ($categories as $category) {
					if (!empty($category->category_parent))	$cat = $category;
				}
				if (empty($cat)) $cat = $categories[0];

				$img_id = get_post_thumbnail_id();
				
				$img = wp_get_attachment_image_src($img_id, 'news-thumbnail-sp');
				
				$permalink = get_permalink();
				?>
				<div class="one-fourth column-block clearfix">
					<div class="rc-item">
						<a class="rc-item-img" href="<?php echo $permalink;?>"><img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt=""></a>
						<a class="rc-item-cat" href="<?php echo get_category_link($cat->term_id);?>"><?php echo $cat->name;?></a>
						<span class="rc-item-date"><?php echo get_the_date('m.d.y');?></span>
						<div class="clear"></div>
						<a class="rc-item-title" href="<?php echo $permalink;?>"><?php the_title();?></a>
					</div>
				</div>	
				<?php
			endwhile;?>
		</div>
		<?php
	endif;
		
	return ob_get_clean();		
}	
add_shortcode('mgad_recent_news', 'mgad_recent_news');


function mgad_recent_blog_posts() {
	ob_start();
	
	$args = array(
		'post_type' => 'post',
		'status' => 'publish',
		'category_name' => 'blog',
		'posts_per_page' => 5,
		'orderby' => 'date',
		'order' => 'DESC'
	);

	$the_query = new WP_Query( $args );
	if ( $the_query->have_posts() ) : ?>
		<div class="be-row be-wrap clearfix zero-bottom be-no-space">
			<div class="one-col column-block clearfix">
				<h2><?php _e('Insights', 'mgad');?></h2>
			</div>
		</div>
		<div class="be-row be-wrap clearfix zero-bottom be-no-space">
			<div class="recent-posts clearfix">
				<?php
				while ( $the_query->have_posts() ) : $the_query->the_post();
					$categories = get_the_category();
					$cat = NULL;

					foreach ($categories as $category) {
						if (!empty($category->category_parent))	$cat = $category;
					}
					if (empty($cat)) $cat = $categories[0];

					$img_id = get_post_thumbnail_id();
					
					$img = wp_get_attachment_image_src($img_id, 'news-thumbnail-sp');
					
					$permalink = get_permalink();
					
					?>
					<div class="rc-item">
						<a class="rc-item-img" href="<?php echo $permalink;?>"><img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt=""></a>
						<a class="rc-item-cat" href="<?php echo get_category_link($cat->term_id);?>"><?php echo $cat->name;?></a>
						<div class="rc-item-details clear">
							<a class="rc-item-title" href="<?php echo $permalink;?>"><?php the_title();?></a>
							<div class="rc-item-excerpt"><?php the_excerpt();?></div>
							<a class="rc-item-link" href="<?php echo $permalink;?>">Read More</a>
						</div>
					</div>
					<?php
				endwhile;?>
			</div>
		</div>
		<?php
	endif;
		
	return ob_get_clean();		
}	
add_shortcode('mgad_recent_blog_posts', 'mgad_recent_blog_posts');



function mgad_people() {
	ob_start();
	
	$args = array(
		'post_type' => 'team_manager',
		'status' => 'publish',
		'posts_per_page' => -1
	);

	$the_query = new WP_Query( $args );
	if ( $the_query->have_posts() ) : ?>
		<div class="people-grid">
			<?php
			while ( $the_query->have_posts() ) : $the_query->the_post();
				$img_id = get_field('headshot_image');
				$img = wp_get_attachment_image_src($img_id, 'team-thumbnail');
				?>
				<div class="profile">
					<h3>
						<a href="<?php the_permalink();?>">
							<img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
							<span class="profile-name"><?php the_title();?></span>
							<span class="profile-jobtitle"><?php the_field('job_title');?></span>
						</a>
					</h3>
					</a>
				</div>
				<?php	
			endwhile;
			?>
		</div>
		<?php
	endif;
		
	return ob_get_clean();		
}	
add_shortcode('mgad_people', 'mgad_people');


function mgad_page_links($atts) {
	$atts = shortcode_atts( array(
		'slugs' => 'about,work,contact',
	),$atts );
	
	$slugs = array_map('trim', explode(',', $atts['slugs']));
	
	$links = array(
		'about' => array('About', home_url('/about/')),
		'people' => array('People', home_url('/people/')),
		'work' => array('Work', home_url('/work/')),
		'updates' => array('Updates', home_url('/updates/')),
		'contact' => array('Contact Us', home_url('/contact/'))
	);
	?>
	<div class="be-row clearfix zero-bottom be-no-space">
		<div class="one-half column-block">
			<a class="<?php echo $slugs[0];?>" href="<?php echo $links[$slugs[0]][1];?>"><span><?php echo $links[$slugs[0]][0];?></span></a>
		</div>
		<div class="one-half column-block <?php echo sizeof($slugs)>2?'has-two':'';?>">
			<a class="<?php echo $slugs[1];?>" href="<?php echo $links[$slugs[1]][1];?>"><span><?php echo $links[$slugs[1]][0];?></span></a>

			<?php 
			if ($slugs[2]) { ?>
				<br>
				<a class="<?php echo $slugs[2];?>" href="<?php echo $links[$slugs[2]][1];?>"><span><?php echo $links[$slugs[2]][0];?></span></a>
				<?php
			}
			?>
		</div>
	</div>
	<?php
}
add_shortcode('mgad_page_links', 'mgad_page_links');

// "mgad_location" shortcode
function mgad_location_shortcode( $atts ) {
	$output = '<p itemscope itemtype="schema.org/PostalAddress">';
	$output .= '<span itemprop="streetAddress">'.$atts['address'].'</span><br />';
	if (!empty($atts['address_extra'])) $output .= '<span>'.$atts['address_extra'].'</span><br />';
  $output .= '<span itemprop="addressLocality">'.$atts['locality'].'</span>, ';
  $output .= '<span itemprop="addressRegion">'.$atts['region'].'</span> ';
  $output .= '<span itemprop="postalCode">'.$atts['code'].'</span>';
	$output .= '</p>';
	return $output;
}
add_shortcode( 'mgad_location', 'mgad_location_shortcode' );