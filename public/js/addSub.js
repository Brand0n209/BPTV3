/**
 * Add Sub Module JS
 * Handles validation, error feedback, and submission for the Add Sub form.
 * Requires window.SUBS_FORM_OPTIONS to be defined.
 */
(function() {
  // Field definitions
  const SUBS_HEADERS = [
    "First Name", "Last Name", "Phone Number", "Email", "Referral", "Address", "City", "Home Stories",
    "Lighting Options", "Lighting Sides", "Pref Service Date (LIGHTING)", "Measure", "Lighting notes",
    "Solar Selected Services", "Pref Service Date (SOLAR)", "Solar Panels", "Solar notes",
    "Gutter Selected Service", "Pref Service Date (GUTTER)", "Gutter notes"
  ];
  const FIELD_TYPE = {
    "Referral": "single-select",
    "Home Stories": "single-select",
    "Lighting Options": "multi-select",
    "Lighting Sides": "multi-select",
    "Measure": "single-select",
    "Solar Selected Services": "multi-select",
    "Gutter Selected Service": "multi-select",
    "Pref Service Date (LIGHTING)": "date",
    "Pref Service Date (SOLAR)": "date",
    "Pref Service Date (GUTTER)": "date",
    "Solar Panels": "number",
    "Email": "email",
    "Phone Number": "tel",
    "Lighting notes": "textarea",
    "Solar notes": "textarea",
    "Gutter notes": "textarea",
    "Address": "text",
    "City": "text",
    "First Name": "text",
    "Last Name": "text"
  };

  // Required fields for validation
  const REQUIRED_FIELDS = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Address",
    "City",
    "Home Stories"
  ];

  // Utility: get error element for a field
  function getErrorElem(fieldName) {
    // Convert fieldName to camelCase id or custom for checkboxes
    switch (fieldName) {
      case "First Name": return document.getElementById("firstName-error");
      case "Last Name": return document.getElementById("lastName-error");
      case "Phone Number": return document.getElementById("phoneNumber-error");
      case "Email": return document.getElementById("email-error");
      case "Address": return document.getElementById("address-error");
      case "City": return document.getElementById("city-error");
      case "Home Stories": return document.getElementById("homeStories-error");
      case "Lighting Options": return document.getElementById("addsub-LightingOptions-error");
      case "Lighting Sides": return document.getElementById("addsub-LightingSides-error");
      case "Pref Service Date (LIGHTING)": return document.getElementById("prefServiceDateLighting-error");
      case "Measure": return document.getElementById("measure-error");
      case "Lighting notes": return document.getElementById("lightingNotes-error");
      case "Solar Selected Services": return document.getElementById("addsub-SolarSelectedServices-error");
      case "Pref Service Date (SOLAR)": return document.getElementById("prefServiceDateSolar-error");
      case "Solar Panels": return document.getElementById("solarPanels-error");
      case "Solar notes": return document.getElementById("solarNotes-error");
      case "Gutter Selected Service": return document.getElementById("addsub-GutterSelectedService-error");
      case "Pref Service Date (GUTTER)": return document.getElementById("prefServiceDateGutter-error");
      case "Gutter notes": return document.getElementById("gutterNotes-error");
      default: return null;
    }
  }

  // Utility: get input element(s) for a field
  function getFieldElem(form, fieldName) {
    if (FIELD_TYPE[fieldName] === "multi-select") {
      return form.querySelectorAll('input[type="checkbox"][name="' + fieldName + '"]');
    }
    return form.elements[fieldName];
  }

  // Show error for a field
  function showError(fieldName, message, form) {
    const errorElem = getErrorElem(fieldName);
    const fieldElem = getFieldElem(form, fieldName);
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.classList.remove("hidden");
    }
    if (fieldElem) {
      if (fieldElem.length) {
        fieldElem.forEach(el => {
          el.classList.add("border-red-500");
          el.setAttribute("aria-invalid", "true");
        });
      } else {
        fieldElem.classList.add("border-red-500");
        fieldElem.setAttribute("aria-invalid", "true");
      }
    }
  }

  // Clear error for a field
  function clearError(fieldName, form) {
    const errorElem = getErrorElem(fieldName);
    const fieldElem = getFieldElem(form, fieldName);
    if (errorElem) {
      errorElem.textContent = "";
      errorElem.classList.add("hidden");
    }
    if (fieldElem) {
      if (fieldElem.length) {
        fieldElem.forEach(el => {
          el.classList.remove("border-red-500");
          el.removeAttribute("aria-invalid");
        });
      } else {
        fieldElem.classList.remove("border-red-500");
        fieldElem.removeAttribute("aria-invalid");
      }
    }
  }

  // Validate all required fields, show errors, return true if valid
  function validateForm(form) {
    let valid = true;
    // Validate required fields
    REQUIRED_FIELDS.forEach(field => {
      clearError(field, form);
      const fieldElem = getFieldElem(form, field);
      let value = "";
      if (FIELD_TYPE[field] === "multi-select") {
        const checked = Array.from(fieldElem).filter(cb => cb.checked);
        value = checked.length ? "checked" : "";
      } else {
        value = fieldElem && fieldElem.value ? fieldElem.value.trim() : "";
      }
      if (!value) {
        showError(field, "This field is required.", form);
        valid = false;
      }
    });
    // Email format (optional, but if present, must be valid)
    const emailElem = form.elements["Email"];
    if (emailElem && emailElem.value.trim()) {
      clearError("Email", form);
      const emailVal = emailElem.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal)) {
        showError("Email", "Please enter a valid email address.", form);
        valid = false;
      }
    }
    // Phone format (basic)
    const phoneElem = form.elements["Phone Number"];
    if (phoneElem && phoneElem.value.trim()) {
      clearError("Phone Number", form);
      const phoneVal = phoneElem.value.trim();
      if (!/^\d{10,}$/.test(phoneVal.replace(/\D/g, ""))) {
        showError("Phone Number", "Please enter a valid phone number.", form);
        valid = false;
      }
    }
    return valid;
  }

  // Clear all errors
  function clearAllErrors(form) {
    SUBS_HEADERS.forEach(field => clearError(field, form));
  }

  function initAddSub() {
    const form = document.getElementById('addSubForm');
    if (!form) return;

    // Remove any previous event listeners to avoid duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    const submitBtn = newForm.querySelector('button[type="submit"]');

    // Enable submit button only if required fields are filled
    function checkRequiredFields() {
      let allFilled = true;
      for (const field of REQUIRED_FIELDS) {
        const el = getFieldElem(newForm, field);
        if (FIELD_TYPE[field] === "multi-select") {
          const checked = Array.from(el).filter(cb => cb.checked);
          if (!checked.length) {
            allFilled = false;
            break;
          }
        } else {
          if (!el || !el.value.trim()) {
            allFilled = false;
            break;
          }
        }
      }
      if (submitBtn) {
        submitBtn.disabled = !allFilled;
      }
    }

    // Listen for input changes on the form to clear errors and enable submit
    newForm.addEventListener('input', function(e) {
      const fieldName = e.target.name;
      if (fieldName) {
        clearError(fieldName, newForm);
      }
      checkRequiredFields();
    });

    // Initial check in case browser autofills
    checkRequiredFields();

    newForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearAllErrors(newForm);

      // Gather form data using checkboxes for multi-selects
      const data = {};
      const MULTI_FIELDS = [
        "Lighting Options",
        "Lighting Sides",
        "Solar Selected Services",
        "Gutter Selected Service"
      ];
      SUBS_HEADERS.forEach(function(h) {
        if (MULTI_FIELDS.includes(h)) {
          // Collect all checked values and join with ", "
          const checkboxes = newForm.querySelectorAll('input[type="checkbox"][name="' + h + '"]:checked');
          data[h] = Array.from(checkboxes).map(function(cb) { return cb.value; }).join(", ");
        } else {
          const el = newForm.elements[h];
          data[h] = el ? el.value.trim() : "";
        }
      });

      // Validate fields and show errors
      if (!validateForm(newForm)) {
        // Focus first error field
        for (const field of REQUIRED_FIELDS) {
          const errorElem = getErrorElem(field);
          if (errorElem && !errorElem.classList.contains("hidden")) {
            const fieldElem = getFieldElem(newForm, field);
            if (fieldElem && fieldElem.length) {
              fieldElem[0].focus();
            } else if (fieldElem) {
              fieldElem.focus();
            }
            break;
          }
        }
        return;
      }

      // Disable all fields and show loading overlay
      Array.from(newForm.elements).forEach(function(el) { el.disabled = true; });
      newForm.classList.add('disabled');
      document.getElementById('addSubLoadingOverlay').style.display = 'flex';
      document.getElementById('addSubSuccessMsg').style.display = 'none';

      // Submit to backend via AJAX
      fetch('/admin/subs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function(resp) { return resp.json(); })
      .then(function(resp) {
        document.getElementById('addSubLoadingOverlay').style.display = 'none';
        if (resp.success) {
          document.getElementById('addSubSuccessMsg').style.display = 'block';
          setTimeout(function() {
            document.getElementById('addSubSuccessMsg').style.display = 'none';
            newForm.reset();
            Array.from(newForm.elements).forEach(function(el) { el.disabled = false; });
            newForm.classList.remove('disabled');
            checkRequiredFields();
          }, 2000);
        } else {
          // Show server error as a general error
          alert("Submission failed: " + (resp.message || "Unknown error"));
          Array.from(newForm.elements).forEach(function(el) { el.disabled = false; });
          newForm.classList.remove('disabled');
          checkRequiredFields();
        }
      })
      .catch(function(err) {
        document.getElementById('addSubLoadingOverlay').style.display = 'none';
        document.getElementById('addSubSuccessMsg').style.display = 'none';
        alert("Submission failed: " + (err.message || err));
        Array.from(newForm.elements).forEach(function(el) { el.disabled = false; });
        newForm.classList.remove('disabled');
        checkRequiredFields();
      });
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('addSubForm')) {
      // Always hide overlays on load
      var loading = document.getElementById('addSubLoadingOverlay');
      var success = document.getElementById('addSubSuccessMsg');
      if (loading) loading.classList.add('hidden');
      if (success) success.classList.add('hidden');
      initAddSub();
    }
  });
})();

