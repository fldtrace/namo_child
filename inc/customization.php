<?php
/*
Customization of parent theme functions
*/

if (!function_exists( 'be_themes_calculate_logo_height' )) {
	function be_themes_calculate_logo_height(){
		$logo_height = 64;
		
		$result['logo_sticky_height'] = 74;
		$result['logo_height'] = $logo_height + 40;
		$result['logo_transparent_height'] = $logo_height + 40;
		return $result;
	}
}

if ( ! function_exists( 'be_themes_get_header_navigation' ) ) {
	function be_themes_get_header_navigation() { ?>
		<button class="header-nav-icon hamburger-icon" type="button">
			<span class="hamburger-inner">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>
		<?php
	}
}

if ( ! function_exists( 'be_themes_get_header_mobile_navigation' ) ) {
	function be_themes_get_header_mobile_navigation() {}
}

if ( ! function_exists( 'mgad_get_header_navigation' ) ) {
	function mgad_get_header_navigation() {
		$defaults = array (
			'theme_location'=>'main_nav',
			'depth'=>1,
			'container_class'=>'be-wrap clearfix',
			'menu_class' => 'menu clearfix',
			'echo' => true
		);
		wp_nav_menu( $defaults );
	}
}

/***************************************
			Add Body Class
***************************************/
if ( ! function_exists( 'be_themes_add_body_class' ) ) {
	function be_themes_add_body_class( $classes ) {
		global $post;	
		global $be_themes_data;
		$post_id = be_get_page_id();
		if(is_singular( 'post' ) && is_single($post_id) && isset($be_themes_data['single_blog_hero_section_from']) && $be_themes_data['single_blog_hero_section_from'] == 'inherit_option_panel') {
			if(!empty($be_themes_data['single_blog_header_transparent']) && isset($be_themes_data['single_blog_header_transparent']) && $be_themes_data['single_blog_header_transparent'] ) {
				$header_transparent = $be_themes_data['single_blog_header_transparent'];
			} else {
				$header_transparent = 0;
			}
		} else if((in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) && is_product($post_id)) && isset($be_themes_data['single_shop_hero_section_from']) && $be_themes_data['single_shop_hero_section_from'] == 'inherit_option_panel') {
			if(!empty($be_themes_data['single_shop_header_transparent']) && isset($be_themes_data['single_shop_header_transparent']) && $be_themes_data['single_shop_header_transparent'] ) {
				$header_transparent = $be_themes_data['single_shop_header_transparent'];
			} else {
				$header_transparent = 0;
			}
		} 
		else if(is_singular( 'project' ) && is_single($post_id)) {
			$header_transparent = 1;
		}
		else {
			$header_transparent = get_post_meta($post_id, 'be_themes_header_transparent', true);
		}
		if(!empty($header_transparent) && isset($header_transparent) && $header_transparent) {
			$classes[] = 'header-transparent';
		}
		$section_scroll = get_post_meta($post_id, 'be_themes_section_scroll', true);
		if(!empty($section_scroll) && isset($section_scroll) && $section_scroll) {
			$classes[] = 'section-scroll';
		}
		$single_page_version = get_post_meta($post_id, 'be_themes_single_page_version', true);
		if(!empty($single_page_version) && isset($single_page_version) && $single_page_version) {
			$classes[] = 'single-page-version';
		}
		/*if( isset( $be_themes_data['all_ajax'] ) && 1 == $be_themes_data['all_ajax'] )  {
			$classes[] = 'all-ajax-content';
		}*/
		if( isset( $be_themes_data['remove_smooth_scroll'] ) && 1 == $be_themes_data['remove_smooth_scroll'] )  {
			$classes[] = 'no-smooth-scroll';
		}
		if ( isset($be_themes_data['main_header_style']) && ('left' == $be_themes_data['main_header_style'] ) ) {
			$classes[] = 'left-header';	
		}
		return $classes;
	}
	add_filter('body_class','be_themes_add_body_class');
}


/***************************************
				SITE LOGO - customized
***************************************/
if ( !function_exists( 'be_themes_get_header_logo_image' ) ) {
	function be_themes_get_header_logo_image() {
		global $be_themes_data;
		$logo = get_template_directory_uri().'/img/logo.png';
		if( ! empty( $be_themes_data['logo'] ) ) {
			$logo = $be_themes_data['logo'];
		}
		if( ! empty( $be_themes_data['logo_transparent'] )) {
			$logo_transparent = $be_themes_data['logo_transparent'];
		} else {
			$logo_transparent = $logo;
		}
		if( ! empty( $be_themes_data['logo_transparent_light'] )) {
			$logo_transparent_light = $be_themes_data['logo_transparent_light'];
		} else {
			$logo_transparent_light = $logo_transparent;
		}
		echo '<a href="'.home_url().'">';
			$post_id = be_get_page_id();
			if(is_singular( 'post' ) && is_single($post_id) && isset($be_themes_data['single_blog_hero_section_from']) && $be_themes_data['single_blog_hero_section_from'] == 'inherit_option_panel') {
				if(!empty($be_themes_data['single_blog_header_transparent']) && isset($be_themes_data['single_blog_header_transparent']) && $be_themes_data['single_blog_header_transparent'] ) {
					$header_transparent = $be_themes_data['single_blog_header_transparent'];
				} else {
					$header_transparent = 0;
				}
			} else if((in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) && is_product($post_id)) && isset($be_themes_data['single_shop_hero_section_from']) && $be_themes_data['single_shop_hero_section_from'] == 'inherit_option_panel') {
				if(!empty($be_themes_data['single_shop_header_transparent']) && isset($be_themes_data['single_shop_header_transparent']) && $be_themes_data['single_shop_header_transparent'] ) {
					$header_transparent = $be_themes_data['single_shop_header_transparent'];
				} else {
					$header_transparent = 0;
				}
			} else {
				$header_transparent = get_post_meta($post_id, 'be_themes_header_transparent', true);
			}
			echo '<img class="transparent-logo dark-scheme-logo" src="'.$logo_transparent.'" alt="" />';
			echo '<img class="normal-logo" src="'.$logo.'" alt="" />';
		echo '</a>';
	}
}

// customize shortcodes options
add_action('init','mgad_shortcodes_init', 11);
function mgad_shortcodes_init() {
	global $be_shortcode;
	
	// add class name to "section" shortcode
	$be_shortcode['section']['options']['section_class'] = array (
		'title'=> __('Section Class','be-themes'),
		'type'=> 'text',
		'default'=> ''
	);	

	// add wide wrap option to "row" shortcode
	$be_shortcode['row']['options']['wide_wrap'] = array (
		'title'=> __('Wide Wrap (1280px) ?','be-themes'),
		'type'=> 'checkbox',
		'default'=> ''
	);		
}



/**************************************
			SECTION -- Customized to add class name
**************************************/
if (!function_exists('be_section')) {
	function be_section( $atts, $content ) {
		extract( shortcode_atts( array(
	        'bg_color'=>'',
	        'bg_image' => '',
	        'bg_repeat' => 'repeat',
	        'bg_attachment' => 'scroll',
	        'bg_position' => 'left top',
	        'bg_stretch'=>0,
	        'bg_parallax'=>0,
	        'bg_mousemove_parallax' => 0,
	        'border_size' => '1',
	        'border_color' =>'',
	        'padding_top'=>'',
	        'padding_bottom'=>'',
	        'bg_video'=>0,
	        'bg_video_mp4_src'=>'',
	        'bg_video_mp4_src_ogg'=>'',
	        'bg_video_mp4_src_webm'=>'',
			'bg_overlay'=>0,
			'overlay_color'=>'',
			'overlay_opacity'=>'',
			'section_id'=>'',
			'section_class'=>'',
			'full_screen'=> 0,
			'full_screen_header_scheme' => 'background--dark'
	    ),$atts));

	    $background = '';
	    $border = '';
	    $bg_video_class = '';
	    $bg_overlay_class = '';
	    $output = '';

	    if(empty( $bg_image  ) ){
	    	if( ! empty( $bg_color ) )
	    		$background = 'background-color: '.$bg_color.';';	
	    } else{
			$attachment_info=wp_get_attachment_image_src($bg_image,'full');
			$attachment_url = $attachment_info[0];
			if( ! empty( $attachment_url ) ) {
				if( (isset( $bg_parallax ) && 1 == $bg_parallax) || (isset( $bg_mousemove_parallax ) && 1 == $bg_mousemove_parallax) ) {
					$bg_position = 'center center';
				}
	    		$background = 'background:'.$bg_color.' url('.$attachment_url.') '.$bg_repeat.' '.$bg_attachment.' '.$bg_position.';';
	    	}
	    }

	    $border = ( ! empty( $border_color ) ) ? 'border-top:'.$border_size.'px solid '.$border_color.';border-bottom:'.$border_size.'px solid '.$border_color.';' : $border;
	    $padding_top  = ( isset( $padding_top ) && $padding_top != '' ) ? 'padding-top:'.$padding_top.'px;' : $padding_top;
	    $padding_bottom = ( isset( $padding_bottom ) && $padding_bottom != '' ) ? 'padding-bottom:'.$padding_bottom.'px;' : $padding_bottom;
	    $bg_stretch = ( isset( $bg_stretch ) && 1 == $bg_stretch ) ? 'be-bg-cover' : '' ;
	    $bg_parallax = ( $bg_mousemove_parallax != 1 && isset( $bg_parallax ) && 1 == $bg_parallax ) ? 'be-bg-parallax' : '' ;
	    $bg_mousemove_parallax = ( isset( $bg_mousemove_parallax ) && 1 == $bg_mousemove_parallax ) ? 'be-bg-mousemove-parallax' : '' ;
	    $bg_overlay_class = ( isset( $bg_overlay ) && 1 == $bg_overlay ) ? 'be-bg-overlay' : '' ;
	    $bg_video_class =  ( isset( $bg_video ) && 1 == $bg_video ) ? 'be-video-section' : '' ;
 	    $section_skew = ( isset( $skew ) && 1 == $skew ) ? 'section-skew' : '' ;
		$section_id = !empty($section_id) ? 'id = "'.$section_id.'"' : '';
		
		if( isset( $full_screen_header_scheme ) && $full_screen_header_scheme ) {
			$full_screen_header_scheme = 'data-headerscheme="'.$full_screen_header_scheme.'"';
		} else {
			$full_screen_header_scheme = 'data-headerscheme="background--dark"';
		}
		$full_screen = ( isset( $full_screen ) && 1 == $full_screen ) ? 'full-screen-section' : '' ;

	    $output .= '<div class="be-section '.$section_class.' '.$bg_stretch.' '.$bg_parallax.' '.$bg_mousemove_parallax.' '.$bg_overlay_class.' '.$bg_video_class.' '.$full_screen.' clearfix" '.$full_screen_header_scheme.' style="'.$background.$border.'" '.$section_id.'>';
	    if( 'full-screen-section' == $full_screen ) {
	    	$output .= '<div class="full-screen-section-wrap">';
	    }
	    $output .= '<div class="be-section-pad clearfix" style="'.$padding_top.$padding_bottom.'">';
		$output .=  ( isset( $skew ) && 1 == $skew ) ? '<div class="section-skew-normal">' : '' ;
		if( isset( $bg_video ) && 1 == $bg_video ) {
			$output .= '<video class="be-bg-video" autoplay="autoplay" loop="loop" muted="muted" preload="auto">';
			$output .=  ($bg_video_mp4_src) ? '<source src="'.$bg_video_mp4_src.'" type="video/mp4">' : '' ;
			$output .=  ($bg_video_mp4_src_ogg) ? '<source src="'.$bg_video_mp4_src_ogg.'" type="video/ogg">' : '' ;
			$output .=  ($bg_video_mp4_src_webm) ? '<source src="'.$bg_video_mp4_src_webm.'" type="video/webm">' : '' ;
			$output .= '</video>';
		}	   
		if( isset( $bg_overlay ) && 1 == $bg_overlay ) {
			$opacity = '';
			if($overlay_opacity) {
				$opacity .= '-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity='.floatval($overlay_opacity).');';
				$opacity .= 'filter: alpha(opacity='.floatval($overlay_opacity).');';
				$opacity .= '-moz-opacity: '.floatval($overlay_opacity/100).';';
				$opacity .= '-khtml-opacity: '.floatval($overlay_opacity/100).';';
				$opacity .= 'opacity: '.floatval($overlay_opacity/100).';';
			}
			$output .= '<div class="section-overlay" style="background: '.$overlay_color.'; '.$opacity.'"></div>';
		}
	    $output .= do_shortcode( $content );
		if( isset( $skew ) && 1 == $skew ) {
			$output .= '</div>';
		}
		$output .= '</div>';
		if( 'full-screen-section' == $full_screen ) {
	    	$output .= '</div>';
	    }
	    $output .= '</div>';
	    return $output;
	}
	add_shortcode( 'section', 'be_section' );
}

/**************************************
	ROW -- Customized to add wide wrap option
**************************************/
if (!function_exists('be_row')) {
	function be_row( $atts, $content ) {
		extract( shortcode_atts( array(
	        'no_wrapper'=>0,
	        'no_margin_bottom'=>0,
	        'no_space_columns'=>0,
					'wide_wrap'=>0
	    ),$atts ) );
		$class = 'be-wrap ';
		$class = ( isset( $no_wrapper ) &&  1 == $no_wrapper ) ? '' : $class ;
	    $class .= ( isset( $no_margin_bottom ) &&  1 == $no_margin_bottom ) ? ' zero-bottom' : '' ;
	    $class .= ( isset( $no_space_columns ) &&  1 == $no_space_columns ) ? ' be-no-space' : '' ;
			$class .= ( isset( $wide_wrap ) &&  1 == $wide_wrap ) ? ' be-wide-wrap' : '' ;
		
		return '<div class="be-row clearfix '.$class.'">'.do_shortcode( $content ).'</div>';
	}
	add_shortcode( 'row','be_row' );
}



add_filter('relevanssi_orderby', 'rlv_fix_orderby');
function rlv_fix_orderby($orderby) {
    return "relevancy";
}

add_filter('relevanssi_order', 'rlv_fix_order');
function rlv_fix_order($order) {
    return "desc";
}



/* 
	REMOVE AUTOMATICALLY INSERTED "READ MORE" LINK IN POST EXCERPTS 
*/
function be_excerpt_more($output) {}



