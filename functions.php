<?php
include_once('inc/type-taxonomy.php');
include_once('inc/admin-functions.php');
include_once('inc/customization.php');
include_once('inc/work.php');

add_image_size('very-large', 1920, 9999, true);

add_image_size('work-focus', 980, 400, true);
add_image_size('work-masonry', 450, 450, true);
add_image_size('work-masonry-wide', 900, 450, true);
add_image_size('work-hero', 9999, 470, true);
add_image_size('team-thumbnail', 480, 480, true);

add_image_size('related-project', 640, 450, true);

add_image_size('news-thumbnail', 480, 320, true);

add_image_size('project-thumbnail', 480, 390, true);

/* ---------------------------------------------  */
// Enqueue scripts
/* ---------------------------------------------  */
if ( ! function_exists( 'mgad_add_scripts' ) ) {
	function mgad_add_scripts() {
		wp_register_script( 'mgad-script-js', get_stylesheet_directory_uri() . '/js/script.js', array( 'be-themes-plugins-js'), FALSE, TRUE );
		wp_enqueue_script( 'mgad-script-js' );
	}
	add_action( 'wp_enqueue_scripts', 'mgad_add_scripts' );
}

/* ---------------------------------------------  */
// Enqueue Stylesheets
/* ---------------------------------------------  */
if ( ! function_exists( 'mgad_add_styles' ) ) {
	function mgad_add_styles() {
		wp_register_style( 'mgad-style', get_stylesheet_directory_uri().'/css/custom.css' );
		wp_enqueue_style( 'mgad-style' );		
		wp_register_style( 'flexslider', get_template_directory_uri().'/css/flexslider.css' );
		wp_enqueue_style( 'flexslider' );			
	}
	add_action( 'wp_enqueue_scripts', 'mgad_add_styles', 20 );
}


function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');


function mgad_print($var, $before, $after) {
	if ($var) echo $before . $var . $after;
}





// post social sharing shortcode
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