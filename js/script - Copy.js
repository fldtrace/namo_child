;(function ($) {
	
	var scrollbarWidth = $(window).width()>=960?window.innerWidth - document.documentElement.clientWidth:0;
	
	// show/hide fullscreen menu if nav (hamburger) icon is clicked 
	$('.header-nav-icon').click(function(e){
		var $this = $(this);
		if (!$this.hasClass('is-active')) {
			$this.addClass('is-active');
			$(document.documentElement).addClass('menu-activated').css('marginRight', scrollbarWidth + 'px');
			$('#header-inner-wrap').css('paddingRight', scrollbarWidth + 'px');
			$('.main-nav').css('paddingRight', scrollbarWidth + 'px').addClass('is-active');
		}
		else {
			$this.removeClass('is-active');
			$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
			$('#header-inner-wrap').css('paddingRight', '0');
			$('.main-nav').css('paddingRight', '0').removeClass('is-active');
		}
	});
	
	if ($(window).width() < 768) $(document.body).addClass('mobile');
	
	$workcontainer = $('.work-container');
	$workbreadcrumbs = $('.work-breadcrumbs');
	$workgrid = $('.work-grid');
	$workgridcontainer = $('.work-grid-container');
	$workfiltercontainer = $('.work-filters-container');
	$workfilter = $('.work-filters');
	$worktablehead = $('.work-table-head');
	$work_loadmore = $('.work-load-more');
	$worksearchinput = $('.work-search-input');
	$applyfilters = $('.apply-filters');
	
	showposts = parseInt($workgrid.data('showposts'));
	workgrid_init = 0;
	
	// update work breadcrumbs content when new filters are applied
	function update_breadcrumbs() {
		$current_service = $workfilter.find('.filter-service.current_choice');
		
		breadcrumbs = '';
		
		if ($current_service.length) {
			breadcrumbs += '<span><a class="breadcrumb-service" href="#">'+$current_service.text()+'</a><i class="icon-right-open"></i></span>';
			
			$current_sector = $current_service.siblings('.sector-filters').find('.current_choice');
			if ($current_sector && $current_sector.data('filter')) {
				breadcrumbs += '<span><a class="breadcrumb-sector" href="#">'+$current_sector.text()+'</a><i class="icon-right-open"></i></span>';
			}
			
			$current_location = $current_service.siblings('.location-filters').find('.current_choice');
			if ($current_location && $current_location.data('filter')) {
				breadcrumbs += '<span><a class="breadcrumb-current_location" href="#">'+$current_location.text()+'</a><i class="icon-right-open"></i></span>';
			}
		}
		
		$workbreadcrumbs.html(breadcrumbs);
	}
	
	// update search part of work breadcrumbs when new search is applied
	function update_breadcrumbs_search() {
		if ($worksearchinput.val()) {
			$workbreadcrumbs.find('.breadcrumb-search').remove();
			$workbreadcrumbs.append('<a class="breadcrumb-search" href="#">Search Results for: '+$worksearchinput.val()+'</a>');			
		}
		else {
			$workbreadcrumbs.find('.breadcrumb-search').remove();
		}
	}
	
	// load more work when new filters are applied OR "load more" button is clicked
	function load_work(loadmore = true) {
		filterClasses = $workgrid.data('filter');

		// get all filtered item (without search)
		$filteredItems_temp = $workgrid.children(filterClasses);
		
		$filteredItems = $();
		
		// if search input is not empty, filter the search results from the filtered items
		if ($worksearchinput.val()) {
			qsRegex = new RegExp( $worksearchinput.val(), 'gi' );
			count = 0;
			$filteredItems_temp.each(function(){
				if (qsRegex ? $(this).text().match( qsRegex ) : true) $filteredItems = $filteredItems.add($(this));
			});
		}
		else 
			$filteredItems = $filteredItems_temp;
		
		// update work result count
		$('.work-results-count').html($filteredItems.length + ' Results');

		// return if the current view is "list" because all filtered items are shown (no need to load more)
		if ($workgrid.data('view')=='list') return;
		
		// find filtered and hidden items
		$hiddenItems = $filteredItems.filter(':not(.loaded)');
		
		// calculate if need to load more items
		// if number of loaded items are less than one page
		if ($filteredItems.filter('.loaded').length < showposts) 
			loadposts = showposts - $filteredItems.filter('.loaded').length;
		// if load more is clicked (not automatic load more)
		else if (loadmore)
			loadposts = showposts;
		// if automatic load more and number of loaded items are already more than one page
		else 
			loadposts = 0;
		
		$work_loadmore.addClass('hidden');
		
		if (loadposts) {
			$('.page-loader').css('display', 'block');
			
			// load images of hidden items and refilter when all images are loaded
			$hiddenItems.filter(':lt('+loadposts+')').each(function(){
				var $this = $(this);
				if (!$this.hasClass('loaded')) {
					$img = $this.find('.wkitem-img');
					$img.attr('src', $img.data('src'))
						.attr('data-src','');
				}
			}).imagesLoaded(function(){
				var $this = $(this);
				$this.addClass('loaded');
				
				$workgrid.isotope();
				
				$('.page-loader').css('display', 'none');
				
				// if there are more hidden (unloaded) items
				if ($hiddenItems.length > loadposts) {
					$work_loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
				}			
			});
		}
		else {
			if ($hiddenItems.length > loadposts) {
				$work_loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
			}			
		}
	}

	//work filter
	$workfilter.on('click', '.filter', function (e, reset = false) {
		e.preventDefault();
		var $this = jQuery(this);
		
		// "reset" means scripted click, not real user click
		if (!reset) {
			if ($(document.body).hasClass('mobile')) {
				if ($this.hasClass('current_choice')) {
					$workfilter.toggleClass('showservices');
				}
				else {
					$workfilter.removeClass('showservices');
				}
			}
			// return if it's a real mouse click and this filter is already active
			else if ($this.hasClass('current_choice')) return;
		}
		
		// set selected filter classes and data
		if ($this.closest('.sector-filters').length) {
			$workfilter.find('.sector-filters .current_choice').removeClass('current_choice');
			$workfilter.data('sector', $this.attr('data-filter'));
		}
		else if ($this.closest('.location-filters').length) {
			$workfilter.find('.location-filters .current_choice').removeClass('current_choice');
			$workfilter.data('location', $this.attr('data-filter'));
		}
		else {
			$workfilter.data('service', $this.attr('data-filter'))
				.data('sector', '')
				.data('location', '')
				.find('.current_choice').removeClass('current_choice');
			
			$this.siblings('.location-filters').find('.filter:eq(0)').addClass('current_choice');
			$this.siblings('.sector-filters').find('.filter:eq(0)').addClass('current_choice');
		}
				
		$this.addClass('current_choice');
	});
	
	// "apply filters" clicked
	$workcontainer.on('click', '.apply-filters', function (e) {
		e.preventDefault();
		
		// reset/empty search input
		$worksearchinput.val('');
		
		// find selected filters
		current_service = $workfilter.data('service');
		current_location = $workfilter.data('location');
		current_sector = $workfilter.data('sector');
		filterClasses = current_service + current_location + current_sector;
		
		// if no filters selected, show all items
		if (!filterClasses) filterClasses = '.wkitem';
		
		// assign new current filter
		$workgrid.data('filter', filterClasses);
		
		// if workgrid is not initiated
		if (!workgrid_init) {
			$workgrid.isotope({
				itemSelector : '.wkitem',
				filter: function() {
					matched = $(this).is($workgrid.data('filter') + ($workgrid.data('view')=='list'?'':'.loaded'));
					
					// filter by search string
					if (matched && $worksearchinput.val()) {
						qsRegex = new RegExp( $worksearchinput.val(), 'gi' );
						matched = (qsRegex ? $(this).text().match( qsRegex ) : true);
					}
					
					return matched;
				},
				sortBy: $workgrid.data('view')=='list'?$workgrid.data('orderby'):'original-order',
				sortAscending: $workgrid.data('view')=='list'?$workgrid.data('order')=='asc':true,
				getSortData: {
					// fields used for search
					title: function( itemElem ) {
						var title = $( itemElem ).find('.wkitem-title').text().toLowerCase();
						return title;
					},
					service: function( itemElem ) {
						var service = $( itemElem ).find('.wkitem-service').text().toLowerCase();
						service = service==''?'~':service;
						return service;
					},
					location: function( itemElem ) {
						var location = $( itemElem ).find('.wkitem-location').text().toLowerCase();
						location = location==''?'~':location;
						return location;
					}
				}
			});
			workgrid_init = 1;
		}
		// if workgrid is already initiated, just refilter/resort
		else {
			$workgrid.isotope();
		}
		
		// update breadcrumbs and load more work if needed 
		update_breadcrumbs();

		load_work(false);
	});
	
	// clear filters, remove all selected classes, reset data and trigger click on apply filters 
	$workcontainer.on('click', '.clear-filters', function (e) {
		e.preventDefault();
		$workfilter.find('.current_choice').removeClass('current_choice');
		$workfilter.data('service', '')
			.data('sector', '')
			.data('location', '');
		$applyfilters.click();
	});
	
	// collapse/expand filter panel
	$('.toggle-filters').click(function(e){
		$workfiltercontainer.toggleClass('expanded');
		$(this).toggleClass('expanded');
	});
	
	// view switch (list/grid)
	$workcontainer.on('click', '.work-view-button', function () {
		if ($(this).hasClass('is-active')) return;
		
		if ($workgridcontainer.hasClass('view-list')) {
			$workgridcontainer.removeClass('view-list');
			$workgrid.data('view', 'grid');
			$workgrid.isotope({
				sortBy: 'original-order',
				sortAscending: 'asc'
			});
			load_work(false);
		}
		else {
			$workgridcontainer.addClass('view-list');
			$workgrid.data('view', 'list');
			
			$workgrid.isotope({
				sortBy: $workgrid.data('orderby'),
				sortAscending: $workgrid.data('order')=='asc'
			});
			
			$work_loadmore.addClass('hidden');
		}
		
		$(this).addClass('is-active').siblings('.work-view-button').removeClass('is-active');
	});
	
	// sort in list view
	$worktablehead.on('click', '.sort', function(e){
		e.preventDefault();
		
		orderby = $(this).data('orderby');
		
		
		if (!$(this).hasClass('asc')) {
			asc = true;
			
			$worktablehead.find('.sort').removeClass('desc asc');
			$(this).addClass('asc');
		}
		else {
			asc = false;
			
			$worktablehead.find('.sort').removeClass('desc asc');
			$(this).addClass('desc');
		}
		
		$workgrid.data('orderby', orderby).data('order', asc?'asc':'desc');
		
		$workgrid.isotope({
			sortBy: $workgrid.data('orderby'),
			sortAscending: $workgrid.data('order')=='asc'
		});
	});
	
	// filter when a filter link in list view is clicked
	$workgrid.on('click', '.wkitem-filter', function(e){
		e.preventDefault();
		
		// if service filter
		if ($(this).parent().hasClass('wkitem-service')) {
			service_filter = $(this).data('filter');
			
			$workfilter.find('.current_choice').removeClass('current_choice');
			$workfilter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] );
		}
		// if sector filter
		else if ($(this).parent().hasClass('wkitem-sectors')) {
			service_filter = $(this).parent().siblings('.wkitem-service').find('.wkitem-filter').data('filter');
			sector_filter = $(this).data('filter');
			
			$workfilter.find('.current_choice').removeClass('current_choice');
			$workfilter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] )
				.siblings('.sector-filters').find('a[data-filter="'+sector_filter+'"]').trigger( 'click', [ true ]);
		}
		// if location filter
		else if ($(this).parent().hasClass('wkitem-location')) {
			service_filter = $(this).parent().siblings('.wkitem-service').find('.wkitem-filter').data('filter');
			location_filter = $(this).data('filter');
			
			$workfilter.find('.current_choice').removeClass('current_choice');
			$workfilter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] )
				.siblings('.location-filters').find('a[data-filter="'+location_filter+'"]').trigger( 'click', [ true ]);
		}
		
		$applyfilters.click();
	});

	// use value of search field to filter
	$worksearchinput.keyup( debounce( function() {
		$workgrid.isotope();
		update_breadcrumbs_search();
		load_work(false);
		
	}, 500 ) );

	// debounce so filtering doesn't happen every millisecond
	function debounce( fn, threshold ) {
		var timeout;
		return function debounced() {
			if ( timeout ) {
				clearTimeout( timeout );
			}
			function delayed() {
				fn();
				timeout = null;
			}
			timeout = setTimeout( delayed, threshold || 100 );
		}
	}

	// load more button clicked
	$work_loadmore.find('a').click(function(e){
		e.preventDefault();
		load_work();
	});
	
	// show/hide search input
	$('.work-search a').click(function(e){
		e.preventDefault();
		if ($(this).parent().toggleClass('is-active').hasClass('is-active'))
			$worksearchinput.focus();
	});
	
	//initiate isotope grid
	
	// initial filters array (service, sector, location)
	initial_filters = ['.featured', '', ''];

	$workfilter.find('.current_choice').removeClass('current_choice');
	$workfilter.find('.filter-service[data-filter="'+initial_filters[0]+'"]').trigger( 'click', [ true ] )
		.siblings('.location-filters').find('a[data-filter="'+initial_filters[1]+'"]').trigger( 'click')
		.siblings('.location-filters').find('a[data-filter="'+initial_filters[2]+'"]').trigger( 'click');
		
	$applyfilters.click();	
}(jQuery));