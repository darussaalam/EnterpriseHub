<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>@yield('title', 'EnterpriseHub Mobile PWA')</title>
  
  <!-- PWA Meta -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#2563eb">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="EnterpriseHub">
  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
  <link rel="apple-touch-icon" href="/icons/icon.svg">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- Bootstrap 5 & Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="/css/custom.css">
  @yield('styles')
</head>
<body class="bg-slate-100">

  <div class="mobile-wrapper">
    <!-- Top Mobile Header -->
    <header class="mobile-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2">
        <a href="{{ route('mobile.dashboard') }}" class="d-flex align-items-center text-decoration-none">
          <img src="/icons/icon.svg" width="32" height="32" class="rounded" alt="Logo">
          <span class="ms-2 fw-bold text-dark fs-6">Enterprise<span class="text-primary">Hub</span></span>
        </a>
      </div>
      <div class="d-flex align-items-center gap-2">
        <a href="{{ route('mobile.notifications') }}" class="btn btn-light btn-sm rounded-circle position-relative p-2" title="Notifikasi">
          <i class="bi bi-bell fs-6"></i>
          @php
            $unreadCount = \App\Models\Notification::where('user_id', auth()->id())->where('is_read', false)->count();
          @endphp
          @if($unreadCount > 0)
            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span class="visually-hidden">Notifikasi Baru</span>
            </span>
          @endif
        </a>

        <!-- Switch to Web Admin / User Menu -->
        <div class="dropdown">
          <button class="btn btn-light btn-sm rounded-circle p-1" type="button" data-bs-toggle="dropdown">
            <img src="{{ auth()->user()->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) }}" width="30" height="30" class="rounded-circle object-fit-cover" alt="User">
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
            <li><h6 class="dropdown-header">{{ auth()->user()->name }} ({{ strtoupper(auth()->user()->role) }})</h6></li>
            @if(auth()->user()->isAdmin())
              <li><a class="dropdown-item text-primary" href="{{ route('admin.dashboard') }}"><i class="bi bi-speedometer2 me-2"></i>Web Admin Portal</a></li>
            @endif
            <li><a class="dropdown-item" href="{{ route('mobile.profile') }}"><i class="bi bi-person me-2"></i>Profil & Slip Gaji</a></li>
            <li><hr class="dropdown-divider"></li>
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

    <!-- Main Dynamic Content -->
    <main class="mobile-content">
      <!-- PWA Install Banner -->
      <div id="pwa-install-banner" class="pwa-install-banner d-none">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-phone fs-4"></i>
          <div>
            <div class="fw-bold small">Pasang Aplikasi EnterpriseHub</div>
            <div class="text-white-50" style="font-size: 11px;">Akses cepat, absensi GPS, dan notifikasi</div>
          </div>
        </div>
        <button onclick="triggerPwaInstall()" class="btn btn-sm btn-light fw-bold text-primary rounded-pill px-3 py-1">
          Install
        </button>
      </div>

      <!-- Flash Alerts -->
      @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 small py-2 px-3 mb-3 border-0 shadow-sm" role="alert">
          <i class="bi bi-check-circle-fill me-1"></i> {{ session('success') }}
          <button type="button" class="btn-close py-2" data-bs-dismiss="alert"></button>
        </div>
      @endif

      @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show rounded-3 small py-2 px-3 mb-3 border-0 shadow-sm" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ session('error') }}
          <button type="button" class="btn-close py-2" data-bs-dismiss="alert"></button>
        </div>
      @endif

      @yield('content')
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
      <a href="{{ route('mobile.dashboard') }}" class="bottom-nav-item {{ request()->routeIs('mobile.dashboard') ? 'active' : '' }}">
        <i class="bi bi-grid-fill"></i>
        <span>Beranda</span>
      </a>
      <a href="{{ route('mobile.attendance') }}" class="bottom-nav-item {{ request()->routeIs('mobile.attendance*') ? 'active' : '' }}">
        <i class="bi bi-camera-fill"></i>
        <span>Absensi</span>
      </a>
      <a href="{{ route('mobile.tasks') }}" class="bottom-nav-item {{ request()->routeIs('mobile.tasks*') ? 'active' : '' }}">
        <i class="bi bi-check2-square"></i>
        <span>Tugas</span>
      </a>
      <a href="{{ route('mobile.requests') }}" class="bottom-nav-item {{ request()->routeIs('mobile.requests*') ? 'active' : '' }}">
        <i class="bi bi-calendar2-range"></i>
        <span>Pengajuan</span>
      </a>
      <a href="{{ route('mobile.profile') }}" class="bottom-nav-item {{ request()->routeIs('mobile.profile*') ? 'active' : '' }}">
        <i class="bi bi-person-fill"></i>
        <span>Profil</span>
      </a>
    </nav>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="/js/pwa-app.js"></script>
  @yield('scripts')
</body>
</html>
