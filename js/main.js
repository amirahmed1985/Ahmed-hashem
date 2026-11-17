/* ==========================================================================
   AL-ALSON SCHOOL — shared site behaviour
   1. Sticky header state      4. Content filters (news page)
   2. Mobile navigation        5. FAQ accordion
   3. Scroll reveal            6. Image fallbacks + footer year
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Sticky header ------------------------------------------------------ */

  var header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 2. Mobile navigation --------------------------------------------------- */

  var toggle = document.querySelector(".nav-toggle");

  function closeNav() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close when a panel link is chosen, or when Escape is pressed.
    document.querySelectorAll(".mobile-panel a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // Reset state if resized up to desktop.
    window.matchMedia("(min-width: 941px)").addEventListener("change", closeNav);
  }

  /* 3. Scroll reveal -------------------------------------------------------- */

  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* 4. Content filters (news page) ------------------------------------------ */

  var filterButtons = document.querySelectorAll(".filter-btn");
  var filterItems = document.querySelectorAll("[data-type]");

  if (filterButtons.length && filterItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        filterButtons.forEach(function (other) {
          other.classList.toggle("is-active", other === btn);
          other.setAttribute("aria-pressed", String(other === btn));
        });

        filterItems.forEach(function (item) {
          var type = item.getAttribute("data-type");
          var show = filter === "all" || type === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* 5. FAQ accordion ---------------------------------------------------------- */

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!button || !panel) return;

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";

      // Close the others so only one answer reads at a time.
      document.querySelectorAll('.faq-item[data-open="true"]').forEach(function (openItem) {
        if (openItem === item) return;
        openItem.setAttribute("data-open", "false");
        openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-a").style.maxHeight = "0px";
      });

      item.setAttribute("data-open", String(!isOpen));
      button.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
    });
  });

  /* 6. Image fallbacks + footer year ------------------------------------------ */

  // If a photograph fails to load (e.g. placeholder URL), show a clearly
  // marked stand-in instead of a broken-image icon.
  document.addEventListener(
    "error",
    function (event) {
      var img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";

      var box = document.createElement("div");
      box.className = "img-fallback";
      box.textContent = "School photograph — replace placeholder";
      img.replaceWith(box);
    },
    true
  );

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
