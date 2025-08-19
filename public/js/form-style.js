// Form Application Script - Mobile Upload Optimized
(function() {
    'use strict';

    // Check if form was successfully submitted (for clearing localStorage)
    if (typeof formSubmitted !== 'undefined' && formSubmitted) {
        localStorage.removeItem('jobApplicationFormData');
    }

    // 🆕 MOBILE-OPTIMIZED: Simplified file validation for better mobile compatibility
    const fileValidation = {
        cv: {
            extensions: ['pdf'],
            maxSize: 2 * 1024 * 1024,
            required: true,
            mimeTypes: ['application/pdf']
        },
        photo: {
            extensions: ['jpg', 'jpeg', 'png'],
            maxSize: 2 * 1024 * 1024,
            required: true,
            mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/pjpeg', 'image/x-png']
        },
        transcript: {
            extensions: ['pdf'],
            maxSize: 2 * 1024 * 1024,
            required: true,
            mimeTypes: ['application/pdf']
        },
        certificates: {
            extensions: ['pdf'],
            maxSize: 2 * 1024 * 1024,
            required: false,
            mimeTypes: ['application/pdf']
        }
    };

    // 🆕 MOBILE: Enhanced mobile detection
    function isMobileDevice() {
        const userAgent = navigator.userAgent || '';
        const mobileKeywords = [
            'Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 
            'Windows Phone', 'Opera Mini', 'IEMobile', 'Mobile Safari'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => 
            userAgent.indexOf(keyword) !== -1
        );
        
        const isMobileScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return isMobileUA || (isMobileScreen && isTouchDevice);
    }

    // 🆕 MOBILE-FIRST: Simplified file validation function
    function validateMobileFile(file, validation) {
        console.log('📱 Mobile file validation:', {
            name: file.name,
            type: file.type,
            size: file.size,
            isMobile: isMobileDevice()
        });

        // Basic file existence check
        if (!file || file.size === 0) {
            return { valid: false, error: 'File tidak valid atau kosong' };
        }

        // File size check
        if (file.size > validation.maxSize) {
            const maxSizeMB = (validation.maxSize / 1024 / 1024).toFixed(1);
            const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
            return { 
                valid: false, 
                error: `File terlalu besar (${fileSizeMB}MB). Maksimal ${maxSizeMB}MB` 
            };
        }

        // File extension check (primary validation)
        const extension = file.name.toLowerCase().split('.').pop();
        if (!validation.extensions.includes(extension)) {
            const allowedExtensions = validation.extensions.join(', ').toUpperCase();
            return { 
                valid: false, 
                error: `Format file harus ${allowedExtensions}. File Anda: ${extension.toUpperCase()}` 
            };
        }

        // 🆕 MOBILE: More lenient MIME type validation for mobile browsers
        if (isMobileDevice()) {
            console.log('📱 Using lenient mobile validation for MIME type');
            // For mobile, we primarily rely on extension validation
            // MIME type validation is more flexible
            if (file.type && !validation.mimeTypes.some(mime => 
                file.type.includes(mime) || 
                file.type.includes('octet-stream') ||
                file.type === ''
            )) {
                console.warn('📱 MIME type mismatch on mobile, but allowing based on extension');
            }
        } else {
            // Desktop: stricter MIME type validation
            if (file.type && !validation.mimeTypes.includes(file.type)) {
                console.warn('🖥️ MIME type mismatch on desktop:', {
                    detected: file.type,
                    allowed: validation.mimeTypes
                });
                return { 
                    valid: false, 
                    error: `Tipe file tidak valid (${file.type}). Gunakan format yang benar.` 
                };
            }
        }

        return { valid: true };
    }

    // 🆕 MOBILE-OPTIMIZED: Simple file upload handler
    function handleMobileFileUpload(event, fieldName) {
        const file = event.target.files[0];
        const validation = fileValidation[fieldName];
        const input = event.target;
        const infoDiv = document.getElementById(`${fieldName}-info`);
        const errorDiv = document.getElementById(`${fieldName}-error`);

        // Reset states
        input.classList.remove('has-file', 'error');
        infoDiv.classList.remove('show');
        errorDiv.classList.remove('show');
        infoDiv.innerHTML = '';
        errorDiv.innerHTML = '';

        if (!file) {
            input.placeholder = 'Pilih file...';
            return;
        }

        console.log(`📱 Processing ${fieldName} file:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified).toISOString()
        });

        // Validate file
        const validationResult = validateMobileFile(file, validation);
        
        if (!validationResult.valid) {
            showMobileFileError(fieldName, validationResult.error);
            // Clear the file input
            event.target.value = '';
            return;
        }

        // Show success
        showMobileFileSuccess(fieldName, file);
        
        // Save form data after successful file upload
        saveFormData();
    }

    // 🆕 MOBILE: Multiple file upload handler
    function handleMobileMultipleFileUpload(event, fieldName) {
        const files = Array.from(event.target.files);
        const validation = fileValidation[fieldName];
        const input = event.target;
        const infoDiv = document.getElementById(`${fieldName}-info`);
        const errorDiv = document.getElementById(`${fieldName}-error`);

        // Reset states
        input.classList.remove('has-file', 'error');
        infoDiv.classList.remove('show');
        errorDiv.classList.remove('show');
        infoDiv.innerHTML = '';
        errorDiv.innerHTML = '';

        if (files.length === 0) {
            input.placeholder = 'Pilih file...';
            return;
        }

        let validFiles = [];
        let errors = [];

        // Validate each file
        files.forEach((file, index) => {
            const validationResult = validateMobileFile(file, validation);
            if (validationResult.valid) {
                validFiles.push(file);
            } else {
                errors.push(`File ${index + 1} (${file.name}): ${validationResult.error}`);
            }
        });

        if (errors.length > 0) {
            showMobileFileError(fieldName, errors.join('<br>'));
            event.target.value = '';
            return;
        }

        // Show success for multiple files
        showMobileMultipleFileSuccess(fieldName, validFiles);
        
        // Save form data after successful file upload
        saveFormData();
    }

    // 🆕 MOBILE: Show file error
    function showMobileFileError(fieldName, errorMessage) {
        const input = document.getElementById(fieldName);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        input.classList.add('error');
        errorDiv.innerHTML = `
            <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <div class="text-sm">${errorMessage}</div>
            </div>
        `;
        errorDiv.classList.add('show');
    }

    // 🆕 MOBILE: Show file success
    function showMobileFileSuccess(fieldName, file) {
        const input = document.getElementById(fieldName);
        const infoDiv = document.getElementById(`${fieldName}-info`);
        
        input.classList.add('has-file');
        
        const fileSizeFormatted = formatFileSize(file.size);
        infoDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm font-medium text-green-800">File dipilih</span>
                </div>
                <button type="button" class="text-red-600 hover:text-red-800 text-sm" onclick="removeMobileFile('${fieldName}')">
                    Hapus
                </button>
            </div>
            <div class="text-xs text-gray-600 mt-1">
                ${file.name} (${fileSizeFormatted})
            </div>
        `;
        infoDiv.classList.add('show');
    }

    // 🆕 MOBILE: Show multiple file success
    function showMobileMultipleFileSuccess(fieldName, files) {
        const input = document.getElementById(fieldName);
        const infoDiv = document.getElementById(`${fieldName}-info`);
        
        input.classList.add('has-file');
        
        let fileListHtml = '';
        files.forEach((file, index) => {
            const fileSizeFormatted = formatFileSize(file.size);
            fileListHtml += `
                <div class="flex items-center justify-between py-1">
                    <div class="text-xs text-gray-600">
                        ${file.name} (${fileSizeFormatted})
                    </div>
                    <button type="button" class="text-red-600 hover:text-red-800 text-xs" onclick="removeMobileMultipleFile('${fieldName}', ${index})">
                        Hapus
                    </button>
                </div>
            `;
        });
        
        infoDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm font-medium text-green-800">${files.length} file dipilih</span>
                </div>
                <button type="button" class="text-red-600 hover:text-red-800 text-sm" onclick="removeMobileFile('${fieldName}')">
                    Hapus Semua
                </button>
            </div>
            <div class="mt-2 space-y-1">
                ${fileListHtml}
            </div>
        `;
        infoDiv.classList.add('show');
    }

    // 🆕 MOBILE: Remove single file
    function removeMobileFile(fieldName) {
        const input = document.getElementById(fieldName);
        const infoDiv = document.getElementById(`${fieldName}-info`);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        input.value = '';
        input.classList.remove('has-file', 'error');
        infoDiv.classList.remove('show');
        errorDiv.classList.remove('show');
        infoDiv.innerHTML = '';
        errorDiv.innerHTML = '';
        
        saveFormData();
    }

    // 🆕 MOBILE: Remove specific file from multiple selection
    function removeMobileMultipleFile(fieldName, indexToRemove) {
        const input = document.getElementById(fieldName);
        const dt = new DataTransfer();
        const files = input.files;
        
        for (let i = 0; i < files.length; i++) {
            if (i !== indexToRemove) {
                dt.items.add(files[i]);
            }
        }
        
        input.files = dt.files;
        
        if (dt.files.length === 0) {
            removeMobileFile(fieldName);
        } else {
            // Re-trigger the file change event to update display
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        }
    }

    // Make remove functions global for onclick handlers
    window.removeMobileFile = removeMobileFile;
    window.removeMobileMultipleFile = removeMobileMultipleFile;

    // 🆕 MOBILE: Format file size helper
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Form State Preservation
    const STORAGE_KEY = 'jobApplicationFormData';
    const form = document.getElementById('applicationForm');
    const saveIndicator = document.getElementById('saveIndicator');
    
    // Required field IDs for validation
    const requiredFields = [
        'position_applied', 'expected_salary', 'full_name', 'email', 'nik',
        'phone_number', 'phone_alternative', 'birth_place', 'birth_date', 'gender', 
        'religion', 'marital_status', 'ethnicity', 'current_address', 
        'current_address_status', 'ktp_address', 'height_cm', 'weight_kg', 
        'motivation', 'strengths', 'weaknesses', 'start_work_date', 
        'information_source', 'cv', 'photo', 'transcript'
    ];
    
    // 🆕 UPDATED: Save form data dengan OCR status preservation
    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        
        // Handle regular inputs (existing code tetap sama)
        for (let [key, value] of formData.entries()) {
            if (!key.includes('cv') && !key.includes('photo') && !key.includes('transcript') && !key.includes('certificates')) {
                if (data[key]) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
        }

        // Handle salary formatting (existing code tetap sama)
        const salaryInput = document.getElementById('expected_salary');
        if (salaryInput && data.expected_salary) {
            data.expected_salary = getRawSalaryValue(salaryInput);
        }
        
        // 🆕 PRESERVE OCR status di localStorage
        const nikField = document.getElementById('nik');
        if (nikField && nikField.readOnly && nikField.classList.contains('ocr-filled')) {
            data.ocr_nik_locked = 'true';
            data.ocr_nik_value = nikField.value;
            console.log('Preserving OCR NIK status in localStorage');
        }

        // Handle checkboxes (existing code tetap sama)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.name.includes('[]')) {
                data[checkbox.name] = checkbox.checked ? '1' : '0';
            }
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSaveIndicator();
    }
    
    // 🆕 UPDATED: Load form data dengan OCR state restoration
    function loadFormData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Restore regular inputs (existing code tetap sama)
            Object.keys(data).forEach(key => {
                const elements = form.querySelectorAll(`[name="${key}"]`);
                
                elements.forEach((element, index) => {
                    if (element.type === 'checkbox') {
                        element.checked = data[key] === '1' || data[key] === true;
                    } else if (element.type === 'radio') {
                        if (Array.isArray(data[key])) {
                            element.checked = data[key].includes(element.value);
                        } else {
                            element.checked = element.value === data[key];
                        }
                    } else if (element.tagName === 'SELECT' || element.type === 'text' || element.type === 'number' || element.type === 'date' || element.type === 'email' || element.tagName === 'TEXTAREA') {
                        if (Array.isArray(data[key])) {
                            element.value = data[key][index] || '';
                        } else {
                            element.value = data[key] || '';
                        }
                    }
                });
            });

            // Handle salary formatting (existing code tetap sama)
            const salaryInput = document.getElementById('expected_salary');
            if (salaryInput && salaryInput.value) {
                const rawValue = salaryInput.value.replace(/\./g, '');
                salaryInput.value = rawValue;
                formatSalary(salaryInput);
            }

            // 🆕 RESTORE OCR NIK state jika ada
            if (data.ocr_nik_locked === 'true' && data.ocr_nik_value) {
                const nikField = document.getElementById('nik');
                if (nikField) {
                    nikField.value = data.ocr_nik_value;
                    nikField.readOnly = true;
                    nikField.style.backgroundColor = '#ecfdf5';
                    nikField.style.borderColor = '#10b981';
                    nikField.style.color = '#065f46';
                    nikField.classList.add('ocr-filled');
                    
                    console.log('Restored OCR NIK from localStorage:', data.ocr_nik_value);
                    
                    // Remove instruction if exists
                    const existingInstruction = nikField.parentNode.querySelector('.nik-instruction');
                    if (existingInstruction) {
                        existingInstruction.remove();
                    }

                    // Add OCR indicator
                    addOcrIndicator(nikField);
                }
            }

            // Handle checkbox arrays (existing code tetap sama)
            const checkboxArrays = ['driving_licenses'];
            checkboxArrays.forEach(name => {
                if (data[name + '[]'] && Array.isArray(data[name + '[]'])) {
                    data[name + '[]'].forEach(value => {
                        const checkbox = form.querySelector(`input[name="${name}[]"][value="${value}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
            });
            
        } catch (e) {
            console.error('Error loading form data:', e);
        }
    }

    // 🆕 NEW: Add OCR indicator to NIK field
    function addOcrIndicator(nikField) {
        // Remove existing indicator
        const existing = nikField.parentNode.querySelector('.ocr-indicator');
        if (existing) {
            existing.remove();
        }
        
        const indicator = document.createElement('div');
        indicator.className = 'ocr-indicator';
        indicator.innerHTML = `
            <div style="margin-top: 4px; padding: 4px 8px; background: #ecfdf5; border: 1px solid #10b981; 
                        border-radius: 4px; font-size: 12px; color: #065f46; display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>NIK terisi otomatis dari scan KTP</span>
            </div>
        `;
        nikField.parentNode.appendChild(indicator);
    }
    
    // Show save indicator
    function showSaveIndicator() {
        saveIndicator.classList.add('show');
        setTimeout(() => {
            saveIndicator.classList.remove('show');
        }, 2000);
    }
    
    // Show custom alert
    function showAlert(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <div class="font-medium">${type === 'error' ? 'Error!' : type === 'success' ? 'Berhasil!' : 'Peringatan!'}</div>
            <div class="text-sm mt-1">${message}</div>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
    // Debounce function
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
    
    // Dynamic form functions
    let familyIndex = 3;
    let educationIndex = 0;
    let nonFormalEducationIndex = 0;
    let workIndex = 0;
    let languageIndex = 0;
    let socialActivityIndex = 0;
    let achievementIndex = 0;

    // Get default templates
    function getDefaultFamilyMember(index) {
        return `
            <div class="dynamic-group" data-index="${index}">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="form-group">
                        <label class="form-label">Hubungan Keluarga <span class="required-star">*</span></label>
                        <select name="family_members[${index}][relationship]" class="form-input" required>
                            <option value="">Pilih Hubungan</option>
                            <option value="Pasangan">Pasangan</option>
                            <option value="Anak">Anak</option>
                            <option value="Ayah">Ayah</option>
                            <option value="Ibu">Ibu</option>
                            <option value="Saudara">Saudara</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nama <span class="required-star">*</span></label>
                        <input type="text" name="family_members[${index}][name]" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Usia <span class="required-star">*</span></label>
                        <input type="number" name="family_members[${index}][age]" class="form-input" min="0" max="120" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pendidikan <span class="required-star">*</span></label>
                        <input type="text" name="family_members[${index}][education]" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pekerjaan <span class="required-star">*</span></label>
                        <input type="text" name="family_members[${index}][occupation]" class="form-input" required>
                    </div>
                    <div class="form-group flex items-end">
                        <button type="button" class="btn-remove" onclick="removeFamilyMember(this)">Hapus</button>
                    </div>
                </div>
            </div>
        `;
    }

    function getDefaultEducation(index) {
        return `
            <div class="dynamic-group" data-index="${index}">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="form-group">
                        <label class="form-label">Jenjang Pendidikan <span class="required-star">*</span></label>
                        <select name="formal_education[${index}][education_level]" class="form-input" required>
                            <option value="">Pilih Jenjang</option>
                            <option value="SMA/SMK">SMA/SMK</option>
                            <option value="Diploma">Diploma</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nama Institusi <span class="required-star">*</span></label>
                        <input type="text" name="formal_education[${index}][institution_name]" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Jurusan <span class="required-star">*</span></label>
                        <input type="text" name="formal_education[${index}][major]" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tahun Mulai <span class="required-star">*</span></label>
                        <input type="number" name="formal_education[${index}][start_year]" class="form-input" min="1950" max="2030" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tahun Selesai <span class="required-star">*</span></label>
                        <input type="number" name="formal_education[${index}][end_year]" class="form-input" min="1950" max="2030" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">IPK/Nilai <span class="required-star">*</span></label>
                        <input type="number" name="formal_education[${index}][gpa]" class="form-input" step="0.01" min="0" max="4" required>
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeEducation(this)" ${index === 0 ? 'style="display:none"' : ''}>Hapus Pendidikan</button>
                </div>
            </div>
        `;
    }

    function getDefaultLanguageSkill(index) {
        return `
            <div class="dynamic-group" data-index="${index}">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="form-group">
                        <label class="form-label">Bahasa <span class="required-star">*</span></label>
                        <select name="language_skills[${index}][language]" class="form-input" required>
                            <option value="">Pilih Bahasa</option>
                            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                            <option value="Bahasa Inggris">Bahasa Inggris</option>
                            <option value="Bahasa Mandarin">Bahasa Mandarin</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kemampuan Berbicara <span class="required-star">*</span></label>
                        <select name="language_skills[${index}][speaking_level]" class="form-input" required>
                            <option value="">Pilih Level</option>
                            <option value="Pemula">Pemula</option>
                            <option value="Menengah">Menengah</option>
                            <option value="Mahir">Mahir</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kemampuan Menulis <span class="required-star">*</span></label>
                        <select name="language_skills[${index}][writing_level]" class="form-input" required>
                            <option value="">Pilih Level</option>
                            <option value="Pemula">Pemula</option>
                            <option value="Menengah">Menengah</option>
                            <option value="Mahir">Mahir</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeLanguageSkill(this)" ${index === 0 ? 'style="display:none"' : ''}>Hapus Bahasa</button>
                </div>
            </div>
        `;
    }

    // Make functions global for onclick handlers
    window.addFamilyMember = function() {
        familyIndex++;
        const container = document.getElementById('familyMembers');
        container.insertAdjacentHTML('beforeend', getDefaultFamilyMember(familyIndex));
        attachEventListeners();
        updateRemoveButtons('familyMembers');
    };

    window.removeFamilyMember = function(button) {
        const container = document.getElementById('familyMembers');
        if (container.children.length > 1) {
            button.closest('.dynamic-group').remove();
            updateRemoveButtons('familyMembers');
            saveFormData();
        } else {
            showAlert('Minimal harus ada 1 anggota keluarga.', 'warning');
        }
    };

    window.addEducation = function() {
        educationIndex++;
        const container = document.getElementById('formalEducation');
        container.insertAdjacentHTML('beforeend', getDefaultEducation(educationIndex));
        attachEventListeners();
        updateRemoveButtons('formalEducation');
    };

    window.removeEducation = function(button) {
        const container = document.getElementById('formalEducation');
        if (container.children.length > 1) {
            button.closest('.dynamic-group').remove();
            updateRemoveButtons('formalEducation');
            saveFormData();
        } else {
            showAlert('Minimal harus ada 1 pendidikan formal.', 'warning');
        }
    };

    window.addLanguageSkill = function() {
        languageIndex++;
        const container = document.getElementById('languageSkills');
        container.insertAdjacentHTML('beforeend', getDefaultLanguageSkill(languageIndex));
        attachEventListeners();
        updateRemoveButtons('languageSkills');
    };

    window.removeLanguageSkill = function(button) {
        const container = document.getElementById('languageSkills');
        if (container.children.length > 1) {
            button.closest('.dynamic-group').remove();
            updateRemoveButtons('languageSkills');
            saveFormData();
        } else {
            showAlert('Minimal harus ada 1 kemampuan bahasa.', 'warning');
        }
    };

    // Optional dynamic functions
    window.addNonFormalEducation = function() {
        nonFormalEducationIndex++;
        const container = document.getElementById('nonFormalEducation');
        const template = `
            <div class="dynamic-group" data-index="${nonFormalEducationIndex}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Nama Kursus/Pelatihan</label>
                        <input type="text" name="non_formal_education[${nonFormalEducationIndex}][course_name]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Penyelenggara</label>
                        <input type="text" name="non_formal_education[${nonFormalEducationIndex}][organizer]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tanggal</label>
                        <input type="date" name="non_formal_education[${nonFormalEducationIndex}][date]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Keterangan</label>
                        <input type="text" name="non_formal_education[${nonFormalEducationIndex}][description]" class="form-input">
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeNonFormalEducation(this)">Hapus</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', template);
        attachEventListeners();
    };

    window.removeNonFormalEducation = function(button) {
        button.closest('.dynamic-group').remove();
        saveFormData();
    };

    window.addWorkExperience = function() {
        workIndex++;
        const container = document.getElementById('workExperiences');
        const template = `
            <div class="dynamic-group" data-index="${workIndex}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Nama Perusahaan</label>
                        <input type="text" name="work_experiences[${workIndex}][company_name]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Alamat Perusahaan</label>
                        <input type="text" name="work_experiences[${workIndex}][company_address]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bergerak di Bidang</label>
                        <input type="text" name="work_experiences[${workIndex}][company_field]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Posisi/Jabatan</label>
                        <input type="text" name="work_experiences[${workIndex}][position]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tahun Mulai</label>
                        <input type="number" name="work_experiences[${workIndex}][start_year]" class="form-input" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tahun Selesai</label>
                        <input type="number" name="work_experiences[${workIndex}][end_year]" class="form-input" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gaji Terakhir</label>
                        <input type="number" name="work_experiences[${workIndex}][salary]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Alasan Berhenti</label>
                        <input type="text" name="work_experiences[${workIndex}][reason_for_leaving]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nama & No Telp Atasan Langsung</label>
                        <input type="text" name="work_experiences[${workIndex}][supervisor_contact]" class="form-input" 
                               placeholder="contoh: Bpk. Ahmad - 081234567890">
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeWorkExperience(this)">Hapus Pengalaman</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', template);
        attachEventListeners();
    };

    window.removeWorkExperience = function(button) {
        button.closest('.dynamic-group').remove();
        saveFormData();
    };

    window.addSocialActivity = function() {
        socialActivityIndex++;
        const container = document.getElementById('socialActivities');
        const template = `
            <div class="dynamic-group" data-index="${socialActivityIndex}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Nama Organisasi</label>
                        <input type="text" name="social_activities[${socialActivityIndex}][organization_name]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bidang</label>
                        <input type="text" name="social_activities[${socialActivityIndex}][field]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Periode Kepesertaan</label>
                        <input type="text" name="social_activities[${socialActivityIndex}][period]" class="form-input" 
                               placeholder="contoh: 2020-2022">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Keterangan</label>
                        <input type="text" name="social_activities[${socialActivityIndex}][description]" class="form-input">
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeSocialActivity(this)">Hapus</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', template);
        attachEventListeners();
    };

    window.removeSocialActivity = function(button) {
        button.closest('.dynamic-group').remove();
        saveFormData();
    };

    window.addAchievement = function() {
        achievementIndex++;
        const container = document.getElementById('achievements');
        const template = `
            <div class="dynamic-group" data-index="${achievementIndex}">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="form-group">
                        <label class="form-label">Prestasi</label>
                        <input type="text" name="achievements[${achievementIndex}][achievement]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tahun</label>
                        <input type="number" name="achievements[${achievementIndex}][year]" class="form-input" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Keterangan</label>
                        <input type="text" name="achievements[${achievementIndex}][description]" class="form-input">
                    </div>
                </div>
                <div class="mt-4">
                    <button type="button" class="btn-remove" onclick="removeAchievement(this)">Hapus</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', template);
        attachEventListeners();
    };

    window.removeAchievement = function(button) {
        button.closest('.dynamic-group').remove();
        saveFormData();
    };

    // Address copy functionality
    function initializeAddressCopy() {
        const copyCheckbox = document.getElementById('copy_ktp_address');
        const currentAddressField = document.getElementById('current_address');
        const ktpAddressField = document.getElementById('ktp_address');

        if (copyCheckbox && currentAddressField && ktpAddressField) {
            copyCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    currentAddressField.value = ktpAddressField.value;
                    currentAddressField.setAttribute('readonly', true);
                    currentAddressField.style.backgroundColor = '#f3f4f6';
                    currentAddressField.style.color = '#6b7280';
                    saveFormData();
                } else {
                    currentAddressField.removeAttribute('readonly');
                    currentAddressField.style.backgroundColor = '';
                    currentAddressField.style.color = '';
                    currentAddressField.value = ''; // Clear the field when unchecked
                    currentAddressField.focus();
                    saveFormData();
                }
            });

            // Update current address when KTP address changes (if copy is checked)
            ktpAddressField.addEventListener('input', function() {
                if (copyCheckbox.checked) {
                    currentAddressField.value = this.value;
                    saveFormData();
                }
            });
        }
    }

    // Salary formatting functions yang diperbaiki
    function formatSalary(input) {
        // Simpan posisi cursor
        const cursorPosition = input.selectionStart;
        const oldValue = input.value;
        
        // Remove all non-digits
        let value = input.value.replace(/\D/g, '');
        
        // Add thousand separators
        if (value) {
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        input.value = value;
        
        // Restore cursor position (adjust for added dots)
        const newDots = (value.match(/\./g) || []).length;
        const oldDots = (oldValue.match(/\./g) || []).length;
        const dotDifference = newDots - oldDots;
        
        const newCursorPosition = cursorPosition + dotDifference;
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    function unformatSalary(input) {
        // Remove dots for form submission - hanya menghilangkan titik
        input.value = input.value.replace(/\./g, '');
    }

    // Function untuk mendapatkan nilai raw salary (tanpa titik)
    function getRawSalaryValue(input) {
        return input.value.replace(/\./g, '');
    }

    // Enhanced duplicate checking system
    const duplicateChecker = {
        email: {
            timeout: null,
            isChecking: false,
            lastChecked: null
        },
        nik: {
            timeout: null,
            isChecking: false,
            lastChecked: null
        }
    };

    // Debounced duplicate check function
    function checkDuplicate(fieldType, value, callback) {
        const checker = duplicateChecker[fieldType];
        if (checker.timeout) clearTimeout(checker.timeout);
        if (checker.lastChecked === value) return;
        checker.timeout = setTimeout(async () => {
            if (checker.isChecking) return;
            checker.isChecking = true;
            checker.lastChecked = value;
            try {
                const response = await fetch(`/check-${fieldType}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ [fieldType]: value })
                });
                const result = await response.json();
                callback(result);
            } catch (error) {
                console.error(`Error checking ${fieldType}:`, error);
                callback({ exists: false, message: 'Debug result:0' });
            } finally {
                checker.isChecking = false;
            }
        }, 1000);
    }

    function showDuplicateStatus(fieldId, result, isValid = true) {
        const input = document.getElementById(fieldId);
        const existingStatus = input.parentNode.querySelector('.duplicate-status');
        if (existingStatus) existingStatus.remove();
        const statusElement = document.createElement('div');
        statusElement.className = 'duplicate-status text-xs mt-1 flex items-center';
        if (result.exists) {
            statusElement.className += ' text-red-600';
            statusElement.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                ${result.message}
            `;
            input.classList.add('error');
        } else if (isValid && result.message !== 'Email tidak valid' && result.message !== 'NIK harus 16 digit angka') {
            statusElement.className += ' text-green-600';
            statusElement.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ${result.message}
            `;
            input.classList.remove('error');
        } else {
            statusElement.className += ' text-gray-500';
            statusElement.innerHTML = result.message;
            input.classList.remove('error');
        }
        input.parentNode.appendChild(statusElement);
    }

    function enhanceEmailValidation() {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        emailInput.addEventListener('input', function(e) {
            const email = e.target.value.trim();
            e.target.classList.remove('error');
            if (email.length === 0) {
                const status = e.target.parentNode.querySelector('.duplicate-status');
                if (status) status.remove();
                return;
            }
            if (!isValidEmail(email)) {
                showDuplicateStatus('email', { exists: false, message: 'Format email tidak valid' }, false);
                return;
            }
            checkDuplicate('email', email, (result) => {
                showDuplicateStatus('email', result, true);
            });
        });
    }

    // 🆕 UPDATED: Enhanced NIK validation - less restrictive but still secure
    function enhanceNikValidation() {
        const nikInput = document.getElementById('nik');
        if (!nikInput) return;

        nikInput.addEventListener('input', function(e) {
            const nik = e.target.value.trim();
            e.target.classList.remove('error');
            const existingError = e.target.parentNode.querySelector('.nik-error');
            if (existingError) existingError.remove();

            if (nik.length === 0) {
                const status = e.target.parentNode.querySelector('.duplicate-status');
                if (status) status.remove();
                return;
            }

            if (nik.length !== 16 || !/^[0-9]{16}$/.test(nik)) {
                showDuplicateStatus('nik', { exists: false, message: 'NIK harus 16 digit angka' }, false);
                return;
            }

            // 🆕 UPDATED: Only check duplicates, don't require OCR validation
            checkDuplicate('nik', nik, (result) => {
                showDuplicateStatus('nik', result, true);
            });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function enhanceFormSubmissionValidation() {
        const form = document.getElementById('applicationForm');
        if (!form) return;
        const originalHandler = form.onsubmit;
        form.addEventListener('submit', async function(e) {
            const emailDuplicateStatus = document.querySelector('#email').parentNode.querySelector('.duplicate-status');
            const nikDuplicateStatus = document.querySelector('#nik').parentNode.querySelector('.duplicate-status');
            let hasDuplicates = false;
            let duplicateErrors = [];
            if (emailDuplicateStatus && emailDuplicateStatus.classList.contains('text-red-600')) {
                hasDuplicates = true;
                duplicateErrors.push('Email sudah terdaftar dalam sistem');
            }
            if (nikDuplicateStatus && nikDuplicateStatus.classList.contains('text-red-600')) {
                hasDuplicates = true;
                duplicateErrors.push('NIK sudah terdaftar dalam sistem');
            }
            if (hasDuplicates) {
                e.preventDefault();
                showAlert(
                    'Tidak dapat mengirim lamaran:<br>' + duplicateErrors.join('<br>'),
                    'error'
                );
                const firstError = document.querySelector('.duplicate-status.text-red-600');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
            if (originalHandler) {
                return originalHandler.call(this, e);
            }
        });
    }

    // ✅ KEEP: Existing attachEventListeners function
    function attachEventListeners() {
        // Attach save event listeners for dynamically added elements
        const newInputs = form.querySelectorAll('input:not([type="file"]):not(.listener-attached), select:not(.listener-attached), textarea:not(.listener-attached)');
        
        newInputs.forEach(input => {
            if (!input.classList.contains('listener-attached')) {
                input.addEventListener('change', function() {
                    saveFormData();
                });
                input.addEventListener('input', debounce(function() {
                    saveFormData();
                }, 1000));
                input.classList.add('listener-attached');
            }
        });
    }

    // ✅ KEEP: Existing updateRemoveButtons function  
    function updateRemoveButtons(containerId) {
        const container = document.getElementById(containerId);
        const removeButtons = container.querySelectorAll('.btn-remove');
        
        // For family members, always show remove button since user can delete default fields if not needed
        if (containerId === 'familyMembers') {
            removeButtons.forEach(button => {
                button.style.display = 'inline-block';
            });
        } else {
            // Original logic for other containers
            removeButtons.forEach((button, index) => {
                if (index === 0 && container.children.length > 1) {
                    button.style.display = 'none';
                } else if (index > 0) {
                    button.style.display = 'inline-block';
                }
            });
        }
    }

    // ✅ KEEP: Existing cleanEmptyOptionalFields function
    function cleanEmptyOptionalFields() {
        // Remove empty optional dynamic sections
        const optionalContainers = [
            'nonFormalEducation', 
            'workExperiences', 
            'socialActivities', 
            'achievements'
        ];
        
        optionalContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                const groups = container.querySelectorAll('.dynamic-group');
                groups.forEach(group => {
                    const inputs = group.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select, textarea');
                    const isEmpty = Array.from(inputs).every(input => !input.value || input.value.trim() === '');
                    
                    if (isEmpty) {
                        group.remove();
                    }
                });
            }
        });
    }

    // 🆕 UPDATED: NIK field initialization - no longer locked by default
    function initializeNikField() {
        const nikField = document.getElementById('nik');
        if (!nikField) return;

        // Check if OCR data exists from session
        const ocrValidated = sessionStorage.getItem('nik_locked') === 'true';
        const savedNikValue = sessionStorage.getItem('extracted_nik');
        
        if (ocrValidated && savedNikValue) {
            // Restore OCR state
            nikField.value = savedNikValue;
            nikField.readOnly = true;
            nikField.style.backgroundColor = '#ecfdf5';
            nikField.style.borderColor = '#10b981';
            nikField.style.color = '#065f46';
            nikField.classList.add('ocr-filled');
            addOcrIndicator(nikField);
            console.log('NIK field restored from OCR session:', savedNikValue);
        } else {
            // 🆕 UPDATED: NIK field is now editable by default with helpful placeholder
            nikField.readOnly = false;
            nikField.style.backgroundColor = '';
            nikField.style.color = '';
            nikField.placeholder = 'Masukkan NIK 16 digit atau gunakan scan KTP';
        }
    }

    // 🆕 MOBILE: Initialize mobile file upload handlers
    function initializeMobileFileUploads() {
        console.log('📱 Initializing mobile-optimized file uploads');
        
        // Single file uploads
        const singleFileInputs = ['cv', 'photo', 'transcript'];
        singleFileInputs.forEach(fieldName => {
            const input = document.getElementById(fieldName);
            if (input) {
                // Remove any existing event listeners to prevent duplicates
                input.removeEventListener('change', handleMobileFileUpload);
                
                // Add mobile-optimized event listener
                input.addEventListener('change', function(e) {
                    handleMobileFileUpload(e, fieldName);
                });
                
                console.log(`📱 Mobile file handler attached to ${fieldName}`);
            }
        });

        // Multiple file upload
        const certificatesInput = document.getElementById('certificates');
        if (certificatesInput) {
            certificatesInput.removeEventListener('change', handleMobileMultipleFileUpload);
            certificatesInput.addEventListener('change', function(e) {
                handleMobileMultipleFileUpload(e, 'certificates');
            });
            console.log('📱 Mobile multiple file handler attached to certificates');
        }
    }

    // Main DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 Initializing mobile-optimized form...');
        
        loadFormData();
        initializeAddressCopy();
        initializeNikField();
        initializeMobileFileUploads(); // 🆕 NEW: Initialize mobile file uploads
        
        // Add event listeners for auto-save
        const inputs = form.querySelectorAll('input:not([type="file"]), select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                saveFormData();
            });
            input.addEventListener('input', debounce(function() {
                saveFormData();
            }, 1000));
        });

        // Initialize salary formatting - PERBAIKAN UTAMA
        const salaryInput = document.getElementById('expected_salary');
        if (salaryInput) {
            // Event listener untuk formatting real-time
            salaryInput.addEventListener('input', function(e) {
                formatSalary(e.target);
                
                // Debounced save dengan nilai yang sudah diformat
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    saveFormData();
                }, 1000);
            });
            
            // Format on load if there's a value
            if (salaryInput.value) {
                formatSalary(salaryInput);
            }
            
            // PENTING: Event listener untuk form submission
            salaryInput.form.addEventListener('submit', function(e) {
                // Unformat salary sebelum submit
                const rawValue = getRawSalaryValue(salaryInput);
                salaryInput.value = rawValue;
            });
        }

        // Enhanced NIK validation
        enhanceNikValidation();

        // Enhanced email validation
        enhanceEmailValidation();

        // Enhanced form submission validation
        enhanceFormSubmissionValidation();

        // Initialize remove button states
        updateRemoveButtons('familyMembers');
        updateRemoveButtons('formalEducation');
        updateRemoveButtons('languageSkills');

        // 🆕 MOBILE-OPTIMIZED: Enhanced form validation with mobile file support
        document.getElementById('applicationForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            console.log('📱 Starting mobile-optimized form validation...');

            // PERBAIKAN: Unformat salary sebelum validation dan submission
            const salaryInput = document.getElementById('expected_salary');
            if (salaryInput) {
                const rawValue = getRawSalaryValue(salaryInput);
                salaryInput.value = rawValue;
                console.log('Raw salary value for submission:', rawValue);
            }

            let errors = [];
            let hasError = false;

            // Clean empty optional fields first
            cleanEmptyOptionalFields();

            // Reset all field styles
            form.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error');
            });
            
            // Check required basic fields
            requiredFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input && (!input.value || input.value.trim() === '')) {
                    hasError = true;
                    input.classList.add('error');
                    if (input.type === 'file') {
                        input.classList.add('error');
                    }
                    errors.push(`${input.previousElementSibling.textContent.replace(' *', '')} harus diisi`);
                }
            });
            
            // Enhanced date validation dengan explicit parsing
            const startWorkDate = document.getElementById('start_work_date');
            if (startWorkDate && startWorkDate.value) {
                console.log('Validating start_work_date:', startWorkDate.value);
                
                // Parse date using explicit format (YYYY-MM-DD)
                const selectedDateParts = startWorkDate.value.split('-');
                if (selectedDateParts.length === 3) {
                    const selectedDate = new Date(
                        parseInt(selectedDateParts[0]), // year
                        parseInt(selectedDateParts[1]) - 1, // month (0-based)
                        parseInt(selectedDateParts[2]) // day
                    );
                    
                    const today = new Date();
                    today.setHours(23, 59, 59, 999); // Set to end of today
                    
                    console.log('Selected date:', selectedDate);
                    console.log('Today (end of day):', today);
                    console.log('Is selected date after today?', selectedDate > today);
                    
                    if (selectedDate <= today) {
                        hasError = true;
                        startWorkDate.classList.add('error');
                        const todayStr = new Date().toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric'
                        });
                        errors.push(`Tanggal mulai kerja harus setelah ${todayStr}`);
                    }
                } else {
                    hasError = true;
                    startWorkDate.classList.add('error');
                    errors.push('Format tanggal mulai kerja tidak valid');
                }
            }

            const familyContainer = document.getElementById('familyMembers');
            const educationContainer = document.getElementById('formalEducation');
            const languageContainer = document.getElementById('languageSkills');
            
            if (familyContainer.children.length === 0) {
                hasError = true;
                errors.push('Data keluarga minimal harus diisi 1 anggota');
            }
            
            if (educationContainer.children.length === 0) {
                hasError = true;
                errors.push('Pendidikan formal minimal harus diisi 1 pendidikan');
            }
            
            if (languageContainer.children.length === 0) {
                hasError = true;
                errors.push('Kemampuan bahasa minimal harus diisi 1 bahasa');
            }
            
            [
                {container: familyContainer, name: 'Data Keluarga'},
                {container: educationContainer, name: 'Pendidikan Formal'},
                {container: languageContainer, name: 'Kemampuan Bahasa'}
            ].forEach(section => {
                Array.from(section.container.children).forEach((group, index) => {
                    const requiredInputs = group.querySelectorAll('input[required], select[required]');
                    requiredInputs.forEach(input => {
                        if (!input.value || input.value.trim() === '') {
                            hasError = true;
                            input.classList.add('error');
                            errors.push(`${section.name} #${index + 1}: ${input.previousElementSibling.textContent.replace(' *', '')} harus diisi`);
                        }
                    });
                });
            });

            const agreementCheckbox = document.querySelector('input[name="agreement"]');
            if (!agreementCheckbox.checked) {
                hasError = true;
                errors.push('Anda harus menyetujui pernyataan untuk melanjutkan');
            }

            // 🆕 MOBILE: File validation using simplified mobile validation
            const fileInputs = ['cv', 'photo', 'transcript'];
            for (const fieldName of fileInputs) {
                const input = document.getElementById(fieldName);
                if (input && input.files.length > 0) {
                    const file = input.files[0];
                    const validation = fileValidation[fieldName];
                    
                    console.log(`📱 Validating ${fieldName} file for submission:`, {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                    
                    const validationResult = validateMobileFile(file, validation);
                    
                    if (!validationResult.valid) {
                        hasError = true;
                        errors.push(`${fieldName.toUpperCase()}: ${validationResult.error}`);
                        showMobileFileError(fieldName, validationResult.error);
                    }
                } else if (fileValidation[fieldName].required) {
                    hasError = true;
                    errors.push(`${fieldName.toUpperCase()}: File harus diupload`);
                }
            }
            
            if (hasError) {
                // Re-format salary jika ada error untuk user experience
                if (salaryInput && salaryInput.value) {
                    formatSalary(salaryInput);
                }
                
                let errorMessage = 'Harap lengkapi data berikut:\n\n';
                errors.slice(0, 10).forEach((error, index) => {
                    errorMessage += `${index + 1}. ${error}\n`;
                });
                if (errors.length > 10) {
                    errorMessage += `\n... dan ${errors.length - 10} field lainnya`;
                }
                
                showAlert(errorMessage.replace(/\n/g, '<br>'), 'error');
                
                // Scroll to first error
                const firstError = form.querySelector('.form-input.error, .mobile-file-input.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (firstError.classList.contains('form-input')) {
                        firstError.focus();
                    }
                }
            } else {
                // Disable submit button to prevent double submission
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner mr-2"></span> Mengirim...';
                
                // Submit form dengan nilai raw
                console.log('📱 All mobile validations passed, submitting form with raw salary value...');
                this.submit();
            }
        });

        console.log('📱 Mobile-optimized form initialization complete');
    });

})();