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

  // --- Event Listeners and Logic ---

  // Utility: Check for modal visibility conflicts
  function checkModalVisibilityIssues(modal) {
    let el = modal;
    let i = 0;
    while (el && el !== document.body && i < 10) {
      const cs = window.getComputedStyle(el);
      if (el.classList.contains('invisible')) {
        console.warn('Modal or parent has class "invisible":', el);
      }
      if (cs.overflow === 'hidden') {
        console.warn('Modal or parent has overflow:hidden:', el);
      }
      if (cs.zIndex === '0') {
        console.warn('Modal or parent has z-index:0:', el);
      }
      if (cs.display === 'none') {
        console.warn('Modal or parent has display:none:', el);
      }
      if (cs.visibility === 'hidden') {
        console.warn('Modal or parent has visibility:hidden:', el);
      }
      el = el.parentElement;
      i++;
    }
  }

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
    // Check for modal visibility issues
    checkModalVisibilityIssues(addSubModal);
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
  // (Removed: no longer supports editing subs)
});
