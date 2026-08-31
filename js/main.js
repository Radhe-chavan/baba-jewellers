// ============================================================================
// Baba Jewellers — Interactive UI & Mobile Experience
// Sangli, Maharashtra | Contact: 9168157092 / 9168156528
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. Dynamic Year in Footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle with Auto-Close on Scroll & Outside Click
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var siteHeader = document.querySelector(".site-header");

  function closeMobileNav() {
    if (mainNav && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close when tapping any menu link
    var navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });

    // Close when clicking outside header/menu
    document.addEventListener("click", function (e) {
      if (siteHeader && !siteHeader.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close automatically when scrolling the page
    var scrollTimeout = null;
    window.addEventListener("scroll", function () {
      if (mainNav.classList.contains("open")) {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(function () {
            closeMobileNav();
            scrollTimeout = null;
          }, 100);
        }
      }
    }, { passive: true });
  }

  // 3. Hero Slider with Changeable Images
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".slider-dot");
  var prevBtn = document.getElementById("sliderPrevBtn");
  var nextBtn = document.getElementById("sliderNextBtn");
  var heroStage = document.getElementById("heroStage");

  var currentSlide = 0;
  var slideCount = slides.length;
  var slideInterval = null;

  function showSlide(index) {
    if (slideCount === 0) return;
    if (index >= slideCount) currentSlide = 0;
    else if (index < 0) currentSlide = slideCount - 1;
    else currentSlide = index;

    slides.forEach(function (slide, idx) {
      if (idx === currentSlide) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    dots.forEach(function (dot, idx) {
      if (idx === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (slideCount > 0) {
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var idx = parseInt(dot.getAttribute("data-slide"), 10);
        if (!isNaN(idx)) {
          showSlide(idx);
          startAutoSlide();
        }
      });
    });

    if (heroStage) {
      heroStage.addEventListener("mouseenter", stopAutoSlide);
      heroStage.addEventListener("mouseleave", startAutoSlide);
    }

    startAutoSlide();
  }

  // 4. Quick Appointment / Inquiry Form Submission to WhatsApp
  var contactForm = document.getElementById("appointmentForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("formName") || {}).value || "";
      var phone = (document.getElementById("formPhone") || {}).value || "";
      var interest = (document.getElementById("formInterest") || {}).value || "Bridal Jewellery";
      var notes = (document.getElementById("formNotes") || {}).value || "";

      var text = "Namaste Baba Jewellers! I would like to schedule a showroom visit / custom order:%0A%0A" +
        "• Name: " + encodeURIComponent(name) + "%0A" +
        "• Mobile: " + encodeURIComponent(phone) + "%0A" +
        "• Interested In: " + encodeURIComponent(interest) + "%0A" +
        (notes ? ("• Requirements: " + encodeURIComponent(notes) + "%0A%0A") : "%0A") +
        "Please confirm appointment details.";

      window.open("https://wa.me/919168157092?text=" + text, "_blank");
    });
  }

  // 5. Fullscreen Image Lightbox Modal
  var lightbox = document.getElementById("imageLightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  if (lightbox && lightboxImg) {
    var triggers = document.querySelectorAll("[data-lightbox]");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var fullSrc = trigger.getAttribute("data-full");
        var title = trigger.getAttribute("data-title") || "";
        if (!fullSrc) {
          var img = trigger.querySelector("img");
          if (img) fullSrc = img.getAttribute("src");
        }
        if (fullSrc) {
          lightboxImg.src = fullSrc;
          if (lightboxCaption) lightboxCaption.textContent = title;
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
      lightboxImg.src = "";
    }

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});
