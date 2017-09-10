<?php
/**
* The template for displaying Search Results.
* 
*/
?>
<?php 
get_header();

global $wp_query;

$results_count = $wp_query->found_posts;
if ($results_count == 1) 
	$results_count .= ' ' . __('Result');
else
	$results_count .= ' ' . __('Results');

$results = array(
	'work' => array('output' => '', 'count' => 0),
	'news' => array('output' => '', 'count' => 0),
	'blog' => array('output' => '', 'count' => 0),
	'people' => array('output' => '', 'count' => 0),
	'pages' => array('output' => '', 'count' => 0)
);

$show = 4;

while ( have_posts() ) : the_post();
	$post_type = get_post_type();
	
	ob_start();
	switch ($post_type) {
		case 'project':
			$img_id = get_post_thumbnail_id();
			$img = wp_get_attachment_image_src( $img_id, 'work-masonry');
			?>
			<div class="sresult">
				<div class="sresult-inner">
					<a href="<?php the_permalink();?>">
						<img class="ftitem-img" src="<?php echo $results['work']['count']<$show?$img[0]:'';?>" data-src="<?php echo $results['work']['count']>=$show?$img[0]:'';?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt />
						<span class="sresult-title">
							<?php the_title();?>
							<?php 
							$second_title = get_field('project_title_2');
							if ($second_title) { ?>
								<span class="sresult-title2"><?php echo $second_title;?></span>
								<?php
							}
							?>
						</span>
					</a>
				</div>
			</div>
			<?php
			$results['work']['output'] .= ob_get_clean();
			$results['work']['count']++;
			break;
		case 'post':
			$categories = get_the_category();
			$lv1_term = null;
			$lv2_term = null;

			foreach ($categories as $category) {
				if (!empty($category->category_parent))	$lv2_term = $category;
				else if ($category->slug != 'uncategorized') $lv1_term = $category;
			}
			
			if (!$lv1_term) continue;
			?>
			<div class="sresult">
				<div class="sresult-inner">
					<?php
					if ($lv2_term) { ?>
						<a class="sresult-cat" href="<?php echo get_category_link($lv2_term->term_id);?>"><?php echo $lv2_term->name;?></a>
						<?php
					}
					?>
					<a class="sresult-title" href="<?php the_permalink();?>"><?php the_title();?></a>
					<div class="sresult-excerpt"><?php the_excerpt();?></div>
				</div>
			</div>
			<?php
			if ($lv1_term->slug == 'news') {
				$results['news']['output'] .= ob_get_clean();
				$results['news']['count']++;
			}
			else if ($lv1_term->slug == 'blog') {
				$results['blog']['output'] .= ob_get_clean();
				$results['blog']['count']++;
			}
			break;
		case 'team_manager':
			$img_id = get_field('headshot_image');
			$img = wp_get_attachment_image_src($img_id, 'team-thumbnail');
			?>
			<div class="sresult">
				<div class="sresult-inner">
					<a href="<?php the_permalink();?>">
						<img src="<?php echo $results['people']['count']<$show?$img[0]:'';?>" data-src="<?php echo $results['people']['count']>=$show?$img[0]:'';?>" width="<?php echo $img[1];?>" height="<?php echo $img[2];?>" alt="">
						<span class="sresult-title">
							<?php the_title();?>
							<span class="sresult-title2"><?php the_field('job_title');?></span>
						</span>
					</a>
				</div>
			</div>
			<?php
			$results['people']['output'] .= ob_get_clean();
			$results['people']['count']++;
			break;
	}
	
endwhile;
?>
<section id="page-header">
	<div class="be-section breadcrumbs clearfix">
		<div class="be-section-pad clearfix">
			<div class="be-row be-wrap clearfix zero-bottom be-no-space">
				Search
			</div>
		</div>
	</div>
	<div class="be-section page-intro clearfix">
		<div class="be-section-pad clearfix">
			<div class="be-row clearfix be-wrap">
				<div class="one-col column-block clearfix">
					<h1><?php printf(__('Search Results for: %s', 'mgad'), '<span>' . get_search_query() . '</span>');?></h1>
					<h3><?php echo $results_count;?></h3>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="content" class="no-sidebar-page">
	<div id="content-wrap" class="clearfix"> 
		<section id="page-content">
			<div class="be-section">
				<div class="be-section-pad">
					<div class="be-row clearfix be-wrap-wide">
						<?php 			
						if( have_posts() ) : ?>
							<div class="result-set">
								<div class="result-header be-wrap">
									<h2>Work</h2>
									<div class="result-count">
										<?php echo $results['work']['count']>$show?$show:$results['work']['count'];?> of <?php echo $results['work']['count'];?> results
									</div>
								</div>
								<div class="result-wrap sresult-s1 clearfix">
									<?php echo $results['work']['output'];?>
								</div>
								<?php 
								if ($results['work']['count'] > $show) : ?>
									<div class="result-loadmore">
										<a class="be-shortcode mediumbtn be-button" data-show="<?php echo $show;?>" href="#">Load <?php echo $results['work']['count'] - $show;?> More</a>
									</div>
									<?php
								endif;
								?>
							</div>
							
							<div class="result-set">
								<div class="result-header be-wrap">
									<h2>News</h2>
									<div class="result-count">
										<?php echo $results['news']['count']>$show?$show:$results['news']['count'];?> of <?php echo $results['news']['count'];?> results
									</div>
								</div>
								<div class="result-wrap sresult-s2 clearfix">
									<?php echo $results['news']['output'];?>
								</div>
								<?php 
								if ($results['news']['count'] > $show) : ?>
									<div class="result-loadmore">
										<a class="be-shortcode mediumbtn be-button" data-show="<?php echo $show;?>" href="#">Load <?php echo $results['news']['count'] - $show;?> More</a>
									</div>
									<?php
								endif;
								?>
							</div>
							
							
							<div class="result-set">
								<div class="result-header be-wrap">
									<h2>Insights/Blog</h2>
									<div class="result-count">
										<?php echo $results['blog']['count']>$show?$show:$results['blog']['count'];?> of <?php echo $results['blog']['count'];?> results
									</div>
								</div>
								<div class="result-wrap sresult-s2 clearfix">
									<?php echo $results['blog']['output'];?>
								</div>
								<?php 
								if ($results['blog']['count'] > $show) : ?>
									<div class="result-loadmore">
										<a class="be-shortcode mediumbtn be-button" data-show="<?php echo $show;?>" href="#">Load <?php echo $results['blog']['count'] - $show;?> More</a>
									</div>
									<?php
								endif;
								?>								
							</div>
							
							
							<div class="result-set">
								<div class="result-header be-wrap">
									<h2>People</h2>
									<div class="result-count">
										<?php echo $results['people']['count']>$show?$show:$results['people']['count'];?> of <?php echo $results['people']['count'];?> results
									</div>
								</div>
								<div class="result-wrap sresult-s1 clearfix">
									<?php echo $results['people']['output'];?>
								</div>
								<?php 
								if ($results['people']['count'] > $show) : ?>
									<div class="result-loadmore">
										<a class="be-shortcode mediumbtn be-button" data-show="<?php echo $show;?>" href="#">Load <?php echo $results['people']['count'] - $show;?> More</a>
									</div>
									<?php
								endif;
								?>		
							</div>
							
							
							<div class="result-set">
								<div class="result-header be-wrap">
									<h2>Pages</h2>
									<div class="result-count">
										<?php echo $results['pages']['count']>$show?$show:$results['pages']['count'];?> of <?php echo $results['pages']['count'];?> results
									</div>
								</div>
								<div class="result-wrap clearfix">
									<?php echo $results['pages']['output'];?>
								</div>
								<?php 
								if ($results['pages']['count'] > $show) : ?>
									<div class="result-loadmore">
										<a class="be-shortcode mediumbtn be-button" data-show="<?php echo $show;?>" href="#">Load <?php echo $results['pages']['count'] - $show;?> More</a>
									</div>
									<?php
								endif;
								?>
							</div>
							<?php
						else:
							echo '<p class="inner-content">'.__( 'Apologies, but no results were found.', 'be-themes' ).'</p>';
						endif;
						?>
					</div>
				</div>
			</div> 
		</section>
	</div>
</section>					
<?php get_footer(); ?>