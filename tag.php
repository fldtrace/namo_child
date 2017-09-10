<?php
/**
* The template for displaying Tag Archive pages.
* 
*/
?>
<?php 
get_header(); 
?>
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
					<h1><?php _e( 'Articles tagged with: ' ); echo single_tag_title( '', false );?></h1>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="content">
	<div id="content-wrap" class="clearfix"> 
		<section id="page-content">
			<div class="clearfix">
				<?php 			
				global $wp_query;
				$items_per_page = 12;
				if( have_posts() ) : ?>
					<div class="filterable-container updates-filterable" data-showposts="<?php echo $items_per_page;?>" data-filter="" data-orderby="" data-order="asc">
						<div class="filterable-grid-container">
							<div class="filterable-grid clearfix">
								<?php
								while ( have_posts() ) : the_post();
									get_template_part( 'loop' ); 
								endwhile;
								?>
							</div>
							<?php
							if( $items_per_page != '-1' && $items_per_page < $wp_query->found_posts ) { ?>
								<div class="filterable-load-more load-hidden"><a class="be-shortcode mediumbtn be-button" href="#">Load More</a></div>
								<?php
							}
							?>
						</div>
					</div>
					<?php
				else:
					echo '<p class="inner-content">'.__( 'Apologies, but no results were found. Perhaps searching will help find a related post.', 'be-themes' ).'</p>';
				endif;
				?>
			</div> 
		</section>
	</div>
</section>					
<?php get_footer(); ?>