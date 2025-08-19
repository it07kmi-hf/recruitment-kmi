<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Manajemen Posisi - HR System</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/positions-index.css') }}" rel="stylesheet">
</head>
<body>
    <!-- Sidebar Overlay for Mobile -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <div class="dashboard-container">
        <!-- Sidebar -->
        @include('sidebar.sidebar')
        <main class="main-content" id="mainContent">
            <header class="header">
                <div class="header-left">
                    <button class="sidebar-toggle" id="sidebarToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="header-info">
                        <div class="breadcrumb">
                            <a href="{{ route('dashboard') }}">Dashboard</a>
                            <span>/</span>
                            <span>Posisi</span>
                        </div>
                        <h1 class="page-title">Manajemen Posisi</h1>
                    </div>
                </div>
                <div class="header-right">
                    <a href="{{ route('positions.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        <span class="btn-text">Tambah Posisi</span>
                    </a>
                    <a href="{{ route('positions.trashed') }}" class="btn btn-secondary">
                        <i class="fas fa-trash"></i>
                        <span class="btn-text">Posisi Terhapus</span>
                    </a>
                </div>
            </header>

            <div class="content">
                <!-- Filter Section -->
                <div class="filters-section">
                    <form id="filterForm" method="GET">
                        <div class="filters-row">
                            <div class="filter-group">
                                <label class="filter-label">Pencarian</label>
                                <div class="search-input-container">
                                    <i class="fas fa-search search-icon"></i>
                                    <input type="text" name="search" class="filter-input search-input" 
                                           placeholder="Cari posisi, departemen, atau lokasi..."
                                           value="{{ request('search') }}">
                                </div>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">Departemen</label>
                                <select name="department" class="filter-select">
                                    <option value="">Semua Departemen</option>
                                    @foreach(\App\Models\Position::getDepartments() as $dept)
                                        <option value="{{ $dept }}" 
                                                {{ request('department') == $dept ? 'selected' : '' }}>
                                            {{ $dept }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">Status</label>
                                <select name="status" class="filter-select">
                                    <option value="">Semua Status</option>
                                    <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Aktif</option>
                                    <option value="closed" {{ request('status') == 'closed' ? 'selected' : '' }}>Tutup</option>
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label class="filter-label">Tipe</label>
                                <select name="employment_type" class="filter-select">
                                    <option value="">Semua Tipe</option>
                                    @foreach(\App\Models\Position::getEmploymentTypes() as $key => $label)
                                        <option value="{{ $key }}" 
                                                {{ request('employment_type') == $key ? 'selected' : '' }}>
                                            {{ $label }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-filter"></i>
                                    <span class="btn-text">Filter</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title">Daftar Posisi</h3>
                        <span class="table-info">Total: {{ $positions->total() }} posisi</span>
                    </div>
                    
                    <!-- Desktop Table -->
                    <div class="desktop-table">
                        <table class="positions-table">
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th width="25%">Posisi</th>
                                    <th width="15%">Tipe & Gaji</th>
                                    <th width="15%">Aplikasi</th>
                                    <th width="10%">Status</th>
                                    <th width="15%">Tanggal</th>
                                    <th width="10%">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($positions as $index => $position)
                                <tr>
                                    <td>{{ $positions->firstItem() + $index }}</td>
                                    <td>
                                        <div class="position-info">
                                            <div class="position-name">{{ $position->position_name }}</div>
                                            <div class="position-department">{{ $position->department }}</div>
                                            @if($position->location)
                                                <div class="position-location">
                                                    <i class="fas fa-map-marker-alt"></i> {{ $position->location }}
                                                </div>
                                            @endif
                                        </div>
                                    </td>
                                    <td>
                                        <div style="margin-bottom: 8px;">
                                            <span class="employment-badge employment-{{ str_replace('-', '-', $position->employment_type) }}">
                                                {{ $position->employment_type_label }}
                                            </span>
                                        </div>
                                        <div style="font-size: 0.85rem; color: #6b7280;">
                                            {{ $position->salary_range }}
                                        </div>
                                    </td>
                                    <td>
                                        <div class="application-stats">
                                            <div class="stat-item">
                                                <span class="stat-label">
                                                    <i class="fas fa-users"></i>
                                                    Total:
                                                </span>
                                                <span class="stat-value {{ $position->total_applications_count == 0 ? 'zero' : '' }}">
                                                    {{ $position->total_applications_count }}
                                                </span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-label">
                                                    <i class="fas fa-clock"></i>
                                                    Proses:
                                                </span>
                                                <span class="stat-value {{ $position->active_applications_count == 0 ? 'zero' : ($position->active_applications_count > 0 ? 'warning' : 'active') }}">
                                                    {{ $position->active_applications_count }}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        @if($position->detailed_status === 'aktif')
                                            <span class="status-badge status-active">
                                                <i class="fas fa-check-circle"></i> Aktif
                                            </span>
                                        @else
                                            <span class="status-badge status-closed">
                                                <i class="fas fa-times-circle"></i> Tutup
                                            </span>
                                        @endif
                                    </td>
                                    <td>
                                        <div style="font-size: 0.85rem;">
                                            @if($position->posted_date)
                                                <div style="color: #6b7280; margin-bottom: 4px;">
                                                    Posted: {{ $position->posted_date->format('d M Y') }}
                                                </div>
                                            @endif
                                            @if($position->closing_date)
                                                <div style="color: {{ $position->closing_date->isPast() ? '#dc2626' : '#f59e0b' }};">
                                                    Tutup: {{ $position->closing_date->format('d M Y') }}
                                                    @if($position->closing_date->isPast())
                                                        <span style="font-size: 0.7rem;">(Lewat)</span>
                                                    @endif
                                                </div>
                                            @endif
                                        </div>
                                    </td>
                                    <td>
                                        <div class="action-dropdown">
                                            <button class="action-btn" onclick="toggleDropdown(this)">
                                                <i class="fas fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-menu">
                                                <a href="{{ route('positions.edit', $position->id) }}" class="dropdown-item">
                                                    <i class="fas fa-edit"></i>
                                                    Edit
                                                </a>
                                                <div class="dropdown-divider"></div>
                                           
                                                @if($position->detailed_status === 'aktif')
                                                    <button class="dropdown-item" 
                                                            onclick="togglePositionStatus({{ $position->id }}, '{{ addslashes($position->position_name) }}', 'close', {{ $position->active_applications_count }}, {{ $position->total_applications_count }})">
                                                        <i class="fas fa-ban"></i>
                                                        Tutup Posisi
                                                    </button>
                                                @else
                                                    <button class="dropdown-item" 
                                                            onclick="togglePositionStatus({{ $position->id }}, '{{ addslashes($position->position_name) }}', 'open', {{ $position->active_applications_count }}, {{ $position->total_applications_count }})">
                                                        <i class="fas fa-check"></i>
                                                        Buka Posisi
                                                    </button>
                                                @endif
                                                <div class="dropdown-divider"></div>
                                                <button type="button" 
                                                        class="btn btn-outline-danger btn-sm btn-delete-position dropdown-item" 
                                                        data-position-id="{{ $position->id }}"
                                                        data-position-name="{{ $position->position_name }}"
                                                        onclick="deletePosition({{ $position->id }}, '{{ addslashes($position->position_name) }}', {{ $position->total_applications_count }}, {{ $position->active_applications_count }})"
                                                        title="Hapus Posisi">
                                                    <i class="fas fa-trash-alt"></i> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="7" class="empty-state">
                                        <i class="fas fa-briefcase"></i>
                                        <p>Tidak ada posisi yang tersedia</p>
                                        @if(request()->hasAny(['search', 'department', 'status', 'employment_type']))
                                            <small>Coba ubah filter pencarian Anda</small>
                                        @endif
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Cards -->
                    <div class="mobile-cards">
                        @forelse($positions as $index => $position)
                        <div class="position-card">
                            <div class="card-header">
                                <div class="position-info">
                                    <div class="position-name">{{ $position->position_name }}</div>
                                    <div class="position-department">{{ $position->department }}</div>
                                    @if($position->location)
                                        <div class="position-location">
                                            <i class="fas fa-map-marker-alt"></i> {{ $position->location }}
                                        </div>
                                    @endif
                                </div>
                                <div class="card-actions">
                                    <div class="action-dropdown">
                                        <button class="action-btn" onclick="toggleDropdown(this)">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <a href="{{ route('positions.edit', $position->id) }}" class="dropdown-item">
                                                <i class="fas fa-edit"></i>
                                                Edit
                                            </a>
                                            <div class="dropdown-divider"></div>
                                       
                                            @if($position->detailed_status === 'aktif')
                                                <button class="dropdown-item" 
                                                        onclick="togglePositionStatus({{ $position->id }}, '{{ addslashes($position->position_name) }}', 'close', {{ $position->active_applications_count }}, {{ $position->total_applications_count }})">
                                                    <i class="fas fa-ban"></i>
                                                    Tutup Posisi
                                                </button>
                                            @else
                                                <button class="dropdown-item" 
                                                        onclick="togglePositionStatus({{ $position->id }}, '{{ addslashes($position->position_name) }}', 'open', {{ $position->active_applications_count }}, {{ $position->total_applications_count }})">
                                                    <i class="fas fa-check"></i>
                                                    Buka Posisi
                                                </button>
                                            @endif
                                            <div class="dropdown-divider"></div>
                                            <button type="button" 
                                                    class="btn btn-outline-danger btn-sm btn-delete-position dropdown-item" 
                                                    data-position-id="{{ $position->id }}"
                                                    data-position-name="{{ $position->position_name }}"
                                                    onclick="deletePosition({{ $position->id }}, '{{ addslashes($position->position_name) }}', {{ $position->total_applications_count }}, {{ $position->active_applications_count }})"
                                                    title="Hapus Posisi">
                                                <i class="fas fa-trash-alt"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card-content">
                                <div class="card-row">
                                    <div class="card-label">
                                        <i class="fas fa-briefcase"></i>
                                        Tipe
                                    </div>
                                    <div class="card-value">
                                        <span class="employment-badge employment-{{ str_replace('-', '-', $position->employment_type) }}">
                                            {{ $position->employment_type_label }}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="card-row">
                                    <div class="card-label">
                                        <i class="fas fa-money-bill-wave"></i>
                                        Gaji
                                    </div>
                                    <div class="card-value">{{ $position->salary_range }}</div>
                                </div>
                                
                                <div class="card-row">
                                    <div class="card-label">
                                        <i class="fas fa-users"></i>
                                        Aplikasi
                                    </div>
                                    <div class="card-value">
                                        <span class="stat-value {{ $position->total_applications_count == 0 ? 'zero' : '' }}">
                                            {{ $position->total_applications_count }}
                                        </span>
                                        <small>({{ $position->active_applications_count }} aktif)</small>
                                    </div>
                                </div>
                                
                                <div class="card-row">
                                    <div class="card-label">
                                        <i class="fas fa-info-circle"></i>
                                        Status
                                    </div>
                                    <div class="card-value">
                                        @if($position->detailed_status === 'aktif')
                                            <span class="status-badge status-active">
                                                <i class="fas fa-check-circle"></i> Aktif
                                            </span>
                                        @else
                                            <span class="status-badge status-closed">
                                                <i class="fas fa-times-circle"></i> Tutup
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                
                                @if($position->posted_date || $position->closing_date)
                                <div class="card-row">
                                    <div class="card-label">
                                        <i class="fas fa-calendar"></i>
                                        Tanggal
                                    </div>
                                    <div class="card-value">
                                        @if($position->posted_date)
                                            <div style="font-size: 0.8rem; color: #6b7280;">
                                                Posted: {{ $position->posted_date->format('d M Y') }}
                                            </div>
                                        @endif
                                        @if($position->closing_date)
                                            <div style="font-size: 0.8rem; color: {{ $position->closing_date->isPast() ? '#dc2626' : '#f59e0b' }};">
                                                Tutup: {{ $position->closing_date->format('d M Y') }}
                                                @if($position->closing_date->isPast())
                                                    <span style="font-size: 0.7rem;">(Lewat)</span>
                                                @endif
                                            </div>
                                        @endif
                                    </div>
                                </div>
                                @endif
                            </div>
                        </div>
                        @empty
                        <div class="empty-state">
                            <i class="fas fa-briefcase"></i>
                            <p>Tidak ada posisi yang tersedia</p>
                            @if(request()->hasAny(['search', 'department', 'status', 'employment_type']))
                                <small>Coba ubah filter pencarian Anda</small>
                            @endif
                        </div>
                        @endforelse
                    </div>

                    <!-- Enhanced Pagination -->
                    @if ($positions->hasPages())
                    <div class="pagination-container">
                        <div class="custom-pagination">
                            {{-- Info summary --}}
                            <div class="pagination-info">
                                <div class="pagination-summary">
                                    Menampilkan {{ $positions->firstItem() ?? 0 }} - {{ $positions->lastItem() ?? 0 }} 
                                    dari {{ $positions->total() }} hasil
                                </div>
                                <div class="pagination-total">
                                    Halaman {{ $positions->currentPage() }} dari {{ $positions->lastPage() }}
                                </div>
                            </div>

                            {{-- Custom Pagination --}}
                            <div class="d-flex justify-content-center">
                                <ul class="pagination">
                                    {{-- Tombol Prev --}}
                                    @if ($positions->onFirstPage())
                                        <li class="page-item disabled">
                                            <span class="page-link">‹</span>
                                        </li>
                                    @else
                                        <li class="page-item">
                                            <a class="page-link" href="{{ $positions->previousPageUrl() }}" rel="prev">‹</a>
                                        </li>
                                    @endif

                                    {{-- Angka halaman --}}
                                    @foreach ($positions->links()->elements[0] as $page => $url)
                                        @if ($page == $positions->currentPage())
                                            <li class="page-item active"><span class="page-link">{{ $page }}</span></li>
                                        @else
                                            <li class="page-item"><a class="page-link" href="{{ $url }}">{{ $page }}</a></li>
                                        @endif
                                    @endforeach

                                    {{-- Tombol Next --}}
                                    @if ($positions->hasMorePages())
                                        <li class="page-item">
                                            <a class="page-link" href="{{ $positions->nextPageUrl() }}" rel="next">›</a>
                                        </li>
                                    @else
                                        <li class="page-item disabled">
                                            <span class="page-link">›</span>
                                        </li>
                                    @endif
                                </ul>
                            </div>
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </main>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/position-transfer.js') }}"></script>
    <script src="{{ asset('js/positions-index.js') }}"></script>
</body>
</html>