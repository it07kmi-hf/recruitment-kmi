// Global variables
let isProcessing = false;

// Utility Functions
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

function showLoading(message = 'Processing...', subtitle = '') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: message,
            html: subtitle ? `<div style="text-align: center;"><p>${subtitle}</p></div>` : '',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    } else {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }
}

function hideLoading() {
   if (typeof Swal !== 'undefined') {
       Swal.close();
   } else {
       const loadingOverlay = document.getElementById('loadingOverlay');
       if (loadingOverlay) {
           loadingOverlay.style.display = 'none';
       }
   }
}

function showSuccess(title, message, timer = 3000) {
   if (typeof Swal !== 'undefined') {
       return Swal.fire({
           title: title,
           html: message,
           icon: 'success',
           timer: timer,
           showConfirmButton: timer > 5000,
           timerProgressBar: true
       });
   } else {
       alert(title + ': ' + message);
       return Promise.resolve();
   }
}

function showError(title, message) {
   if (typeof Swal !== 'undefined') {
       return Swal.fire({
           title: title,
           html: message,
           icon: 'error',
           confirmButtonText: 'OK'
       });
   } else {
       alert(title + ': ' + message);
       return Promise.resolve();
   }
}

async function makeRequest(url, options = {}) {
   if (isProcessing) {
       showError('Sedang Diproses', 'Harap tunggu operasi sebelumnya selesai');
       return null;
   }

   isProcessing = true;

   try {
       const defaultOptions = {
           headers: {
               'Content-Type': 'application/json',
               'X-CSRF-TOKEN': getCSRFToken(),
               'Accept': 'application/json'
           }
       };

       const response = await fetch(url, { ...defaultOptions, ...options });
       
       if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
       }

       return await response.json();
   } catch (error) {
       console.error('Request error:', error);
       throw error;
   } finally {
       isProcessing = false;
   }
}

// Sidebar Functionality
function initializeSidebar() {
   const sidebarToggle = document.getElementById('sidebarToggle');
   const sidebar = document.getElementById('sidebar');
   const mainContent = document.getElementById('mainContent');
   const mobileOverlay = document.getElementById('mobileOverlay');

   if (!sidebarToggle || !sidebar || !mainContent) return;

   function toggleSidebar() {
       const isMobile = window.innerWidth <= 768;
       
       if (isMobile) {
           sidebar.classList.toggle('show');
           if (mobileOverlay) {
               mobileOverlay.classList.toggle('show');
           }
       } else {
           sidebar.classList.toggle('collapsed');
           mainContent.classList.toggle('expanded');
       }
   }

   function closeMobileSidebar() {
       if (window.innerWidth <= 768) {
           sidebar.classList.remove('show');
           if (mobileOverlay) {
               mobileOverlay.classList.remove('show');
           }
       }
   }

   sidebarToggle.addEventListener('click', toggleSidebar);

   // Close mobile sidebar when clicking overlay
   if (mobileOverlay) {
       mobileOverlay.addEventListener('click', closeMobileSidebar);
   }

   // Handle window resize
   let resizeTimeout;
   window.addEventListener('resize', () => {
       clearTimeout(resizeTimeout);
       resizeTimeout = setTimeout(() => {
           if (window.innerWidth > 768) {
               sidebar.classList.remove('show');
               if (mobileOverlay) {
                   mobileOverlay.classList.remove('show');
               }
           } else {
               sidebar.classList.remove('collapsed');
               mainContent.classList.remove('expanded');
           }
       }, 100);
   });

   // Close mobile sidebar when clicking nav links
   const navLinks = sidebar.querySelectorAll('.nav-link');
   navLinks.forEach(link => {
       link.addEventListener('click', () => {
           if (window.innerWidth <= 768) {
               setTimeout(closeMobileSidebar, 100);
           }
       });
   });
}

// Filter Functionality
function initializeFilters() {
   const filterToggle = document.getElementById('filterToggle');
   const filterContent = document.getElementById('filterContent');
   const searchInput = document.getElementById('searchInput');
   const statusFilter = document.getElementById('statusFilter');
   const positionFilter = document.getElementById('positionFilter');
   const testStatusFilter = document.getElementById('testStatusFilter');
   const kraeplinCategoryFilter = document.getElementById('kraeplinCategoryFilter');
   const discTypeFilter = document.getElementById('discTypeFilter');
   
   let searchTimeout;

   // Mobile filter toggle
   if (filterToggle && filterContent) {
       filterToggle.addEventListener('click', () => {
           const isCollapsed = filterContent.classList.contains('collapsed');
           filterContent.classList.toggle('collapsed');
           filterToggle.classList.toggle('collapsed');
           
           // Store preference
           if (window.innerWidth <= 768) {
               localStorage.setItem('filterCollapsed', isCollapsed ? 'false' : 'true');
           }
       });

       // Initialize mobile filter state
       if (window.innerWidth <= 768) {
           const savedState = localStorage.getItem('filterCollapsed');
           if (savedState === 'true') {
               filterContent.classList.add('collapsed');
               filterToggle.classList.add('collapsed');
           }
       }
   }

   function applyFilters() {
       clearTimeout(searchTimeout);
       searchTimeout = setTimeout(() => {
           const params = new URLSearchParams();
           
           if (searchInput && searchInput.value.trim()) {
               params.append('search', searchInput.value.trim());
           }
           if (statusFilter && statusFilter.value) {
               params.append('status', statusFilter.value);
           }
           if (positionFilter && positionFilter.value) {
               params.append('position', positionFilter.value);
           }
           if (testStatusFilter && testStatusFilter.value) {
               params.append('test_status', testStatusFilter.value);
           }
           if (kraeplinCategoryFilter && kraeplinCategoryFilter.value) {
               params.append('kraeplin_category', kraeplinCategoryFilter.value);
           }
           if (discTypeFilter && discTypeFilter.value) {
               params.append('disc_type', discTypeFilter.value);
           }
           
           const baseUrl = window.location.pathname;
           const newUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
           
           // Show loading state
           showLoading('Memuat data...', 'Menerapkan filter');
           
           window.location.href = newUrl;
       }, 500);
   }

   // Add event listeners
   if (searchInput) {
       searchInput.addEventListener('input', applyFilters);
       
       // Add clear button functionality
       searchInput.addEventListener('keydown', (e) => {
           if (e.key === 'Escape') {
               searchInput.value = '';
               applyFilters();
           }
       });
   }
   
   if (statusFilter) statusFilter.addEventListener('change', applyFilters);
   if (positionFilter) positionFilter.addEventListener('change', applyFilters);
   if (testStatusFilter) testStatusFilter.addEventListener('change', applyFilters);
   if (kraeplinCategoryFilter) kraeplinCategoryFilter.addEventListener('change', applyFilters);
   if (discTypeFilter) discTypeFilter.addEventListener('change', applyFilters);

   // Handle window resize for filter toggle
   window.addEventListener('resize', () => {
       if (window.innerWidth > 768 && filterContent) {
           filterContent.classList.remove('collapsed');
           if (filterToggle) {
               filterToggle.classList.remove('collapsed');
           }
       }
   });
}

function resetFilters() {
   const searchInput = document.getElementById('searchInput');
   const statusFilter = document.getElementById('statusFilter');
   const positionFilter = document.getElementById('positionFilter');
   const testStatusFilter = document.getElementById('testStatusFilter');
   const kraeplinCategoryFilter = document.getElementById('kraeplinCategoryFilter');
   const discTypeFilter = document.getElementById('discTypeFilter');

   if (searchInput) searchInput.value = '';
   if (statusFilter) statusFilter.value = '';
   if (positionFilter) positionFilter.value = '';
   if (testStatusFilter) testStatusFilter.value = '';
   if (kraeplinCategoryFilter) kraeplinCategoryFilter.value = '';
   if (discTypeFilter) discTypeFilter.value = '';
   
   showLoading('Reset filter...', 'Mengembalikan ke tampilan awal');
   window.location.href = window.location.pathname;
}

// Dropdown Functionality
function initializeDropdowns() {
   // Close dropdowns when clicking outside
   document.addEventListener('click', (e) => {
       if (!e.target.closest('.action-dropdown')) {
           document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
               dropdown.classList.remove('show');
           });
       }
   });

   // Handle escape key
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
               dropdown.classList.remove('show');
           });
       }
   });
}

function toggleDropdown(button) {
   const dropdown = button.nextElementSibling;
   const allDropdowns = document.querySelectorAll('.dropdown-menu');
   
   // Close all other dropdowns
   allDropdowns.forEach(d => {
       if (d !== dropdown) {
           d.classList.remove('show');
       }
   });
   
   // Toggle current dropdown
   dropdown.classList.toggle('show');
   
   // Position dropdown if it goes off screen
   requestAnimationFrame(() => {
       const rect = dropdown.getBoundingClientRect();
       const viewportWidth = window.innerWidth;
       const viewportHeight = window.innerHeight;
       
       if (rect.right > viewportWidth) {
           dropdown.style.right = '0';
           dropdown.style.left = 'auto';
       }
       
       if (rect.bottom > viewportHeight) {
           dropdown.style.bottom = '100%';
           dropdown.style.top = 'auto';
       }
   });
}

// Checkbox & Bulk Actions
function initializeBulkActions() {
   const selectAllCheckbox = document.getElementById('selectAll');
   const candidateCheckboxes = document.querySelectorAll('.candidate-checkbox');
   const bulkActionToolbar = document.getElementById('bulkActionToolbar');
   const selectedCountElement = document.getElementById('selectedCount');

   function updateSelectedCount() {
       const selectedCheckboxes = document.querySelectorAll('.candidate-checkbox:checked');
       const selectedCount = selectedCheckboxes.length;
       
       if (selectedCountElement) {
           selectedCountElement.textContent = selectedCount;
       }

       if (bulkActionToolbar) {
           if (selectedCount > 0) {
               bulkActionToolbar.style.display = 'flex';
           } else {
               bulkActionToolbar.style.display = 'none';
           }
       }

       // Update select all state
       if (selectAllCheckbox && candidateCheckboxes.length > 0) {
           const totalBoxes = candidateCheckboxes.length;
           
           if (selectedCount === totalBoxes && totalBoxes > 0) {
               selectAllCheckbox.checked = true;
               selectAllCheckbox.indeterminate = false;
           } else if (selectedCount > 0) {
               selectAllCheckbox.checked = false;
               selectAllCheckbox.indeterminate = true;
           } else {
               selectAllCheckbox.checked = false;
               selectAllCheckbox.indeterminate = false;
           }
       }
   }

   // Select all functionality
   if (selectAllCheckbox) {
       selectAllCheckbox.addEventListener('change', function() {
           const isChecked = this.checked;
           candidateCheckboxes.forEach(checkbox => {
               checkbox.checked = isChecked;
           });
           updateSelectedCount();
       });
   }

   // Individual checkbox functionality
   candidateCheckboxes.forEach(checkbox => {
       checkbox.addEventListener('change', updateSelectedCount);
   });

   // Initialize count
   updateSelectedCount();
}

// Delete Functions
async function deleteCandidate(candidateId, candidateName) {
   const confirmResult = typeof Swal !== 'undefined' 
       ? await Swal.fire({
           title: 'Hapus Kandidat?',
           text: `Apakah Anda yakin ingin menghapus kandidat "${candidateName}" ke trash?`,
           icon: 'warning',
           showCancelButton: true,
           confirmButtonColor: '#e53e3e',
           cancelButtonColor: '#6b7280',
           confirmButtonText: 'Ya, Hapus!',
           cancelButtonText: 'Batal',
           reverseButtons: true
       })
       : { isConfirmed: confirm(`Apakah Anda yakin ingin menghapus kandidat "${candidateName}"?`) };

   if (!confirmResult.isConfirmed) return;

   try {
       showLoading('Menghapus...', 'Memindahkan kandidat ke trash');

       const data = await makeRequest(`/candidates/${candidateId}`, {
           method: 'DELETE'
       });

       await showSuccess('Berhasil!', data.message);
       window.location.reload();

   } catch (error) {
       hideLoading();
       showError('Gagal Menghapus', `Terjadi kesalahan: ${error.message}`);
   }
}

async function bulkDelete() {
   const selectedCheckboxes = document.querySelectorAll('.candidate-checkbox:checked');
   const selectedIds = [];
   const selectedNames = [];
   
   selectedCheckboxes.forEach(checkbox => {
       selectedIds.push(checkbox.value);
       const row = checkbox.closest('tr');
       const nameElement = row.querySelector('.candidate-name');
       selectedNames.push(nameElement ? nameElement.textContent.trim() : 'Unknown');
   });

   if (selectedIds.length === 0) {
       showError('Tidak Ada Yang Dipilih', 'Pilih minimal satu kandidat untuk dihapus');
       return;
   }

   const confirmResult = typeof Swal !== 'undefined' 
       ? await Swal.fire({
           title: 'Hapus ke Trash?',
           html: `
               <div style="text-align: left; margin: 20px 0;">
                   <p style="margin-bottom: 15px;">Anda akan menghapus <strong>${selectedIds.length} kandidat</strong> ke trash:</p>
                   <div style="max-height: 150px; overflow-y: auto; background: #f7fafc; padding: 10px; border-radius: 6px; margin: 10px 0;">
                       ${selectedNames.slice(0, 5).map(name => `<div style="margin: 2px 0;">• ${name}</div>`).join('')}
                       ${selectedNames.length > 5 ? `<div style="margin: 2px 0; color: #6b7280;">• dan ${selectedNames.length - 5} kandidat lainnya...</div>` : ''}
                   </div>
                   <p style="color: #718096; font-size: 0.9rem; margin-top: 10px;">
                       <i class="fas fa-info-circle"></i> Kandidat akan dipindahkan ke trash dan dapat dipulihkan nanti
                   </p>
               </div>
           `,
           icon: 'warning',
           showCancelButton: true,
           confirmButtonColor: '#e53e3e',
           cancelButtonColor: '#6b7280',
           confirmButtonText: `Ya, Hapus ${selectedIds.length} Kandidat`,
           cancelButtonText: 'Batal',
           reverseButtons: true,
           width: '500px'
       })
       : { isConfirmed: confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} kandidat terpilih?`) };

   if (!confirmResult.isConfirmed) return;

   try {
       showLoading('Menghapus...', `Memproses ${selectedIds.length} kandidat`);

       const data = await makeRequest('/candidates/bulk-delete', {
           method: 'POST',
           body: JSON.stringify({ ids: selectedIds })
       });

       await showSuccess('Berhasil Dihapus!', data.message);
       window.location.reload();

   } catch (error) {
       hideLoading();
       showError('Gagal Menghapus', `Terjadi kesalahan: ${error.message}`);
   }
}

// Table Enhancements
function initializeTableEnhancements() {
   const table = document.querySelector('.candidates-table');
   const tableWrapper = document.querySelector('.table-wrapper');
   
   if (!table || !tableWrapper) return;

   // Add horizontal scroll indicators
   function updateScrollIndicators() {
       const scrollLeft = tableWrapper.scrollLeft;
       const scrollWidth = tableWrapper.scrollWidth;
       const clientWidth = tableWrapper.clientWidth;
       const maxScroll = scrollWidth - clientWidth;

       tableWrapper.classList.toggle('scroll-start', scrollLeft <= 0);
       tableWrapper.classList.toggle('scroll-end', scrollLeft >= maxScroll - 1);
       tableWrapper.classList.toggle('scrollable', scrollWidth > clientWidth);
   }

   tableWrapper.addEventListener('scroll', updateScrollIndicators);
   window.addEventListener('resize', updateScrollIndicators);
   
   // Initialize scroll indicators
   setTimeout(updateScrollIndicators, 100);

   // Add touch-friendly scrolling for mobile
   let isScrolling = false;
   let scrollTimeout;

   tableWrapper.addEventListener('scroll', () => {
       if (!isScrolling) {
           tableWrapper.classList.add('scrolling');
           isScrolling = true;
       }

       clearTimeout(scrollTimeout);
       scrollTimeout = setTimeout(() => {
           tableWrapper.classList.remove('scrolling');
           isScrolling = false;
       }, 150);
   });
}

// Accessibility Enhancements
function initializeAccessibility() {
   // Add keyboard navigation for dropdowns
   document.addEventListener('keydown', (e) => {
       const activeDropdown = document.querySelector('.dropdown-menu.show');
       
       if (activeDropdown && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
           e.preventDefault();
           const items = activeDropdown.querySelectorAll('.dropdown-item');
           const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
           
           let nextIndex;
           if (e.key === 'ArrowDown') {
               nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
           } else {
               nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
           }
           
           items[nextIndex].focus();
       }
   });

   // Improve focus management
   const focusableElements = document.querySelectorAll(
       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
   );

   focusableElements.forEach(element => {
       element.addEventListener('focus', () => {
           // Ensure focused element is visible
           element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
       });
   });

   // Add ARIA labels for better screen reader support
   const selectAllCheckbox = document.getElementById('selectAll');
   if (selectAllCheckbox) {
       selectAllCheckbox.setAttribute('aria-label', 'Pilih semua kandidat');
   }

   const candidateCheckboxes = document.querySelectorAll('.candidate-checkbox');
   candidateCheckboxes.forEach((checkbox, index) => {
       const row = checkbox.closest('tr');
       const nameElement = row.querySelector('.candidate-name');
       const candidateName = nameElement ? nameElement.textContent.trim() : `Kandidat ${index + 1}`;
       checkbox.setAttribute('aria-label', `Pilih kandidat ${candidateName}`);
   });
}

// Performance Optimizations
function initializePerformanceOptimizations() {
   // Lazy load images in avatars
   const avatarImages = document.querySelectorAll('.candidate-avatar img');
   
   if ('IntersectionObserver' in window) {
       const imageObserver = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   const img = entry.target;
                   if (img.dataset.src) {
                       img.src = img.dataset.src;
                       img.removeAttribute('data-src');
                       imageObserver.unobserve(img);
                   }
               }
           });
       });

       avatarImages.forEach(img => {
           if (img.src && !img.dataset.src) {
               img.dataset.src = img.src;
               img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23e2e8f0"/%3E%3C/svg%3E';
           }
           imageObserver.observe(img);
       });
   }

   // Debounce resize events
   let resizeTimeout;
   window.addEventListener('resize', () => {
       clearTimeout(resizeTimeout);
       resizeTimeout = setTimeout(() => {
           // Re-initialize responsive features
           initializeTableEnhancements();
       }, 250);
   });
}

// Error Handling
function initializeErrorHandling() {
   // Global error handler
   window.addEventListener('error', (e) => {
       console.error('Global error:', e.error);
       hideLoading();
   });

   // Unhandled promise rejection handler
   window.addEventListener('unhandledrejection', (e) => {
       console.error('Unhandled promise rejection:', e.reason);
       hideLoading();
   });

   // Network error detection
   window.addEventListener('online', () => {
       if (document.hidden) return;
       showSuccess('Koneksi Tersambung', 'Koneksi internet telah pulih', 2000);
   });

   window.addEventListener('offline', () => {
       showError('Koneksi Terputus', 'Periksa koneksi internet Anda');
   });
}

// Page Visibility Handling
function initializePageVisibility() {
   let wasHidden = false;

   document.addEventListener('visibilitychange', () => {
       if (document.hidden) {
           wasHidden = true;
       } else if (wasHidden) {
           // Page became visible again, refresh if data might be stale
           const lastUpdate = sessionStorage.getItem('lastUpdate');
           const now = Date.now();
           
           if (!lastUpdate || (now - parseInt(lastUpdate)) > 300000) { // 5 minutes
               // Optionally refresh data
               console.log('Page visible again, consider refreshing data');
           }
           wasHidden = false;
       }
   });

   // Store last update time
   sessionStorage.setItem('lastUpdate', Date.now().toString());
}

// Initialization
function initializePage() {
   try {
       initializeSidebar();
       initializeFilters();
       initializeDropdowns();
       initializeBulkActions();
       initializeTableEnhancements();
       initializeAccessibility();
       initializePerformanceOptimizations();
       initializeErrorHandling();
       initializePageVisibility();
       
       console.log('✅ Candidates Index page initialized successfully');
   } catch (error) {
       console.error('❌ Error initializing page:', error);
   }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Expose functions to global scope for inline handlers
window.toggleDropdown = toggleDropdown;
window.resetFilters = resetFilters;
window.deleteCandidate = deleteCandidate;
window.bulkDelete = bulkDelete;

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
       initializePage,
       toggleDropdown,
       resetFilters,
       deleteCandidate,
       bulkDelete
   };
}