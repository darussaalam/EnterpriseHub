<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - EnterpriseHub Management & Mobile PWA</title>
  
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
  <meta name="theme-color" content="#2563eb">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="/css/custom.css">
</head>
<body class="bg-slate-900 min-vh-100 d-flex align-items-center justify-content-center p-3" style="background: radial-gradient(circle at top right, #1e293b, #0f172a);">

  <div class="container py-4" style="max-width: 960px;">
    <div class="row g-4 align-items-center">
      
      <!-- Left Hero Banner -->
      <div class="col-lg-6 text-white pe-lg-4">
        <div class="d-flex align-items-center gap-3 mb-4">
          <img src="/icons/icon.svg" width="48" height="48" class="rounded-3 shadow" alt="Logo">
          <div>
            <h3 class="fw-black mb-0">Enterprise<span class="text-primary">Hub</span></h3>
            <span class="badge bg-primary px-2 py-1 small rounded-pill">Web + Mobile PWA Edition</span>
          </div>
        </div>

        <h2 class="fw-bold text-white mb-3 lh-sm">
          Satu Platform Enterprise untuk Web Admin & Mobile Employee
        </h2>
        <p class="text-slate-300 mb-4 fs-6">
          Sistem terintegrasi dengan Absensi GPS & Kamera Selfie, Manajemen Tugas, Payroll, Pengajuan Cuti/WFH, dan Aset Inventaris.
        </p>

        <div class="row g-3">
          <div class="col-6">
            <div class="p-3 rounded-3 bg-slate-800 border border-slate-700">
              <i class="bi bi-phone-vibrate text-primary fs-4 mb-2 d-block"></i>
              <div class="fw-bold text-white small">Mobile PWA Ready</div>
              <div class="text-muted" style="font-size: 11px;">Bisa install di HP tanpa aplikasi native</div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-3 rounded-3 bg-slate-800 border border-slate-700">
              <i class="bi bi-geo-alt-fill text-emerald-400 fs-4 mb-2 d-block text-success"></i>
              <div class="fw-bold text-white small">GPS & Selfie Valid</div>
              <div class="text-muted" style="font-size: 11px;">Geofencing radius kantor akurat</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Login Card -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5">
          
          <div class="mb-4">
            <h4 class="fw-bold text-slate-800 mb-1">Masuk ke Sistem</h4>
            <p class="text-muted small">Pilih akun demo atau gunakan form login di bawah</p>
          </div>

          @if($errors->any())
            <div class="alert alert-danger py-2 px-3 small rounded-3 border-0 mb-3">
              <i class="bi bi-exclamation-circle-fill me-1"></i> {{ $errors->first() }}
            </div>
          @endif

          @if(session('success'))
            <div class="alert alert-success py-2 px-3 small rounded-3 border-0 mb-3">
              <i class="bi bi-check-circle-fill me-1"></i> {{ session('success') }}
            </div>
          @endif

          <!-- Quick 1-Click Role Logins for Test Demo -->
          <div class="mb-4">
            <div class="fw-bold text-muted small mb-2 text-uppercase" style="font-size: 11px; letter-spacing: 0.05em;">
              ⚡ 1-Click Demo Login:
            </div>
            <div class="d-flex flex-wrap gap-2">
              <a href="{{ route('quick.login', 'employee') }}" class="btn btn-outline-primary btn-sm rounded-pill fw-semibold px-3 py-1">
                <i class="bi bi-phone me-1"></i> Employee (Budi)
              </a>
              <a href="{{ route('quick.login', 'admin') }}" class="btn btn-outline-dark btn-sm rounded-pill fw-semibold px-3 py-1">
                <i class="bi bi-shield-lock me-1"></i> Super Admin
              </a>
              <a href="{{ route('quick.login', 'hr') }}" class="btn btn-outline-info btn-sm rounded-pill fw-semibold px-3 py-1">
                <i class="bi bi-person-badge me-1"></i> HR (Sarah)
              </a>
              <a href="{{ route('quick.login', 'manager') }}" class="btn btn-outline-warning btn-sm rounded-pill fw-semibold px-3 py-1">
                <i class="bi bi-briefcase me-1"></i> Manager
              </a>
              <a href="{{ route('quick.login', 'finance') }}" class="btn btn-outline-success btn-sm rounded-pill fw-semibold px-3 py-1">
                <i class="bi bi-cash me-1"></i> Finance
              </a>
            </div>
          </div>

          <div class="position-relative text-center my-3">
            <hr class="text-muted">
            <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">atau email & sandi</span>
          </div>

          <!-- Standard Login Form -->
          <form action="{{ route('login.submit') }}" method="POST">
            @csrf
            <div class="mb-3">
              <label class="form-label small fw-semibold text-slate-700">Alamat Email</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                <input type="email" name="email" class="form-control bg-light border-start-0 ps-0" placeholder="nama@enterprise.com" value="{{ old('email', 'budi@enterprise.com') }}" required>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-semibold text-slate-700">Kata Sandi</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-key text-muted"></i></span>
                <input type="password" name="password" class="form-control bg-light border-start-0 ps-0" placeholder="••••••••" value="password123" required>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="remember" id="remember" checked>
                <label class="form-check-label small text-muted" for="remember">Ingat saya</label>
              </div>
              <span class="small text-muted">Default password: <code>password123</code></span>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm">
              Masuk ke Aplikasi <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
