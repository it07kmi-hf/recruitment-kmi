// Sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Dropdown menu
function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    
    allDropdowns.forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('show');
        }
    });
    
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(d => {
            d.classList.remove('show');
        });
    }
});

// Get CSRF token
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Auto-submit filter form
document.querySelectorAll('.filter-select, .search-input').forEach(element => {
    element.addEventListener('change', function() {
        if (this.classList.contains('search-input')) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.closest('form').submit();
            }, 500);
        } else {
            this.closest('form').submit();
        }
    });
});

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
                        ðŸ“Š <strong>${totalCandidates} total kandidat</strong> terdaftar<br>
                        âš ï¸ <strong>${activeCandidates} kandidat sedang dalam proses</strong> rekrutmen<br>
                        <small>Menghapus posisi akan mempengaruhi proses rekrutmen yang sedang berjalan</small>
                    </div>
                </div>
                <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 12px; margin: 10px 0; text-align: left;">
                    <strong style="color: #0369a1;">ðŸ’¡ Opsi yang tersedia:</strong>
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
                        ðŸ“Š <strong>${totalCandidates} kandidat</strong> pernah mendaftar di posisi ini<br>
                        âœ… Tidak ada kandidat yang sedang dalam proses aktif
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
            }
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
                        âœ… Posisi ini belum memiliki kandidat yang mendaftar, aman untuk dihapus.
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
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
                    âœ… Posisi akan aktif untuk menerima aplikasi baru
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
                        ðŸ“Š <strong>${totalCandidates} total kandidat</strong> terdaftar<br>
                        âš ï¸ <strong>${activeCandidates} kandidat sedang dalam proses</strong><br>
                        ðŸ”’ Menonaktifkan posisi akan menghentikan aplikasi baru<br>
                        âœ… Kandidat yang sudah mendaftar tetap dapat diproses
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
        }
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
                showConfirmButton: false
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Gagal!',
                text: data.message,
                icon: 'error'
            });
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Terjadi kesalahan saat menghapus posisi',
            icon: 'error'
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
                showConfirmButton: false
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
                    cancelButtonText: 'Batal'
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
                                    showConfirmButton: false
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
                    icon: 'error'
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
            icon: 'error'
        });
    });
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Add CSS for wider SweetAlert
const style = document.createElement('style');
style.textContent = `
    .swal-wide {
        width: 600px !important;
    }
    .swal-wide .swal2-html-container {
        max-height: 400px;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Position Index page loaded successfully');
});