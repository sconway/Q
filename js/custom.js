(function() {
	var mouseY,
		scrollTo = $(".work .project").offset().top;

    var videos = document.getElementsByTagName("video"),
        fraction = 0.8;


    $.fn.isOnScreen = function(){
        var viewport = {};
        viewport.top = $(window).scrollTop();
        viewport.bottom = viewport.top + $(window).height();
        var bounds = {};
        bounds.top = this.offset().top;
        bounds.bottom = bounds.top + this.outerHeight();
        return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
    };


    function checkScroll() {
        // console.log("called");
        for(var i = 0; i < videos.length; i++) {

            var video = videos[i];

            var x = video.offsetLeft, y = $(video).offset().top, w = video.offsetWidth, h = video.offsetHeight, r = x + w, //right
                b = y + h, //bottom
                visibleX, visibleY, visible;

                visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
                visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

                visible = visibleX * visibleY / (w * h);

                if (visible > fraction) {
                    // console.log("visible");
                    video.play();
                } else {
                    // console.log("not visible");
                    video.pause();
                }
        }
    }

    window.addEventListener('scroll', checkScroll, false);
    window.addEventListener('resize', checkScroll, false);


	/**
	 * This function is responsible for scrolling the page to the supplied
	 * center point. It creates an interval and calls the scrollBy method
	 * within that interval to slide up or down the page.
	 *
	 *  @param scrollPoint : Integer
	 *  @param duration    : Integer
	 */
	function handleSectionScroll(scrollPoint, duration) {
	    $('html, body').stop().animate({scrollTop: scrollPoint}, duration, "linear");
	}


	/**
	 * This function is responsible for sliding the projects to the left
	 * or the right based on the user's input. It manipulates the transform
	 * attribute of the project wrapper, and handles the bounds checks to make
	 * sure the first and last slides are not scrolled past.
	 */
	function animateSlide(dir) {
		var curTransform = $(".project-wrapper")[0].style["transform"],
			newTransform = "",
			numProjects  = $(".project-container").length,
			currentIndex = $(".project-container.current").index();

		console.log("current index: ", currentIndex);
		console.log("current transform value: ", curTransform);

        if ( $(".body-container").hasClass("active") ) {
            $(".project").addClass("transform");
            setTimeout(function() { slideProjects(dir, newTransform, numProjects, currentIndex, true); }, 800);
            setTimeout(function() { $(".project").removeClass("transform"); }, 2000); 
        } else {
            slideProjects(dir, newTransform, numProjects, currentIndex, false);
        }
	}



    function slideProjects(dir, newTransform, numProjects, currentIndex, active) {
        if (dir === "right" && currentIndex !== numProjects-1) {
            newTransform = "translateX(-" +(currentIndex * 100 + 100)+ "vw)";

            updateAfterSlide(currentIndex, false);

            $(".project-wrapper")[0].style["transform"] = newTransform;

        } else if (dir === "left" && currentIndex !== 0) {
            newTransform = "translateX(-" +(currentIndex * 100 - 100)+ "vw)";

            updateAfterSlide(currentIndex, true);

            $(".project-wrapper")[0].style["transform"] = newTransform;
        }

        console.log("new transform value: ", newTransform);
    }


    /**
     * This function is called after a slide transition completes. It is
     * responsible for updating the current classes on the various project
     * containers, along with updating the active status of the nav bar, and
     * setting the height of the current project container.
     */
    function updateAfterSlide(currentIndex, left) {
        var $current = $(".project-container.current");

        $(".nav-link").removeClass("active");
        $current.removeClass("current");

        if ( left ) { 
            $current.prev(".project-container").addClass("current");
            $($(".nav-link").get(currentIndex - 1)).addClass("active");
        } else {
            $current.next(".project-container").addClass("current");
            $($(".nav-link").get(currentIndex + 1)).addClass("active");
        }

        $(".project-wrapper").css("height",  
            $(".project-container.current").height() + "px");
    }

    

    /**
     * This function slides the project wrapper to the slide corresponding to
     * the clicked nav item.
     */
    function handleNavClick() {
    	$(".header .nav li:not(:first)").click(function(event) {
    		event.preventDefault();

    		var newTransform = "translateX(-" +(($(this).index() - 1) * 100)+ "vw)";

            // Be sure to only slide the projects if they are in the viewport.
            // If they aren't, scroll the page down so they are in view.
            if ( $(".project-container.current").isOnScreen() ) {
                $(".project-container.current").removeClass("current");
                $(".header .nav li a").removeClass("active");
                $(this).find("a").addClass("active");

                if ( $(".body-container").hasClass("active") ) {
                    $(".project").addClass("transform");
                    setTimeout(function() { 
                        $(".project-wrapper")[0].style["transform"] = newTransform;
                    }, 800);
                    setTimeout(function() { 
                        $(".project").removeClass("transform"); 
                        $($(".project-container").get($(this).index() - 1)).addClass("current");
                    }, 2000); 
                } else {
                    $(".project-wrapper")[0].style["transform"] = newTransform;
                    $($(".project-container").get($(this).index() - 1)).addClass("current");
                }
            } else {
                handleSectionScroll($(".project-container.current").offset().top, 1000);
            }
    		

            console.log(newTransform);
    	})
    }


    /**
     * 
     */
	function initSlides() {
		$(".project-container").first().addClass("current");
		// $(".section.work").css("height", $(".project-container.current").height() + "px");
		$(".project-wrapper").css("height",  $(".project-container.current").height() + "px");
		
		$(".piece1").click(function(event) {
            if ($(".body-container").hasClass("active")) {
                console.log("scrolling to: ", $(".piece1").offset().top);
                $("html, body").animate({ scrollTop: scrollTo }, 1000);
                $(".body-container, .header").removeClass("active");
            } else {
                $(".body-container, .header").addClass("active");
                $("html, body").animate({ scrollTop: 0 }, 1000);
            }
            
			// $("#hello").slideToggle(1000);
			$(".project > h2").slideToggle(1000);
			$(".project > .intro").slideToggle(1000);
            $(".section.hello, .section.about").slideToggle(1000);
			$("#work").slideToggle(1000);
			$(".piece:not(.piece1)").slideToggle(500);

			

			
		});
	}


	function handleSlideTransitions() {
		var numProjects = $(".project-container").length,
			workHeight  = $("#work").height(),
			firstHeight = $("#1").height(),
			index       = 0,
			curLeft     = 0, 
			maxLeft     = 0;
		
			// $(".section.work").height(workHeight + firstHeight);
			// console.log("first height set");

		    $(document).keydown( function(e) {
		    	curLeft = parseInt($(".project-wrapper").css("left").match(/\d+/)),
	    		maxLeft = window.innerWidth * (numProjects - 1);
		    	index   = curLeft / window.innerWidth;

		    	

		        switch (e.which) {
		            case 37: // left
		            	// make sure we're not on the last slide before sliding left
			            // if (curLeft < maxLeft) {
		                	animateSlide("left");
		                	// $(".section.work").height($($(".project").get(index+1)).height() + workHeight);
		                // }
		                break;
		            case 39: // right
		            	// make sure we're not on the first slide before sliding right
			            // if (curLeft > 0) {
			                animateSlide("right");
							// $(".section.work").height($($(".project").get(index-1)).height() + workHeight);
			            // } 
			            break;
		            default:
		                return;
		        }
		    });

		    // $(".project").swipe({
		    //     swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
		    //         if (direction === "left" || direction === "down") {
		    //             if (curLeft < maxLeft) {
		    //             	animateSlide("-=");
		    //             	// $(".section.work").height($($(".project").get(index+1)).height() + workHeight);
		    //             }
		    //         } else {
		    //         	if (curLeft > 0) {
			   //          	animateSlide("+=");
						// 	// $(".section.work").height($($(".project").get(index-1)).height() + workHeight);
						// }
		    //         }
		    //     }
		    // });
	}


	$(window).load(function() {
		// needs to be called after load to compute height properly.
		initSlides();
		handleNavClick();
		handleSlideTransitions();
		
	});

})();
