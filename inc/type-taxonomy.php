<?php
/*
Custom post types and custom taxonomies registration
*/

add_action( 'init', 'register_cpt_project', 20 );
function register_cpt_project() {

	$labels = array(
		'name' => __( 'Projects', 'mgad' ),
		'singular_name' => __( 'Project', 'mgad' ),
		'add_new' => __( 'Add New Project', 'mgad' ),
		'add_new_item' => __( 'Add New Project', 'mgad' ),
		'edit_item' => __( 'Edit Project', 'mgad' ),
		'new_item' => __( 'New Project', 'mgad' ),
		'view_item' => __( 'View Project', 'mgad' ),
		'search_items' => __( 'Search Projects', 'mgad' ),
		'not_found' => __( 'No projects found', 'mgad' ),
		'not_found_in_trash' => __( 'No projects found in Trash', 'mgad' ),
		'parent_item_colon' => __( 'Parent Project:', 'mgad' ),
		'menu_name' => __( 'Projects', 'mgad' ),
	);

	$args = array(
		'labels' => $labels,
		'hierarchical' => false,
		'supports' => array( 'title', 'thumbnail' ),
		'public' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => false,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'has_archive' => false,
		'query_var' => true,
		'can_export' => true,
		'rewrite' => true,
		'capability_type' => 'post'
	);

	unregister_post_type( 'portfolio' );
	unregister_taxonomy( 'portfolio_categories' );
	unregister_taxonomy( 'portfolio_tags' );
	
	register_post_type( 'project', $args );
}


function register_service_taxonomy( )
{
    $labels = array(
        'name'                       => _x( 'Services', 'Taxonomy General Name', 'mgad' ),
        'singular_name'              => _x( 'Service', 'Taxonomy Singular Name', 'mgad' ),
        'menu_name'                  => __( 'Services', 'mgad' ),
        'all_items'                  => __( 'All items', 'mgad' ),
        'parent_item'                => __( 'Parent Item', 'mgad' ),
        'parent_item_colon'          => __( 'Parent Item Colon:', 'mgad' ),
        'new_item_name'              => __( 'New Item Name', 'mgad' ),
        'add_new_item'               => __( 'Add New Item', 'mgad' ),
        'edit_item'                  => __( 'Edit Item', 'mgad' ),
        'update_item'                => __( 'Update Item', 'mgad' ),
        'view_item'                  => __( 'View Item', 'mgad' ),
        'separate_items_with_commas' => __( 'Separate Items With Commas', 'mgad' ),
        'choose_from_most_used'      => __( 'Choose From Most Used', 'mgad' ),
        'popular_items'              => __( 'Popular Items', 'mgad' ),
        'search_items'               => __( 'Search Items', 'mgad' ),
        'not_found'                  => __( 'Not Found', 'mgad' ),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_in_menu'               => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => false,
        'show_in_quick_edit'         => true,
        'sort'                       => true
    );

    register_taxonomy( 'project_service', array( 'project' ), $args );
}
add_action( 'init', 'register_service_taxonomy');

function register_sector_taxonomy( )
{
    $labels = array(
        'name'                       => _x( 'Sectors', 'Taxonomy General Name', 'mgad' ),
        'singular_name'              => _x( 'Sector', 'Taxonomy Singular Name', 'mgad' ),
        'menu_name'                  => __( 'Sectors', 'mgad' ),
        'all_items'                  => __( 'All items', 'mgad' ),
        'parent_item'                => __( 'Parent Item', 'mgad' ),
        'parent_item_colon'          => __( 'Parent Item Colon:', 'mgad' ),
        'new_item_name'              => __( 'New Item Name', 'mgad' ),
        'add_new_item'               => __( 'Add New Item', 'mgad' ),
        'edit_item'                  => __( 'Edit Item', 'mgad' ),
        'update_item'                => __( 'Update Item', 'mgad' ),
        'view_item'                  => __( 'View Item', 'mgad' ),
        'separate_items_with_commas' => __( 'Separate Items With Commas', 'mgad' ),
        'choose_from_most_used'      => __( 'Choose From Most Used', 'mgad' ),
        'popular_items'              => __( 'Popular Items', 'mgad' ),
        'search_items'               => __( 'Search Items', 'mgad' ),
        'not_found'                  => __( 'Not Found', 'mgad' ),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_in_menu'               => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => false,
        'show_in_quick_edit'         => true,
        'sort'                       => true
    );

    register_taxonomy( 'project_sector', array( 'project' ), $args );
}
add_action( 'init', 'register_sector_taxonomy');


function register_location_taxonomy( )
{
    $labels = array(
        'name'                       => _x( 'Locations', 'Taxonomy General Name', 'mgad' ),
        'singular_name'              => _x( 'Location', 'Taxonomy Singular Name', 'mgad' ),
        'menu_name'                  => __( 'Locations', 'mgad' ),
        'all_items'                  => __( 'All items', 'mgad' ),
        'parent_item'                => __( 'Parent Item', 'mgad' ),
        'parent_item_colon'          => __( 'Parent Item Colon:', 'mgad' ),
        'new_item_name'              => __( 'New Item Name', 'mgad' ),
        'add_new_item'               => __( 'Add New Item', 'mgad' ),
        'edit_item'                  => __( 'Edit Item', 'mgad' ),
        'update_item'                => __( 'Update Item', 'mgad' ),
        'view_item'                  => __( 'View Item', 'mgad' ),
        'separate_items_with_commas' => __( 'Separate Items With Commas', 'mgad' ),
        'choose_from_most_used'      => __( 'Choose From Most Used', 'mgad' ),
        'popular_items'              => __( 'Popular Items', 'mgad' ),
        'search_items'               => __( 'Search Items', 'mgad' ),
        'not_found'                  => __( 'Not Found', 'mgad' ),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_in_menu'               => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => false,
        'show_in_quick_edit'         => true,
        'sort'                       => true
    );

    register_taxonomy( 'project_location', array( 'project' ), $args );
}
add_action( 'init', 'register_location_taxonomy');


function register_anecdotal_taxonomy( )
{
    $labels = array(
        'name'                       => _x( 'Anecdotals', 'Taxonomy General Name', 'mgad' ),
        'singular_name'              => _x( 'Anecdotal', 'Taxonomy Singular Name', 'mgad' ),
        'menu_name'                  => __( 'Anecdotals', 'mgad' ),
        'all_items'                  => __( 'All items', 'mgad' ),
        'parent_item'                => __( 'Parent Item', 'mgad' ),
        'parent_item_colon'          => __( 'Parent Item Colon:', 'mgad' ),
        'new_item_name'              => __( 'New Item Name', 'mgad' ),
        'add_new_item'               => __( 'Add New Item', 'mgad' ),
        'edit_item'                  => __( 'Edit Item', 'mgad' ),
        'update_item'                => __( 'Update Item', 'mgad' ),
        'view_item'                  => __( 'View Item', 'mgad' ),
        'separate_items_with_commas' => __( 'Separate Items With Commas', 'mgad' ),
        'choose_from_most_used'      => __( 'Choose From Most Used', 'mgad' ),
        'popular_items'              => __( 'Popular Items', 'mgad' ),
        'search_items'               => __( 'Search Items', 'mgad' ),
        'not_found'                  => __( 'Not Found', 'mgad' ),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => false,
        'public'                     => true,
        'show_ui'                    => true,
        'show_in_menu'               => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => false,
        'show_tagcloud'              => false,
        'show_in_quick_edit'         => true,
        'sort'                       => true
    );

    register_taxonomy( 'project_anecdotal', array( 'project' ), $args );
}
add_action( 'init', 'register_anecdotal_taxonomy');


add_action( 'init', 'register_cpt_team_manager' );
function register_cpt_team_manager() {

	$labels = array(
		'name' => __( 'Team Members', 'mgad' ),
		'singular_name' => __( 'Team Member', 'mgad' ),
		'add_new' => __( 'Add New Member', 'mgad' ),
		'add_new_item' => __( 'Add New Member', 'mgad' ),
		'edit_item' => __( 'Edit Team Member', 'mgad' ),
		'new_item' => __( 'New Team Member', 'mgad' ),
		'view_item' => __( 'View Team Member', 'mgad' ),
		'search_items' => __( 'Search Team Members', 'mgad' ),
		'not_found' => __( 'No team members found', 'mgad' ),
		'not_found_in_trash' => __( 'No team members found in Trash', 'mgad' ),
		'parent_item_colon' => __( 'Parent Team Member:', 'mgad' ),
		'menu_name' => __( 'Team', 'mgad' ),
	);

	$args = array(
		'labels' => $labels,
		'hierarchical' => false,
		'supports' => array( 'title' ),
		'public' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => false,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'has_archive' => false,
		'query_var' => true,
		'can_export' => true,
		'rewrite' => array(
			'slug' => 'people',
			'with_front' => true,
			'feeds' => false,
			'pages' => false
		),
		'capability_type' => 'post'
	);

	register_post_type( 'team_manager', $args );
}

// ADD "Project Title 2" COLUMN TO ADMIN SCREEN
add_filter('manage_project_posts_columns', 'mg_columns_head_only_project', 10);
add_action('manage_project_posts_custom_column', 'mg_columns_content_only_project', 10, 2);
 
function mg_columns_head_only_project($columns) {
	$columns['taxonomy-project_sector'] = 'Sectors/Types';
	array_splice( $columns, 2, 0, array('project_title_2' => 'Project Title 2') );
	$columns['menu_order'] = 'Order';
	return $columns;
}
function mg_columns_content_only_project($column_name, $post_ID) {
	global $post;
  switch ($column_name) {
    case 'menu_order':
      echo $post->menu_order;
      break;
		case 'project_title_2':
			the_field('project_title_2', $post_ID);
		default:
      break;
   }
}

/**
* make "ORDER" column sortable
*/
function mgad_order_column_register_sortable($columns){
  $columns['menu_order'] = 'menu_order';
  return $columns;
}
add_filter('manage_edit-portfolio_sortable_columns','mgad_order_column_register_sortable');

//$wpdb->query("UPDATE $wpdb->term_taxonomy SET taxonomy = 'project_sector' WHERE taxonomy = 'portfolio_sector'");


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