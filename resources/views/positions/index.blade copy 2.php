<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="csrf_token_placeholder">
    <title>Manajemen Posisi - HR System</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #1a202c;
            line-height: 1.6;
        }

        .dashboard-container {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Styles */
        /* .sidebar {
            width: 280px;
            background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            transition: all 0.3s ease;
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            z-index: 1000;
            overflow-y: auto;
        } */

        .sidebar {
            width: 280px;
            background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
            color: white;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            transition: all 0.3s ease;
            z-index: 1000;
            border-right: 1px solid #4a5568;
        }

        .sidebar.collapsed {
            width: 70px;
        }

        .sidebar-header {
            padding: 1.5rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 700;
        }
        
        .logo i {
            font-size: 2rem;
            color: #46e54e;
        }

        .logo-text {
            transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .logo-text {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }

        .user-info {
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .user-name {
            font-weight: 600;
            font-size: 0.9rem;
        }

        .user-role {
            font-size: 0.8rem;
            opacity: 0.8;
            text-transform: capitalize;
        }

        .sidebar.collapsed .user-info {
            text-align: center;
        }

        .sidebar.collapsed .user-details {
            align-items: center;
        }

        .sidebar.collapsed .user-name,
        .sidebar.collapsed .user-role {
            font-size: 0.7rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 50px;
        }

        .nav-menu {
            padding: 1rem 0;
        }

        .nav-item {
            margin-bottom: 0.5rem;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            transition: all 0.3s ease;
            border-radius: 0;
            position: relative;
        }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .nav-link.active {
            background: rgba(255, 255, 255, 0.15);
            color: white;
        }

        .nav-link i {
            width: 20px;
            text-align: center;
            flex-shrink: 0;
        }

        .sidebar.collapsed .nav-link span {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            transition: margin-left 0.3s ease;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .main-content.expanded {
            margin-left: 70px;
        }

        /* Header */
        .header {
            background: white;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 1;
            min-width: 0;
        }

        .sidebar-toggle {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: #6b7280;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: all 0.2s ease;
        }

        .sidebar-toggle:hover {
            background: #f3f4f6;
            color: #374151;
        }

        .breadcrumb {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
        }

        .breadcrumb a {
            color: #3b82f6;
            text-decoration: none;
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }

        .header-right {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.875rem;
            white-space: nowrap;
        }

        .btn-primary {
            background: #3b82f6;
            color: white;
        }

        .btn-primary:hover {
            background: #2563eb;
            color: white;
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-secondary:hover {
            background: #374151;
            color: white;
        }

        /* Content */
        .content {
            flex: 1;
            padding: 1.5rem;
        }

        /* Filters */
        .filters-section {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filters-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            align-items: end;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-label {
            font-weight: 600;
            font-size: 0.875rem;
            color: #374151;
        }

        .search-input-container {
            position: relative;
        }

        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 0.875rem;
        }

        .filter-input,
        .filter-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: border-color 0.2s ease;
        }

        .search-input {
            padding-left: 2.5rem;
        }

        .filter-input:focus,
        .filter-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Table */
        .table-container {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .table-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .table-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }

        .table-info {
            font-size: 0.875rem;
            color: #6b7280;
        }

        .positions-table {
            width: 100%;
            border-collapse: collapse;
        }

        .positions-table th {
            background: #f9fafb;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            font-size: 0.875rem;
        }

        .positions-table td {
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
        }

        .positions-table tr:hover {
            background: #f9fafb;
        }

        /* Position Info */
        .position-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .position-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.9rem;
        }

        .position-department {
            font-size: 0.8rem;
            color: #6b7280;
        }

        .position-location {
            font-size: 0.75rem;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        /* Badges */
        .employment-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
        }

        .employment-full-time {
            background: #d1fae5;
            color: #065f46;
        }

        .employment-part-time {
            background: #fef3c7;
            color: #92400e;
        }

        .employment-contract {
            background: #e0e7ff;
            color: #3730a3;
        }

        .employment-internship {
            background: #f3e8ff;
            color: #6b21a8;
        }

        /* Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.375rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .status-active {
            background: #d1fae5;
            color: #065f46;
        }

        .status-closed {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Application Stats */
        .application-stats {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
        }

        .stat-label {
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .stat-value {
            font-weight: 600;
            color: #1f2937;
        }

        .stat-value.zero {
            color: #9ca3af;
        }

        .stat-value.warning {
            color: #f59e0b;
        }

        .stat-value.active {
            color: #10b981;
        }

        /* Action Dropdown */
        .action-dropdown {
            position: relative;
        }

        .action-btn {
            background: none;
            border: none;
            padding: 0.5rem;
            border-radius: 0.375rem;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .action-btn:hover {
            background: #f3f4f6;
            color: #374151;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            min-width: 160px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.2s ease;
        }

        .dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            color: #374151;
            text-decoration: none;
            font-size: 0.875rem;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
            background: #f9fafb;
            color: #1f2937;
        }

        .dropdown-divider {
            border-top: 1px solid #e5e7eb;
            margin: 0.5rem 0;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #6b7280;
        }

        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #d1d5db;
        }

        .empty-state p {
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .empty-state small {
            font-size: 0.875rem;
        }

        /* Pagination */
        .pagination-container {
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }

        .custom-pagination {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .pagination-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
            color: #6b7280;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.25rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .page-item {
            border-radius: 0.375rem;
        }

        .page-link {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 0.75rem;
            color: #6b7280;
            text-decoration: none;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            transition: all 0.2s ease;
            min-width: 40px;
            height: 40px;
        }

        .page-link:hover {
            background: #f9fafb;
            color: #374151;
            border-color: #9ca3af;
        }

        .page-item.active .page-link {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }

        .page-item.disabled .page-link {
            color: #d1d5db;
            cursor: not-allowed;
        }

        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.show {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .main-content.expanded {
                margin-left: 0;
            }

            .filters-row {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .header {
                padding: 1rem;
            }

            .header-left {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }

            .header-right {
                width: 100%;
                justify-content: flex-end;
            }

            .btn {
                padding: 0.5rem 0.75rem;
                font-size: 0.8rem;
            }

            .content {
                padding: 1rem;
            }

            .filters-section {
                padding: 1rem;
            }

            .table-container {
                overflow-x: auto;
            }

            .positions-table {
                min-width: 800px;
            }

            .positions-table th,
            .positions-table td {
                padding: 0.75rem 0.5rem;
                font-size: 0.8rem;
            }

            .table-header {
                padding: 1rem;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }

            .pagination-info {
                flex-direction: column;
                text-align: center;
            }
        }

        @media (max-width: 640px) {
            .page-title {
                font-size: 1.25rem;
            }

            .btn {
                padding: 0.5rem;
                font-size: 0.75rem;
            }

            .btn span {
                display: none;
            }

            .positions-table th,
            .positions-table td {
                padding: 0.5rem 0.25rem;
            }

            .position-name {
                font-size: 0.8rem;
            }

            .position-department,
            .position-location {
                font-size: 0.7rem;
            }

            .employment-badge {
                font-size: 0.65rem;
                padding: 0.2rem 0.4rem;
            }

            .status-badge {
                font-size: 0.7rem;
                padding: 0.3rem 0.6rem;
            }
        }

        /* Sidebar overlay for mobile */
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
        }

        .sidebar-overlay.show {
            display: block;
        }

        @media (max-width: 1024px) {
            .sidebar-overlay.show {
                display: block;
            }
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        }

        /* SweetAlert Custom */
        .swal-wide {
            width: 600px !important;
        }

        .swal-wide .swal2-html-container {
            max-height: 400px;
            overflow-y: auto;
        }

        @media (max-width: 768px) {
            .swal-wide {
                width: 95% !important;
                max-width: 500px !important;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar Overlay for Mobile -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <i class="fas fa-building"></i>
                    <span class="logo-text">HR System</span>
                </div>
            </div>

            <div class="user-info">
                <div class="user-details">
                    <div class="user-name">{{ Auth::user()->full_name }}</div>
                    <div class="user-role">{{ ucfirst(Auth::user()->role) }}</div>
                </div>
            </div>

            <nav class="nav-menu">
                @if(in_array(Auth::user()->role, ['admin', 'hr']))
                    <div class="nav-item">
                        <a href="{{ route('candidates.index') }}" class="nav-link">
                            <i class="fas fa-user-tie"></i>
                            <span>Kandidat</span>
                        </a>
                    </div>
                    <div class="nav-item">
                        <a href="{{ route('positions.index') }}" class="nav-link active">
                            <i class="fas fa-briefcase"></i>
                            <span>Posisi</span>
                        </a>
                    </div>
                @endif
            </nav>
        </aside>

        <main class="main-content" id="mainContent">
            <header class="header">
                <div class="header-left">
                    <button class="sidebar-toggle" id="sidebarToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div>
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
                        Tambah Posisi
                    </a>
                    <a href="{{ route('positions.trashed') }}" class="btn btn-secondary">
                        <i class="fas fa-trash"></i>
                        Posisi Terhapus
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
                                    Filter
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/positions-index.js') }}"></script>
    <script src="{{ asset('js/position-transfer.js') }}"></script>
</body>
</html>