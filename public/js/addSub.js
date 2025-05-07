/**
 * Add Sub Module JS
 * Renders the Add Sub form using config options and handles submission.
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

  // No field rendering logic needed; form is rendered in EJS.

  function initAddSub() {

    // Remove any previous event listeners to avoid duplicates
    const oldForm = document.getElementById('addSubForm');
    if (oldForm) {
      const newForm = oldForm.cloneNode(true);
      oldForm.parentNode.replaceChild(newForm, oldForm);
    }
    const form = document.getElementById('addSubForm');
    if (!form) return;

    // Disable submit button by default
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    // Enable submit button only if required fields are filled
    function checkRequiredFields() {
      const requiredFields = [
        "First Name",
        "Last Name",
        "Phone Number",
        "Address",
        "City"
      ];
      let allFilled = true;
      for (const field of requiredFields) {
        const el = form.elements[field];
        if (!el || !el.value.trim()) {
          allFilled = false;
          break;
        }
      }
      if (submitBtn) {
        submitBtn.disabled = !allFilled;
      }
    }

    // Listen for input changes on the form
    form.addEventListener('input', checkRequiredFields);

    // Initial check in case browser autofills
    checkRequiredFields();

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Gather form data using checkboxes for multi-selects, matching manage subs logic
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
          const checkboxes = form.querySelectorAll('input[type="checkbox"][name="' + h + '"]:checked');
          data[h] = Array.from(checkboxes).map(function(cb) { return cb.value; }).join(", ");
        } else {
          const el = form.elements[h];
          data[h] = el ? el.value.trim() : "";
        }
      });
      // Validation: required fields
      if (!data["First Name"] || !data["Last Name"] || !data["Phone Number"] || !data["Referral"] || !data["Address"] || !data["City"] || !data["Home Stories"]) {
        alert("Please fill in all required fields.");
        return;
      }
      // Disable all fields and show loading overlay
      Array.from(form.elements).forEach(function(el) { el.disabled = true; });
      form.classList.add('disabled');
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
            form.reset();
            Array.from(form.elements).forEach(function(el) { el.disabled = false; });
            form.classList.remove('disabled');
            checkRequiredFields();
          }, 2000);
        } else {
          alert("Submission failed: " + (resp.message || "Unknown error"));
          Array.from(form.elements).forEach(function(el) { el.disabled = false; });
          form.classList.remove('disabled');
          checkRequiredFields();
        }
      })
      .catch(function(err) {
        document.getElementById('addSubLoadingOverlay').style.display = 'none';
        document.getElementById('addSubSuccessMsg').style.display = 'none';
        alert("Submission failed: " + (err.message || err));
        Array.from(form.elements).forEach(function(el) { el.disabled = false; });
        form.classList.remove('disabled');
        checkRequiredFields();
      });
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('addSubForm')) {
      initAddSub();
    }
  });
})();
