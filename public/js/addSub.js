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

  function renderAddSubFields(opts) {
    const OPTIONS = {
      "Referral": opts.REFERRAL_SOURCES,
      "Home Stories": opts.HOME_STORIES,
      "Lighting Options": [...opts.LIGHTING_OPTIONS_TEMPORARY, ...opts.LIGHTING_OPTIONS_PERMANENT],
      "Lighting Sides": opts.LIGHTING_SIDES,
      "Measure": opts.MEASURE_OPTIONS,
      "Solar Selected Services": opts.SOLAR_SERVICES,
      "Gutter Selected Service": opts.GUTTER_SERVICES
    };
    let html = '<div class="row w-100">';
    const REQUIRED_FIELDS = [
      "First Name",
      "Last Name",
      "Phone Number",
      "Address",
      "City"
    ];
    let i = 0;
    while (i < SUBS_HEADERS.length) {
      const h = SUBS_HEADERS[i];
      if (h === "Lighting Options") {
        // Lighting Options checkboxes
        const lightingOptionsLabel = `<label class="form-label">Lighting Options</label>`;
        const lightingOptionsInput = OPTIONS["Lighting Options"].map(opt => `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="Lighting Options" value="${opt}" id="addsub-LightingOptions-${opt.replace(/\s+/g, '')}">
            <label class="form-check-label" for="addsub-LightingOptions-${opt.replace(/\s+/g, '')}">${opt}</label>
          </div>
        `).join("");
        // Lighting Sides checkboxes
        const lightingSidesLabel = `<label class="form-label">Lighting Sides</label>`;
        const lightingSidesInput = OPTIONS["Lighting Sides"].map(opt => `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="Lighting Sides" value="${opt}" id="addsub-LightingSides-${opt.replace(/\s+/g, '')}">
            <label class="form-check-label" for="addsub-LightingSides-${opt.replace(/\s+/g, '')}">${opt}</label>
          </div>
        `).join("");
        // Pref Service Date (LIGHTING)
        const prefServiceDateLabel = `<label class="form-label">Pref Service Date (LIGHTING)</label>`;
        const prefServiceDateInput = `<input type="date" class="form-control" name="Pref Service Date (LIGHTING)">`;
        // Measure
        const measureLabel = `<label class="form-label">Measure</label>`;
        const measureInput = `<select class="form-select" name="Measure">` +
          OPTIONS["Measure"].map(opt => `<option value="${opt}">${opt}</option>`).join("") +
          `</select>`;
        // Lighting notes
        const lightingNotesLabel = `<label class="form-label">Lighting notes</label>`;
        const lightingNotesInput = `<textarea class="form-control" name="Lighting notes" rows="4"></textarea>`;

        html += `
        </div>
        <div class="row w-100">
          <div class="col-md-6 mb-3" style="display:flex; gap:16px;">
            <div style="flex:1; min-width:0;">
              ${lightingOptionsLabel}
              ${lightingOptionsInput}
            </div>
            <div style="flex:1; min-width:0;">
              ${lightingSidesLabel}
              ${lightingSidesInput}
            </div>
          </div>
          <div class="col-md-3 mb-3">
            ${prefServiceDateLabel}
            ${prefServiceDateInput}
            ${measureLabel}
            ${measureInput}
          </div>
          <div class="col-md-3 mb-3" style="display:flex; flex-direction:column; height:100%;">
            ${lightingNotesLabel}
            ${lightingNotesInput}
          </div>
        </div>
        <div class="row w-100">
        `;
        i += 5;
        continue;
      }
      if (
        h === "Lighting Sides" ||
        h === "Pref Service Date (LIGHTING)" ||
        h === "Measure" ||
        h === "Lighting notes"
      ) {
        i++;
        continue;
      }
      if (h === "Solar Selected Services") {
        const solarServicesLabel = `<label class="form-label">Solar Selected Services</label>`;
        const solarServicesInput = OPTIONS["Solar Selected Services"].map(opt => `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="Solar Selected Services" value="${opt}" id="addsub-SolarSelectedServices-${opt.replace(/\s+/g, '')}">
            <label class="form-check-label" for="addsub-SolarSelectedServices-${opt.replace(/\s+/g, '')}">${opt}</label>
          </div>
        `).join("");
        const prefServiceDateSolarLabel = `<label class="form-label">Pref Service Date (SOLAR)</label>`;
        const prefServiceDateSolarInput = `<input type="date" class="form-control" name="Pref Service Date (SOLAR)">`;
        const solarPanelsLabel = `<label class="form-label">Solar Panels</label>`;
        const solarPanelsInput = `<input type="number" class="form-control" name="Solar Panels">`;
        const solarNotesLabel = `<label class="form-label">Solar notes</label>`;
        const solarNotesInput = `<textarea class="form-control" name="Solar notes" rows="2"></textarea>`;

        html += `
        </div>
        <div class="row w-100">
          <div class="col-md-3 mb-3">
            ${solarServicesLabel}
            ${solarServicesInput}
          </div>
          <div class="col-md-3 mb-3">
            ${prefServiceDateSolarLabel}
            ${prefServiceDateSolarInput}
          </div>
          <div class="col-md-3 mb-3">
            ${solarPanelsLabel}
            ${solarPanelsInput}
          </div>
          <div class="col-md-3 mb-3">
            ${solarNotesLabel}
            ${solarNotesInput}
          </div>
        </div>
        <div class="row w-100">
        `;
        i += 4;
        continue;
      }
      if (
        h === "Pref Service Date (SOLAR)" ||
        h === "Solar Panels" ||
        h === "Solar notes"
      ) {
        i++;
        continue;
      }
      const isRequired = REQUIRED_FIELDS.includes(h);
      const label = `<label class="form-label">${h}${isRequired ? ' <span style="color:red">*</span>' : ''}</label>`;
      let input = "";
      const type = FIELD_TYPE[h] || "text";
      if (type === "textarea") {
        input = `<textarea class="form-control" name="${h}" rows="2"></textarea>`;
      } else if (type === "date") {
        input = `<input type="date" class="form-control" name="${h}">`;
      } else if (type === "email") {
        input = `<input type="email" class="form-control" name="${h}">`;
      } else if (type === "tel") {
        input = `<input type="tel" class="form-control" name="${h}">`;
      } else if (type === "number") {
        input = `<input type="number" class="form-control" name="${h}">`;
      } else if (type === "single-select" && OPTIONS[h]) {
        input = `<select class="form-select" name="${h}">` +
          OPTIONS[h].map(opt => `<option value="${opt}">${opt}</option>`).join("") +
          `</select>`;
      } else if (type === "multi-select" && OPTIONS[h]) {
        input = OPTIONS[h].map(opt => `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="${h}" value="${opt}" id="addsub-${h}-${opt.replace(/\s+/g, '')}">
            <label class="form-check-label" for="addsub-${h}-${opt.replace(/\s+/g, '')}">${opt}</label>
          </div>
        `).join("");
      } else {
        input = `<input type="text" class="form-control" name="${h}">`;
      }
      html += `<div class="col-md-3 mb-3">${label}${input}</div>`;
      if ((i + 1) % 4 === 0 && i !== SUBS_HEADERS.length - 1) {
        html += '</div><div class="row w-100">';
      }
      i++;
    }
    html += '</div>';
    document.getElementById('addSubFields').innerHTML = html;
  }

  function getConfigOptions() {
    if (window.SUBS_FORM_OPTIONS) {
      renderAddSubFields(window.SUBS_FORM_OPTIONS);
    } else {
      // fallback
      renderAddSubFields({
        REFERRAL_SOURCES: ["Yelp", "Referral", "Google", "Instagram", "Facebook", "NextDoor"],
        HOME_STORIES: ["1 Story", "2 Story", "3 Story", "Commercial"],
        LIGHTING_OPTIONS_TEMPORARY: ["Temporary Installation", "Temporary Takedown", "Temporary Service"],
        LIGHTING_OPTIONS_PERMANENT: ["Permanent Installation", "Permanent Takedown", "Permanent Service", "Garage/Doorway Lighting"],
        LIGHTING_SIDES: ["Fence", "Bottom Back", "Back Side", "Left Side", "Right Side", "Front Side"],
        MEASURE_OPTIONS: ["Yes please!", "No thanks!"],
        SOLAR_SERVICES: ["Solar Cleaning", "Solar Mesh"],
        GUTTER_SERVICES: ["Full Gutter Cleaning", "Partial Gutter Cleaning"]
      });
    }
  }

  function initAddSub() {
    getConfigOptions();

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
