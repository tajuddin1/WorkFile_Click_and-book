(function ($) {
  ("use strict");

  //====== Mobile Menu ======//
  $.fn.thmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: ".cs-menu-toggle",
        bodyToggleClass: "cs-body-visible",
        subMenuParent: "menu-item",
        subMenuParentToggle: "cs-active",
        meanExpandClass: "cs-mean-expand",
        subMenuToggleClass: "cs-open",
        toggleSpeed: 400,
      },
      options,
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = "." + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css("display", "none");
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on("click", function () {
          menuToggle();
        });
      });

      // Hide Menu On outside click
      menu.on("click", function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find("div").on("click", function (e) {
        e.stopPropagation();
      });
    });
  };

  $(".cs-menu-wrapper").thmobilemenu();

  //====== Sticky ======//
  $(window).scroll(function () {
    var topPos = $(this).scrollTop();
    if (topPos > 500) {
      $(".sticky-wrapper").addClass("sticky");
    } else {
      $(".sticky-wrapper").removeClass("sticky");
    }
  });

  //====== Scroll To Top ======//
  $(document).ready(function () {
    if ($(".scroll-top").length > 0) {
      var scrollTopbtn = $(".scroll-top")[0];
      var progressPath = $(".scroll-top path")[0];
      var pathLength = progressPath.getTotalLength();

      // Initialize stroke-dasharray and stroke-dashoffset for the progress path
      progressPath.style.transition = progressPath.style.WebkitTransition =
        "none";
      progressPath.style.strokeDasharray = pathLength + " " + pathLength;
      progressPath.style.strokeDashoffset = pathLength;
      progressPath.getBoundingClientRect();
      progressPath.style.transition = progressPath.style.WebkitTransition =
        "stroke-dashoffset 10ms linear";

      // Update the progress bar
      var updateProgress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength) / height;
        progressPath.style.strokeDashoffset = progress;
      };
      updateProgress();

      $(window).on("scroll", updateProgress);

      var offset = 50;
      var duration = 750;

      // Show the scroll-to-top button on scroll
      $(window).on("scroll", function () {
        if ($(this).scrollTop() > offset) {
          $(scrollTopbtn).addClass("show");
        } else {
          $(scrollTopbtn).removeClass("show");
        }
      });

      // Click event to scroll to top
      $(scrollTopbtn).on("click", function (event) {
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          duration,
        );
        return false;
      });
    }
  });

  //====== Set Background Image & Mask ======//
  if ($("[data-bg-src]").length > 0) {
    $("[data-bg-src]").each(function () {
      var src = $(this).attr("data-bg-src");
      $(this).css("background-image", "url(" + src + ")");
      $(this).removeAttr("data-bg-src").addClass("background-image");
    });
  }

  if ($("[data-mask-src]").length > 0) {
    $("[data-mask-src]").each(function () {
      var mask = $(this).attr("data-mask-src");
      $(this).css({
        "mask-image": "url(" + mask + ")",
        "-webkit-mask-image": "url(" + mask + ")",
      });
      $(this).addClass("bg-mask");
      $(this).removeAttr("data-mask-src");
    });
  }

  //====== 07. Global Slider ======//

  $(".cs-slider").each(function () {
    var thSlider = $(this);
    var settings = $(this).data("slider-options");

    // Store references to the navigation Slider
    var prevArrow = thSlider.find(".slider-prev");
    var nextArrow = thSlider.find(".slider-next");
    var paginationElN = thSlider.find(".slider-pagination.pagi-number");
    var paginationExternel = thSlider
      .siblings(".slider-controller")
      .find(".slider-pagination");

    var paginationEl = paginationExternel.length
      ? paginationExternel.get(0)
      : thSlider.find(".slider-pagination").get(0);

    var paginationType = settings["paginationType"]
      ? settings["paginationType"]
      : "bullets";
    var autoplayconditon = settings["autoplay"];

    var sliderDefault = {
      slidesPerView: 1,
      spaceBetween: settings["spaceBetween"] || 24,
      loop: settings["loop"] !== false,
      speed: settings["speed"] || 1000,
      autoplay: autoplayconditon || {
        delay: 6000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: nextArrow.get(0),
        prevEl: prevArrow.get(0),
      },
      pagination: {
        el: paginationEl,
        type: paginationType,
        clickable: true,
        renderBullet: function (index, className) {
          var number = index + 1;
          var formattedNumber = number < 10 ? "0" + number : number;
          if (paginationElN.length) {
            return (
              '<span class="' +
              className +
              ' number">' +
              formattedNumber +
              "</span>"
            );
          } else {
            return (
              '<span class="' +
              className +
              '" aria-label="Go to Slide ' +
              formattedNumber +
              '"></span>'
            );
          }
        },
        formatFractionCurrent: function (number) {
          return number < 10 ? "0" + number : number;
        },
        formatFractionTotal: function (number) {
          return number < 10 ? "0" + number : number;
        },
      },
      on: {
        slideChange: function () {
          setTimeout(function () {
            swiper.params.mousewheel.releaseOnEdges = false;
          }, 500);
        },
        reachEnd: function () {
          setTimeout(function () {
            swiper.params.mousewheel.releaseOnEdges = true;
          }, 750);
        },
      },
    };

    var options = JSON.parse(thSlider.attr("data-slider-options"));
    options = $.extend({}, sliderDefault, options);
    var swiper = new Swiper(thSlider.get(0), options); // Assign the swiper variable

    if ($(".slider-area").length > 0) {
      $(".slider-area").closest(".container").parent().addClass("arrow-wrap");
    }

    // Category slider specific wheel effect
    if (thSlider.hasClass("categorySlider")) {
      const multiplier = {
        translate: 0.1,
        rotate: 0.008,
      };

      function calculateWheel() {
        const slides = document.querySelectorAll(".single");
        slides.forEach((slide) => {
          const rect = slide.getBoundingClientRect();
          const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
          let ty =
            Math.abs(r) * multiplier.translate -
            rect.width * multiplier.translate;

          if (ty < 0) {
            ty = 0;
          }
          const transformOrigin = r < 0 ? "left top" : "right top";
          slide.style.transform = `translate(0, ${ty}px) rotate(${-r * multiplier.rotate}deg)`;
          slide.style.transformOrigin = transformOrigin;
        });
      }

      function raf() {
        requestAnimationFrame(raf);
        calculateWheel();
      }

      raf();
    }
  });

  // Function to add animation classes
  function animationProperties() {
    $("[data-ani]").each(function () {
      var animationName = $(this).data("ani");
      $(this).addClass(animationName);
    });

    $("[data-ani-delay]").each(function () {
      var delayTime = $(this).data("ani-delay");
      $(this).css("animation-delay", delayTime);
    });
  }
  animationProperties();

  //====== Ajax Contact Form ======//
  var form = ".ajax-contact";
  var invalidCls = "is-invalid";
  var $email = '[name="email"]';
  var $validation =
    '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]'; // Must be use (,) without any space
  var formMessages = $(".form-messages");

  function sendContact() {
    var formData = $(form).serialize();
    var valid;
    valid = validateContact();
    if (valid) {
      jQuery
        .ajax({
          url: $(form).attr("action"),
          data: formData,
          type: "POST",
        })
        .done(function (response) {
          // Make sure that the formMessages div has the 'success' class.
          formMessages.removeClass("error");
          formMessages.addClass("success");
          // Set the message text.
          formMessages.text(response);
          // Clear the form.
          $(form + ' input:not([type="submit"]),' + form + " textarea").val("");
        })
        .fail(function (data) {
          // Make sure that the formMessages div has the 'error' class.
          formMessages.removeClass("success");
          formMessages.addClass("error");
          // Set the message text.
          if (data.responseText !== "") {
            formMessages.html(data.responseText);
          } else {
            formMessages.html(
              "Oops! An error occured and your message could not be sent.",
            );
          }
        });
    }
  }

  function validateContact() {
    var valid = true;
    var formInput;

    function unvalid($validation) {
      $validation = $validation.split(",");
      for (var i = 0; i < $validation.length; i++) {
        formInput = form + " " + $validation[i];
        if (!$(formInput).val()) {
          $(formInput).addClass(invalidCls);
          valid = false;
        } else {
          $(formInput).removeClass(invalidCls);
          valid = true;
        }
      }
    }
    unvalid($validation);

    if (
      !$($email).val() ||
      !$($email)
        .val()
        .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
    ) {
      $($email).addClass(invalidCls);
      valid = false;
    } else {
      $($email).removeClass(invalidCls);
      valid = true;
    }
    return valid;
  }

  $(form).on("submit", function (element) {
    element.preventDefault();
    sendContact();
  });

  //====== Search Box Popup ======//
  function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    // Delegate events for opening the search box
    $(document).on("click", $searchOpen, function (e) {
      e.preventDefault();
      $($searchBox).addClass($toggleCls);
    });

    // Delegate event for closing the search box when clicking outside
    $(document).on("click", function (e) {
      if (
        !$(e.target).closest($searchBox).length &&
        !$(e.target).closest($searchOpen).length
      ) {
        $($searchBox).removeClass($toggleCls);
      }
    });

    // Prevent the click inside the search box from closing it
    $(document).on("click", $searchBox + " form", function (e) {
      e.stopPropagation();
      $($searchBox).addClass($toggleCls);
    });

    // Delegate event for closing the search box on clicking close button
    $(document).on("click", $searchCls, function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
  }

  // Call function
  popupSarchBox(
    ".popup-search-box",
    ".searchBoxToggler",
    ".searchClose",
    "show",
  );

  //====== Magnific Popup ======//
  $(".popup-image").magnificPopup({
    type: "image",
    mainClass: "mfp-zoom-in",
    removalDelay: 260,
    gallery: {
      enabled: true,
    },
  });

  // magnificPopup video view //
  $(".popup-video").magnificPopup({
    type: "iframe",
  });

  // magnificPopup video view //
  $(".popup-content").magnificPopup({
    type: "inline",
    midClick: true,
  });

  // ====== Wow Init ===== //
  var wow = new WOW({
    boxClass: "wow",
    animateClass: "animated",
    offset: 0,
    mobile: true,
    live: true,
  });
  new WOW().init();

  //====== Text Effect Animation =====//
  if ($(".text-anime-style-2").length) {
    let staggerAmount = 0.03,
      translateXValue = 20,
      delayValue = 0.1,
      easeType = "power2.out",
      animatedTextElements = document.querySelectorAll(".text-anime-style-2");

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, {
        type: "chars, words",
      });
      gsap.from(animationSplitText.chars, {
        duration: 2,
        delay: delayValue,
        x: translateXValue,
        autoAlpha: 0,
        stagger: staggerAmount,
        ease: easeType,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
      });
    });
  }

  if ($(".text-anime-style-3").length) {
    let animatedTextElements = document.querySelectorAll(".text-anime-style-3");

    animatedTextElements.forEach((element) => {
      if (element.animation) {
        element.animation.progress(1).kill();
        element.split.revert();
      }

      element.split = new SplitText(element, {
        type: "lines,words,chars",
        linesClass: "split-line",
      });
      gsap.set(element, {
        perspective: 400,
      });

      gsap.set(element.split.chars, {
        opacity: 0,
        x: "50",
      });

      element.animation = gsap.to(element.split.chars, {
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
        },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: 0.02,
      });
    });
  }

  //====== Slider Drag Cursor =====//
  const cursor = document.querySelector(".slider-drag-cursor");
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const speed = 1;

  const xSet = gsap.quickSetter(cursor, "x", "px");
  const ySet = gsap.quickSetter(cursor, "y", "px");

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    xSet(pos.x);
    ySet(pos.y);
  });

  // Use event delegation and .on() for better performance
  $(document)
    .on("mouseenter", ".slider-drag-wrap", function () {
      $(".slider-drag-cursor").addClass("active");
    })
    .on("mouseleave", ".slider-drag-wrap", function () {
      $(".slider-drag-cursor").removeClass("active");
    });

  $(document)
    .on(
      "mouseenter",
      ".slider-drag-wrap a, .slider-drag-wrap .slider-pagination",
      function () {
        $(".slider-drag-cursor").removeClass("active");
      },
    )
    .on(
      "mouseleave",
      ".slider-drag-wrap a, .slider-drag-wrap .slider-pagination",
      function () {
        $(".slider-drag-cursor").addClass("active");
      },
    );

  //====== Section Position ======//
  function convertInteger(str) {
    return parseInt(str, 10);
  }

  $.fn.sectionPosition = function (mainAttr, posAttr) {
    $(this).each(function () {
      var section = $(this);

      function setPosition() {
        var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
          posData = section.attr(mainAttr), // where to position
          posFor = section.attr(posAttr), // On Which section is for positioning
          topMark = "top-half", // Pos top
          bottomMark = "bottom-half", // Pos Bottom
          parentPT = convertInteger($(posFor).css("padding-top")), // Default Padding of  parent
          parentPB = convertInteger($(posFor).css("padding-bottom")); // Default Padding of  parent

        if (posData === topMark) {
          $(posFor).css("padding-bottom", parentPB + sectionHeight + "px");
          section.css("margin-top", "-" + sectionHeight + "px");
        } else if (posData === bottomMark) {
          $(posFor).css("padding-top", parentPT + sectionHeight + "px");
          section.css("margin-bottom", "-" + sectionHeight + "px");
        }
      }
      setPosition(); // Set Padding On Load
    });
  };

  var postionHandler = "[data-sec-pos]";
  if ($(postionHandler).length) {
    $(postionHandler).imagesLoaded(function () {
      $(postionHandler).sectionPosition("data-sec-pos", "data-pos-for");
    });
  }

  //====== 14. Counter Up ======//
  $(".counter-number").counterUp({
    delay: 10,
    time: 1000,
  });

  // ====== Smooth Scroll ======
  gsap.registerPlugin(ScrollTrigger);

  let lenis;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function initializeLenis() {
    lenis = new Lenis({
      lerp: 0.07, // Smoothing factor
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Allow native scroll inside specified elements
    document.querySelectorAll(".allow-natural-scroll").forEach((el) => {
      el.addEventListener("wheel", (e) => e.stopPropagation(), {
        passive: true,
      });
      el.addEventListener("touchmove", (e) => e.stopPropagation(), {
        passive: true,
      });
    });
  }

  function enableOrDisableLenis() {
    if (prefersReducedMotion) return;

    if (window.innerWidth > 991) {
      if (!lenis) initializeLenis();
      lenis.start();
    } else {
      if (lenis) {
        lenis.stop();
        lenis = null;
      }
    }
  }

  //==== Signup Form =====//

  function clearAllErrors() {
        $('.form-control, .form-select').removeClass('is-invalid');
        $('.invalid-feedback').text('');
      }
      
      // ----- Helper function to show error for a field -----
      function showError(fieldId, message) {
        $(fieldId).addClass('is-invalid');
        const errorId = fieldId.replace('#', '#') + 'Error';
        $(errorId).text(message);
      }
      
      // ----- Category card selection -----
      function updateCardSelection() {
        if ($('#catFreelancer').is(':checked')) {
          $('#freelancerCard').addClass('selected');
          $('#travelCard').removeClass('selected');
          $('#agencyField').addClass('hidden-field');
          $('#agencyName').val('').removeClass('is-invalid');
          $('#agencyNameError').text('');
        } else {
          $('#travelCard').addClass('selected');
          $('#freelancerCard').removeClass('selected');
          $('#agencyField').removeClass('hidden-field');
        }
      }
      
      // Initial call
      updateCardSelection();
      
      // Card click handlers
      $('#freelancerCard').on('click', function() {
        $('#catFreelancer').prop('checked', true);
        updateCardSelection();
        clearAllErrors();
      });
      
      $('#travelCard').on('click', function() {
        $('#catTravel').prop('checked', true);
        updateCardSelection();
        clearAllErrors();
      });
      
      // Radio change handler
      $('input[name="userCategory"]').on('change', updateCardSelection);
      
      // ----- Password visibility toggles -----
      $('.toggle-password').on('click', function() {
        const targetId = $(this).data('target');
        const inputField = $(targetId);
        const icon = $(this).find('i');
        
        if (inputField.attr('type') === 'password') {
          inputField.attr('type', 'text');
          icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
          inputField.attr('type', 'password');
          icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
      });
      
      // ----- Real-time validation on input change -----
      $('#fullName').on('input', function() {
        if ($(this).val().trim() !== '') {
          $(this).removeClass('is-invalid');
          $('#fullNameError').text('');
        }
      });
      
      $('#email').on('input', function() {
        const email = $(this).val().trim();
        if (email && email.includes('@') && email.includes('.')) {
          $(this).removeClass('is-invalid');
          $('#emailError').text('');
        }
      });
      
      $('#country').on('change', function() {
        if ($(this).val()) {
          $(this).removeClass('is-invalid');
          $('#countryError').text('');
        }
      });

      $('#phone').on('change', function() {
        if ($(this).val()) {
          $(this).removeClass('is-invalid');
          $('#phoneError').text('');
        }
      });
      
      $('#agencyName').on('input', function() {
        if ($(this).val().trim() !== '') {
          $(this).removeClass('is-invalid');
          $('#agencyNameError').text('');
        }
      });
      
      $("#password").on("input", function () {
        const password = $(this).val();

        if (password.length >= 6) {
          $(this).removeClass("is-invalid");
          $("#passwordError").text("");
        } else {
          $(this).addClass("is-invalid");
          $("#passwordError").text("Password must be at least 6 characters");
        }
      });
      
      // ----- Form submit handler with inline errors (no alerts) -----
      $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        clearAllErrors();
        
        let isValid = true;
        const category = $('input[name="userCategory"]:checked').val();
        
        // Validate Full Name
        const fullName = $('#fullName').val().trim();
        if (!fullName) {
          showError('#fullName', 'Full name is required');
          isValid = false;
        }
        
        // Validate Email
        const email = $('#email').val().trim();
        if (!email) {
          showError('#email', 'Email is required');
          isValid = false;
        } else if (!email.includes('@') || !email.includes('.')) {
          showError('#email', 'Please enter a valid email address');
          isValid = false;
        }
        
        // Validate Country
        const country = $('#country').val();
        if (!country) {
          showError('#country', 'Please select your country');
          isValid = false;
        }
        
        // Validate Agency Name for Travel Agent
        if (category === 'travel') {
          const agencyName = $('#agencyName').val().trim();
          if (!agencyName) {
            showError('#agencyName', 'Agency name is required for travel agents');
            isValid = false;
          }
        }
        
        // Validate Password
        const password = $('#password').val();
        if (!password) {
          showError('#password', 'Password is required');
          isValid = false;
        } else if (password.length < 6) {
          showError('#password', 'Password must be at least 6 characters');
          isValid = false;
        }
        
        // Validate Phone
        const confirm = $('#phone').val();
        if (!confirm) {
          showError("#phone", "Please confirm your phone");
          isValid = false;
        }
        
        // If valid, show success message (you can replace this with form submission)
        if (isValid) {
          const successDiv = $('<div class="alert alert-success alert-dismissible fade show mt-3" role="alert">' +
            '<i class="fas fa-check-circle me-2"></i>Account created successfully! (Demo)' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
            '</div>');
          
          $('.modal-body').append(successDiv);
          
          // Auto remove after 3 seconds
          setTimeout(function() {
            successDiv.alert('close');
          }, 3000);
          
          // Optional: close modal after success
          setTimeout(function() {
            $('#signupModal').modal('hide');
          }, 1500);
        }
      });
      
      // ----- Login link click -----
      $('#loginLink').on('click', function(e) {
        e.preventDefault();
        $('#signupModal').modal('hide');
        
        // Show login message (you can replace with actual login modal)
        setTimeout(function() {
          const loginDiv = $('<div class="alert alert-info alert-dismissible fade show position-fixed top-50 start-50 translate-middle" style="z-index: 9999;" role="alert">' +
            '<i class="fas fa-info-circle me-2"></i>Login flow would open here (demo)' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
            '</div>');
          $('body').append(loginDiv);
          
          setTimeout(function() {
            loginDiv.alert('close');
          }, 2000);
        }, 300);
      });
      
      // ----- Reset form when modal is closed -----
      $('#signupModal').on('hidden.bs.modal', function() {
        $('#signupForm')[0].reset();
        $('#catFreelancer').prop('checked', true);
        updateCardSelection();
        clearAllErrors();
        
        // Reset password icons
        $('.toggle-password i').removeClass('fa-eye-slash').addClass('fa-eye');
        $('input[type="password"]').attr('type', 'password');
        
        // Remove any success alerts
        $('.alert').remove();
      });

  // Initial call
  enableOrDisableLenis();
  window.addEventListener("resize", enableOrDisableLenis);
})(jQuery);
