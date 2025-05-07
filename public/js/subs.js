/**
 * Subs Management Frontend Logic
 * Handles Add/Edit/Delete Sub modals and form submissions.
 * Requires window.SUBS_FORM_OPTIONS to be defined.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Modal elements
  const addSubBtn = document.getElementById('addSubBtn');
  const addSubModal = document.getElementById('addSubModal');
  const closeAddSubModal = document.getElementById('closeAddSubModal');
  const addSubModalContent = document.getElementById('addSubModalContent');

  const editSubModal = document.getElementById('editSubModal');
  const closeEditSubModal = document.getElementById('closeEditSubModal');
  const editSubModalContent = document.getElementById('editSubModalContent');

  // Open Add Sub Modal
  addSubBtn && addSubBtn.addEventListener('click', function () {
    // Always hide the main content area (table/search) using Tailwind classes
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.classList.add('hidden');
      contentArea.classList.remove('block');
    }
    renderAddSubForm();
    // Always show the modal using Tailwind classes
    addSubModal.classList.remove('hidden');
    addSubModal.classList.add('block');
  });

  // Close Add Sub Modal
  closeAddSubModal && closeAddSubModal.addEventListener('click', function () {
    addSubModal.classList.add('hidden');
    addSubModal.classList.remove('block');
    addSubModalContent.innerHTML = '';
    // Restore table/search area using Tailwind classes
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.classList.remove('hidden');
      contentArea.classList.add('block');
    }
  });

  // Close Edit Sub Modal
  closeEditSubModal && closeEditSubModal.addEventListener('click', function () {
    editSubModal.classList.add('hidden');
    editSubModal.classList.remove('block');
    editSubModalContent.innerHTML = '';
    // Restore table/search area using Tailwind classes
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.classList.remove('hidden');
      contentArea.classList.add('block');
    }
  });

  // Close modals on background click
  [addSubModal, editSubModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('block');
          modal.querySelector('div.relative').innerHTML = '';
          // Restore table/search area using Tailwind classes
          const contentArea = document.querySelector('.content-area');
          if (contentArea) {
            contentArea.classList.remove('hidden');
            contentArea.classList.add('block');
          }
        }
      });
    }
  });

  // Make table rows clickable for editing
  document.querySelectorAll('.sub-row').forEach(row => {
    row.addEventListener('click', function () {
      // Always hide the main content area (table/search) using Tailwind classes
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        contentArea.classList.add('hidden');
        contentArea.classList.remove('block');
      }
      const table = row.closest('table');
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
      const values = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
      const rowData = {};
      headers.forEach((h, i) => { rowData[h] = values[i]; });
      // Pass unique fields for backend matching
      renderEditSubForm(rowData);
      // Always show the modal using Tailwind classes
      editSubModal.classList.remove('hidden');
      editSubModal.classList.add('block');
    });
  });

  // Render Add Sub Form
  function renderAddSubForm() {
    const opts = window.SUBS_FORM_OPTIONS || {};
    addSubModalContent.innerHTML = getSubFormHTML('add', {}, opts);

    // Add event listener for form submission
    const form = addSubModalContent.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleAddSubSubmit(form);
    });
  }

  // Render Edit Sub Form
  function renderEditSubForm(rowData) {
    const opts = window.SUBS_FORM_OPTIONS || {};
    editSubModalContent.innerHTML = getSubFormHTML('edit', rowData, opts);

    // Add event listeners for update and delete
    const form = editSubModalContent.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleEditSubSubmit(form, rowData);
    });
    const deleteBtn = editSubModalContent.querySelector('#deleteSubBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this sub? This cannot be undone.')) {
          handleDeleteSub(rowData);
        }
      });
    }
  }

  // Generate Sub Form HTML (Add/Edit)
  function getSubFormHTML(mode, data, opts) {
    // mode: 'add' or 'edit'
    // data: rowData for edit, {} for add
    // opts: SUBS_FORM_OPTIONS
    const isEdit = mode === 'edit';
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
    const OPTIONS = {
      "Referral": opts.REFERRAL_SOURCES || [],
      "Home Stories": opts.HOME_STORIES || [],
      "Lighting Options": [
        ...(opts.LIGHTING_OPTIONS_TEMPORARY || []),
        ...(opts.LIGHTING_OPTIONS_PERMANENT || [])
      ],
      "Lighting Sides": opts.LIGHTING_SIDES || [],
      "Measure": opts.MEASURE_OPTIONS || [],
      "Solar Selected Services": opts.SOLAR_SERVICES || [],
      "Gutter Selected Service": opts.GUTTER_SERVICES || []
    };
    let html = `<form autocomplete="off" class="space-y-4 relative">`;
    html += `<h2 class="text-xl font-bold mb-2">${isEdit ? 'Edit Sub' : 'Add Sub'}</h2>`;
    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
    SUBS_HEADERS.forEach(h => {
      const val = (data && data[h]) ? data[h] : '';
      const type = FIELD_TYPE[h] || "text";
      html += `<div>`;
      html += `<label class="block font-medium mb-1">${h}</label>`;
      if (type === "textarea") {
        html += `<textarea name="${h}" class="form-control w-full border rounded p-2" rows="2">${val}</textarea>`;
      } else if (type === "date") {
        html += `<input type="date" name="${h}" class="form-control w-full border rounded p-2" value="${val}">`;
      } else if (type === "email") {
        html += `<input type="email" name="${h}" class="form-control w-full border rounded p-2" value="${val}">`;
      } else if (type === "tel") {
        html += `<input type="tel" name="${h}" class="form-control w-full border rounded p-2" value="${val}">`;
      } else if (type === "number") {
        html += `<input type="number" name="${h}" class="form-control w-full border rounded p-2" value="${val}">`;
      } else if (type === "single-select" && OPTIONS[h]) {
        html += `<select name="${h}" class="form-select w-full border rounded p-2">`;
        OPTIONS[h].forEach(opt => {
          html += `<option value="${opt}"${val === opt ? ' selected' : ''}>${opt}</option>`;
        });
        html += `</select>`;
      } else if (type === "multi-select" && OPTIONS[h]) {
        const selected = typeof val === "string" ? val.split(/\s*,\s*/).map(s => s.trim()) : [];
        OPTIONS[h].forEach(opt => {
          html += `<label class="inline-flex items-center mr-2"><input type="checkbox" name="${h}" value="${opt}"${selected.includes(opt) ? ' checked' : ''}> ${opt}</label>`;
        });
      } else {
        html += `<input type="text" name="${h}" class="form-control w-full border rounded p-2" value="${val}">`;
      }
      html += `</div>`;
    });
    html += `</div>`;
    html += `<div class="flex space-x-2 mt-4">`;
    html += `<button type="submit" class="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">${isEdit ? 'Update' : 'Submit'}</button>`;
    if (isEdit) {
      html += `<button type="button" id="deleteSubBtn" class="btn btn-danger px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 ml-2">Delete</button>`;
    }
    html += `</div>`;
    html += `<div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 hidden" id="${isEdit ? 'editSubLoading' : 'addSubLoading'}"><div class="text-blue-600 font-bold">Processing...</div></div>`;
    html += `<div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-20 hidden" id="${isEdit ? 'editSubSuccess' : 'addSubSuccess'}">Success!</div>`;
    html += `</form>`;
    return html;
  }

  // Handle Add Sub Submit
  function handleAddSubSubmit(form) {
    const data = getFormData(form);
    const loading = form.querySelector('#addSubLoading');
    const success = form.querySelector('#addSubSuccess');
    loading && loading.classList.remove('hidden');
    fetch('/admin/subs/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(resp => {
        loading && loading.classList.add('hidden');
        if (resp.success) {
          success && (success.textContent = 'Submission successful!');
          success && success.classList.remove('hidden');
          setTimeout(() => {
            success && success.classList.add('hidden');
            form.reset();
            document.getElementById('addSubModal').classList.add('hidden');
            // Restore table/search area using Tailwind classes
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
              contentArea.classList.remove('hidden');
              contentArea.classList.add('block');
            }
            window.location.reload();
          }, 1200);
        } else {
          alert(resp.message || 'Submission failed.');
        }
      }).catch(err => {
        loading && loading.classList.add('hidden');
        alert('Submission failed: ' + err.message);
      });
  }

  // Handle Edit Sub Submit
  function handleEditSubSubmit(form, rowData) {
    const data = getFormData(form);
    // Add unique fields for backend matching
    data["Sub Date"] = rowData["Sub Date"] || rowData["Pref Service Date (LIGHTING)"] || "";
    data["First Name"] = rowData["First Name"] || "";
    data["Last Name"] = rowData["Last Name"] || "";
    const loading = form.querySelector('#editSubLoading');
    const success = form.querySelector('#editSubSuccess');
    loading && loading.classList.remove('hidden');
    fetch('/admin/subs/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(resp => {
        loading && loading.classList.add('hidden');
        if (resp.success) {
          success && (success.textContent = 'Update successful!');
          success && success.classList.remove('hidden');
          setTimeout(() => {
            success && success.classList.add('hidden');
            form.reset();
            document.getElementById('editSubModal').classList.add('hidden');
            // Restore table/search area using Tailwind classes
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
              contentArea.classList.remove('hidden');
              contentArea.classList.add('block');
            }
            window.location.reload();
          }, 1200);
        } else {
          alert(resp.message || 'Update failed.');
        }
      }).catch(err => {
        loading && loading.classList.add('hidden');
        alert('Update failed: ' + err.message);
      });
  }

  // Handle Delete Sub
  function handleDeleteSub(rowData) {
    const loading = document.getElementById('editSubLoading');
    const success = document.getElementById('editSubSuccess');
    loading && loading.classList.remove('hidden');
    fetch('/admin/subs/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "Sub Date": rowData["Sub Date"] || rowData["Pref Service Date (LIGHTING)"] || "",
        "First Name": rowData["First Name"] || "",
        "Last Name": rowData["Last Name"] || ""
      })
    }).then(res => res.json())
      .then(resp => {
        loading && loading.classList.add('hidden');
        if (resp.success) {
          success && (success.textContent = 'Delete successful!');
          success && success.classList.remove('hidden');
          setTimeout(() => {
            success && success.classList.add('hidden');
            document.getElementById('editSubModal').classList.add('hidden');
            // Restore table/search area using Tailwind classes
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
              contentArea.classList.remove('hidden');
              contentArea.classList.add('block');
            }
            window.location.reload();
          }, 1200);
        } else {
          alert(resp.message || 'Delete failed.');
        }
      }).catch(err => {
        loading && loading.classList.add('hidden');
        alert('Delete failed: ' + err.message);
      });
  }

  // Utility: Get form data as object, handling multi-selects
  function getFormData(form) {
    const data = {};
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      // If multiple checkboxes with same name, join as comma-separated
      if (data[key]) {
        data[key] += ', ' + value;
      } else {
        data[key] = value;
      }
    }
    // For checkboxes not checked, ensure empty string
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (!formData.has(cb.name)) {
        if (!data[cb.name]) data[cb.name] = '';
      }
    });
    return data;
  }
});
