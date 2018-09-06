<?php
include_once('inc/type-taxonomy.php');
include_once('inc/helpers.php');
include_once('inc/admin-functions.php');
include_once('inc/customization.php');
include_once('inc/shortcodes.php');

/* ---------------------------------------------  */
// Add the custom image sizes for theme
/* ---------------------------------------------  */

add_image_size('very-large', 1920, 9999, true);
add_image_size('work-focus', 980, 400, true);
add_image_size('work-masonry', 450, 450, true);
add_image_size('work-masonry-wide', 900, 450, true);
//add_image_size('work-hero', 9999, 470, true);
add_image_size('team-thumbnail', 480, 480, true);

add_image_size('related-project', 640, 450, true);
add_image_size('news-thumbnail', 480, 320, true);
add_image_size('news-thumbnail-sp', 480);
add_image_size('project-thumbnail', 480, 390, true);

/* ---------------------------------------------  */
// Enqueue scripts
/* ---------------------------------------------  */
if ( ! function_exists( 'mgad_add_scripts' ) ) {
	function mgad_add_scripts() {
		wp_enqueue_script( 'mCustomScrollbar', get_stylesheet_directory_uri() . '/js/jquery.mCustomScrollbar.concat.min.js', array( 'be-themes-plugins-js'), FALSE, TRUE );
		wp_enqueue_script( 'mgad-script-js', get_stylesheet_directory_uri() . '/js/script.js', array( 'be-themes-plugins-js'), FALSE, TRUE );
	}
	add_action( 'wp_enqueue_scripts', 'mgad_add_scripts', 30 );
}

/* ---------------------------------------------  */
// Enqueue Stylesheets
/* ---------------------------------------------  */
if ( ! function_exists( 'mgad_add_styles' ) ) {
	function mgad_add_styles() {
		wp_enqueue_style( 'google-fonts', '//fonts.googleapis.com/css?family=Montserrat:600' );
		
		wp_enqueue_style( 'flexslider', get_template_directory_uri().'/css/flexslider.css' );
		
		wp_enqueue_style( 'mCustomScrollbar', get_stylesheet_directory_uri().'/css/jquery.mCustomScrollbar.min.css' );
		
		wp_enqueue_style( 'mgad-style', get_stylesheet_directory_uri().'/css/custom.css' );
	}
	add_action( 'wp_enqueue_scripts', 'mgad_add_styles', 20 );
}

// allow svg upload
function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');


// REMOVE UNNECESSARY ITEMS FROM WP_HEAD
remove_action('wp_head', 'wp_generator'); // kill the wordpress version number
remove_action('wp_head', 'wlwmanifest_link'); // kill the WLW link
remove_action('wp_head', 'rsd_link'); // kill the RSD link
remove_action('wp_head', 'feed_links_extra', 3); // kill category, author, and other extra feeds
remove_action('wp_head', 'feed_links', 2); // kill post and comment feeds 


// ADD POST TYPES IN SEARCH
function mgad_filter_search($query) {
	if (!is_admin() && $query->is_search) {
		$query->set('post_type', array('post', 'project', 'page', 'team_manager'));
	};
	return $query;
};
add_filter('pre_get_posts', 'mgad_filter_search');



// Fix revolution slider error with the new page builder version
remove_filter( 'the_content', 'be_pb_content_filter', 1);
add_filter( 'the_content', 'be_pb_content_filter');


// filter category link
function mgad_category_link($term_link, $term_id) {
	$category = get_category($term_id);
	
	$url = '/updates/#';
	
	if ($category->parent) {
		$parent_cat = get_category($category->parent);
		$url .= $parent_cat->slug . ':';
	}
	$url .= $category->slug;
	
	$link = home_url($url);
	return $link;
}
add_filter('category_link', 'mgad_category_link', 10, 2);


// limit excerpt length to 150 chars and add character count
function mgad_excerpt_count_js(){
	if ('page' != get_post_type()) {
		echo '<script>jQuery(document).ready(function(){
		if (jQuery("#postexcerpt .handlediv").length == 0) return;
		jQuery("#postexcerpt .handlediv").after("<div style=\"position:absolute;top:12px;right:34px;color:#666;\"><small>Excerpt length: </small><span id=\"excerpt_counter\"></span><span style=\"font-weight:bold; padding-left:7px;\">/ 150</span><small><span style=\"font-weight:bold; padding-left:7px;\">character(s).</span></small></div>");
			 jQuery("span#excerpt_counter").text(jQuery("#excerpt").val().length);
			 jQuery("#excerpt").on("change keydown paste input", function() {
				 if(jQuery(this).val().length > 150){
					jQuery(this).val(jQuery(this).val().substr(0, 150));
				}
			 jQuery("span#excerpt_counter").text(jQuery("#excerpt").val().length);
		   });
		});</script>';
	}
}
add_action( 'admin_head-post.php', 'mgad_excerpt_count_js');
add_action( 'admin_head-post-new.php', 'mgad_excerpt_count_js');


function mgad_excerpt($excerpt){
	$excerpt = trim($excerpt);
	if (strlen($excerpt) <= 150) 
		return $excerpt;

	$excerpt = substr($excerpt, 0, 150);
	$excerpt = substr($excerpt, 0, strripos($excerpt, " "));
	$excerpt = trim(preg_replace( '/\s+/', ' ', $excerpt));
	$excerpt = $excerpt.'...';
	return $excerpt;
}
add_filter('get_the_excerpt', 'mgad_excerpt');


// KEEP KITCHEN SINK VISIBLE AT ALL TIMES
function mgad_unhide_kitchensink( $args ) {
	$args['wordpress_adv_hidden'] = false;
	return $args;
}
add_filter( 'tiny_mce_before_init', 'mgad_unhide_kitchensink' );


// FIX REVOLUTION SLIDER - prevent shortcode output from being filtered by WP filters
remove_filter('the_content', 'do_shortcode', 7); 

// Filter to prevent empty <p> from shortcodes
add_filter( 'the_content', 'tgm_io_shortcode_empty_paragraph_fix' );
function tgm_io_shortcode_empty_paragraph_fix( $content ) {
	$array = array(
			'<p>['    => '[',
			']</p>'   => ']',
			']<br />' => ']'
	);
	return strtr( $content, $array );
}

/**
 * Completely disable archives for taxonomy.
 */
add_action('pre_get_posts', 'mgad_remove_taxonomy_archive');
function mgad_remove_taxonomy_archive($query) {
	if (is_admin()) return;

	if (is_tax() || is_category()) {
		$query->set_404();
	}
}