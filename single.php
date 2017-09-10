<?php
/*
 *  The template for displaying a Blog Post.
 * 
 *
*/
get_header(); 
$sidebar = get_post_meta( get_the_ID(), 'be_themes_page_layout', true );
if( empty( $sidebar ) ) {
	$sidebar = 'right';
}
while ( have_posts() ) : the_post(); ?>
	<section id="page-header">
		<div class="be-section breadcrumbs clearfix">
			<div class="be-section-pad clearfix">
				<div class="be-row be-wrap clearfix zero-bottom be-no-space">
					<a href="<?php echo home_url('/updates/');?>">Updates <i class="icon-right-open"></i></a>
				</div>
			</div>
		</div>
		<div class="be-section page-intro clearfix">
			<div class="be-section-pad clearfix">
				<div class="be-row clearfix be-wrap ">
					<div class="one-col column-block clearfix">
						<h1><?php the_title();?></h1>
						<?php
						$author_name = get_field('author_name');
						if ($author_name) : ?>
							<h3 class="post-author">By <?php echo $author_name;?></h3>
							<?php
						endif;
						?>
						<div class="post-date"><?php echo get_the_date('m.d.y');?></div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section id="content" class="<?php echo $sidebar; ?>-sidebar-page">
		<div id="content-wrap" class="be-wrap clearfix">
			<section id="page-content" class="content-single-sidebar">			
				<div class="clearfix">
					<article id="post-<?php the_ID(); ?>" class="blog-post clearfix <?php echo $post_classes; ?>">
						<div class="post-content-wrap">
							<div class="post-details">
								<div class="post-content">
									<?php
									the_content();

									$args = array(
									'before'           => '<div class="pages_list margin-40">',
									'after'            => '</div>',
									'link_before'      => '',
									'link_after'       => '',
									'next_or_number'   => 'next',
									'nextpagelink'     => __('Next >','be-themes'),
									'previouspagelink' => __('< Prev','be-themes'),
									'pagelink'         => '%',
									'echo'             => 1 );
									wp_link_pages( $args );
									?>
								</div>
								<?php
								echo '<div class="post-tags">';
								the_tags();
								echo '</div>';
								
								echo do_shortcode('[et_bloom_inline optin_id="optin_2"]');
								?>
								
							</div>
							<div class="clearfix"></div>
						</div>
					</article>
				</div> <!--  End Page Content -->
			</section>
			<section id="<?php echo $sidebar; ?>-sidebar" class="sidebar-widgets">
				<?php get_sidebar(); ?>
			</section>
		</div>
		<div class="be-section page-links fullwidth clearfix">
			<div class="be-section-pad clearfix">
				<?php echo do_shortcode('[mgad_page_links slugs="updates,work,contact"]');?>
			</div>
		</div>
	</section> <?php 
endwhile;
get_footer(); 
?>