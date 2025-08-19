// Global variables
let sidebarToggle, sidebar, mainContent, sidebarOverlay;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeResponsive();
    console.log('Position Index page loaded successfully');
});

// Initialize DOM elements
function initializeElements() {
    sidebarToggle = document.getElementById('sidebarToggle');
    sidebar = document.getElementById('sidebar');
    mainContent = document.getElementById('mainContent');
    sidebarOverlay = document.getElementById('sidebarOverlay');
}

// Initialize event listeners
function initializeEventListeners() {
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Sidebar overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', handleOutsideClick);

    // Auto-submit filter form
    initializeFilterForm();

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Handle escape key
    document.addEventListener('keydown', handleKeyDown);
}

// Initialize responsive behavior
function initializeResponsive() {
    handleResize();
}

// Toggle sidebar
function toggleSidebar() {
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
        // Mobile behavior
        const isVisible = sidebar.classList.contains('mobile-visible');
        
        if (isVisible) {
            closeSidebar();
        } else {
            openSidebar();
        }
    } else {
        // Desktop behavior
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Store preference
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
}

// Open sidebar (mobile)
function openSidebar() {
    sidebar.classList.remove('mobile-hidden');
    sidebar.classList.add('mobile-visible');
    sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close sidebar (mobile)
function closeSidebar() {
    sidebar.classList.remove('mobile-visible');
    sidebar.classList.add('mobile-hidden');
    sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Handle window resize
function handleResize() {
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
        // Mobile mode
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        
        if (!sidebar.classList.contains('mobile-visible')) {
            sidebar.classList.add('mobile-hidden');
        }
    } else {
        // Desktop mode
        sidebar.classList.remove('mobile-hidden', 'mobile-visible');
        sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Restore desktop sidebar state
        const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (wasCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
}

// Handle escape key
function handleKeyDown(e) {
    if (e.key === 'Escape') {
        // Close any open dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(d => {
            d.classList.remove('show');
        });
        
        // Close mobile sidebar
        if (window.innerWidth <= 1024 && sidebar.classList.contains('mobile-visible')) {
            closeSidebar();
        }
    }
}

// Handle outside clicks
function handleOutsideClick(e) {
    // Close dropdowns when clicking outside
    if (!e.target.closest('.action-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(d => {
            d.classList.remove('show');
        });
    }
}

// Initialize filter form
function initializeFilterForm() {
    const filterInputs = document.querySelectorAll('.filter-select, .search-input');

    filterInputs.forEach(element => {
       if (element.classList.contains('search-input')) {
           // Debounce search input
           element.addEventListener('input', function() {
               clearTimeout(this.searchTimeout);
               this.searchTimeout = setTimeout(() => {
                   this.closest('form').submit();
               }, 500);
           });
       } else {
           // Immediate submit for selects
           element.addEventListener('change', function() {
               this.closest('form').submit();
           });
       }
   });
}

// Dropdown menu functions
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
   
   // Position dropdown if needed (for mobile)
   positionDropdown(dropdown, button);
}

// Position dropdown for better mobile experience
function positionDropdown(dropdown, button) {
   if (window.innerWidth <= 768) {
       const rect = button.getBoundingClientRect();
       const dropdownRect = dropdown.getBoundingClientRect();
       const viewportWidth = window.innerWidth;
       const viewportHeight = window.innerHeight;
       
       // Check if dropdown goes off screen horizontally
       if (rect.right + dropdownRect.width > viewportWidth) {
           dropdown.style.right = '0';
           dropdown.style.left = 'auto';
       }
       
       // Check if dropdown goes off screen vertically
       if (rect.bottom + dropdownRect.height > viewportHeight) {
           dropdown.style.top = 'auto';
           dropdown.style.bottom = '100%';
       }
   }
}

// Get CSRF token
function getCSRFToken() {
   return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Enhanced Delete Position Function
function deletePosition(positionId, positionName, totalCandidates, activeCandidates) {
   if (totalCandidates > 0) {
       let candidateInfo = '';
       let warningLevel = 'warning';
       
       if (activeCandidates > 0) {
           candidateInfo = `
               <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: left;">
                   <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                       <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.2rem;"></i>
                       <strong style="color: #92400e;">Posisi ini memiliki kandidat aktif!</strong>
                   </div>
                   <div style="color: #78350f; font-size: 0.9rem; line-height: 1.4;">
                       📊 <strong>${totalCandidates} total kandidat</strong> terdaftar<br>
                       ⚠️ <strong>${activeCandidates} kandidat sedang dalam proses</strong> rekrutmen<br>
                       <small>Menghapus posisi akan mempengaruhi proses rekrutmen yang sedang berjalan</small>
                   </div>
               </div>
               <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 12px; margin: 10px 0; text-align: left;">
                   <strong style="color: #0369a1;">💡 Opsi yang tersedia:</strong>
                   <ul style="margin: 8px 0 0 20px; color: #0c4a6e; font-size: 0.9rem;">
                       <li><strong>Transfer & Hapus:</strong> Pindahkan semua kandidat ke posisi lain</li>
                       <li><strong>Nonaktifkan Posisi:</strong> Hentikan aplikasi baru (kandidat tetap diproses)</li>
                       <li><strong>Hapus Paksa:</strong> Tidak disarankan jika ada kandidat aktif</li>
                   </ul>
               </div>
           `;
           warningLevel = 'error';
       } else {
           candidateInfo = `
               <div style="background: #f0fdf8; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: left;">
                   <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                       <i class="fas fa-info-circle" style="color: #10b981; font-size: 1.2rem;"></i>
                       <strong style="color: #065f46;">Semua kandidat sudah selesai diproses</strong>
                   </div>
                   <div style="color: #047857; font-size: 0.9rem;">
                       📊 <strong>${totalCandidates} kandidat</strong> pernah mendaftar di posisi ini<br>
                       ✅ Tidak ada kandidat yang sedang dalam proses aktif
                   </div>
               </div>
           `;
           warningLevel = 'warning';
       }

       Swal.fire({
           title: 'Tidak Dapat Menghapus Langsung',
           html: `
               <div style="text-align: left; margin: 10px 0;">
                   <p style="margin-bottom: 15px; text-align: center;">
                       Posisi <strong>"${positionName}"</strong> memiliki data kandidat yang terkait.
                   </p>
                   ${candidateInfo}
               </div>
           `,
           icon: warningLevel,
           showCancelButton: true,
           showDenyButton: activeCandidates > 0,
           confirmButtonColor: activeCandidates > 0 ? '#dc2626' : '#f59e0b',
           cancelButtonColor: '#6b7280',
           denyButtonColor: '#f59e0b',
           confirmButtonText: activeCandidates > 0 ? 'Transfer & Hapus' : 'Nonaktifkan Posisi',
           denyButtonText: activeCandidates > 0 ? 'Nonaktifkan Posisi' : null,
           cancelButtonText: 'Batal',
           customClass: {
               popup: 'swal-wide'
           },
           responsive: true
       }).then((result) => {
           if (result.isConfirmed) {
               if (activeCandidates > 0) {
                   showTransferDialog(positionId, positionName);
               } else {
                   togglePositionStatus(positionId, positionName, 'close', activeCandidates, totalCandidates);
               }
           } else if (result.isDenied && activeCandidates > 0) {
               togglePositionStatus(positionId, positionName, 'close', activeCandidates, totalCandidates);
           }
       });
   } else {
       Swal.fire({
           title: 'Hapus Posisi?',
           html: `
               <div style="text-align: center; margin: 20px 0;">
                   <p>Apakah Anda yakin ingin menghapus posisi:</p>
                   <strong style="color: #1a202c; font-size: 1.1rem;">"${positionName}"</strong>
                   <div style="background: #f0fdf8; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin: 15px 0; color: #065f46; font-size: 0.9rem;">
                       ✅ Posisi ini belum memiliki kandidat yang mendaftar, aman untuk dihapus.
                   </div>
               </div>
           `,
           icon: 'question',
           showCancelButton: true,
           confirmButtonColor: '#dc2626',
           cancelButtonColor: '#6b7280',
           confirmButtonText: 'Ya, Hapus',
           cancelButtonText: 'Batal',
           responsive: true
       }).then((result) => {
           if (result.isConfirmed) {
               performDelete(positionId);
           }
       });
   }
}

// Toggle Position Status
function togglePositionStatus(positionId, positionName, action, activeCandidates, totalCandidates) {
   let title, message, confirmText, icon, confirmColor;
   
   if (action === 'open') {
       title = 'Aktifkan Posisi?';
       confirmText = 'Ya, Aktifkan';
       icon = 'question';
       confirmColor = '#10b981';
       
       message = `
           <div style="text-align: center; margin: 15px 0;">
               <p>Posisi <strong>"${positionName}"</strong> akan diaktifkan dan dapat menerima aplikasi baru.</p>
               <div style="background: #f0fdf8; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin: 10px 0; color: #065f46; font-size: 0.9rem;">
                   ✅ Posisi akan aktif untuk menerima aplikasi baru
               </div>
           </div>
       `;
   } else {
       title = 'Nonaktifkan Posisi?';
       confirmText = 'Ya, Nonaktifkan';
       icon = 'warning';
       confirmColor = '#f59e0b';
       
       message = `
           <div style="text-align: left; margin: 15px 0;">
               <p style="text-align: center; margin-bottom: 15px;">
                   Posisi <strong>"${positionName}"</strong> akan dinonaktifkan untuk aplikasi baru.
               </p>
               <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 12px;">
                   <div style="color: #92400e; font-size: 0.9rem;">
                       📊 <strong>${totalCandidates} total kandidat</strong> terdaftar<br>
                       ⚠️ <strong>${activeCandidates} kandidat sedang dalam proses</strong><br>
                       🔒 Menonaktifkan posisi akan menghentikan aplikasi baru<br>
                       ✅ Kandidat yang sudah mendaftar tetap dapat diproses
                   </div>
               </div>
               <div style="margin-top: 10px;">
                   <textarea id="deactivateReason" placeholder="Alasan penonaktifan (opsional)..." 
                           style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; min-height: 60px;"></textarea>
               </div>
           </div>
       `;
   }

   Swal.fire({
       title: title,
       html: message,
       icon: icon,
       showCancelButton: true,
       confirmButtonColor: confirmColor,
       cancelButtonColor: '#6b7280',
       confirmButtonText: confirmText,
       cancelButtonText: 'Batal',
       customClass: {
           popup: 'swal-wide'
       },
       responsive: true
   }).then((result) => {
       if (result.isConfirmed) {
           const reason = document.getElementById('deactivateReason')?.value || '';
           performStatusToggle(positionId, action, reason);
       }
   });
}

// Perform actual delete
function performDelete(positionId) {
   showLoading();
   
   fetch(`/positions/${positionId}`, {
       method: 'DELETE',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRF-TOKEN': getCSRFToken()
       }
   })
   .then(response => response.json())
   .then(data => {
       hideLoading();
       if (data.success) {
           Swal.fire({
               title: 'Berhasil!',
               text: data.message,
               icon: 'success',
               timer: 2000,
               showConfirmButton: false,
               responsive: true
           }).then(() => {
               window.location.reload();
           });
       } else {
           Swal.fire({
               title: 'Gagal!',
               text: data.message,
               icon: 'error',
               responsive: true
           });
       }
   })
   .catch(error => {
       hideLoading();
       console.error('Error:', error);
       Swal.fire({
           title: 'Error!',
           text: 'Terjadi kesalahan saat menghapus posisi',
           icon: 'error',
           responsive: true
       });
   });
}

// Perform status toggle
function performStatusToggle(positionId, action, reason = '', closingDate = '') {
   showLoading();
   const endpoint = `/positions/${positionId}/toggle-status`;
   const payload = { 
       action: action,
       reason: reason,
       closing_date: closingDate
   };
   
   fetch(endpoint, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRF-TOKEN': getCSRFToken()
       },
       body: JSON.stringify(payload)
   })
   .then(response => response.json())
   .then(data => {
       hideLoading();
       if (data.success) {
           Swal.fire({
               title: 'Berhasil!',
               text: data.message,
               icon: 'success',
               timer: 2000,
               showConfirmButton: false,
               responsive: true
           }).then(() => {
               window.location.reload();
           });
       } else {
           if (data.requiresConfirmation) {
               Swal.fire({
                   title: 'Konfirmasi Diperlukan',
                   text: data.message,
                   icon: 'warning',
                   showCancelButton: true,
                   confirmButtonColor: '#f59e0b',
                   cancelButtonColor: '#6b7280',
                   confirmButtonText: 'Ya, Lanjutkan',
                   cancelButtonText: 'Batal',
                   responsive: true
               }).then((result) => {
                   if (result.isConfirmed) {
                       payload.force = true;
                       fetch(endpoint, {
                           method: 'POST',
                           headers: {
                               'Content-Type': 'application/json',
                               'X-CSRF-TOKEN': getCSRFToken()
                           },
                           body: JSON.stringify(payload)
                       })
                       .then(response => response.json())
                       .then(data => {
                           if (data.success) {
                               Swal.fire({
                                   title: 'Berhasil!',
                                   text: data.message,
                                   icon: 'success',
                                   timer: 2000,
                                   showConfirmButton: false,
                                   responsive: true
                               }).then(() => {
                                   window.location.reload();
                               });
                           }
                       });
                   }
               });
           } else {
               Swal.fire({
                   title: 'Gagal!',
                   text: data.message,
                   icon: 'error',
                   responsive: true
               });
           }
       }
   })
   .catch(error => {
       hideLoading();
       console.error('Error:', error);
       Swal.fire({
           title: 'Error!',
           text: 'Terjadi kesalahan saat mengubah status posisi',
           icon: 'error',
           responsive: true
       });
   });
}

// Show transfer dialog (if transfer functionality exists)
function showTransferDialog(positionId, positionName) {
   // This function should be implemented based on your transfer functionality
   // For now, we'll show a placeholder
   Swal.fire({
       title: 'Transfer Kandidat',
       text: `Fitur transfer kandidat dari posisi "${positionName}" belum tersedia.`,
       icon: 'info',
       confirmButtonText: 'OK',
       responsive: true
   });
}

// Show loading overlay
function showLoading() {
   const loadingOverlay = document.getElementById('loadingOverlay');
   if (loadingOverlay) {
       loadingOverlay.style.display = 'flex';
   }
}

// Hide loading overlay
function hideLoading() {
   const loadingOverlay = document.getElementById('loadingOverlay');
   if (loadingOverlay) {
       loadingOverlay.style.display = 'none';
   }
}

// Utility functions for responsive behavior
function isMobile() {
   return window.innerWidth <= 768;
}

function isTablet() {
   return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
   return window.innerWidth > 1024;
}

// Add touch event support for mobile
function addTouchSupport() {
   let touchStartY = 0;
   let touchEndY = 0;
   
   document.addEventListener('touchstart', function(e) {
       touchStartY = e.changedTouches[0].screenY;
   });
   
   document.addEventListener('touchend', function(e) {
       touchEndY = e.changedTouches[0].screenY;
       handleSwipe();
   });
   
   function handleSwipe() {
       const swipeThreshold = 50;
       const diff = touchStartY - touchEndY;
       
       if (Math.abs(diff) > swipeThreshold) {
           // Handle swipe gestures if needed
           // For example, closing mobile sidebar on swipe
           if (isMobile() && sidebar.classList.contains('mobile-visible')) {
               if (diff > 0) {
                   // Swipe up - could close sidebar
                   closeSidebar();
               }
           }
       }
   }
}

// Initialize touch support
addTouchSupport();

// Add custom styles for SweetAlert responsive
const style = document.createElement('style');
style.textContent = `
   .swal-wide {
       width: 90% !important;
       max-width: 600px !important;
   }
   
   .swal-wide .swal2-html-container {
       max-height: 70vh;
       overflow-y: auto;
   }
   
   @media (max-width: 768px) {
       .swal2-popup {
           width: 95% !important;
           margin: 0 !important;
           border-radius: 12px !important;
       }
       
       .swal2-title {
           font-size: 1.2rem !important;
       }
       
       .swal2-content {
           font-size: 0.9rem !important;
       }
       
       .swal2-actions {
           flex-direction: column !important;
           gap: 10px !important;
       }
       
       .swal2-actions button {
           width: 100% !important;
           margin: 0 !important;
       }
   }
   
   @media (max-width: 480px) {
       .swal2-popup {
           width: 98% !important;
           padding: 15px !important;
       }
       
       .swal2-title {
           font-size: 1.1rem !important;
           margin-bottom: 15px !important;
       }
       
       .swal2-content {
           font-size: 0.85rem !important;
       }
       
       .swal2-html-container {
           max-height: 60vh !important;
       }
   }
`;
document.head.appendChild(style);

// Export functions for global access
window.toggleDropdown = toggleDropdown;
window.deletePosition = deletePosition;
window.togglePositionStatus = togglePositionStatus;
window.showTransferDialog = showTransferDialog;

// Performance optimization: Debounce resize handler
function debounce(func, wait) {
   let timeout;
   return function executedFunction(...args) {
       const later = () => {
           clearTimeout(timeout);
           func(...args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
   };
}

// Use debounced resize handler
window.addEventListener('resize', debounce(handleResize, 150));

// Handle orientation change on mobile
window.addEventListener('orientationchange', function() {
   setTimeout(handleResize, 100);
});

// Prevent zoom on double tap for better mobile experience
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
   const now = (new Date()).getTime();
   if (now - lastTouchEnd <= 300) {
       event.preventDefault();
   }
   lastTouchEnd = now;
}, false);

// Add smooth scrolling for mobile
if (isMobile()) {
   document.documentElement.style.scrollBehavior = 'smooth';
}

// Initialize intersection observer for performance (lazy loading)
if ('IntersectionObserver' in window) {
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               // Add any lazy loading logic here
           }
       });
   });
   
   // Observe elements that need lazy loading
   document.querySelectorAll('.position-card, .positions-table tbody tr').forEach(el => {
       observer.observe(el);
   });
}

// Add error handling for network issues
window.addEventListener('online', function() {
   console.log('Connection restored');
});

window.addEventListener('offline', function() {
   console.log('Connection lost');
   Swal.fire({
       title: 'Koneksi Terputus',
       text: 'Periksa koneksi internet Anda',
       icon: 'warning',
       toast: true,
       position: 'top-end',
       showConfirmButton: false,
       timer: 3000
   });
});
