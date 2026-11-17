/* ==========================================================================
   AL-ALSON SCHOOL — client-side form validation
   Applies to every <form data-validate>. Validation runs locally and no
   data is submitted anywhere; the success panel states this explicitly.
   ========================================================================== */

(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_PATTERN = /^[+()\-\s\d]{7,20}$/;

  function setError(field, message) {
    var wrapper = field.closest(".field");
    if (!wrapper) return;
    var msg = wrapper.querySelector(".field-msg");

    wrapper.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
    if (msg) msg.textContent = message;
  }

  function clearError(field) {
    var wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    // Checkboxes are valid when ticked (if required), regardless of value.
    if (field.type === "checkbox") {
      if (field.hasAttribute("data-required") && !field.checked) {
        setError(field, "Please tick this box to continue.");
        return false;
      }
      clearError(field);
      return true;
    }

    var value = field.value.trim();
    var required = field.hasAttribute("data-required");

    if (required && !value) {
      setError(field, "This field is required.");
      return false;
    }
    if (value && field.type === "email" && !EMAIL_PATTERN.test(value)) {
      setError(field, "Please enter a valid email address, e.g. name@example.com.");
      return false;
    }
    if (value && field.type === "tel" && !PHONE_PATTERN.test(value)) {
      setError(field, "Please enter a valid phone number.");
      return false;
    }
    if (field.hasAttribute("data-minlength") && value.length < Number(field.getAttribute("data-minlength"))) {
      setError(field, "Please write at least " + field.getAttribute("data-minlength") + " characters.");
      return false;
    }
    clearError(field);
    return true;
  }

  function initForm(form) {
    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input, select, textarea")
    );
    var successPanel = document.getElementById(form.getAttribute("data-success-target") || "");

    form.setAttribute("novalidate", "novalidate");

    // Clear an error as soon as the user edits the field again.
    fields.forEach(function (field) {
      field.addEventListener("input", function () { clearError(field); });
      field.addEventListener("change", function () { clearError(field); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        var ok = validateField(field);
        if (!ok && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      if (successPanel) {
        form.hidden = true;
        successPanel.classList.add("is-visible");
        successPanel.setAttribute("tabindex", "-1");
        successPanel.focus();
        return;
      }

      // Fallback if no success panel is present.
      form.reset();
    });
  }

  document.querySelectorAll("form[data-validate]").forEach(initForm);
})();
