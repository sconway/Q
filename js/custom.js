(function() {
	var mouseY,
		scrollTo = $(".work .project").offset().top;

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

            $(".project-container.current")
                .removeClass("current")
                .next(".project-container")
                .addClass("current");

            $(".project-wrapper")[0].style["transform"] = newTransform;
            // $(".project-wrapper")[1].style["transform"] = newTransform;

        } else if (dir === "left" && currentIndex !== 0) {
            newTransform = "translateX(-" +(currentIndex * 100 - 100)+ "vw)";

            $(".project-container.current")
                .removeClass("current")
                .prev(".project-container")
                .addClass("current");

            $(".project-wrapper")[0].style["transform"] = newTransform;
            // $(".project-wrapper")[1].style["transform"] = newTransform;
        }

        console.log("new transform value: ", newTransform);
    }



    var videos = document.getElementsByTagName("video"),
        fraction = 0.8;

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
     * This function slides the project wrapper to the slide corresponding to
     * the clicked nav item.
     */
    function handleNavClick() {
    	$(".header .nav li:not(:first)").click(function(event) {
    		event.preventDefault();

    		var newTransform = "translateX(-" +(($(this).index() - 1) * 100)+ "vw)";
    		
    		$(".project-container.current").removeClass("current");

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

            console.log(newTransform);
    	})
    }


    /**
     * 
     */
	function initSlides() {
		$(".project-container").first().addClass("current");
		$(".project-wrapper").css("height", $(".project-container.current").height() + "px");
		
		$(".piece1").click(function(event) {
			// $("#hello").slideToggle(1000);
			$(".project > h2").slideToggle(1000);
			$(".project > .intro").slideToggle(1000);
			$("#work").slideToggle(1000);
			$(".piece:not(.piece1)").slideToggle(500);

			if ($(".body-container").hasClass("active")) {
				console.log("scrolling to: ", $(".piece1").offset().top);
				$("html, body").animate({ scrollTop: scrollTo }, 1000);
			} else {
				$("html, body").animate({ scrollTop: 0 }, 1000);
			}

			$(".body-container, .header").toggleClass("active");
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
