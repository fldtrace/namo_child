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
		#project_sectordiv,
		#project_locationdiv {
			display: none;
		}
		#project_sectorchecklist li {
			display: none;
		}
		#project_locationchecklist .wpseo-make-primary-term, 
		#project_locationchecklist .wpseo-is-primary-term, 
		#project_sectorchecklist .wpseo-make-primary-term, 
		#project_sectorchecklist .wpseo-is-primary-term, 
		#project_servicechecklist .wpseo-make-primary-term,
		#project_servicechecklist .wpseo-is-primary-term {
			display: none;
		}
		#project_servicediv .service-notice {
			font-size: 13px;
			font-weight: 400;
		}
		</style>
		<script>
		jQuery(document).ready(function($) {
			$('#project_servicediv .ui-sortable-handle').append('<br><span class="service-notice">(Notice: A project should belongs to only one service)</span>');
			
			$("#project_servicechecklist input[type=checkbox]").change(function(){
				// only allow one service, when user checks a service, automatically uncheck others
				if ($(this).closest('li').siblings('li').find('input:checked').length) {
					alert('A project should have only one service. \nPlease uncheck the previously checked service first!');
					$(this).prop('checked', false);
					return;
				}
				
				// automatically choose project form (Architecture/Product) based on the chosen service 
				if (['359', '372', '374'].indexOf($('input[type=checkbox]:checked', '#project_servicechecklist').val())!= -1) {
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
					data: {"action": "get_filters_by_service", "service": $('input[type=checkbox]:checked', '#project_servicechecklist').val() },
					success: function(response) {
						if (response.sectors) {
							$('#project_sectordiv').show();
							$('#project_sectorchecklist li').hide();
							sectors = response.sectors.split(',');
							for (i = 0; i < sectors.length; i++) { 
								$('#project_sector-'+sectors[i]).show();
							}
							
							$('#project_sectorchecklist li:hidden').each(function(){
								$(this).find('input[type=checkbox]').prop('checked', false);
							});
						}
						else 
							$('#project_sectordiv').hide();
						
						if (response.locations)
							$('#project_locationdiv').show()
						else {
							$('#project_locationdiv').hide();
							$('#project_locationchecklist input[type=checkbox]').prop('checked', false);
						}

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
	$sectors = get_field('sectors', 'project_service_'.$_POST['service']);
	if ($sectors) { 
		foreach ($sectors as $sector) {
			$rs_sectors[] = $sector->term_id;
		}
	}
	$result['sectors'] =  join(',', $rs_sectors);
	
	$rs_locations = array();
	$locations = get_field('locations', 'project_service_'.$_POST['service']);
	if ($locations) 
		$result['locations'] =  1;
	
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