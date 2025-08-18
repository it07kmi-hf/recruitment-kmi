<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div class="logo flex flex-col items-center text-center">
            <img src="{{ asset('images/PT. KAYU MEBEL INDONESIA GROUP.png') }}" 
                alt="HR System Logo" 
                class="logo-img">
            <span class="logo-text mt-2 text-base font-semibold">HR System</span>
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
                <a href="{{ route('candidates.index') }}" 
                   class="nav-link {{ request()->routeIs('candidates.*') ? 'active' : '' }}">
                    <i class="fas fa-user-tie"></i>
                    <span class="nav-text">Kandidat</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="{{ route('positions.index') }}" 
                   class="nav-link {{ request()->routeIs('positions.*') ? 'active' : '' }}">
                    <i class="fas fa-briefcase"></i>
                    <span class="nav-text">Posisi</span>
                </a>
            </div>
        @endif
    </nav>
</aside>
