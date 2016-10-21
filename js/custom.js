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


    /**
     * Called on every scroll event. This function handles any scroll
     * related behavior, such as playing videos when they are on screen,
     * or displaying/toggling certain elements/classes.
     */
    function checkScroll() {
        
        // Check all videos to see if they are in the viewport.
        for(var i = 0; i < videos.length; i++) {

            var video = videos[i];

            var x = video.offsetLeft, y = $(video).offset().top, w = video.offsetWidth, h = video.offsetHeight, r = x + w, //right
                b = y + h, //bottom
                visibleX, visibleY, visible;

                visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
                visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

                visible = visibleX * visibleY / (w * h);

                if (visible > fraction) {
                    video.play();
                } else {
                    video.pause();
                }
        }

        // Checks if a project is visible and sets the corresponding menu item active
        if ( $(".project-container.current").isOnScreen() ) {
            var index = $(".project-container.current").index();
            $($(".nav-link").get(index)).addClass("active");
        } else {
            $(".nav-link").removeClass("active");
        }


        // if the space betweet the project cover photo and the about section
        // is in the middle of the viewport, show the nav keys.
        if ( (window.pageYOffset + 20) > $(".project-container .details").offset().top &&
             (window.pageYOffset + window.innerHeight) < $("#about").offset().top ) {
            $("#navKeys").addClass("active");
        } else {
            $("#navKeys").removeClass("active");
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
	 *  @param fn          : Anonymous function
	 */
	function handleSectionScroll(scrollPoint, duration, fn) {
	    $('html, body').stop().animate(
            { scrollTop: scrollPoint }, 
            duration, 
            "linear", 
            fn );
	}


	/**
	 * This function uses the supplied direction and index to slide the 
     * project container to the specifieda point
	 */
	function animateSlide(index) {
		var curTransform = $(".project-wrapper")[0].style["transform"],
			newTransform = "",
			numProjects  = $(".project-container").length;
			// currentIndex = $(".project-container.current").index();

        if ( $(".body-container").hasClass("active") ) {
            $(".project").addClass("transform");
            setTimeout(function() { slideProjects(newTransform, numProjects, index, true); }, 800);
            setTimeout(function() { $(".project").removeClass("transform"); }, 2000); 
        } else {
            slideProjects(newTransform, numProjects, index, false);
        }
	}


    /**
     * This function slides the project container left or right based on the
     * provided direction.
     */
    function slideProjects(newTransform, numProjects, index, active) {
        console.log("IN slideProjects");
        console.log("newTransform: ", newTransform);
        console.log("numProjects: ", numProjects);
        console.log("currentIndex: ", index);
        console.log("active: ", active);


        newTransform = "translateX(-" +(index * 100)+ "vw)";

        // This is the main code that slides the projects. The new transform
        // value gets computed above, based off the new index, and then this
        // value is set as the transform style of the project wrapper
        $(".project-wrapper")[0].style["transform"] = newTransform;

        updateAfterSlide(index);

    }


    /**
     * This function is called after a slide transition completes. It is
     * responsible for updating the current classes on the various project
     * containers, along with updating the active status of the nav bar, and
     * setting the height of the current project container.
     */
    function updateAfterSlide(currentIndex) {
        $(".project-container").removeClass("current");
        $(".nav-link").removeClass("active");

        // find the new current project and add the current class to it
        $($(".project-container").get(currentIndex)).addClass("current");
        $($(".nav-link").get(currentIndex)).addClass("active");

        // Adjust the height to account for different sized project covers
        $(".project-wrapper").css("height",  
            $(".project-container.current").height() + "px");

        // add the click handler back after a second
        setTimeout( function() {
            handleProjectClick();
        }, 1000);
    }

    

    /**
     * This function slides the project wrapper to the slide corresponding to
     * the clicked nav item.
     */
    function handleNavClick() {
    	$(".nav-link").parent().click(function(event) {
    		event.preventDefault();

    		var index = $(this).index() - 1,
                $this        = $(this);

            // Be sure to only slide the projects if they are in the viewport.
            // If they aren't, scroll the page down so they are in view.
            if ( $(".project-container.current").isOnScreen() ) {
                $(".project-container.current").removeClass("current");
                $(".header .nav li a").removeClass("active");
                $this.find("a").addClass("active");

                animateSlide(index);
            } else {
                // $(".project-container.current").removeClass("current");
                handleSectionScroll(
                    $(".project-container").offset().top, 
                    1000, function() {
                        // $(".project-wrapper")[0].style["transform"] = newTransform;
                        // $($(".project-container").get($this.index() - 1)).addClass("current");
                        // $(".project-wrapper").css("height",  
                        //     $(".project-container.current").height() + "px");
                        // remove the current nav link and set the clicked one to be current.
                        // $($(".nav-link").get($this.index() - 1)).addClass("active");
                        animateSlide(index);
                    });
            }
    		

    	});

        // slides the page down to the about section when the bio link
        // in the nav is clicked. Only does this when the project is not active.
        $(".bioLink").click(function() {
            if ( !$(".body-container").hasClass("active") ) {
                handleSectionScroll($("#about").offset().top - 50, 1250);
            }
        });


        // slides the page down to the work section when the work link
        // is clicked. Only does this when the project is not active.
        $("#workLink").click(function() {
            if ( !$(".body-container").hasClass("active") ) {
                handleSectionScroll($(".section.work").offset().top, 1250);
            }
        });


        $("#homeLink").click(function() {
            if ( !$(".body-container").hasClass("active") ) {
                console.log("clicked");
                handleSectionScroll(0, 1250);
            }
        });
    }


    /**
     * Handles clicks on the back button for the project details. Exits
     * out of the active project when clicked.
     */
    function handleBackButtonClick() {

        $("#backBtn").click( function() {
            $(this).removeClass("active");

            closeProject();
            toggleActiveHeights();
        });

    }


    /**
     * Exits out of the current project and removes the necessary classes.
     */
    function closeProject() {
        console.log("scrolling to: ", $(".piece1").offset().top);
        $("html, body").animate({ scrollTop: scrollTo }, 1000);
        $(".body-container, .header").removeClass("active");
    }


    function toggleActiveHeights() {
        $(".project > h2").slideToggle(1000);
        $(".project > .intro").slideToggle(1000);
        $(".section.hello, .section.about").slideToggle(1000, function() {
            $(".project-wrapper").css("height",  
                $(".project-container.current").height() + "px");
        });
        $("#work").slideToggle(1000);
        $(".piece:not(.piece1)").slideToggle(500);
    }


    /**
     * 
     */
	function initSlides() {
		$(".project-container").first().addClass("current");
        
        setTimeout(function() {
            $(".bg").height($(".body-container").height());
        }, 1000);

        // Set the project wrapper to be the height of the current project container
		$(".project-wrapper").css("height",  $(".project-container.current").height() + "px");
	}


    /**
     * Detects clicks on projects, and either expands or closes the project
     * when one is clicked. If a closed project is clicked, it will be 
     * expanded to show the user the project details.
     */
    function handleProjectClick() {
        // Determine whether or not the project should be expanded or reduced
        $(".project-container").off().click(function() {

            console.log("project container clicked");

            // If the current project was clicked, expand it. If not, it must
            // have been the next project, so slide it.
            if ( $(this).hasClass("current") ) {

                // If the project is expanded, close it. Otherwise expand it.
                if ($(".body-container").hasClass("active")) {
                    closeProject();
                } else {
                    $(".body-container, .header").addClass("active");
                    $("html, body").animate({ scrollTop: 0 }, 1000);
                }
                
                toggleActiveHeights();
            } else {
                var index = $(".project-container.current").index();

                animateSlide(index+1);
            }

        });
    }


    /**
     * Listens for any keypresses, and slides the projects if 
     * the left or the right button is clicked.
     */
    function handleKeyPress() {

        $(document).keydown( function(e) {

            var index = $(".project-container.current").index();

            switch (e.which) {
                // left
                case 37: 
                    // make sure we're not on the last slide before sliding left
                    if (!$(".project-container").first().hasClass("current")) {
                        animateSlide(index - 1);
                    }
                    break;
                // right
                case 39: 
                    // make sure we're not on the first slide before sliding right
                    if (!$(".project-container").last().hasClass("current")) {
                        animateSlide(index + 1);
                    } 
                    break;
                default:
                    return;
            }
        });

    }


    /**
     * Detects swipe gestures and slides the projects left or right
     * accordingly.
     */
	function handleSwipe() {
		
        $(".piece1").swipe( {

            //Generic swipe handler for all directions
            swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                // temporarily remove the click handler so it doesn't reset the translate.
                $(".project-container").off();

                var index = $(".project-container.current").index();

                if (direction === "right") {
                    // make sure we're not on the last slide before sliding left
                    if ( !$(".project-container").first().hasClass("current") ) {
                        console.log("right swipe");
                        animateSlide(index - 1 );
                    }
                }

                if (direction === "left") {
                    // make sure we're not on the first slide before sliding right
                    if (!$(".project-container").last().hasClass("current")) {
                        console.log("left swipe");
                        animateSlide(index + 1 );
                    }
                }
            }

        }); 
		   
	}


	$(window).load(function() {
		// needs to be called after load to compute height properly.
		initSlides();
        handleProjectClick();
		handleNavClick();
        handleBackButtonClick();
		handleKeyPress();
		handleSwipe();
	});

})();
