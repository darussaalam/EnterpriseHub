@extends('layouts.mobile')

@section('title', 'Profil & Slip Gaji - EnterpriseHub')

@section('content')
<!-- Header Profile Card -->
<div class="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white text-center">
  <div class="position-relative d-inline-block mx-auto mb-2">
    <img src="{{ $employee->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($employee->full_name) }}" width="80" height="80" class="rounded-circle border border-3 border-primary object-fit-cover shadow" alt="Avatar">
  </div>
  <h5 class="fw-bold text-slate-900 mb-0">{{ $employee->full_name }}</h5>
  <div class="text-primary fw-semibold small mb-1">{{ $employee->position }}</div>
  <div class="text-muted small">
    <span class="badge bg-light text-dark border">{{ $employee->emp_code }}</span> &bull; 
    <span>{{ $employee->department->name ?? 'Dept' }}</span>
  </div>
</div>

<!-- Stats Overview -->
<div class="row g-2 mb-3">
  <div class="col-4">
    <div class="card border-0 shadow-sm p-2 rounded-3 bg-white text-center">
      <span class="text-muted" style="font-size: 10px;">Hadir</span>
      <div class="fw-bold fs-5 text-success">{{ $totalPresent }}</div>
    </div>
  </div>
  <div class="col-4">
    <div class="card border-0 shadow-sm p-2 rounded-3 bg-white text-center">
      <span class="text-muted" style="font-size: 10px;">Terlambat</span>
      <div class="fw-bold fs-5 text-warning">{{ $totalLate }}</div>
    </div>
  </div>
  <div class="col-4">
    <div class="card border-0 shadow-sm p-2 rounded-3 bg-white text-center">
      <span class="text-muted" style="font-size: 10px;">Cuti/Izin</span>
      <div class="fw-bold fs-5 text-primary">{{ $approvedLeaves }}</div>
    </div>
  </div>
</div>

<!-- Personal Details Card -->
<div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
  <h6 class="fw-bold text-slate-800 mb-3 border-bottom pb-2">Informasi Pribadi & Pekerjaan</h6>
  
  <div class="d-flex justify-content-between py-1 border-bottom small">
    <span class="text-muted">Email Perusahaan</span>
    <span class="fw-semibold text-dark">{{ $user->email }}</span>
  </div>
  <div class="d-flex justify-content-between py-1 border-bottom small">
    <span class="text-muted">Nomor WhatsApp / HP</span>
    <span class="fw-semibold text-dark">{{ $employee->phone ?? '-' }}</span>
  </div>
  <div class="d-flex justify-content-between py-1 border-bottom small">
    <span class="text-muted">Tanggal Bergabung</span>
    <span class="fw-semibold text-dark">{{ $employee->join_date ? $employee->join_date->format('d M Y') : '-' }}</span>
  </div>
  <div class="d-flex justify-content-between py-1 border-bottom small">
    <span class="text-muted">Rekening Penggajian</span>
    <span class="fw-semibold text-dark">{{ $employee->bank_name }} - {{ $employee->bank_account }}</span>
  </div>
  <div class="d-flex justify-content-between py-1 small">
    <span class="text-muted">Alamat Domisili</span>
    <span class="fw-semibold text-dark text-end" style="max-width: 60%;">{{ $employee->address ?? '-' }}</span>
  </div>
</div>

<!-- Digital Payslip History (Slip Gaji) -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
  <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
    <h6 class="fw-bold text-slate-800 mb-0">Riwayat Slip Gaji Digital</h6>
    <span class="badge bg-primary-subtle text-primary">{{ $payrolls->count() }} Slip</span>
  </div>

  @forelse($payrolls as $pay)
    <a href="{{ route('mobile.profile.payslip', $pay->id) }}" class="p-3 border rounded-3 mb-2 bg-light d-flex justify-content-between align-items-center text-decoration-none text-dark hover-shadow">
      <div>
        <div class="fw-bold text-slate-900 small">Periode {{ date('F', mktime(0, 0, 0, $pay->period_month, 10)) }} {{ $pay->period_year }}</div>
        <div class="text-muted" style="font-size: 11px;">No: {{ $pay->slip_number }}</div>
        <div class="fw-bold text-primary small mt-1">Rp {{ number_format($pay->net_salary, 0, ',', '.') }}</div>
      </div>
      <div class="text-end">
        <span class="badge {{ $pay->payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark' }} rounded-pill mb-1">
          {{ strtoupper($pay->payment_status) }}
        </span>
        <div class="text-primary small fw-semibold" style="font-size: 11px;">Lihat Slip <i class="bi bi-chevron-right"></i></div>
      </div>
    </a>
  @empty
    <div class="text-center py-3 text-muted small">Belum ada slip gaji yang diterbitkan.</div>
  @endforelse
</div>

<!-- Logout Action -->
<div class="d-grid mb-2">
  <form action="{{ route('logout') }}" method="POST">
    @csrf
    <button type="submit" class="btn btn-outline-danger w-100 py-2 rounded-3 fw-bold">
      <i class="bi bi-box-arrow-right me-1"></i> Keluar dari Aplikasi
    </button>
  </form>
</div>
@endsection
