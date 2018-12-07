/*
 * jQuery FlexSlider v2.7.1
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */!function($){var e=!0;$.flexslider=function(t,a){var n=$(t);void 0===a.rtl&&"rtl"==$("html").attr("dir")&&(a.rtl=!0),n.vars=$.extend({},$.flexslider.defaults,a);var i=n.vars.namespace,r=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,s=("ontouchstart"in window||r||window.DocumentTouch&&document instanceof DocumentTouch)&&n.vars.touch,o="click touchend MSPointerUp keyup",l="",c,d="vertical"===n.vars.direction,u=n.vars.reverse,v=n.vars.itemWidth>0,p="fade"===n.vars.animation,m=""!==n.vars.asNavFor,f={};$.data(t,"flexslider",n),f={init:function(){n.animating=!1,n.currentSlide=parseInt(n.vars.startAt?n.vars.startAt:0,10),isNaN(n.currentSlide)&&(n.currentSlide=0),n.animatingTo=n.currentSlide,n.atEnd=0===n.currentSlide||n.currentSlide===n.last,n.containerSelector=n.vars.selector.substr(0,n.vars.selector.search(" ")),n.slides=$(n.vars.selector,n),n.container=$(n.containerSelector,n),n.count=n.slides.length,n.syncExists=$(n.vars.sync).length>0,"slide"===n.vars.animation&&(n.vars.animation="swing"),n.prop=d?"top":n.vars.rtl?"marginRight":"marginLeft",n.args={},n.manualPause=!1,n.stopped=!1,n.started=!1,n.startTimeout=null,n.transitions=!n.vars.video&&!p&&n.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var a in t)if(void 0!==e.style[t[a]])return n.pfx=t[a].replace("Perspective","").toLowerCase(),n.prop="-"+n.pfx+"-transform",!0;return!1}(),n.isFirefox=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,n.ensureAnimationEnd="",""!==n.vars.controlsContainer&&(n.controlsContainer=$(n.vars.controlsContainer).length>0&&$(n.vars.controlsContainer)),""!==n.vars.manualControls&&(n.manualControls=$(n.vars.manualControls).length>0&&$(n.vars.manualControls)),""!==n.vars.customDirectionNav&&(n.customDirectionNav=2===$(n.vars.customDirectionNav).length&&$(n.vars.customDirectionNav)),n.vars.randomize&&(n.slides.sort(function(){return Math.round(Math.random())-.5}),n.container.empty().append(n.slides)),n.doMath(),n.setup("init"),n.vars.controlNav&&f.controlNav.setup(),n.vars.directionNav&&f.directionNav.setup(),n.vars.keyboard&&(1===$(n.containerSelector).length||n.vars.multipleKeyboard)&&$(document).bind("keyup",function(e){var t=e.keyCode;if(!n.animating&&(39===t||37===t)){var a=n.vars.rtl?37===t?n.getTarget("next"):39===t&&n.getTarget("prev"):39===t?n.getTarget("next"):37===t&&n.getTarget("prev");n.flexAnimate(a,n.vars.pauseOnAction)}}),n.vars.mousewheel&&n.bind("mousewheel",function(e,t,a,i){e.preventDefault();var r=t<0?n.getTarget("next"):n.getTarget("prev");n.flexAnimate(r,n.vars.pauseOnAction)}),n.vars.pausePlay&&f.pausePlay.setup(),n.vars.slideshow&&n.vars.pauseInvisible&&f.pauseInvisible.init(),n.vars.slideshow&&(n.vars.pauseOnHover&&n.hover(function(){n.manualPlay||n.manualPause||n.pause()},function(){n.manualPause||n.manualPlay||n.stopped||n.play()}),n.vars.pauseInvisible&&f.pauseInvisible.isHidden()||(n.vars.initDelay>0?n.startTimeout=setTimeout(n.play,n.vars.initDelay):n.play())),m&&f.asNav.setup(),s&&n.vars.touch&&f.touch(),(!p||p&&n.vars.smoothHeight)&&$(window).bind("resize orientationchange focus",f.resize),n.find("img").attr("draggable","false"),setTimeout(function(){n.vars.start(n)},200)},asNav:{setup:function(){n.asNav=!0,n.animatingTo=Math.floor(n.currentSlide/n.move),n.currentItem=n.currentSlide,n.slides.removeClass(i+"active-slide").eq(n.currentItem).addClass(i+"active-slide"),r?(t._slider=n,n.slides.each(function(){var e=this;e._gesture=new MSGesture,e._gesture.target=e,e.addEventListener("MSPointerDown",function(e){e.preventDefault(),e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1),e.addEventListener("MSGestureTap",function(e){e.preventDefault();var t=$(this),a=t.index();$(n.vars.asNavFor).data("flexslider").animating||t.hasClass("active")||(n.direction=n.currentItem<a?"next":"prev",n.flexAnimate(a,n.vars.pauseOnAction,!1,!0,!0))})})):n.slides.on(o,function(e){e.preventDefault();var t=$(this),a=t.index(),r;r=n.vars.rtl?-1*(t.offset().right-$(n).scrollLeft()):t.offset().left-$(n).scrollLeft(),r<=0&&t.hasClass(i+"active-slide")?n.flexAnimate(n.getTarget("prev"),!0):$(n.vars.asNavFor).data("flexslider").animating||t.hasClass(i+"active-slide")||(n.direction=n.currentItem<a?"next":"prev",n.flexAnimate(a,n.vars.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){n.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()},setupPaging:function(){var e="thumbnails"===n.vars.controlNav?"control-thumbs":"control-paging",t=1,a,r;if(n.controlNavScaffold=$('<ol class="'+i+"control-nav "+i+e+'"></ol>'),n.pagingCount>1)for(var s=0;s<n.pagingCount;s++){r=n.slides.eq(s),void 0===r.attr("data-thumb-alt")&&r.attr("data-thumb-alt","");var c=""!==r.attr("data-thumb-alt")?c=' alt="'+r.attr("data-thumb-alt")+'"':"";if(a="thumbnails"===n.vars.controlNav?'<img src="'+r.attr("data-thumb")+'"'+c+"/>":'<a href="#">'+t+"</a>","thumbnails"===n.vars.controlNav&&!0===n.vars.thumbCaptions){var d=r.attr("data-thumbcaption");""!==d&&void 0!==d&&(a+='<span class="'+i+'caption">'+d+"</span>")}n.controlNavScaffold.append("<li>"+a+"</li>"),t++}n.controlsContainer?$(n.controlsContainer).append(n.controlNavScaffold):n.append(n.controlNavScaffold),f.controlNav.set(),f.controlNav.active(),n.controlNavScaffold.delegate("a, img",o,function(e){if(e.preventDefault(),""===l||l===e.type){var t=$(this),a=n.controlNav.index(t);t.hasClass(i+"active")||(n.direction=a>n.currentSlide?"next":"prev",n.flexAnimate(a,n.vars.pauseOnAction))}""===l&&(l=e.type),f.setToClearWatchedEvent()})},setupManual:function(){n.controlNav=n.manualControls,f.controlNav.active(),n.controlNav.bind(o,function(e){if(e.preventDefault(),""===l||l===e.type){var t=$(this),a=n.controlNav.index(t);t.hasClass(i+"active")||(a>n.currentSlide?n.direction="next":n.direction="prev",n.flexAnimate(a,n.vars.pauseOnAction))}""===l&&(l=e.type),f.setToClearWatchedEvent()})},set:function(){var e="thumbnails"===n.vars.controlNav?"img":"a";n.controlNav=$("."+i+"control-nav li "+e,n.controlsContainer?n.controlsContainer:n)},active:function(){n.controlNav.removeClass(i+"active").eq(n.animatingTo).addClass(i+"active")},update:function(e,t){n.pagingCount>1&&"add"===e?n.controlNavScaffold.append($('<li><a href="#">'+n.count+"</a></li>")):1===n.pagingCount?n.controlNavScaffold.find("li").remove():n.controlNav.eq(t).closest("li").remove(),f.controlNav.set(),n.pagingCount>1&&n.pagingCount!==n.controlNav.length?n.update(t,e):f.controlNav.active()}},directionNav:{setup:function(){var e=$('<ul class="'+i+'direction-nav"><li class="'+i+'nav-prev"><a class="'+i+'prev" href="#">'+n.vars.prevText+'</a></li><li class="'+i+'nav-next"><a class="'+i+'next" href="#">'+n.vars.nextText+"</a></li></ul>");n.customDirectionNav?n.directionNav=n.customDirectionNav:n.controlsContainer?($(n.controlsContainer).append(e),n.directionNav=$("."+i+"direction-nav li a",n.controlsContainer)):(n.append(e),n.directionNav=$("."+i+"direction-nav li a",n)),f.directionNav.update(),n.directionNav.bind(o,function(e){e.preventDefault();var t;""!==l&&l!==e.type||(t=$(this).hasClass(i+"next")?n.getTarget("next"):n.getTarget("prev"),n.flexAnimate(t,n.vars.pauseOnAction)),""===l&&(l=e.type),f.setToClearWatchedEvent()})},update:function(){var e=i+"disabled";1===n.pagingCount?n.directionNav.addClass(e).attr("tabindex","-1"):n.vars.animationLoop?n.directionNav.removeClass(e).removeAttr("tabindex"):0===n.animatingTo?n.directionNav.removeClass(e).filter("."+i+"prev").addClass(e).attr("tabindex","-1"):n.animatingTo===n.last?n.directionNav.removeClass(e).filter("."+i+"next").addClass(e).attr("tabindex","-1"):n.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var e=$('<div class="'+i+'pauseplay"><a href="#"></a></div>');n.controlsContainer?(n.controlsContainer.append(e),n.pausePlay=$("."+i+"pauseplay a",n.controlsContainer)):(n.append(e),n.pausePlay=$("."+i+"pauseplay a",n)),f.pausePlay.update(n.vars.slideshow?i+"pause":i+"play"),n.pausePlay.bind(o,function(e){e.preventDefault(),""!==l&&l!==e.type||($(this).hasClass(i+"pause")?(n.manualPause=!0,n.manualPlay=!1,n.pause()):(n.manualPause=!1,n.manualPlay=!0,n.play())),""===l&&(l=e.type),f.setToClearWatchedEvent()})},update:function(e){"play"===e?n.pausePlay.removeClass(i+"pause").addClass(i+"play").html(n.vars.playText):n.pausePlay.removeClass(i+"play").addClass(i+"pause").html(n.vars.pauseText)}},touch:function(){function e(e){e.stopPropagation(),n.animating?e.preventDefault():(n.pause(),t._gesture.addPointer(e.pointerId),w=0,c=d?n.h:n.w,f=Number(new Date),l=v&&u&&n.animatingTo===n.last?0:v&&u?n.limit-(n.itemW+n.vars.itemMargin)*n.move*n.animatingTo:v&&n.currentSlide===n.last?n.limit:v?(n.itemW+n.vars.itemMargin)*n.move*n.currentSlide:u?(n.last-n.currentSlide+n.cloneOffset)*c:(n.currentSlide+n.cloneOffset)*c)}function a(e){e.stopPropagation();var a=e.target._slider;if(a){var n=-e.translationX,i=-e.translationY;if(w+=d?i:n,m=(a.vars.rtl?-1:1)*w,x=d?Math.abs(w)<Math.abs(-n):Math.abs(w)<Math.abs(-i),e.detail===e.MSGESTURE_FLAG_INERTIA)return void setImmediate(function(){t._gesture.stop()});(!x||Number(new Date)-f>500)&&(e.preventDefault(),!p&&a.transitions&&(a.vars.animationLoop||(m=w/(0===a.currentSlide&&w<0||a.currentSlide===a.last&&w>0?Math.abs(w)/c+2:1)),a.setProps(l+m,"setTouch")))}}function i(e){e.stopPropagation();var t=e.target._slider;if(t){if(t.animatingTo===t.currentSlide&&!x&&null!==m){var a=u?-m:m,n=a>0?t.getTarget("next"):t.getTarget("prev");t.canAdvance(n)&&(Number(new Date)-f<550&&Math.abs(a)>50||Math.abs(a)>c/2)?t.flexAnimate(n,t.vars.pauseOnAction):p||t.flexAnimate(t.currentSlide,t.vars.pauseOnAction,!0)}s=null,o=null,m=null,l=null,w=0}}var s,o,l,c,m,f,g,h,S,x=!1,y=0,b=0,w=0;r?(t.style.msTouchAction="none",t._gesture=new MSGesture,t._gesture.target=t,t.addEventListener("MSPointerDown",e,!1),t._slider=n,t.addEventListener("MSGestureChange",a,!1),t.addEventListener("MSGestureEnd",i,!1)):(g=function(e){n.animating?e.preventDefault():(window.navigator.msPointerEnabled||1===e.touches.length)&&(n.pause(),c=d?n.h:n.w,f=Number(new Date),y=e.touches[0].pageX,b=e.touches[0].pageY,l=v&&u&&n.animatingTo===n.last?0:v&&u?n.limit-(n.itemW+n.vars.itemMargin)*n.move*n.animatingTo:v&&n.currentSlide===n.last?n.limit:v?(n.itemW+n.vars.itemMargin)*n.move*n.currentSlide:u?(n.last-n.currentSlide+n.cloneOffset)*c:(n.currentSlide+n.cloneOffset)*c,s=d?b:y,o=d?y:b,t.addEventListener("touchmove",h,!1),t.addEventListener("touchend",S,!1))},h=function(e){y=e.touches[0].pageX,b=e.touches[0].pageY,m=d?s-b:(n.vars.rtl?-1:1)*(s-y),x=d?Math.abs(m)<Math.abs(y-o):Math.abs(m)<Math.abs(b-o);var t=500;(!x||Number(new Date)-f>500)&&(e.preventDefault(),!p&&n.transitions&&(n.vars.animationLoop||(m/=0===n.currentSlide&&m<0||n.currentSlide===n.last&&m>0?Math.abs(m)/c+2:1),n.setProps(l+m,"setTouch")))},S=function(e){if(t.removeEventListener("touchmove",h,!1),n.animatingTo===n.currentSlide&&!x&&null!==m){var a=u?-m:m,i=a>0?n.getTarget("next"):n.getTarget("prev");n.canAdvance(i)&&(Number(new Date)-f<550&&Math.abs(a)>50||Math.abs(a)>c/2)?n.flexAnimate(i,n.vars.pauseOnAction):p||n.flexAnimate(n.currentSlide,n.vars.pauseOnAction,!0)}t.removeEventListener("touchend",S,!1),s=null,o=null,m=null,l=null},t.addEventListener("touchstart",g,!1))},resize:function(){!n.animating&&n.is(":visible")&&(v||n.doMath(),p?f.smoothHeight():v?(n.slides.width(n.computedW),n.update(n.pagingCount),n.setProps()):d?(n.viewport.height(n.h),n.setProps(n.h,"setTotal")):(n.vars.smoothHeight&&f.smoothHeight(),n.newSlides.width(n.computedW),n.setProps(n.computedW,"setTotal")))},smoothHeight:function(e){if(!d||p){var t=p?n:n.viewport;e?t.animate({height:n.slides.eq(n.animatingTo).innerHeight()},e):t.innerHeight(n.slides.eq(n.animatingTo).innerHeight())}},sync:function(e){var t=$(n.vars.sync).data("flexslider"),a=n.animatingTo;switch(e){case"animate":t.flexAnimate(a,n.vars.pauseOnAction,!1,!0);break;case"play":t.playing||t.asNav||t.play();break;case"pause":t.pause();break}},uniqueID:function(e){return e.filter("[id]").add(e.find("[id]")).each(function(){var e=$(this);e.attr("id",e.attr("id")+"_clone")}),e},pauseInvisible:{visProp:null,init:function(){var e=f.pauseInvisible.getHiddenProp();if(e){var t=e.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(t,function(){f.pauseInvisible.isHidden()?n.startTimeout?clearTimeout(n.startTimeout):n.pause():n.started?n.play():n.vars.initDelay>0?setTimeout(n.play,n.vars.initDelay):n.play()})}},isHidden:function(){var e=f.pauseInvisible.getHiddenProp();return!!e&&document[e]},getHiddenProp:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}},setToClearWatchedEvent:function(){clearTimeout(c),c=setTimeout(function(){l=""},3e3)}},n.flexAnimate=function(e,t,a,r,o){if(n.vars.animationLoop||e===n.currentSlide||(n.direction=e>n.currentSlide?"next":"prev"),m&&1===n.pagingCount&&(n.direction=n.currentItem<e?"next":"prev"),!n.animating&&(n.canAdvance(e,o)||a)&&n.is(":visible")){if(m&&r){var l=$(n.vars.asNavFor).data("flexslider");if(n.atEnd=0===e||e===n.count-1,l.flexAnimate(e,!0,!1,!0,o),n.direction=n.currentItem<e?"next":"prev",l.direction=n.direction,Math.ceil((e+1)/n.visible)-1===n.currentSlide||0===e)return n.currentItem=e,n.slides.removeClass(i+"active-slide").eq(e).addClass(i+"active-slide"),!1;n.currentItem=e,n.slides.removeClass(i+"active-slide").eq(e).addClass(i+"active-slide"),e=Math.floor(e/n.visible)}if(n.animating=!0,n.animatingTo=e,t&&n.pause(),n.vars.before(n),n.syncExists&&!o&&f.sync("animate"),n.vars.controlNav&&f.controlNav.active(),v||n.slides.removeClass(i+"active-slide").eq(e).addClass(i+"active-slide"),n.atEnd=0===e||e===n.last,n.vars.directionNav&&f.directionNav.update(),e===n.last&&(n.vars.end(n),n.vars.animationLoop||n.pause()),p)s?(n.slides.eq(n.currentSlide).css({opacity:0,zIndex:1}),n.slides.eq(e).css({opacity:1,zIndex:2}),n.wrapup(c)):(n.slides.eq(n.currentSlide).css({zIndex:1}).animate({opacity:0},n.vars.animationSpeed,n.vars.easing),n.slides.eq(e).css({zIndex:2}).animate({opacity:1},n.vars.animationSpeed,n.vars.easing,n.wrapup));else{var c=d?n.slides.filter(":first").height():n.computedW,g,h,S;v?(g=n.vars.itemMargin,S=(n.itemW+g)*n.move*n.animatingTo,h=S>n.limit&&1!==n.visible?n.limit:S):h=0===n.currentSlide&&e===n.count-1&&n.vars.animationLoop&&"next"!==n.direction?u?(n.count+n.cloneOffset)*c:0:n.currentSlide===n.last&&0===e&&n.vars.animationLoop&&"prev"!==n.direction?u?0:(n.count+1)*c:u?(n.count-1-e+n.cloneOffset)*c:(e+n.cloneOffset)*c,n.setProps(h,"",n.vars.animationSpeed),n.transitions?(n.vars.animationLoop&&n.atEnd||(n.animating=!1,n.currentSlide=n.animatingTo),n.container.unbind("webkitTransitionEnd transitionend"),n.container.bind("webkitTransitionEnd transitionend",function(){clearTimeout(n.ensureAnimationEnd),n.wrapup(c)}),clearTimeout(n.ensureAnimationEnd),n.ensureAnimationEnd=setTimeout(function(){n.wrapup(c)},n.vars.animationSpeed+100)):n.container.animate(n.args,n.vars.animationSpeed,n.vars.easing,function(){n.wrapup(c)})}n.vars.smoothHeight&&f.smoothHeight(n.vars.animationSpeed)}},n.wrapup=function(e){p||v||(0===n.currentSlide&&n.animatingTo===n.last&&n.vars.animationLoop?n.setProps(e,"jumpEnd"):n.currentSlide===n.last&&0===n.animatingTo&&n.vars.animationLoop&&n.setProps(e,"jumpStart")),n.animating=!1,n.currentSlide=n.animatingTo,n.vars.after(n)},n.animateSlides=function(){!n.animating&&e&&n.flexAnimate(n.getTarget("next"))},n.pause=function(){clearInterval(n.animatedSlides),n.animatedSlides=null,n.playing=!1,n.vars.pausePlay&&f.pausePlay.update("play"),n.syncExists&&f.sync("pause")},n.play=function(){n.playing&&clearInterval(n.animatedSlides),n.animatedSlides=n.animatedSlides||setInterval(n.animateSlides,n.vars.slideshowSpeed),n.started=n.playing=!0,n.vars.pausePlay&&f.pausePlay.update("pause"),n.syncExists&&f.sync("play")},n.stop=function(){n.pause(),n.stopped=!0},n.canAdvance=function(e,t){var a=m?n.pagingCount-1:n.last;return!!t||(!(!m||n.currentItem!==n.count-1||0!==e||"prev"!==n.direction)||(!m||0!==n.currentItem||e!==n.pagingCount-1||"next"===n.direction)&&(!(e===n.currentSlide&&!m)&&(!!n.vars.animationLoop||(!n.atEnd||0!==n.currentSlide||e!==a||"next"===n.direction)&&(!n.atEnd||n.currentSlide!==a||0!==e||"next"!==n.direction))))},n.getTarget=function(e){return n.direction=e,"next"===e?n.currentSlide===n.last?0:n.currentSlide+1:0===n.currentSlide?n.last:n.currentSlide-1},n.setProps=function(e,t,a){var i=function(){var a=e||(n.itemW+n.vars.itemMargin)*n.move*n.animatingTo;return function(){if(v)return"setTouch"===t?e:u&&n.animatingTo===n.last?0:u?n.limit-(n.itemW+n.vars.itemMargin)*n.move*n.animatingTo:n.animatingTo===n.last?n.limit:a;switch(t){case"setTotal":return u?(n.count-1-n.currentSlide+n.cloneOffset)*e:(n.currentSlide+n.cloneOffset)*e;case"setTouch":return e;case"jumpEnd":return u?e:n.count*e;case"jumpStart":return u?n.count*e:e;default:return e}}()*(n.vars.rtl?1:-1)+"px"}();n.transitions&&(i=n.isFirefox?d?"translate3d(0,"+i+",0)":"translate3d("+parseInt(i)+"px,0,0)":d?"translate3d(0,"+i+",0)":"translate3d("+(n.vars.rtl?-1:1)*parseInt(i)+"px,0,0)",a=void 0!==a?a/1e3+"s":"0s",n.container.css("-"+n.pfx+"-transition-duration",a),n.container.css("transition-duration",a)),n.args[n.prop]=i,(n.transitions||void 0===a)&&n.container.css(n.args),n.container.css("transform",i)},n.setup=function(e){if(p)n.vars.rtl?n.slides.css({width:"100%",float:"right",marginLeft:"-100%",position:"relative"}):n.slides.css({width:"100%",float:"left",marginRight:"-100%",position:"relative"}),"init"===e&&(s?n.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+n.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(n.currentSlide).css({opacity:1,zIndex:2}):0==n.vars.fadeFirstSlide?n.slides.css({opacity:0,display:"block",zIndex:1}).eq(n.currentSlide).css({zIndex:2}).css({opacity:1}):n.slides.css({opacity:0,display:"block",zIndex:1}).eq(n.currentSlide).css({zIndex:2}).animate({opacity:1},n.vars.animationSpeed,n.vars.easing)),n.vars.smoothHeight&&f.smoothHeight();else{var t,a;"init"===e&&(n.viewport=$('<div class="'+i+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(n).append(n.container),n.cloneCount=0,n.cloneOffset=0,u&&(a=$.makeArray(n.slides).reverse(),n.slides=$(a),n.container.empty().append(n.slides))),n.vars.animationLoop&&!v&&(n.cloneCount=2,n.cloneOffset=1,"init"!==e&&n.container.find(".clone").remove(),n.container.append(f.uniqueID(n.slides.first().clone().addClass("clone")).attr("aria-hidden","true")).prepend(f.uniqueID(n.slides.last().clone().addClass("clone")).attr("aria-hidden","true"))),n.newSlides=$(n.vars.selector,n),t=u?n.count-1-n.currentSlide+n.cloneOffset:n.currentSlide+n.cloneOffset,d&&!v?(n.container.height(200*(n.count+n.cloneCount)+"%").css("position","absolute").width("100%"),setTimeout(function(){n.newSlides.css({display:"block"}),n.doMath(),n.viewport.height(n.h),n.setProps(t*n.h,"init")},"init"===e?100:0)):(n.container.width(200*(n.count+n.cloneCount)+"%"),n.setProps(t*n.computedW,"init"),setTimeout(function(){n.doMath(),n.vars.rtl&&n.isFirefox?n.newSlides.css({width:n.computedW,marginRight:n.computedM,float:"right",display:"block"}):n.newSlides.css({width:n.computedW,marginRight:n.computedM,float:"left",display:"block"}),n.vars.smoothHeight&&f.smoothHeight()},"init"===e?100:0))}v||n.slides.removeClass(i+"active-slide").eq(n.currentSlide).addClass(i+"active-slide"),n.vars.init(n)},n.doMath=function(){var e=n.slides.first(),t=n.vars.itemMargin,a=n.vars.minItems,i=n.vars.maxItems;n.w=void 0===n.viewport?n.width():n.viewport.width(),n.isFirefox&&(n.w=n.width()),n.h=e.height(),n.boxPadding=e.outerWidth()-e.width(),v?(n.itemT=n.vars.itemWidth+t,n.itemM=t,n.minW=a?a*n.itemT:n.w,n.maxW=i?i*n.itemT-t:n.w,n.itemW=n.minW>n.w?(n.w-t*(a-1))/a:n.maxW<n.w?(n.w-t*(i-1))/i:n.vars.itemWidth>n.w?n.w:n.vars.itemWidth,n.visible=Math.floor(n.w/n.itemW),n.move=n.vars.move>0&&n.vars.move<n.visible?n.vars.move:n.visible,n.pagingCount=Math.ceil((n.count-n.visible)/n.move+1),n.last=n.pagingCount-1,n.limit=1===n.pagingCount?0:n.vars.itemWidth>n.w?n.itemW*(n.count-1)+t*(n.count-1):(n.itemW+t)*n.count-n.w-t):(n.itemW=n.w,n.itemM=t,n.pagingCount=n.count,n.last=n.count-1),n.computedW=n.itemW-n.boxPadding,n.computedM=n.itemM},n.update=function(e,t){n.doMath(),v||(e<n.currentSlide?n.currentSlide+=1:e<=n.currentSlide&&0!==e&&(n.currentSlide-=1),n.animatingTo=n.currentSlide),n.vars.controlNav&&!n.manualControls&&("add"===t&&!v||n.pagingCount>n.controlNav.length?f.controlNav.update("add"):("remove"===t&&!v||n.pagingCount<n.controlNav.length)&&(v&&n.currentSlide>n.last&&(n.currentSlide-=1,n.animatingTo-=1),f.controlNav.update("remove",n.last))),n.vars.directionNav&&f.directionNav.update()},n.addSlide=function(e,t){var a=$(e);n.count+=1,n.last=n.count-1,d&&u?void 0!==t?n.slides.eq(n.count-t).after(a):n.container.prepend(a):void 0!==t?n.slides.eq(t).before(a):n.container.append(a),n.update(t,"add"),n.slides=$(n.vars.selector+":not(.clone)",n),n.setup(),n.vars.added(n)},n.removeSlide=function(e){var t=isNaN(e)?n.slides.index($(e)):e;n.count-=1,n.last=n.count-1,isNaN(e)?$(e,n.slides).remove():d&&u?n.slides.eq(n.last).remove():n.slides.eq(e).remove(),n.doMath(),n.update(t,"remove"),n.slides=$(n.vars.selector+":not(.clone)",n),n.setup(),n.vars.removed(n)},f.init()},$(window).blur(function(t){e=!1}).focus(function(t){e=!0}),$.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,fadeFirstSlide:!0,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",customDirectionNav:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,isFirefox:!1,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){},init:function(){},rtl:!1},$.fn.flexslider=function(e){if(void 0===e&&(e={}),"object"==typeof e)return this.each(function(){var t=$(this),a=e.selector?e.selector:".slides > li",n=t.find(a);1===n.length&&!1===e.allowOneSlide||0===n.length?(n.fadeIn(400),e.start&&e.start(t)):void 0===t.data("flexslider")&&new $.flexslider(this,e)});var t=$(this).data("flexslider");switch(e){case"play":t.play();break;case"pause":t.pause();break;case"stop":t.stop();break;case"next":t.flexAnimate(t.getTarget("next"),!0);break;case"prev":case"previous":t.flexAnimate(t.getTarget("prev"),!0);break;default:"number"==typeof e&&t.flexAnimate(e,!0)}}}(jQuery);

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
				filterable.message = $('.filterable-grid-msg', filterable).html('Please remove some of the filters selected to see more results.');
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
			
			getFilteredItems: function() {
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
				
				return $filteredItems;
			},
			
			// load more filterable when new filters are applied OR "load more" button is clicked
			loadMore: function(required) {
				required = typeof required !== 'undefined' ? required : true;
				
				// hide load more button
				filterable.loadmore.addClass('hidden');
				
				filterClasses = filterable.filterClasses;

				/*
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
				*/
				
				$filteredItems = methods.getFilteredItems();
				
				// update filterable result count
				filterable.resultscount.html($filteredItems.length + ' Results');

				
				// if no items match the filters
				if ($filteredItems.length == 0) {
					filterable.gridcontainer.addClass('no-result');
					return;
				}

				// return if the current view is "list" because all filtered items are shown (no need to load more)
				if (filterable.view == 'list' && !filterable.imageinlistview) return;
			
					
			
				// find filtered and hidden items
				$hiddenItems = $filteredItems.filter(':not(.loaded)');
				
				if ($hiddenItems.length == 0) return;
				
				// calculate if need to load more items:
				
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

						var columnSize = 0;
						$('.ftitem').each(function() {
							var thisWide = $(this).width();

							if(columnSize == 0) {
								columnSize = thisWide;
							} else {
								if(columnSize > thisWide)
									columnSize = thisWide;
							}
						});
					
						filterable.grid.isotope({
							itemSelector: '.ftitem',
							percentPosition: true,
							masonry: {
								columnWidth: '.grid-sizer'
							}
						});
						
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
				//reset container class
				filterable.gridcontainer.removeClass('no-result');
				
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
						itemSelector: '.ftitem',
						percentPosition: true,
						masonry: {
							columnWidth: '.grid-sizer'
						},
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
					else if ($(this).hasClass('ftitem-filter-lv3')) {
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
				top: ($(window).width()>=768?($(window).scrollTop() + $('#header-inner-wrap').height()/2):($(window).scrollTop() + $(window).height()/4)) + 'px',
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
	
	// initiate zoom buttons in project solution & project-holistic section
	$('.project-solution img, .project-holistic img').each(function(){	
		if (!$(this).is('img')) return;
		$(this).wrap('<div class="img-zoom"></div>')
			.after('<a class="zoom-btn" href="'+$(this).attr('src')+'"></a>')
			.next('.zoom-btn').mgadZoom(true);
	});

	
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



