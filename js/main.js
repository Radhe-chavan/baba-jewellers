// ============================================================================
// Baba Jewellers — Interactive UI & Hero Slider
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. Dynamic Year in Footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    var navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
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

  // 4. Fullscreen Image Lightbox Modal
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
