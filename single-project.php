<?php
/*
	The template for displaying a Project (Work)
*/

get_header();
while (have_posts() ) : the_post();
	$hero_image_id = get_field('project_hero_image');
	$hero_image = wp_get_attachment_image_src($hero_image_id, 'work-hero');
	
	$project_title = get_the_title();
	$project_color = get_field('project_color');
	$project_title_2 = get_field('project_title_2');
	
	$project_lead = get_field('project_lead');
	
	$project_location = get_field('project_location');
	$project_industry = get_field('project_industry');
	$project_url = get_field('project_url');
	$project_url_label = get_field('project_url_label');
	$project_size = get_field('project_size');
	$project_completion_year = get_field('project_completion_year');
	$project_cert = get_field('project_cert');
	
	$project_problems = get_field('project_problems');
	if (!$project_problems) $project_problems = get_field('project_objective');
	
	$feature_section = get_field('project_feature_section');
	$feature_quote = get_field('project_feature_quote');
	
	$callouts = get_field('project_call_outs');
	$images = get_field('project_images');
	
	$solution = get_field('project_solution');
	$solution_image = get_field('project_solution_image');
	
	$related_projects = get_field('related_projects');
	
	$awards = get_field('project_awards');
	?>
	<style>
	.hs-spot-shape {
		border-color: <?php echo $project_color;?> !important;
	}
	.hs-spot-shape-inner,
	.hs-spot-shape-inner-two,
	.hs-active .hs-spot-shape {
		background-color: <?php echo $project_color;?> !important;
	}
	</style>
	
	<div class="header-hero-section" id="hero-section">
		<div class="header-hero-custom-section">
			<div class="hero-section-wrap be-section full-no be-bg-cover clearfix" style="background-image: url(<?php echo $hero_image[0];?>)">
				<div class="be-row be-wrap">
					<div class="hero-section-inner-wrap">
						<div class="hero-section-inner">
							<h1 class="project-title"><?php echo $project_title;?></h1>
							<?php echo do_shortcode('[mgad_social_sharing]');?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<section id="content" class="no-sidebar-page">
		<div id="content-wrap" class="page-builder">
			<section id="page-content">
				<div class="clearfix">
					<div class="be-section clearfix project-tagline" style="background-color:<?php echo $project_color;?>">
						<div class="be-row clearfix be-no-space zero-bottom">
							<div class="one-col column-block be-column-pad">
								<h2><?php the_field('project_tagline');?></h2>
							</div>
						</div>
					</div>
					<div class="be-section clearfix project-details">
						<div class="be-row be-wide-wrap clearfix zero-bottom be-no-space">
							<div class="one-fourth column-block be-column-pad">
								<h1 class="project-title-1"><?php the_title();?></h1>
								<?php mgad_print($project_title_2,'<h2 class="project-title-2">','</h2>');?>
							</div>
							<div class="one-half column-block be-column-pad project-problems">
								<?php echo $project_problems;?>
							</div>
							<div class="one-fourth column-block be-column-pad project-others">
								<?php
								if ($project_lead) : ?>
									<div class="project-lead clearfix">
										<h3><?php _e('Project Lead');?></h3>
										<?php
										foreach ($project_lead as $profile_id) : 
											$profile_image_id = get_field('headshot_image', $profile_id);
											$profile_image = wp_get_attachment_image_src($profile_image_id, 'team-thumbnail');
											?>
											<a href="<?php echo get_permalink($profile_id);?>"><img src="<?php echo $profile_image[0];?>" width="<?php echo $profile_image[1];?>" height="<?php echo $profile_image[2];?>" alt=""><span><?php echo get_the_title($profile_id);?></span></a>
											<?php
										endforeach;
										?>
									</div>
									
									<ul class="project-fields">
										<?php mgad_print($project_location, '<li><i class="icon-mgad-location"></i>', '</li>');?>
										<?php mgad_print($project_industry, '<li><i class="icon-mgad-industry"></i>', '</li>');?>
										<?php mgad_print($project_material, '<li><i class="icon-mgad-material"></i>', '</li>');?>
										<?php mgad_print($project_size, '<li><i class="icon-mgad-size"></i>', '</li>');?>
										<?php mgad_print($project_completion_year, '<li><i class="icon-mgad-year"></i>', '</li>');?>
										<?php mgad_print($project_cert, '<li><i class="icon-mgad-cert"></i>', '</li>');?>
										
										<?php
										if ($project_certs) :
											foreach ($project_certs as $cert) : ?>
												<li><i class="icon-mgad-cert"></i><?php echo $cert['certification'];?></li>
												<?php
											endforeach;
										endif;
										?>
										
										<?php
										if ($project_url) : ?>
											<li><a href="<?php echo $project_url;?>" target="_blank"><i class="icon-mgad-link"></i><?php echo $project_url_label;?></a></li>
											<?php
										endif;
										?>
									</ul>
									<?php
								endif;
								?>
							</div>
						</div>
						
						<?php 
						if ($feature_section) : ?>
							<div class="be-row be-wide-wrap clearfix zero-bottom be-no-space project-feature-section">
								<?php mgad_print($feature_quote, '<div class="one-fourth column-block be-column-pad"><div class="project-feature-quote">', '</div></div>');?>
								<div class="<?php echo $feature_quote?'three-fourth':'one-col';?> column-block">
									<div class="project-feature flexslider-wrap">
										<div class="flexslider">
											<ul class="slides">
												<?php
												foreach ($feature_section as $slide) : ?>
													<li>
														<?php
														if ($slide['slide_type'] == '1') : 
															$img = wp_get_attachment_image_src($slide['image'], 'full');
															?>
															<div class="img-zoom">
																<img src="<?php echo esc_attr($img[0]);?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
																<a class="zoom-btn" href="<?php echo $img[0];?>"></a>
															</div>
															<?php mgad_print($slide['image_caption'], '<div class="caption">', '</div>');?>															
															<?php
														else :
															echo do_shortcode($slide['html']);
														endif;
														?>
													</li>
													<?php
												endforeach;
												?>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<?php
						endif;
						?>
						
						<div class="be-row be-wrap clearfix zero-bottom be-no-space">
							<div class="one-col column-block be-column-pad">
								<div class="project-holistic">
									<?php the_field('project_holistic');?>
								</div>
							</div>
						</div>
						
						<?php
						if ($callouts) : ?>
							<div class="be-row clearfix zero-bottom be-no-space" style="background-color:<?php echo $project_color;?>">
								<div class="one-col be-column-pad column-block project-callouts flexslider-wrap">
									<div class="flexslider">
										<ul class="slides">
											<?php 
											foreach ($callouts as $callout) : ?>
												<li><?php echo $callout['call_out'];?></li>
												<?php
											endforeach;
											?>
										</ul>
									</div>
								</div>
							</div>
							<?php
						endif;
						?>
						
						<?php
						if ($images) : ?>
							<div class="be-row clearfix zero-bottom be-no-space">
								<div class="one-col column-block be-column-pad project-images flexslider-wrap">
									<div class="flexslider">
										<ul class="slides">
											<?php 
											foreach ($images as $image) : 
												$img = wp_get_attachment_image_src($image['image'], 'large');
												$img_full = wp_get_attachment_image_src($image['image'], 'full');
												?>
												<li>
													<div class="img-zoom">
														<img src="<?php echo esc_attr($img[0]);?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
														<a class="zoom-btn" href="<?php echo $img_full[0];?>"></a>
													</div>
													<?php mgad_print($image['image_caption'], '<div class="caption">', '</div>');?>
												</li>
												<?php
											endforeach;
											?>
										</ul>
									</div>
								</div>
							</div>
							<?php
						endif;
						?>
						
						<?php
						if ($solution) : ?>
							<div class="be-row be-wrap clearfix zero-bottom be-no-space project-solution-wrap">
								<div class="one-col column-block be-column-pad project-solution">
									<?php echo $solution;?>
								</div>
							</div>
							<?php
						endif;
						?>
						
						
						<?php 
						if ($related_projects) : ?>
							<div class="be-row clearfix zero-bottom be-no-space section-title">
								<div class="one-col column-block be-column-pad">
									<?php _e('Related Projects');?>
								</div>
							</div>
							<div class="be-row be-wide-wrap clearfix zero-bottom be-no-space rp-list">
								<div class="one-fourth column-block rp-project-titles expanded">
									<i class="icon-down-open"></i>
									<ul>
										<?php
										foreach ($related_projects as $related_project) : ?>
											<li><a href="#"><?php echo get_the_title($related_project);?></a></li>
											<?php
										endforeach;
										?>
									</ul>
								</div>
								<div class="three-fourth column-block">
									<ul class="rp-project-details">
										<?php
										foreach ($related_projects as $related_project) : ?>
											<li class="clearfix">
												<div class="rp-project-images flexslider-wrap">
													<?php
													$rp_imgs = get_field('project_images', $related_project);
													if ($rp_imgs) :	?>
														<div class="flexslider">
															<ul class="slides">
																<?php
																foreach ($rp_imgs as $rp_img) : 
																	$img = wp_get_attachment_image_src( $rp_img['image'], 'related-project');
																	$img_full = wp_get_attachment_image_src( $rp_img['image'], 'full');
																	?>
																	<li>
																		<div class="img-zoom">
																			<img src="<?php echo esc_attr($img[0]);?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
																			<a class="zoom-btn" href="<?php echo $img_full[0];?>"></a>
																		</div>
																	</li>
																	<?php
																endforeach;
																?>
															</ul>
														</div>
														<?php
													endif;
													?>
												</div>
												<div class="rp-project-link">
													<div class="rp-project-title-2"><?php echo get_field('project_tagline', $related_project);?></div>
													<a class="be-button mediumbtn redbtn" href="<?php echo get_permalink($related_project);?>">See More</a>
												</div>
											</li>
											<?php
										endforeach;
										?>
									</ul>
								</div>
							</div>
							<?php
						endif;
						?>
						
						<?php
						if ($awards) : ?>
							<div class="be-row be-wrap clearfix zero-bottom be-no-space project-awards">
								<div class="one-col column-block">
									<div class="awards-title"><img src="<?php echo get_stylesheet_directory_uri();?>/images/icon_awards.svg" width="45" alt="Awards"></div>
									<ul>
										<?php
										foreach ($awards as $award) : ?>
											<li><?php echo $award['award'];?></li>
											<?php
										endforeach;
										?>
									</ul>
								</div>
							</div>
							<?php
						endif;
						?>								
								
						
						<div class="be-row be-no-space zero-bottom clearfix section-title section-title-light rc-title">
							<div class="one-col column-block be-column-pad">
								<?php 
								if ($related_projects) 
									_e('Related News & Insights');
								else
									_e('Related Content');
								?>
							</div>
						</div>
						
						<?php 
						// if small client story, search for related projects
						if (!$related_projects) : 
							$post_ids = mgad_get_project_related_projects(2);
							?>
							<div class="be-row be-wrap clearfix zero-bottom be-no-space rc-pr-list">
								<?php
								foreach ($post_ids as $post_id) : 
									$img_id = get_post_thumbnail_id($post_id);
									$img = wp_get_attachment_image_src( $img_id, 'project-thumbnail');
									
									$permalink = get_permalink($post_id);
									?>
									<div class="one-half column-block clearfix">
										<div class="rc-item clearfix">
											<a class="rc-item-img" href="<?php echo $permalink;?>"><img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt=""></a>
											<div class="rc-item-details">
												<div class="rc-item-details-inner">
													<a class="rc-parent" href="#"><?php _e('Work', 'mgad');?></a>
													<div class="rc-item-title"><?php echo get_the_title($post_id);?></div>
													<div class="rc-item-title-2"><?php echo get_the_title($post_id);?></div>
													<a class="be-button mediumbtn redbtn" href="<?php echo $permalink;?>">See More</a>
												</div>
											</div>
										</div>
									</div>
									<?php
								endforeach;
								?>
							</div>
							<?php
						endif;
						?>
						
						<div class="be-row be-wrap clearfix zero-bottom be-no-space rc-list">
							<?php
							$post_ids = mgad_get_project_related_news(4);
							foreach ($post_ids as $post_id) : 
								$categories = get_the_category($post_id);
								$cat = NULL;

								foreach ($categories as $category) {
									if (!empty($category->category_parent))	$cat = $category;
								}
								if (empty($cat)) $cat = $categories[0];

								$img_id = get_post_thumbnail_id($post_id);
								
								$img = wp_get_attachment_image_src( $img_id, 'news-thumbnail');
								
								$permalink = get_permalink($post_id);
								?>
								<div class="one-fourth column-block clearfix">
									<div class="rc-item">
										<a class="rc-item-img" href="<?php echo $permalink;?>"><img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt=""></a>
										<a class="rc-item-cat" href="<?php echo get_category_link($cat->term_id);?>"><?php echo $cat->name;?></a>
										<div class="clear"></div>
										<a class="rc-item-title" href="<?php echo $permalink;?>"><?php echo get_the_title($post_id);?></a>
									</div>
								</div>
								<?php
							endforeach;
							?>
						</div>
						
						
						<div class="be-row zero-bottom clearfix call-to-action-wrap">
							<div class="be-wrap">
								<div class="one-col column-block clearfix">
									<div class="call-to-action clearfix" data-animation="fadeIn">
										<h4 class="action-content">Hi, let’s work together.</h4>
										<a class="mediumbtn be-button rounded action-button" href="<?php echo home_url();?>/contact/">Yeah, let’s talk</a>
									</div>
								</div>
							</div>
						</div>						
						
					</div>
				</div>
			</section>
		</div>
	</section>
	<?php
endwhile;
get_footer();
