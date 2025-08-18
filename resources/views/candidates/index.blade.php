<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Manajemen Kandidat - HR System</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/candidates-index.css') }}" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <i class="fas fa-building"></i>
                    <span class="logo-text">HR System</span>
                </div>
            </div>

            <div class="user-info">
                <div class="user-avatar">
                    {{ substr(Auth::user()->full_name, 0, 2) }}
                </div>
                <div class="user-details">
                    <div class="user-name">{{ Auth::user()->full_name }}</div>
                    <div class="user-role">{{ ucfirst(Auth::user()->role) }}</div>
                </div>
            </div>

            <nav class="nav-menu">
                @if(in_array(Auth::user()->role, ['admin', 'hr']))
                    <div class="nav-item">
                        <a href="{{ route('candidates.index') }}" class="nav-link active">
                            <i class="fas fa-user-tie"></i>
                            <span>Kandidat</span>
                        </a>
                    </div>
                    <div class="nav-item">
                        <a href="{{ route('positions.index') }}" class="nav-link">
                            <i class="fas fa-briefcase"></i>
                            <span>Posisi</span>
                        </a>
                    </div>
                @endif
            </nav>
        </aside>

        <div class="mobile-overlay" id="mobileOverlay"></div>

        <main class="main-content" id="mainContent">
            <header class="header">
                <div class="header-left">
                    <button class="sidebar-toggle" id="sidebarToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h1 class="page-title">
                        <span class="title-full">Manajemen Kandidat</span>
                        <span class="title-short">Kandidat</span>
                    </h1>
                </div>
                <div class="header-right">
                    <a href="{{ route('candidates.trashed') }}" class="btn-secondary btn-responsive">
                        <i class="fas fa-trash"></i>
                        <span class="btn-text">Kandidat Terhapus</span>
                        <span class="btn-text-short">Trash</span>
                    </a>
                    
                    <form action="{{ route('logout') }}" method="POST" style="display: inline;">
                        @csrf
                        <button type="submit" class="logout-btn btn-responsive" onclick="return confirm('Apakah Anda yakin ingin logout?')">
                            <i class="fas fa-sign-out-alt"></i>
                            <span class="btn-text">Logout</span>
                        </button>
                    </form>
                </div>
            </header>

            <div class="content">
                <div class="filter-section">
                    <div class="filter-header">
                        <h3 class="filter-title">
                            <i class="fas fa-filter"></i>
                            Filter & Pencarian
                        </h3>
                        <button type="button" class="filter-toggle" id="filterToggle">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    
                    <div class="filter-content" id="filterContent">
                        <form id="filterForm">
                            <div class="filter-row">
                                <div class="search-box">
                                    <i class="fas fa-search search-icon"></i>
                                    <input type="text" class="search-input" id="searchInput" 
                                           placeholder="Cari berdasarkan nama, email, atau kode kandidat..."
                                           value="{{ request('search') }}">
                                </div>
                                
                                <div class="filter-grid">
                                    <div class="filter-group">
                                        <label class="filter-label">Status</label>
                                        <select class="filter-select" id="statusFilter">
                                            <option value="">Semua Status</option>
                                            @foreach(\App\Models\Candidate::getStatusOptions() as $statusKey => $statusLabel)
                                                <option value="{{ $statusKey }}" 
                                                        {{ request('status') == $statusKey ? 'selected' : '' }}>
                                                    {{ $statusLabel }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    
                                    <div class="filter-group">
                                        <label class="filter-label">Posisi</label>
                                        <select class="filter-select" id="positionFilter">
                                            <option value="">Semua Posisi</option>
                                            @foreach($positions as $position)
                                                <option value="{{ $position->position_name }}"
                                                        {{ request('position') == $position->position_name ? 'selected' : '' }}>
                                                    {{ $position->position_name }} - {{ $position->department }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    
                                    <div class="filter-group">
                                        <label class="filter-label">Status Test</label>
                                        <select class="filter-select" id="testStatusFilter">
                                            <option value="">Semua</option>
                                            <option value="all_tests_completed" {{ request('test_status') == 'all_tests_completed' ? 'selected' : '' }}>
                                                Semua Test Selesai
                                            </option>
                                            <option value="kraeplin_completed" {{ request('test_status') == 'kraeplin_completed' ? 'selected' : '' }}>
                                                Kraeplin Selesai
                                            </option>
                                            <option value="disc_completed" {{ request('test_status') == 'disc_completed' ? 'selected' : '' }}>
                                                DISC Selesai
                                            </option>
                                            <option value="no_tests" {{ request('test_status') == 'no_tests' ? 'selected' : '' }}>
                                                Belum Test
                                            </option>
                                        </select>
                                    </div>
                                    
                                    <div class="filter-group">
                                        <label class="filter-label">Kategori Kraeplin</label>
                                        <select class="filter-select" id="kraeplinCategoryFilter">
                                            <option value="">Semua Kategori</option>
                                            @foreach($kraeplinCategories as $category)
                                                <option value="{{ $category }}" 
                                                        {{ request('kraeplin_category') == $category ? 'selected' : '' }}>
                                                    {{ ucfirst($category) }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    
                                    <div class="filter-group">
                                        <label class="filter-label">Tipe DISC</label>
                                        <select class="filter-select" id="discTypeFilter">
                                            <option value="">Semua Tipe</option>
                                            @foreach($discTypes as $type)
                                                <option value="{{ $type }}" 
                                                        {{ request('disc_type') == $type ? 'selected' : '' }}>
                                                    {{ strtoupper($type) }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="action-buttons">
                                    <button type="button" class="btn-secondary" onclick="resetFilters()">
                                        <i class="fas fa-redo"></i>
                                        <span class="btn-text">Reset</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="bulk-action-toolbar" id="bulkActionToolbar" style="display: none;">
                    <div class="bulk-action-content">
                        <span><span id="selectedCount">0</span> kandidat terpilih</span>
                        <div class="bulk-actions">
                            <button type="button" class="btn-small btn-danger" onclick="bulkDelete()">
                                <i class="fas fa-trash"></i> 
                                <span class="btn-text">Hapus Terpilih</span>
                                <span class="btn-text-short">Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <div class="loading-overlay" id="loadingOverlay">
                        <div class="loading-spinner"></div>
                    </div>
                    
                    <div class="table-header">
                        <h3 class="table-title">Daftar Kandidat</h3>
                        <span class="table-info">Total: {{ $candidates->total() }} kandidat</span>
                    </div>
                    
                    <div class="table-wrapper">
                        <table class="candidates-table">
                            <thead>
                                <tr>
                                    <th class="col-no">No</th>
                                    <th class="col-checkbox">
                                        <input type="checkbox" id="selectAll" style="margin: 0;">
                                    </th>
                                    <th class="col-code">Kode</th>
                                    <th class="col-candidate">Kandidat</th>
                                    <th class="col-position">Posisi</th>
                                    <th class="col-status">Status</th>
                                    <th class="col-date">Tgl Apply</th>
                                    <th class="col-salary">Gaji Harapan</th>
                                    <th class="col-kraeplin">Skor Kraeplin</th>
                                    <th class="col-disc">Tipe DISC</th>
                                    <th class="col-actions">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($candidates as $index => $candidate)
                                <tr>
                                    <td class="col-no">{{ $candidates->firstItem() + $index }}</td>
                                    <td class="col-checkbox">
                                        <input type="checkbox" class="candidate-checkbox" value="{{ $candidate->id }}" style="margin: 0;">
                                    </td>
                                    <td class="col-code">
                                        <span class="candidate-code">
                                            {{ $candidate->candidate_code }}
                                        </span>
                                    </td>
                                    <td class="col-candidate">
                                        <div class="candidate-info">
                                            <div class="candidate-avatar">
                                                @php
                                                    $photoDocument = $candidate->documentUploads->where('document_type', 'photo')->first();
                                                @endphp
                                                @if($photoDocument)
                                                    <img src="{{ Storage::url($photoDocument->file_path) }}" 
                                                        alt="Foto {{ $candidate->full_name ?? 'Kandidat' }}" 
                                                        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                                                @else
                                                    {{ substr($candidate->full_name ?? 'N/A', 0, 2) }}
                                                @endif
                                            </div>
                                            <div class="candidate-details">
                                                <div class="candidate-name">
                                                    {{ $candidate->full_name ?? 'N/A' }}
                                                </div>
                                                <div class="candidate-email">
                                                    {{ $candidate->email ?? 'N/A' }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="col-position">
                                        <span class="position-text">{{ $candidate->position_applied }}</span>
                                    </td>
                                    <td class="col-status">
                                        <span class="status-badge {{ $candidate->status_badge_class }}">
                                            {{ \App\Models\Candidate::getStatusOptions()[$candidate->application_status] ?? ucfirst($candidate->application_status) }}
                                        </span>
                                    </td>
                                    <td class="col-date">
                                        <span class="date-text">{{ $candidate->created_at->format('d M Y') }}</span>
                                    </td>
                                    <td class="col-salary">
                                        @if($candidate->expected_salary)
                                            <span class="salary-amount">Rp {{ number_format($candidate->expected_salary, 0, ',', '.') }}</span>
                                        @else
                                            <span class="salary-none">Tidak disebutkan</span>
                                        @endif
                                    </td>
                                    <td class="col-kraeplin">
                                        @if($candidate->kraeplinTestResult)
                                            <div class="test-score">
                                                <span class="score-value">{{ $candidate->kraeplinTestResult->overall_score ?? 0 }}</span>
                                                @if($candidate->kraeplinTestResult->performance_category)
                                                    <span class="score-category kraeplin-{{ strtolower($candidate->kraeplinTestResult->performance_category) }}">
                                                        {{ ucfirst($candidate->kraeplinTestResult->performance_category) }}
                                                    </span>
                                                @endif
                                            </div>
                                        @else
                                            <span class="test-not-taken">Belum test</span>
                                        @endif
                                    </td>
                                    <td class="col-disc">
                                        @if($candidate->disc3DResult && $candidate->disc3DResult->primary_type)
                                            <div class="test-score">
                                                <span class="disc-type disc-{{ strtolower($candidate->disc3DResult->primary_type) }}">
                                                    {{ strtoupper($candidate->disc3DResult->primary_type) }}
                                                </span>
                                                @if($candidate->disc3DResult->primary_percentage)
                                                    <span class="disc-percentage">
                                                        {{ round($candidate->disc3DResult->primary_percentage) }}%
                                                    </span>
                                                @endif
                                            </div>
                                        @else
                                            <span class="test-not-taken">Belum test</span>
                                        @endif
                                    </td>
                                    <td class="col-actions">
                                        <div class="action-dropdown">
                                            <button class="action-btn" onclick="toggleDropdown(this)">
                                                <i class="fas fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-menu">
                                                <a href="{{ route('candidates.show', $candidate->id) }}" class="dropdown-item">
                                                    <i class="fas fa-eye"></i>
                                                    Lihat Detail
                                                </a>
                                                <a href="{{ route('candidates.edit', $candidate->id) }}" class="dropdown-item">
                                                    <i class="fas fa-edit"></i>
                                                    Edit
                                                </a>
                                                @if($candidate->kraeplinTestResult)
                                                    <a href="{{ route('candidates.show', $candidate->id) }}#kraeplin-section" class="dropdown-item">
                                                        <i class="fas fa-chart-line"></i>
                                                        Hasil Kraeplin
                                                    </a>
                                                @endif
                                                @if($candidate->disc3DResult)
                                                    <a href="{{ route('candidates.show', $candidate->id) }}#disc-section" class="dropdown-item">
                                                        <i class="fas fa-chart-pie"></i>
                                                        Hasil DISC
                                                    </a>
                                                @endif
                                                <div class="dropdown-divider"></div>
                                                <a href="#" class="dropdown-item" onclick="deleteCandidate({{ $candidate->id }}, '{{ $candidate->full_name ?? 'Unknown' }}')">
                                                    <i class="fas fa-trash"></i>
                                                    Hapus
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="11" class="empty-state">
                                        <i class="fas fa-inbox"></i>
                                        <div class="empty-message">
                                            Tidak ada data kandidat
                                            @if(request()->hasAny(['search', 'status', 'position', 'test_status', 'kraeplin_category', 'disc_type']))
                                                <small>Coba ubah filter pencarian Anda</small>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="pagination">
                        <div class="pagination-info">
                            <div class="pagination-summary">
                                <span class="info-highlight">{{ $candidates->firstItem() ?? 0 }} - {{ $candidates->lastItem() ?? 0 }}</span>
                                dari <span class="info-total">{{ $candidates->total() }}</span> kandidat
                            </div>
                            <div class="pagination-meta">
                                <i class="fas fa-file-alt"></i>
                                Halaman {{ $candidates->currentPage() }} dari {{ $candidates->lastPage() }}
                            </div>
                        </div>
                        
                        <div class="pagination-controls">
                            <div class="pagination-nav">
                                @if($candidates->currentPage() > 1)
                                    <a href="{{ $candidates->appends(request()->query())->url(1) }}" class="page-btn nav-btn" title="Halaman Pertama">
                                        <i class="fas fa-angle-double-left"></i>
                                    </a>
                                @else
                                    <button class="page-btn nav-btn" disabled title="Halaman Pertama">
                                        <i class="fas fa-angle-double-left"></i>
                                    </button>
                                @endif

                                @if($candidates->previousPageUrl())
                                    <a href="{{ $candidates->appends(request()->query())->previousPageUrl() }}" class="page-btn nav-btn" title="Halaman Sebelumnya">
                                        <i class="fas fa-chevron-left"></i>
                                    </a>
                                @else
                                    <button class="page-btn nav-btn" disabled title="Halaman Sebelumnya">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                @endif
                                
                                @php
                                    $start = max(1, $candidates->currentPage() - 2);
                                    $end = min($candidates->lastPage(), $candidates->currentPage() + 2);
                                    
                                    if ($candidates->currentPage() <= 3) {
                                        $end = min($candidates->lastPage(), 5);
                                    }
                                    if ($candidates->currentPage() > $candidates->lastPage() - 3) {
                                        $start = max(1, $candidates->lastPage() - 4);
                                    }
                                @endphp

                                @if($start > 1)
                                    <a href="{{ $candidates->appends(request()->query())->url(1) }}" class="page-btn">1</a>
                                    @if($start > 2)
                                        <span class="pagination-ellipsis">
                                            <i class="fas fa-ellipsis-h"></i>
                                        </span>
                                    @endif
                                @endif

                                @for($page = $start; $page <= $end; $page++)
                                    @if($page == $candidates->currentPage())
                                        <button class="page-btn active">
                                            <span class="page-number">{{ $page }}</span>
                                            <div class="active-indicator"></div>
                                        </button>
                                    @else
                                        <a href="{{ $candidates->appends(request()->query())->url($page) }}" class="page-btn">
                                            <span class="page-number">{{ $page }}</span>
                                        </a>
                                    @endif
                                @endfor

                                @if($end < $candidates->lastPage())
                                    @if($end < $candidates->lastPage() - 1)
                                        <span class="pagination-ellipsis">
                                            <i class="fas fa-ellipsis-h"></i>
                                        </span>
                                    @endif
                                    <a href="{{ $candidates->appends(request()->query())->url($candidates->lastPage()) }}" class="page-btn">{{ $candidates->lastPage() }}</a>
                                @endif

                                @if($candidates->nextPageUrl())
                                    <a href="{{ $candidates->appends(request()->query())->nextPageUrl() }}" class="page-btn nav-btn" title="Halaman Selanjutnya">
                                        <i class="fas fa-chevron-right"></i>
                                    </a>
                                @else
                                    <button class="page-btn nav-btn" disabled title="Halaman Selanjutnya">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                @endif

                                @if($candidates->currentPage() < $candidates->lastPage())
                                    <a href="{{ $candidates->appends(request()->query())->url($candidates->lastPage()) }}" class="page-btn nav-btn" title="Halaman Terakhir">
                                        <i class="fas fa-angle-double-right"></i>
                                    </a>
                                @else
                                    <button class="page-btn nav-btn" disabled title="Halaman Terakhir">
                                        <i class="fas fa-angle-double-right"></i>
                                    </button>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="{{ asset('js/candidates-index.js') }}"></script>
</body>
</html>