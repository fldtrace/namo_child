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
	$.mgadFilterable = function(el, options) {
		var filterable = $(el),
		methods = {};


		// Store a reference to the filterable object
		$.data(el, "mgadFilterable", filterable);
		
		// private methods
		methods = {
			// filterable init
			init: function() {
				filterable.breadcrumbs = $('.filterable-breadcrumbs', filterable);
				filterable.grid = $('.filterable-grid', filterable);
				filterable.gridcontainer = $('.filterable-grid-container', filterable);
				filterable.filtercontainer = $('.filterable-filters-container', filterable);
				filterable.filter = $('.filterable-filters', filterable);
				filterable.tablehead = $('.filterable-table-head', filterable);
				filterable.loadmore = $('.filterable-load-more', filterable);
				filterable.searchinput = $('.filterable-search-input', filterable);
				filterable.applyfilters = $('.apply-filters', filterable);
				filterable.resultscount = $('.filterable-results-count', filterable);
				
				filterable.showposts = parseInt(filterable.data('showposts'));
				filterable.imageinlistview = filterable.hasClass('updates-filterable')?true:false;
				
				filterable.activeFilters = {};
				filterable.init = false;
				
				filterable.on('click', '.apply-filters', methods.applyFilters);
				filterable.on('click', '.clear-filters', methods.clearFilters);
				filterable.on('click', '.filterable-load-more a', methods.loadMore);
				
				filterable.on('click', 'a[href=#]', function(){
					$(this).blur();
				});
						
				methods.setup();
				
				// use value of search field to filter
				filterable.searchinput.keyup( debounce(methods.search, 500 ) );

				hash = window.location.hash.substring(1);
				
				hash_filters = hash.split(':');
				
				// initial filters array (lv1, lv2, lv3)
				initial_filters = ['.ftitem', '', ''];
				
				if (hash_filters[0]) initial_filters[0] = '.' + hash_filters[0];
				if (hash_filters[1]) initial_filters[1] = '.' + hash_filters[1];
				if (hash_filters[2]) initial_filters[2] = '.' + hash_filters[2];
				
				
				filterable.filter.find('.current_choice').removeClass('current_choice');
				$initial_lv1 = filterable.filter.find('.filter-lv1[data-filter="'+initial_filters[0]+'"]');

				$initial_lv1.trigger( 'click', [ true ] );
				
				if (initial_filters[1])
					$initial_lv1.siblings('.lv2-filters').find('a[data-filter="'+initial_filters[1]+'"]').trigger( 'click');
				
				if (initial_filters[2])
					$initial_lv1.siblings('.lv3-filters').find('a[data-filter="'+initial_filters[2]+'"]').trigger( 'click');
					
				methods.applyFilters();
			},			
			// update filterable breadcrumbs content when new filters are applied
			updateBreadcrumbs: function() {
				$current_lv1 = filterable.filter.find('.filter-lv1.current_choice');
				
				breadcrumbs = '';
				
				if ($current_lv1.length) {
					breadcrumbs += '<span><a class="breadcrumb-lv1" href="#">'+$current_lv1.text()+'</a><i class="icon-right-open"></i></span>';
					
					$current_lv2 = $current_lv1.siblings('.lv2-filters').find('.current_choice');
					if ($current_lv2 && $current_lv2.data('filter')) {
						breadcrumbs += '<span><a class="breadcrumb-lv2" href="#">'+$current_lv2.text()+'</a><i class="icon-right-open"></i></span>';
					}
					
					$current_lv3 = $current_lv1.siblings('.lv3-filters').find('.current_choice');
					if ($current_lv3 && $current_lv3.data('filter')) {
						breadcrumbs += '<span><a class="breadcrumb-current_lv3" href="#">'+$current_lv3.text()+'</a><i class="icon-right-open"></i></span>';
					}
				}
				
				filterable.breadcrumbs.html(breadcrumbs);
			},
			// update search part of filterable breadcrumbs when new search is applied
			updateBreadcrumbsSearch: function() {
				if (filterable.searchinput.val()) {
					filterable.breadcrumbs.find('.breadcrumb-search').remove();
					filterable.breadcrumbs.append('<a class="breadcrumb-search" href="#">Search Results for: '+filterable.searchinput.val()+'</a>');			
				}
				else {
					filterable.breadcrumbs.find('.breadcrumb-search').remove();
				}
			},
			// load more filterable when new filters are applied OR "load more" button is clicked
			loadMore: function(required) {
				required = typeof required !== 'undefined' ? required : true;
				
				// hide load more button
				filterable.loadmore.addClass('hidden');
				
				filterClasses = filterable.filterClasses;

				// get all filtered item (without search)
				$filteredItems_temp = filterable.grid.children(filterClasses);
				
				
				$filteredItems = $();
				
				// if search input is not empty, filter the search results from the filtered items
				if (filterable.searchinput.val()) {
					qsRegex = new RegExp( filterable.searchinput.val(), 'gi' );
					count = 0;
					$filteredItems_temp.each(function(){
						if (qsRegex ? $(this).text().match( qsRegex ) : true) $filteredItems = $filteredItems.add($(this));
					});
				}
				else 
					$filteredItems = $filteredItems_temp;
				
				// update filterable result count
				filterable.resultscount.html($filteredItems.length + ' Results');


				// return if the current view is "list" because all filtered items are shown (no need to load more)
				if (filterable.view == 'list' && !filterable.imageinlistview) return;
			
				// find filtered and hidden items
				$hiddenItems = $filteredItems.filter(':not(.loaded)');
				
				if ($hiddenItems.length == 0) return;
				
				// calculate if need to load more items
				// if load more is clicked (not automatic load more)
				if (required)
					loadposts = $hiddenItems.length;
				// if number of loaded items are less than one page
				else if ($filteredItems.filter('.loaded').length < filterable.showposts) 
					loadposts = filterable.showposts - $filteredItems.filter('.loaded').length;
				// if automatic load more and number of loaded items are already more than one page
				else 
					loadposts = 0;
				
				filterable.loadmore.addClass('hidden');
				
				
				if (loadposts) {
					$('.page-loader').css('display', 'block');
					
					// load images of hidden items and refilter when all images are loaded
					$hiddenItems.filter(':lt('+loadposts+')').each(function(){
						var $this = $(this);
						if (!$this.hasClass('loaded')) {
							$img_temp = $this.find('.ftitem-img');
							
							$img = $img_temp.clone().insertAfter($img_temp);
							$img_temp.remove();
							
							$img.attr('src', $img.data('src'))
								.attr('data-src','');
						}
					}).imagesLoaded(function(){
						
						var $this = $(this);
						$this.addClass('loaded');
						
						filterable.grid.isotope();
						
						$('.page-loader').css('display', 'none');
						
						// if there are more hidden (unloaded) items
						if ($hiddenItems.length > loadposts) {
							filterable.loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
						}			
					});
				}
				else {
					if ($hiddenItems.length > loadposts) {
						filterable.loadmore.find('a').html('Load '+($hiddenItems.length - loadposts)+' More').end().removeClass('hidden');;
					}			
				}
			},
			applyFilters: function(e) {
			
				// reset/empty search input
				filterable.searchinput.val('');
				
				// find selected filters
				current_lv1 = filterable.activeFilters.lv1;
				current_lv3 = filterable.activeFilters.lv3;
				current_lv2 = filterable.activeFilters.lv2;
				filterClasses = current_lv1 + current_lv3 + current_lv2;
				
				// if no filters selected, show all items
				if (!filterClasses) {
					filterClasses = '.ftitem';
				}
				
				// assign new current filter
				filterable.filterClasses = filterClasses;
				
				// if filterablegrid is not initiated
				if (!filterable.init) {					
					filterable.grid.isotope({
						itemSelector : '.ftitem',
						filter: function() {
							matched = $(this).is(filterable.filterClasses + (filterable.view=='list'?'':'.loaded'));
							
							// filter by search string
							if (matched && filterable.searchinput.val()) {
								qsRegex = new RegExp( filterable.searchinput.val(), 'gi' );
								matched = (qsRegex ? $(this).text().match( qsRegex ) : true);
							}
							
							return matched;
						},
						sortBy: filterable.view=='list'?filterable.orderby:'original-order',
						sortAscending: filterable.view=='list'?filterable.order=='asc':true,
						getSortData: {
							// fields used for search
							title: function( itemElem ) {
								var title = $( itemElem ).find('.ftitem-title').text().toLowerCase();
								return title;
							},
							lv1: function( itemElem ) {
								var lv1 = $( itemElem ).find('.ftitem-filter-lv1').text().toLowerCase();
								lv1 = lv1==''?'~':lv1;
								return lv1;
							},
							lv3: function( itemElem ) {
								var lv3 = $( itemElem ).find('.ftitem-filter-lv3').text().toLowerCase();
								lv3 = lv3==''?'~':lv3;
								return lv3;
							}
						}
					});
					filterable.init = 1;
					
					// load more items if needed 
					methods.loadMore(false);
				}
				// if filterablegrid is already initiated, just refilter/resort
				else {
					filterable.grid.isotope();
					
					// load more items if needed 
					methods.loadMore(filterable.imageinlistview && filterable.view == 'list');
				}
				
				// update breadcrumbs 
				methods.updateBreadcrumbs();
			},
			
			// clear filters, remove all selected classes, reset data and trigger click on apply filters 
			clearFilters: function(e) {
				e.preventDefault();
				filterable.filter.find('.featured').trigger('click', [true]);
				filterable.applyfilters.click();
			},
			
			
			// set up event handler
			setup: function() {
				
				// collapse/expand filter panel
				filterable.on('click', '.toggle-filters', function() {
					filterable.filtercontainer.slideToggle();
					$(this).toggleClass('expanded');
				});
				
				//select filter
				filterable.on('click', '.filter', function(e, reset) {
					var $this = jQuery(this);
					
					reset = typeof reset !== 'undefined' ? reset : false;
					
	
					// "!reset" means real user click, not scripted/programmed click
					if (!reset) {
						if ($('body').hasClass('mobile')) {
							if ($this.hasClass('current_choice')) {
								filterable.filter.toggleClass('showlv1');
							}
							else {
								filterable.filter.removeClass('showlv1');
							}
						}
						// return if it's a real mouse click and this filter is already active
						else if ($this.hasClass('current_choice')) return;
					}
					
					// set selected filter classes and data
					if ($this.closest('.lv2-filters').length) {
						filterable.filter.find('.lv2-filters .current_choice').removeClass('current_choice');
						filterable.activeFilters.lv2 = $this.attr('data-filter');
					}
					else if ($this.closest('.lv3-filters').length) {
						filterable.filter.find('.lv3-filters .current_choice').removeClass('current_choice');
						filterable.activeFilters.lv3 = $this.attr('data-filter');
					}
					else {
						filterable.activeFilters.lv1 = $this.attr('data-filter');
						filterable.activeFilters.lv2 = '';
						filterable.activeFilters.lv3 = '';

						filterable.filter.find('.current_choice').removeClass('current_choice');
						
						$this.siblings('.lv3-filters').find('.filter:eq(0)').addClass('current_choice');
						$this.siblings('.lv2-filters').find('.filter:eq(0)').addClass('current_choice');
						
						filterable.filter.css('min-height', Math.max($this.siblings('.lv3-filters').outerHeight() + 53, $this.siblings('.lv2-filters').outerHeight()) + 'px');
					}
							
					$this.addClass('current_choice');
					
					if (!reset && !($('body').hasClass('mobile'))) filterable.applyfilters.click();
				});
			
				// view switch (list/grid)
				filterable.on('click', '.filterable-view-button', function() {
					if ($(this).hasClass('is-active')) return;
					
					if (filterable.gridcontainer.hasClass('view-list')) {
						filterable.gridcontainer.removeClass('view-list');
						filterable.view = 'grid';
						filterable.grid.isotope({
							sortBy: 'original-order',
							sortAscending: true
						});
						methods.loadMore(false);
					}
					else {
						filterable.gridcontainer.addClass('view-list');
						filterable.view = 'list';
						
						filterable.grid.isotope({
							sortBy: filterable.orderby,
							sortAscending: filterable.order=='asc'
						});
						
						methods.loadMore(true);
						filterable.loadmore.addClass('hidden');
					}
					
					$(this).addClass('is-active').siblings('.filterable-view-button').removeClass('is-active');
				});
				
				// show/hide search input
				filterable.on('click', '.filterable-search a', function(e){
					if ($(this).parent().toggleClass('is-active').hasClass('is-active')) {
						filterable.searchinput.focus();
						$(document).on('click.searchactivated', function(e){
							if (!$(e.target).closest('.filterable-search').length) {
								$(document).off('click.searchactivated');
								filterable.searchinput.parent().removeClass('is-active');
							}
						});						
					}
					else {
						$(document).off('click.searchactivated');
					}
				});

				
				// sort in list view
				filterable.on('click', '.sort', function(){
					orderby = $(this).data('orderby');
					
					if (!$(this).hasClass('asc')) {
						asc = true;
						
						filterable.tablehead.find('.sort').removeClass('desc asc');
						$(this).addClass('asc');
					}
					else {
						asc = false;
						
						filterable.tablehead.find('.sort').removeClass('desc asc');
						$(this).addClass('desc');
					}
					
					filterable.orderby = orderby;
					filterable.order = asc?'asc':'desc';
					
					filterable.grid.isotope({
						sortBy: filterable.orderby,
						sortAscending: filterable.order=='asc'
					});
				});
				
				// filter when a filter link in the list view is clicked
				filterable.on('click', '.ftitem-filter', function(){
					// if lv1 filter
					if ($(this).hasClass('ftitem-filter-lv1')) {
						lv1_filter = $(this).data('filter');
						
						filterable.filter.find('.current_choice').removeClass('current_choice');
						filterable.filter.find('.filter-lv1[data-filter="'+lv1_filter+'"]').trigger( 'click', [ true ] );
					}
					// if lv2 filter
					else if ($(this).hasClass('ftitem-filter-lv2')) {
						lv1_filter = $(this).closest('.ftitem').find('.ftitem-filter-lv1').data('filter');
						lv2_filter = $(this).data('filter');
						
						filterable.filter.find('.current_choice').removeClass('current_choice');
						filterable.filter.find('.filter-lv1[data-filter="'+lv1_filter+'"]').trigger( 'click', [ true ] )
							.siblings('.lv2-filters').find('a[data-filter="'+lv2_filter+'"]').trigger( 'click', [ true ]);
					}
					// if lv3 filter
					else if ($(this).parent().hasClass('ftitem-filter-lv3')) {
						lv1_filter = $(this).closest('.ftitem').find('.ftitem-filter-lv1').data('filter');
						lv3_filter = $(this).data('filter');
						
						filterable.filter.find('.current_choice').removeClass('current_choice');
						filterable.filter.find('.filter-lv1[data-filter="'+lv1_filter+'"]').trigger( 'click', [ true ] )
							.siblings('.lv3-filters').find('a[data-filter="'+lv3_filter+'"]').trigger( 'click', [ true ]);
					}
					
					filterable.applyfilters.click();
				});
			},
			// search within results
			search: function() {
				filterable.grid.isotope();
				methods.updateBreadcrumbsSearch();
				methods.loadMore(filterable.imageinlistview && filterable.view == 'list');
			}

		};
		
		methods.init();
	};
	
	$.fn.mgadFilterable = function(options) {
		return this.each(function() {
			var $this = $(this);
			if ($this.data('mgadFilterable') === undefined) {
				new $.mgadFilterable(this, options);
			}
		});
	};
})(jQuery);

jQuery(document).ready(function($){
		
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


	$.fn.mgadZoom = function(enable_gallery) {
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
	};
	
	
	$header = $('#header-inner-wrap');
	

	var lastScrollTop = 0;
	
	function stickyHeader(){
		if ($('.header-nav-icon').hasClass('is-active')){
			mgad_close_menu();
		}
		
		var scrollTop = $(this).scrollTop();
		
		if ($(this).width() > 960) {
			if (!$header.hasClass('sticky') && scrollTop > 30) {
				$header.addClass('sticky');
				setTimeout(function () {
					$header.addClass('sticky-animate');
				}, 10);
			}
			else if (scrollTop <= 30) {
				$header.removeClass('sticky-animate');
				setTimeout(function () {
					$header.removeClass('sticky');
				}, 10);
			}			
		}
		
		// tablet/mobile
		if ($(this).width() <= 960) {
			if (scrollTop < lastScrollTop) {
				//scrolling up
				if (scrollTop <= 30) {
					$header.removeClass('sticky-animate');
					setTimeout(function () {
						$header.removeClass('sticky');
					}, 10);
				}
				else if (!$header.hasClass('sticky')) {
					$header.addClass('sticky');
					setTimeout(function () {
						$header.addClass('sticky-animate');
					}, 10);
				}
			}
			else {
				//scrolling down
				$header.removeClass('sticky-animate');
				setTimeout(function () {
					$header.removeClass('sticky');
				}, 10);
			}
		}
		
		lastScrollTop = scrollTop;
	}
	$(window).scroll(stickyHeader);
	
	
	// show/hide fullscreen menu if nav (hamburger) icon is clicked 
	var scrollbarWidth = $(window).width()>=960?window.innerWidth - document.documentElement.clientWidth:0;

	function mgad_close_menu() {
		$('.header-nav-icon').removeClass('is-active');
		$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
		$('#header-inner-wrap').css('paddingRight', '0');
		$('.main-nav').css('paddingRight', '0').removeClass('is-active');
	}
	
	
	// menu button
	$('.header-nav-icon').on('click', function(e){
		var $this = $(this);
		
		if (!$this.hasClass('is-active')) {
			$('.rev_slider.fullscreenbanner .tp-static-layers .tp-mask-wrap').css('opacity', 0);
			mgad_close_search();
			
			$this.addClass('is-active');
			$(document.documentElement).addClass('menu-activated').css('marginRight', scrollbarWidth + 'px');
			$('#header-inner-wrap').css('paddingRight', scrollbarWidth + 'px');
			$('.main-nav').css('paddingRight', scrollbarWidth + 'px').addClass('is-active');

		}
		else {
			$('.rev_slider.fullscreenbanner .tp-static-layers .tp-mask-wrap').css('opacity', 1);
			
			mgad_close_menu();
		}
	});
	

	function mgad_close_search() {
		$('.header-controls .search-btn').removeClass('is-active');
		$(document.documentElement).removeClass('menu-activated').css('marginRight', '0');
		$('#header-inner-wrap').css('paddingRight', '0');
		$('.search-box').removeClass('is-active').find('.s').blur();
	}
	

	jQuery(document).on('mouseup touchend', function (e) {
		if ($('.header-controls .search-btn').hasClass('is-active')){
			if (!$(e.target).closest('.search-box, .header-controls').length) {
				mgad_close_search();
			}
		}
		if ($('.header-nav-icon').hasClass('is-active')){
			if (!$(e.target).closest('#menu-main-menu, #navigation, .header-controls').length) {
				mgad_close_menu();
			}
		}

	});


	// search button
	$('.header-controls .search-btn').click(function(e){
		var $this = $(this);
		if (!$this.hasClass('is-active')) {
			mgad_close_menu();
			$this.addClass('is-active');
			$(document.documentElement).addClass('menu-activated').css('marginRight', scrollbarWidth + 'px');
			$('#header-inner-wrap').css('paddingRight', scrollbarWidth + 'px');
			
			$('.search-box').css({
				top: ($(window).width()>=768?($(window).scrollTop() + $('#header-inner-wrap').height()/2):($(window).scrollTop() + $(window).height()/2)) + 'px',
				left: ($this.offset().left - 15) + 'px'
			}).addClass('is-active').find('.s').focus();
		}
		else {
			mgad_close_search();
		}
	});
	
	/*
	$('.search-box .s').focusout(function(){
		if ($('.header-controls .search-btn').hasClass('is-active')){
			mgad_close_search();
		}
	});
	*/

	
	$('.main-nav a[href="'+window.location.href+'"]').click(function(e) {
		console.log(window.location.href);
		e.preventDefault();
		mgad_close_menu();
	});
	
	
	// check mobile (screen width < 768px)
	if ($(window).width() < 768) $('body').addClass('mobile');
	$(window).resize(function() {
		scrollbarWidth = $(window).width()>=960?window.innerWidth - document.documentElement.clientWidth:0;
		
		if ($(window).width() < 768) 
			$('body').addClass('mobile');
		else
			$('body').removeClass('mobile');
	});
	
	// init filterable filter
	$('.filterable-container').mgadFilterable();
	
	
	// initiate zoom buttons in project feature section
	$('.project-feature .zoom-btn').mgadZoom(true);
	
	// customize hotspot map for project feature section
	$('.project-feature .hs-wrap').each(function(){
		$(this).closest('.slide-imgmap').append('<div class="hs-caption"></div>');
	});
	$('.project-feature').on('click', '.hs-spot-object', function(){
		$(this).closest('.hs-wrap').next('.hs-caption').html($(this).find('.hs-tooltip').html());
		$(this).addClass('hs-active').siblings().removeClass('hs-active');
	});

	

	// initiate zoom buttons in project images section
	$('.project-images .zoom-btn').mgadZoom(true);
	
	// initiate zoom buttons in project solution section
	$('.project-solution img').each(function(){	
		if (!$(this).is('img')) return;
		$(this).wrap('<div class="img-zoom"></div>')
			.after('<a class="zoom-btn" href="'+$(this).attr('src')+'"></a>');
	});
	$('.project-solution .zoom-btn').mgadZoom(true);
	
	// initiate zoom buttons in related projects section
	$('.rp-project-details .zoom-btn').mgadZoom(false);
		

	// sticky share box
	$('<div id="sticky-sharing"></div>').wrapInner($('#post-sharing').clone()).appendTo('body');
	$('#post-sharing').waypoint({
		handler: function (direction) {
			if (direction === 'down') {
				$('#sticky-sharing').addClass('sticky');
			} else {
				$('#sticky-sharing').removeClass('sticky');
			}
		},
		offset: $('#header-wrap').data('sticky-height') + 'px'
	});
	
	$('#bottom-widgets').waypoint({
		handler: function (direction) {
			if (direction === 'down') {
				$('#sticky-sharing').removeClass('sticky');
			} else {
				$('#sticky-sharing').addClass('sticky');
			}
		},
		offset: '100%'
	});


	if ($(window).width() < 768) {
		$('.recent-posts').wrap('<div class="flexslider-wrap"></div>').addClass('flexslider').wrapInner('<ul class="slides"></ul>')
			.find('.rc-item').wrap('<li></li>');
	}
	
	
	$('.result-loadmore a').click(function(){
		$(this).parent().slideUp(200);
		$('.page-loader').css('display', 'block');
		
		$(this).parent().prev('.result-wrap').find('.sresult:gt(' + (parseInt($(this).data('show'))-1) + ')').each(function(){
			$img = $(this).find('img');
			$img.attr('src', $img.data('src'))
				.attr('data-src','');
		}).imagesLoaded(function(){
			$('.page-loader').css('display', 'none');
			$(this).slideDown(200);
		});
		
		$result_header = $(this).parent().siblings('.result-header');
		$result_header.find('.showing').html($result_header.find('.total').html());
	});
	
	if ($(window).width() >= 768) {
		$(".rp-project-titles-inner").mCustomScrollbar({
			scrollbarPosition: 'inside',
			theme: 'rounded-dark'
		});
	}
	
	
	$('.project-feature .fluid-width-video-wrapper').css('padding-top', 0).each(function(){
		$(this).css('padding-top', $(this).closest('.slides').height() + 'px');
	});


	$(window).load(function(){
		
		// initiate recent posts slider
		if ($(window).width() < 768) {
			$('.recent-posts').flexslider({
				animation: "slide",
				animationSpeed: 600, 
				slideshow: true,
				slideshowSpeed: 7000, 
				directionNav: false
			});
		}
	
		// initiate project feature slider
		if ($('.project-feature .slides > li').length >1) {
			$('.project-feature .flexslider').flexslider({
				animation: "slide",
				slideshow: false,
				prevText: '',
				nextText: '',
				start: function(slider){
					slider.find('.img-zoom img').inlineCover();
					
					slider.find('.hs-wrap').hotspot({
						'show_on' : "always",
						'responsive' : "on",
					})
					.find('.hs-spot-object:eq(0)').click();
				},
				before: function(slider){
					// initiate hotspot map in the active slide
					$slide = slider.slides.eq(slider.animatingTo);
					if ($slide.find('.hs-wrap').length && $slide.find('.hs-active').length == 0) {
						$slide.find('.hs-spot-object:eq(0)').click();
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
			
		});
		
		// display/activate the first related project
		$('.rp-project-titles a:eq(0)').click();
	});
	
});



