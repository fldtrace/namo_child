<?php
/*
 *  The template for displaying a Team member
 * 
 *
*/
get_header(); 

while ( have_posts() ) : the_post(); ?>
	<section id="content" class="no-sidebar-page">
		<div id="content-wrap">
			<section id="page-content">
				<div class="be-section breadcrumbs clearfix">
					<div class="be-section-pad clearfix">
						<div class="be-row be-wrap clearfix zero-bottom be-no-space">
							<a href="<?php echo home_url('/people/');?>">People <i class="icon-right-open"></i></a>
						</div>
					</div>
				</div>
				<div class="be-section page-intro clearfix">
					<div class="be-section-pad clearfix">
						<div class="be-row clearfix be-wrap ">
							<div class="one-col column-block clearfix">
								<h1><?php the_title();?></h1>
								<h3><?php the_field('job_title');?></h3>
							</div>
						</div>
					</div>
				</div>

				<div class="be-section profile-b1 clearfix">
					<div class="be-row be-wide-wrap clearfix">
						<?php
						$headshot = get_field('headshot_image');
						$headshot_img = wp_get_attachment_image_src($headshot, 'team-thumbnail');
						
						$pdf = get_field('pdf');
						$email_address = get_field('email');
						$linkedin_url = get_field('linkedin_url');
						
						$education = get_field('education');
						
						$selected_work = get_field('selected_work');
						?>
						<div class="profile-b1-left">
							<div class="profile-photo">
								<img src="<?php echo $headshot_img[0];?>" width="<?php echo $headshot_img[1];?>" height="<?php echo $headshot_img[2];?>" alt="" />
							</div>
						</div>
						<div class="profile-b1-right">
							<div class="profile-quote">
								<?php the_field('quote');?>
							</div>
							<div class="profile-links">
								<?php mgad_print($pdf, '<a class="be-button smallbtn" href="', '">Download PDF</a>');?>
								<?php mgad_print($email_address, '<a class="be-button smallbtn" href="mailto:', '">Contact</a>');?>
								<?php mgad_print($linkedin_url, '<a class="profile-linkedin" href="', '" target="_blank"><i class="icon-linkedin-circled"></i></a>');?>
							</div>
							<a href="<?php echo home_url('/people/');?>" class="profile-exit"><i class="icon-cancel"></i></a>
						</div>
					</div>
				</div>
				<div class="be-section profile-b2 clearfix">
					<div class="be-row be-wide-wrap clearfix">
						<div class="profile-b2-left clearfix">
							<div class="profile-bio">
								<h3>Bio</h3>
								<?php the_field('teammate_description');?>
							</div>
							<?php
							if ($education) : ?>
								<div class="profile-edu">
									<h3>Education</h3>
									<ul>
									<?php 
									foreach ($education as $edu) : ?>
										<li><?php echo $edu['education'];?></li>
										<?php
									endforeach;
									?>
									</ul>
								</div>
								<?php
							endif;
							?>
						</div>
						
						<?php
						$related_updates = mgad_get_profile_related_updates(4);
						
						if ($related_updates) : ?>
							<div class="profile-b2-divider"></div>
							<div class="profile-b2-right profile-rel">
								<h3>Related Updates</h3>
								<ul>
									<?php
									foreach ($related_updates as $post_id) : 
										$categories = get_the_category($post_id);
										$cat = NULL;

										foreach ($categories as $category) {
											if (!empty($category->category_parent))	$cat = $category;
										}
										if (empty($cat)) $cat = $categories[0];
										?>
										<li>
											<a class="update-cat" href="<?php echo get_category_link($cat->term_id);?>"><?php echo $cat->name;?></a>
											<br>
											<a class="update-title" href="<?php echo get_permalink($post_id);?>"><?php echo get_the_title($post_id);?></a>
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
				</div>
				
				<?php
				if ($selected_work) : ?>
					<div class="be-section profile-b3 clearfix">
						<div class="be-row be-wrap clearfix">
							<h3>Selected Work</h3>
						</div>
						<div class="be-row be-wide-wrap clearfix">
							<ul class="selected-work">
								<?php
								foreach ($selected_work as $project_id) : 
									$attachment_id = get_post_thumbnail_id($project_id);	
									$img = wp_get_attachment_image_src( $attachment_id, 'work-masonry');
									
									$permalink = get_permalink($project_id);
									$title = get_the_title($project_id);
									$title_2 = get_field('project_title_2', $project_id);
									?>
									<li>
										<a href="<?php echo $permalink;?>">
											<img src="<?php echo $img[0];?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
											<span class="project-title"><?php echo $title;?></span>
											<?php mgad_print($title_2, '<span class="project-title-2">', '</span>');?>
										</a>
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
				
				<div class="be-section page-links fullwidth clearfix">
					<div class="be-section-pad clearfix">
						<?php echo do_shortcode('[mgad_page_links slugs="people,work,contact"]');?>
					</div>
				</div>
			</section>
		</div>
	</section> 
	<?php 
endwhile;
get_footer(); 
?>