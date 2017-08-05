/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(!event.pointerType||"mouse"!=event.pointerType||0!=options.fallbackToMouseEvents){var ret,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.cancelable!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null===options.pinchThreshold||pinchDistance>=options.pinchThreshold}function validateSwipeTime(){var result;return result=!options.maxTimeThreshold||!(duration>=options.maxTimeThreshold)}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&distance<DOUBLE_TAP_THRESHOLD}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){if(maximumsMap[direction])return maximumsMap[direction].distance}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return pinchZoom<1?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return angle<0&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return angle<=45&&angle>=0?LEFT:angle<=360&&angle>=315?LEFT:angle>=135&&angle<=225?RIGHT:angle>45&&angle<135?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.18",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});


// reduce overhead by preventing a function from being called several times in succession
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

;(function ($) {
	$.reset = function() {
		var previous = $(this).previous()
		, next = $(this).next()
		, parent = $(this).parent()
		, detached = $(this).detach()

		if (previous.length) previous.after(detached)
		else if (next.length) next.before(detached)
		else if (parent.length) parent.append(detached)
		else $('body').append(detached)
	};

  //mgadwork: Object Instance
	$.mgadwork = function(el, options) {
		var work = $(el),
		methods = {};

		// Store a reference to the work object
		$.data(el, "mgadwork", work);
		
		// private methods
		methods = {
			// work init
			init: function() {
				work.breadcrumbs = $('.work-breadcrumbs', work);
				work.grid = $('.work-grid', work);
				work.gridcontainer = $('.work-grid-container', work);
				work.filtercontainer = $('.work-filters-container', work);
				work.filter = $('.work-filters', work);
				work.tablehead = $('.work-table-head', work);
				work.loadmore = $('.work-load-more', work);
				work.searchinput = $('.work-search-input', work);
				work.applyfilters = $('.apply-filters', work);
				work.resultscount = $('.work-results-count', work);
				
				work.showposts = parseInt(work.data('showposts'));
				
				work.activeFilters = {};
				work.init = 0;
				
				work.on('click', '.apply-filters', methods.applyFilters);
				work.on('click', '.clear-filters', methods.clearFilters);
				work.on('click', '.work-load-more a', methods.loadWork);
				
				work.on('click', 'a[href=#]', function(){
					$(this).blur();
				});
						
				methods.setup();
				
				// use value of search field to filter
				work.searchinput.keyup( debounce(methods.search, 500 ) );

				// initial filters array (service, sector, location)
				initial_filters = ['.wkitem', '', ''];

				work.filter.find('.current_choice').removeClass('current_choice');
				work.filter.find('.filter-service[data-filter="'+initial_filters[0]+'"]').trigger( 'click', [ true ] )
					.siblings('.location-filters').find('a[data-filter="'+initial_filters[1]+'"]').trigger( 'click')
					.siblings('.location-filters').find('a[data-filter="'+initial_filters[2]+'"]').trigger( 'click');
					
				work.applyfilters.click();
			},			
			// update work breadcrumbs content when new filters are applied
			updateBreadcrumbs: function() {
				$current_service = work.filter.find('.filter-service.current_choice');
				
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
				
				work.breadcrumbs.html(breadcrumbs);
			},
			// update search part of work breadcrumbs when new search is applied
			updateBreadcrumbsSearch: function() {
				if (work.searchinput.val()) {
					work.breadcrumbs.find('.breadcrumb-search').remove();
					work.breadcrumbs.append('<a class="breadcrumb-search" href="#">Search Results for: '+work.searchinput.val()+'</a>');			
				}
				else {
					work.breadcrumbs.find('.breadcrumb-search').remove();
				}
			},
			// load more work when new filters are applied OR "load more" button is clicked
			loadWork: function(loadmore = true) {
				filterClasses = work.filterClasses;

				// get all filtered item (without search)
				$filteredItems_temp = work.grid.children(filterClasses);
				
				$filteredItems = $();
				
				// if search input is not empty, filter the search results from the filtered items
				if (work.searchinput.val()) {
					qsRegex = new RegExp( work.searchinput.val(), 'gi' );
					count = 0;
					$filteredItems_temp.each(function(){
						if (qsRegex ? $(this).text().match( qsRegex ) : true) $filteredItems = $filteredItems.add($(this));
					});
				}
				else 
					$filteredItems = $filteredItems_temp;
				
				// update work result count
				work.resultscount.html($filteredItems.length + ' Results');

				// return if the current view is "list" because all filtered items are shown (no need to load more)
				if (work.view == 'list') return;
				
				// find filtered and hidden items
				$hiddenItems = $filteredItems.filter(':not(.loaded)');
				
				// calculate if need to load more items
				// if number of loaded items are less than one page
				if ($filteredItems.filter('.loaded').length < work.showposts) 
					loadposts = work.showposts - $filteredItems.filter('.loaded').length;
				// if load more is clicked (not automatic load more)
				else if (loadmore)
					loadposts = work.showposts;
				// if automatic load more and number of loaded items are already more than one page
				else 
					loadposts = 0;
				
				work.loadmore.addClass('hidden');
				
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
						
						work.grid.isotope();
						
						$('.page-loader').css('display', 'none');
						
						// if there are more hidden (unloaded) items
						if ($hiddenItems.length > loadposts) {
							work.loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
						}			
					});
				}
				else {
					if ($hiddenItems.length > loadposts) {
						work.loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
					}			
				}
			},
			applyFilters: function(e) {
				// "apply filters" clicked
				e.preventDefault();
				
				// reset/empty search input
				work.searchinput.val('');
				
				// find selected filters
				current_service = work.activeFilters.service;
				current_location = work.activeFilters.location;
				current_sector = work.activeFilters.sector;
				filterClasses = current_service + current_location + current_sector;
				
				// if no filters selected, show all items
				if (!filterClasses) filterClasses = '.wkitem';
				
				// assign new current filter
				work.filterClasses = filterClasses;
				
				// if workgrid is not initiated
				if (!work.init) {
					work.grid.isotope({
						itemSelector : '.wkitem',
						filter: function() {
							matched = $(this).is(work.filterClasses + (work.view=='list'?'':'.loaded'));
							
							// filter by search string
							if (matched && work.searchinput.val()) {
								qsRegex = new RegExp( work.searchinput.val(), 'gi' );
								matched = (qsRegex ? $(this).text().match( qsRegex ) : true);
							}
							
							return matched;
						},
						sortBy: work.view=='list'?work.orderby:'original-order',
						sortAscending: work.view=='list'?work.order=='asc':true,
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
					work.init = 1;
				}
				// if workgrid is already initiated, just refilter/resort
				else {
					work.grid.isotope();
				}
				
				// update breadcrumbs and load more work if needed 
				methods.updateBreadcrumbs();

				methods.loadWork(false);
			},
			
			// clear filters, remove all selected classes, reset data and trigger click on apply filters 
			clearFilters: function(e) {
				e.preventDefault();
				work.filter.find('.featured').click();
				work.applyfilters.click();
			},
			
			
			// set up event handler
			setup: function() {
				
				// collapse/expand filter panel
				work.on('click', '.toggle-filters', function() {
					work.filtercontainer.toggleClass('expanded');
					$(this).toggleClass('expanded');
				});
				
				//select filter
				work.on('click', '.filter', function(reset=false) {
					var $this = jQuery(this);
					
					// "reset" means scripted click, not real user click
					if (!reset) {
						if ($(document.body).hasClass('mobile')) {
							if ($this.hasClass('current_choice')) {
								work.filter.toggleClass('showservices');
							}
							else {
								work.filter.removeClass('showservices');
							}
						}
						// return if it's a real mouse click and this filter is already active
						else if ($this.hasClass('current_choice')) return;
					}
					
					// set selected filter classes and data
					if ($this.closest('.sector-filters').length) {
						work.filter.find('.sector-filters .current_choice').removeClass('current_choice');
						work.activeFilters.sector = $this.attr('data-filter');
					}
					else if ($this.closest('.location-filters').length) {
						work.filter.find('.location-filters .current_choice').removeClass('current_choice');
						work.activeFilters.location = $this.attr('data-filter');
					}
					else {
						work.activeFilters.service = $this.attr('data-filter');
						work.activeFilters.sector = '';
						work.activeFilters.location = '';

						work.filter.find('.current_choice').removeClass('current_choice');
						
						$this.siblings('.location-filters').find('.filter:eq(0)').addClass('current_choice');
						$this.siblings('.sector-filters').find('.filter:eq(0)').addClass('current_choice');
					}
							
					$this.addClass('current_choice');
				});
			
				// view switch (list/grid)
				work.on('click', '.work-view-button', function() {
					if ($(this).hasClass('is-active')) return;
					
					if (work.gridcontainer.hasClass('view-list')) {
						work.gridcontainer.removeClass('view-list');
						work.view = 'grid';
						work.grid.isotope({
							sortBy: 'original-order',
							sortAscending: true
						});
						methods.loadWork(false);
					}
					else {
						work.gridcontainer.addClass('view-list');
						work.view = 'list';
						
						work.grid.isotope({
							sortBy: work.orderby,
							sortAscending: work.order=='asc'
						});
						
						work.loadmore.addClass('hidden');
					}
					
					$(this).addClass('is-active').siblings('.work-view-button').removeClass('is-active');
				});
				
				// show/hide search input
				work.on('click', '.work-search a', function(){
					if ($(this).parent().toggleClass('is-active').hasClass('is-active')) work.searchinput.focus();
				});
				
				// sort in list view
				work.on('click', '.sort', function(){
					orderby = $(this).data('orderby');
					
					if (!$(this).hasClass('asc')) {
						asc = true;
						
						work.tablehead.find('.sort').removeClass('desc asc');
						$(this).addClass('asc');
					}
					else {
						asc = false;
						
						work.tablehead.find('.sort').removeClass('desc asc');
						$(this).addClass('desc');
					}
					
					work.orderby = orderby;
					work.order = asc?'asc':'desc';
					
					work.grid.isotope({
						sortBy: work.orderby,
						sortAscending: work.order=='asc'
					});
				});
				
				// filter when a filter link in list view is clicked
				work.on('click', '.wkitem-filter', function(){
					// if service filter
					if ($(this).parent().hasClass('wkitem-service')) {
						service_filter = $(this).data('filter');
						
						work.filter.find('.current_choice').removeClass('current_choice');
						work.filter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] );
					}
					// if sector filter
					else if ($(this).parent().hasClass('wkitem-sectors')) {
						service_filter = $(this).parent().siblings('.wkitem-service').find('.wkitem-filter').data('filter');
						sector_filter = $(this).data('filter');
						
						work.filter.find('.current_choice').removeClass('current_choice');
						work.filter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] )
							.siblings('.sector-filters').find('a[data-filter="'+sector_filter+'"]').trigger( 'click', [ true ]);
					}
					// if location filter
					else if ($(this).parent().hasClass('wkitem-location')) {
						service_filter = $(this).parent().siblings('.wkitem-service').find('.wkitem-filter').data('filter');
						location_filter = $(this).data('filter');
						
						work.filter.find('.current_choice').removeClass('current_choice');
						work.filter.find('.filter-service[data-filter="'+service_filter+'"]').trigger( 'click', [ true ] )
							.siblings('.location-filters').find('a[data-filter="'+location_filter+'"]').trigger( 'click', [ true ]);
					}
					
					work.applyfilters.click();
				});
			},
			// search within results
			search: function() {
				work.grid.isotope();
				methods.updateBreadcrumbsSearch();
				methods.loadWork(false);
			}

		};
		
		methods.init();
	};
	
	$.fn.mgadwork = function(options) {
		return this.each(function() {
			var $this = $(this);
			if ($this.data('mgadwork') === undefined) {
				new $.mgadwork(this, options);
			}
		});
	};
})(jQuery);

;(function ($) {
	
	// make inline image covering its container (emulate background-size:cover) 
	$.fn.inlineCover = function() {
		$(this).each(function(){
			$container = $(this).parent();
			
			if ($(this).width()/$(this).height() > $container.width()/$container.height()) {
				$(this).css({
					'height': $container.height() + 'px',
					'width': 'auto',
					'opacity': 1
				});
			}
			else {
				$(this).css({
					'width': $container.width() + 'px',
					'height': 'auto',
					'opacity': 1
				});
			}
		});
	};

	$.fn.mgadZoomWrap = function() {
		$(this).each(function(){	
			if (!$(this).is('img')) return;
			$(this).wrap('<div class="img-zoom"></div>')
				.after('<a class="zoom-btn" href="'+$(this).attr('src')+'"></a>')
				.siblings('.zoom-btn').mgadZoom(false);
			
		});
	};
	
	$.fn.mgadZoom = function(enable_gallery) {
		$(this).each(function(){	
			$(this).magnificPopup({
				type: 'image',
				closeOnBgClick: true,
				closeOnContentClick: true,
				gallery:{
					enabled: enable_gallery,
					tCounter: ''
				},
				zoom: {
					enabled: true,
					opener: function(openerElement) {
						return openerElement.is('img') ? openerElement : openerElement.prev('img');
					}
				},
				image: {
					titleSrc: function(item) {
						var $caption = item.el.parent().next('.caption');
						if ($caption.length)
							return $caption.html();
					}
				}
			});
		});
	};
	
	
	$header = $('#header-inner-wrap');
	
	$(window).scroll(function(){
		if (!$header.hasClass('sticky') && $(window).scrollTop() > 30) {
			$header.addClass('sticky');
			setTimeout(function () {
				$header.addClass('sticky-animate');
			}, 10);
		}
		else if ($(window).scrollTop() <= 30) {
			$header.removeClass('sticky-animate');
			setTimeout(function () {
				$header.removeClass('sticky');
			}, 10);
		}
	});
	
	
	// show/hide fullscreen menu if nav (hamburger) icon is clicked 
	var scrollbarWidth = $(window).width()>=960?window.innerWidth - document.documentElement.clientWidth:0;

	$('.header-nav-icon').click(function(e){
		var $this = $(this);
		if (!$this.hasClass('is-active')) {
			$this.addClass('is-active');
			$(document.documentElement).addClass('menu-activated').css('marginRight', scrollbarWidth + 'px');
			$('#header-inner-wrap').css('paddingRight', scrollbarWidth + 'px');
			$('.main-nav').css('paddingRight', scrollbarWidth + 'px').addClass('is-active');
			
			$(document).on('click.menuactivated', function(e){
				if (!$(e.target).closest('#menu-main-menu, #navigation, .header-controls').length) {
					$(document).off('click.menuactivated');
					$('.header-nav-icon').removeClass('is-active');
					$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
					$('#header-inner-wrap').css('paddingRight', '0');
					$('.main-nav').css('paddingRight', '0').removeClass('is-active');
				}
			});
			
			$(document).swipe({
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				},
				threshold: 10
			});
			
			$(document).on('swipe.menuactivated', function(e){
				$(document).off('swipe.menuactivated');
				$('.header-nav-icon').removeClass('is-active');
				$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
				$('#header-inner-wrap').css('paddingRight', '0');
				$('.main-nav').css('paddingRight', '0').removeClass('is-active');
			});
		}
		else {
			$this.removeClass('is-active');
			$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
			$('#header-inner-wrap').css('paddingRight', '0');
			$('.main-nav').css('paddingRight', '0').removeClass('is-active');
		}
	});
	
	if ($(window).width() < 768) $(document.body).addClass('mobile');
	
	
	// init work filter
	$('.work-container').mgadwork();
	

	
	// initiate zoom buttons in project feature section
	$('.project-feature .zoom-btn').mgadZoom(false);
	
	// customize hotspot map for project feature section
	$('.project-feature .hs-wrap').each(function(){
		$(this).closest('li').append('<div class="hs-caption"></div>');
	});
	$('.project-feature').on('click', '.hs-spot-object', function(){
		$(this).closest('.hs-wrap').next('.hs-caption').html($(this).find('.hs-tooltip').html());
		$(this).addClass('hs-active').siblings().removeClass('hs-active');
	});

	

	// initiate zoom buttons in project images section
	$('.project-images .zoom-btn').mgadZoom(true);
	
	// initiate zoom buttons in project solution section
	$('.project-solution img').mgadZoomWrap();
	
	// initiate zoom buttons in related projects section
	$('.rp-project-details .zoom-btn').mgadZoom(true);
		

	// sticky share box
	$('<div id="sticky-sharing"></div>').wrapInner($('#project-sharing').clone()).insertAfter('#hero-section');
	$('#project-sharing').waypoint({
		handler: function (direction) {
			if (direction === 'down') {
				$('#sticky-sharing').addClass('sticky');
			} else {
				$('#sticky-sharing').removeClass('sticky');
			}
		},
		offset: '-' + $('#header-wrap').data('sticky-height') + 'px'
	});



	$(window).load(function(){

		// initiate project feature slider
		if ($('.project-feature .slides > li').length >1) {
			$('.project-feature .flexslider').flexslider({
				animation: "slide",
				slideshow: false,
				prevText: '',
				nextText: '',
				start: function(slider){
					slider.find('.img-zoom img').inlineCover();
					
					// initiate hotspot map in the first/start slide
					$slide = slider.slides.eq(slider.animatingTo);
					if ($slide.find('.hs-wrap').length) {
						$slide.find('.hs-wrap').hotspot({
							'show_on' : "always",
							'responsive' : "on",
						});
					}
				},
				before: function(slider){
					// initiate hotspot map in the active slide
					$slide = slider.slides.eq(slider.animatingTo);
					if ($slide.find('.hs-wrap').length) {
						$slide.find('.hs-wrap').hotspot({
							'show_on' : "always",
							'responsive' : "on",
						});
					}
				}
			});		
		}
		else 
			$('.project-feature .img-zoom img').inlineCover();

		// initiate project callouts slider
		if ($('.project-callouts .slides > li').length >1) {
			$('.project-callouts .flexslider').flexslider({
				animation: 'fade',
				animationSpeed: 600, 
				slideshow: true,
				slideshowSpeed: 7000, 
				smoothHeight: false,
				prevText: '',
				nextText: '',
				start: function(slider){
					// vertical center the quote
					var containerHeight = slider.height();
					slider.slides.each(function() {
						if ($(this).height() < containerHeight) {
							var verticalShift = (containerHeight - $(this).height()) / 2;
							$(this).css("paddingTop", verticalShift + "px");
						}
					});
					slider.css('visibility', 'visible');
				}	
			});
		}
		else 
			$('.project-callouts .flexslider').css('visibility', 'visible');


		// initiate project images slider
		if ($('.project-images .slides > li').length >1) {
			$('.project-images .flexslider').flexslider({
				animation: "slide",
				slideshow: false,
				prevText: '',
				nextText: '',
				start: function(slider){
					slider.find('.img-zoom img').inlineCover();
				}
			});
		}
		else 
			$('.project-images .img-zoom img').inlineCover();

		// related projects toggle
		$('.rp-project-titles a').click(function(){
			if ($(window).width() < 768) {
				$(this).closest('.rp-project-titles').toggleClass('expanded');
			}
			
			if ($(this).hasClass('active')) return;
			
			index = $('.rp-project-titles a').removeClass('active').index($(this));
			$(this).addClass('active');
			
			$rp_projects = $('.rp-project-details > li');
			$rp_projects.removeClass('active fade-in');
			
			$active_rp_project = $rp_projects.filter(':eq('+index+')');
			$active_rp_project.addClass('active').outerWidth();
			$active_rp_project.addClass('fade-in');
			
			// init or refresh flexslider for the active project
			if ($active_rp_project.find('.flexslider').data('flexslider'))
				$active_rp_project.find('.flexslider').data('flexslider').resize();
			else {
				if ($active_rp_project.find('.slides > li').length >1) {
					$active_rp_project.find('.flexslider').flexslider({
						animation: "slide",
						slideshow: false,
						prevText: '',
						nextText: '',
						start: function(slider){
							slider.find('.img-zoom img').inlineCover();
						}
					});			
				}
				else 
					$active_rp_project.find('.img-zoom img').inlineCover();
			}
			
		});
		
		// display/activate the first related project
		$('.rp-project-titles a:eq(0)').click();
	});
	
}(jQuery));


