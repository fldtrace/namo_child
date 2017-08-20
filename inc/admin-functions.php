<?php
/*
Functions for filter fields on the backend
*/

add_action('admin_footer-post.php', 'mgad_admin_footer_function');
add_action('admin_footer-post-new.php', 'mgad_admin_footer_function');
function mgad_admin_footer_function() {
	$screen = get_current_screen();
	if( is_object( $screen ) && $screen->post_type == 'project' ){
		?>
		<style>
		#portfolio_locationdiv,
		#portfolio_typediv {
			display: none;
		}
		#portfolio_sectorchecklist li {
			display: none;
		}
		#portfolio_sectorchecklist .wpseo-make-primary-term, 
		#portfolio_sectorchecklist .wpseo-is-primary-term, 
		#portfolio_servicechecklist .wpseo-make-primary-term,
		#portfolio_servicechecklist .wpseo-is-primary-term,
		#portfolio_typechecklist .wpseo-make-primary-term,
		#portfolio_typechecklist .wpseo-is-primary-term {
			display: none;
		}
		
		</style>
		<script>
		jQuery(document).ready(function($) {
				$("#portfolio_servicechecklist input[type=checkbox]").change(function(){
					// only allow one service, when user checks a service, automatically uncheck others
					$(this).closest('li').siblings('li').find('input[type=checkbox]').prop('checked', false);
					
					// automatically choose project form (Architecture/Product) based on the chosen service 
					if (['359', '372', '374'].indexOf($('input[type=checkbox]:checked', '#portfolio_servicechecklist').val())!= -1) {
						$('#acf-field-project_form-1').prop('checked', true);
					}
					else {
						$('#acf-field-project_form-2').prop('checked', true);
					}
						
					// show/hide sectors, locations and types depending on the chosen service
					$.ajax({
						type: 'POST',
						url: ajaxurl,
						dataType: 'json',
						data: {"action": "get_filters_by_service", "service": $('input[type=checkbox]:checked', '#portfolio_servicechecklist').val() },
						success: function(response) {
							if (response.sectors) {
								$('#portfolio_sectordiv').show();
								$('#portfolio_sectorchecklist li').hide();
								sectors = response.sectors.split(',');
								for (i = 0; i < sectors.length; i++) { 
									$('#portfolio_sector-'+sectors[i]).show();
								}
							}
							else 
								$('#portfolio_sectordiv').hide();
							
							response.locations?$('#portfolio_locationdiv').show():$('#portfolio_locationdiv').hide();
							response.types?$('#portfolio_typediv').show():$('#portfolio_typediv').hide();

							return false;

						}
					});
				}).filter(':checked').change();
		});
		</script>
		<?php
	}
}

// get sectors, locations and types available for the chosen service
add_action( 'wp_ajax_get_filters_by_service', 'mgad_ajax_get_filters_by_service' );
function mgad_ajax_get_filters_by_service() {
	$result = array();
	$rs_sectors = array();
	$sectors = get_field('sectors', 'portfolio_service_'.$_POST['service']);
	if ($sectors) { 
		foreach ($sectors as $sector) {
			$rs_sectors[] = $sector->term_id;
		}
	}
	$result['sectors'] =  join(',', $rs_sectors);
	
	$rs_locations = array();
	$locations = get_field('locations', 'portfolio_service_'.$_POST['service']);
	if ($locations) 
		$result['locations'] =  1;
	
	
	// only show "Types" for "Graphics & branding" service
	if ($_POST['service'] == '367')
		$result['types'] = 1; 
	
	echo json_encode($result);
	die();
}


/* 
	FIX DROPDOWNS OF WYSIWYG EDITOR IN THE PAGE BUILDER 
*/
add_action('admin_head', 'mgad_fix_admin_dropdowns');
function mgad_fix_admin_dropdowns() {
 	?>
	<style>
	.post-php .ui-dialog.ui-widget {
		z-index: 10100 !important;
	}
	</style>
	<?php
}