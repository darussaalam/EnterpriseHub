@extends('layouts.admin')

@section('title', 'Payroll & Penggajian')
@section('page_title', 'Manajemen Penggajian (Payroll) & Slip Gaji')

@section('content')
<!-- Header Filter & Generator -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
    <!-- Month & Year Selector -->
    <form action="{{ route('admin.payroll') }}" method="GET" class="d-flex gap-2 align-items-center">
      <label class="small fw-bold text-muted text-nowrap">Periode:</label>
      <select name="month" class="form-select rounded-3" onchange="this.form.submit()">
        @for($m = 1; $m <= 12; $m++)
          <option value="{{ $m }}" {{ $currentMonth == $m ? 'selected' : '' }}>
            {{ date('F', mktime(0, 0, 0, $m, 10)) }}
          </option>
        @endfor
      </select>
      <select name="year" class="form-select rounded-3" onchange="this.form.submit()">
        @for($y = 2024; $y <= 2027; $y++)
          <option value="{{ $y }}" {{ $currentYear == $y ? 'selected' : '' }}>{{ $y }}</option>
        @endfor
      </select>
    </form>

    <!-- Generate Monthly Payroll Button -->
    <form action="{{ route('admin.payroll.generate') }}" method="POST" onsubmit="return confirm('Generate otomatis draft slip gaji untuk seluruh karyawan aktif periode ini?')">
      @csrf
      <input type="hidden" name="period_month" value="{{ $currentMonth }}">
      <input type="hidden" name="period_year" value="{{ $currentYear }}">
      <button type="submit" class="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
        <i class="bi bi-gear-wide-connected me-1"></i> Generate Payroll Periode Ini
      </button>
    </form>
  </div>
</div>

<!-- Financial Summary Cards -->
<div class="row g-3 mb-4">
  <div class="col-md-6">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 border-success">
      <div class="text-muted small fw-semibold text-uppercase">Total Gaji Telah Dibayarkan (Paid)</div>
      <div class="fs-3 fw-bold text-success mt-1">Rp {{ number_format($totalDisbursed, 0, ',', '.') }}</div>
      <span class="text-muted small">{{ $payrolls->where('payment_status', 'paid')->count() }} Karyawan telah ditransfer</span>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 border-warning">
      <div class="text-muted small fw-semibold text-uppercase">Total Menunggu Pencairan (Draft)</div>
      <div class="fs-3 fw-bold text-warning mt-1">Rp {{ number_format($totalPending, 0, ',', '.') }}</div>
      <span class="text-muted small">{{ $payrolls->where('payment_status', 'draft')->count() }} Slip menunggu persetujuan bayar</span>
    </div>
  </div>
</div>

<!-- Payroll Table -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>No. Slip</th>
          <th>Karyawan</th>
          <th>Gaji Pokok</th>
          <th>Tunjangan</th>
          <th>Lembur</th>
          <th>Potongan</th>
          <th>Gaji Bersih (THP)</th>
          <th>Status</th>
          <th class="text-end">Aksi</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($payrolls as $pay)
          <tr>
            <td>
              <span class="badge bg-light text-dark border">{{ $pay->slip_number }}</span>
            </td>
            <td>
              <div class="fw-bold text-slate-900">{{ $pay->employee->full_name }}</div>
              <div class="text-muted" style="font-size: 11px;">{{ $pay->employee->bank_name }}: {{ $pay->employee->bank_account }}</div>
            </td>
            <td>Rp {{ number_format($pay->basic_salary, 0, ',', '.') }}</td>
            <td>+ Rp {{ number_format($pay->allowance, 0, ',', '.') }}</td>
            <td>+ Rp {{ number_format($pay->overtime_pay, 0, ',', '.') }}</td>
            <td class="text-danger">- Rp {{ number_format($pay->deductions, 0, ',', '.') }}</td>
            <td class="fw-bold text-primary fs-6">Rp {{ number_format($pay->net_salary, 0, ',', '.') }}</td>
            <td>
              <span class="badge {{ $pay->payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark' }} rounded-pill">
                {{ strtoupper($pay->payment_status) }}
              </span>
            </td>
            <td class="text-end">
              @if($pay->payment_status === 'draft')
                <form action="{{ route('admin.payroll.pay', $pay->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Tandai slip gaji ini sebagai TELAH DITRANSFER?')">
                  @csrf
                  <button type="submit" class="btn btn-sm btn-success rounded-pill px-3 py-1 fw-semibold">
                    <i class="bi bi-check-circle me-1"></i> Cairkan & Bayar
                  </button>
                </form>
              @else
                <span class="text-success small fw-semibold"><i class="bi bi-check2-all"></i> Terbayar</span>
              @endif
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="9" class="text-center py-4 text-muted">
              Belum ada slip gaji untuk periode {{ date('F', mktime(0, 0, 0, $currentMonth, 10)) }} {{ $currentYear }}.<br>
              Klik tombol <strong>"Generate Payroll Periode Ini"</strong> di atas.
            </td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>
</div>
@endsection
