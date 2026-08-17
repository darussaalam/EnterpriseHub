<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'Enterprise Management Hub') - Web Admin</title>
  
  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- Bootstrap 5 & Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="/css/custom.css">
  @yield('styles')
</head>
<body>

  <div class="admin-layout">
    <!-- Left Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <img src="/icons/icon.svg" width="36" height="36" class="rounded" alt="Logo">
        <div>
          <div class="fw-bold text-white fs-5 leading-tight">Enterprise<span class="text-primary">Hub</span></div>
          <div class="text-white-50" style="font-size: 11px; letter-spacing: 0.05em;">ADMIN SUITE</div>
        </div>
      </div>

      <div class="sidebar-nav">
        <div class="nav-heading">Main Overview</div>
        <a href="{{ route('admin.dashboard') }}" class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
          <i class="bi bi-speedometer2"></i> Dashboard
        </a>

        <div class="nav-heading">Human Resources</div>
        <a href="{{ route('admin.employees') }}" class="nav-link {{ request()->routeIs('admin.employees*') ? 'active' : '' }}">
          <i class="bi bi-people-fill"></i> Data Karyawan
        </a>
        <a href="{{ route('admin.attendance') }}" class="nav-link {{ request()->routeIs('admin.attendance*') ? 'active' : '' }}">
          <i class="bi bi-calendar-check-fill"></i> Presensi & GPS Log
        </a>
        <a href="{{ route('admin.leaves') }}" class="nav-link {{ request()->routeIs('admin.leaves*') ? 'active' : '' }}">
          <i class="bi bi-envelope-paper-fill"></i> Approval Cuti & WFH
          @php
            $pendingTotal = \App\Models\LeaveRequest::where('status', 'pending')->count() + \App\Models\WfhRequest::where('status', 'pending')->count();
          @endphp
          @if($pendingTotal > 0)
            <span class="badge bg-danger rounded-pill ms-auto">{{ $pendingTotal }}</span>
          @endif
        </a>

        <div class="nav-heading">Operations & Project</div>
        <a href="{{ route('admin.projects') }}" class="nav-link {{ request()->routeIs('admin.projects*') ? 'active' : '' }}">
          <i class="bi bi-kanban-fill"></i> Project & Tasks
        </a>

        <div class="nav-heading">Finance & Asset</div>
        <a href="{{ route('admin.payroll') }}" class="nav-link {{ request()->routeIs('admin.payroll*') ? 'active' : '' }}">
          <i class="bi bi-cash-stack"></i> Payroll & Gaji
        </a>
        <a href="{{ route('admin.assets') }}" class="nav-link {{ request()->routeIs('admin.assets*') ? 'active' : '' }}">
          <i class="bi bi-laptop"></i> Aset & Inventaris
        </a>

        <div class="nav-heading">System & Config</div>
        <a href="{{ route('admin.locations') }}" class="nav-link {{ request()->routeIs('admin.locations*') ? 'active' : '' }}">
          <i class="bi bi-geo-alt-fill"></i> Lokasi GPS Kantor
        </a>
        <a href="{{ route('admin.reports') }}" class="nav-link {{ request()->routeIs('admin.reports*') ? 'active' : '' }}">
          <i class="bi bi-file-earmark-bar-graph-fill"></i> Laporan & Rekap
        </a>

        <div class="mt-4 p-2 bg-slate-900 rounded-3 text-center">
          <a href="{{ route('mobile.dashboard') }}" class="btn btn-outline-info btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-phone"></i> Buka Mobile PWA
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main">
      <!-- Topbar Header -->
      <header class="admin-topbar">
        <div class="d-flex align-items-center gap-3">
          <h5 class="mb-0 fw-bold text-slate-800">@yield('page_title', 'Dashboard')</h5>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill">
            Role: {{ strtoupper(auth()->user()->role) }}
          </span>
        </div>

        <div class="d-flex align-items-center gap-3">
          <!-- Quick Role Switcher for Test/Demo -->
          <div class="dropdown">
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-arrow-left-right me-1"></i> Switch Role Demo
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
              <li><a class="dropdown-item" href="{{ route('quick.login', 'admin') }}"><i class="bi bi-shield-lock me-2 text-danger"></i>Super Admin</a></li>
              <li><a class="dropdown-item" href="{{ route('quick.login', 'hr') }}"><i class="bi bi-person-badge me-2 text-primary"></i>HR Manager (Sarah)</a></li>
              <li><a class="dropdown-item" href="{{ route('quick.login', 'manager') }}"><i class="bi bi-briefcase me-2 text-warning"></i>Engineering Manager (Hendro)</a></li>
              <li><a class="dropdown-item" href="{{ route('quick.login', 'finance') }}"><i class="bi bi-cash-coin me-2 text-success"></i>Finance (Dewi)</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-primary fw-bold" href="{{ route('quick.login', 'employee') }}"><i class="bi bi-phone me-2"></i>Mobile Employee (Budi)</a></li>
            </ul>
          </div>

          <!-- User Dropdown -->
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center gap-2 rounded-pill px-3 py-1 border" type="button" data-bs-toggle="dropdown">
              <img src="{{ auth()->user()->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) }}" width="28" height="28" class="rounded-circle" alt="Avatar">
              <span class="small fw-semibold">{{ auth()->user()->name }}</span>
              <i class="bi bi-chevron-down small"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
              <li><span class="dropdown-item-text text-muted small">{{ auth()->user()->email }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="{{ route('mobile.dashboard') }}"><i class="bi bi-phone me-2"></i>Buka Tampilan Mobile PWA</a></li>
              <li>
                <form action="{{ route('logout') }}" method="POST">
                  @csrf
                  <button type="submit" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Keluar</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Body Content -->
      <main class="admin-body">
        @if(session('success'))
          <div class="alert alert-success alert-dismissible fade show rounded-3 py-2 px-3 mb-4 border-0 shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        @endif

        @if(session('error'))
          <div class="alert alert-danger alert-dismissible fade show rounded-3 py-2 px-3 mb-4 border-0 shadow-sm" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        @endif

        @yield('content')
      </main>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/js/pwa-app.js"></script>
  @yield('scripts')
</body>
</html>
