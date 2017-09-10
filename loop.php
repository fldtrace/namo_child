<?php

$attachment_id = get_post_thumbnail_id();
$image_size = 'news-thumbnail-sp';

$attachment_thumb = wp_get_attachment_image_src( $attachment_id, $image_size);

$permalink = get_permalink() ; 

$categories = get_the_category();
$lv2_term = null;
$lv1_term = null;

foreach ($categories as $category) {
	if (!empty($category->category_parent))	$lv2_term = $category;
	else if ($category->slug != 'uncategorized') $lv1_term = $category;
}

?>
<div class="ftitem rc-item">
	<div class="ftitem-inner clearfix">
		<a class="ftitem-img-wrap" href="<?php echo $permalink;?>"><img class="ftitem-img" src="" data-src="<?php echo $attachment_thumb[0];?>" width="<?php echo  $$attachment_thumb[1] ;?>" height="<?php echo $attachment_thumb[2];?>" alt /></a>
		<div class="ftitem-details">
			<a class="rc-item-cat ftitem-filter ftitem-filter-lv2" href="<?php echo home_url('/updates/#' . $lv1_term->slug . ':' . $lv2_term->slug);?>"><?php echo $lv2_term->name;?></a>
			<span class="rc-item-date"><?php echo get_the_date('m.d.y');?></span>
			<div class="clear"></div>
			<h3 class="ftitem-title"><a href="<?php echo $permalink;?>"><?php the_title();?></a></h3>
			<?php
			$author_name = get_field('author_name');
			if ($author_name) { ?>
				<div class="ftitem-author">By <?php echo $author_name;?></div>
				<?php
			}
			?>
			<div class="ftitem-excerpt"><?php the_excerpt();?></div>
		</div>
	</div>
</div>


