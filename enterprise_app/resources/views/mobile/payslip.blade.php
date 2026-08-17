@extends('layouts.mobile')

@section('title', 'Slip Gaji - ' . $payroll->slip_number)

@section('content')
<div class="d-flex align-items-center justify-content-between mb-3 no-print">
  <div class="d-flex align-items-center gap-2">
    <a href="{{ route('mobile.profile') }}" class="btn btn-light btn-sm rounded-circle p-2">
      <i class="bi bi-arrow-left"></i>
    </a>
    <h5 class="fw-bold text-slate-900 mb-0">Detail Slip Gaji</h5>
  </div>
  <button onclick="window.print()" class="btn btn-outline-primary btn-sm rounded-pill px-3 py-1">
    <i class="bi bi-printer me-1"></i> Cetak / Simpan PDF
  </button>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3" id="printable-slip">
  <!-- Slip Header -->
  <div class="text-center pb-3 border-bottom mb-3">
    <img src="/icons/icon.svg" width="40" height="40" class="mb-2" alt="Logo">
    <h5 class="fw-bold text-slate-900 mb-0">PT ENTERPRISE DIGITAL INDONESIA</h5>
    <p class="text-muted small mb-0">SLIP GAJI KARYAWAN (CONFIDENTIAL)</p>
    <span class="badge bg-light text-dark border mt-1">No: {{ $payroll->slip_number }}</span>
  </div>

  <!-- Employee Meta -->
  <div class="row g-2 mb-3 small">
    <div class="col-6">
      <span class="text-muted d-block">Nama Karyawan:</span>
      <strong class="text-dark">{{ $employee->full_name }}</strong>
    </div>
    <div class="col-6">
      <span class="text-muted d-block">NIK / ID Karyawan:</span>
      <strong class="text-dark">{{ $employee->emp_code }}</strong>
    </div>
    <div class="col-6">
      <span class="text-muted d-block">Departemen & Jabatan:</span>
      <strong class="text-dark">{{ $employee->department->name ?? 'Dept' }} - {{ $employee->position }}</strong>
    </div>
    <div class="col-6">
      <span class="text-muted d-block">Periode Penggajian:</span>
      <strong class="text-primary">{{ date('F', mktime(0, 0, 0, $payroll->period_month, 10)) }} {{ $payroll->period_year }}</strong>
    </div>
  </div>

  <!-- Income & Deductions Table -->
  <div class="border rounded-3 p-3 bg-light mb-3">
    <div class="fw-bold text-slate-800 small mb-2 border-bottom pb-1">A. PENGHASILAN (EARNINGS)</div>
    <div class="d-flex justify-content-between small py-1">
      <span>Gaji Pokok (Basic Salary)</span>
      <strong>Rp {{ number_format($payroll->basic_salary, 0, ',', '.') }}</strong>
    </div>
    <div class="d-flex justify-content-between small py-1">
      <span>Tunjangan Operasional / Posisi</span>
      <strong>Rp {{ number_format($payroll->allowance, 0, ',', '.') }}</strong>
    </div>
    <div class="d-flex justify-content-between small py-1 border-bottom pb-2">
      <span>Uang Lembur (Overtime)</span>
      <strong>Rp {{ number_format($payroll->overtime_pay, 0, ',', '.') }}</strong>
    </div>
    <div class="d-flex justify-content-between small pt-2 fw-bold text-success">
      <span>Total Penghasilan Kotor</span>
      <span>Rp {{ number_format($payroll->basic_salary + $payroll->allowance + $payroll->overtime_pay, 0, ',', '.') }}</span>
    </div>
  </div>

  <div class="border rounded-3 p-3 bg-light mb-3">
    <div class="fw-bold text-slate-800 small mb-2 border-bottom pb-1">B. POTONGAN (DEDUCTIONS)</div>
    <div class="d-flex justify-content-between small py-1 border-bottom pb-2">
      <span>BPJS Ketenagakerjaan, Kesehatan & PPh 21</span>
      <strong class="text-danger">- Rp {{ number_format($payroll->deductions, 0, ',', '.') }}</strong>
    </div>
    <div class="d-flex justify-content-between small pt-2 fw-bold text-danger">
      <span>Total Potongan</span>
      <span>- Rp {{ number_format($payroll->deductions, 0, ',', '.') }}</span>
    </div>
  </div>

  <!-- Net Take Home Pay -->
  <div class="p-3 rounded-3 bg-primary text-white text-center mb-3">
    <div class="small text-white-50 text-uppercase fw-semibold">Gaji Bersih Diterima (Take Home Pay)</div>
    <div class="fs-4 fw-black">Rp {{ number_format($payroll->net_salary, 0, ',', '.') }}</div>
    <span class="badge bg-white text-primary fw-bold mt-1">Status: {{ strtoupper($payroll->payment_status) }}</span>
  </div>

  <div class="text-center text-muted small" style="font-size: 11px;">
    Dokumen ini dicetak secara otomatis melalui sistem EnterpriseHub PWA dan sah tanpa tanda tangan basah.
  </div>
</div>
@endsection
