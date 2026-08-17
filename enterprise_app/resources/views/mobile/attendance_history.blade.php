@extends('layouts.mobile')

@section('title', 'Riwayat Presensi - EnterpriseHub')

@section('content')
<div class="d-flex align-items-center justify-content-between mb-3">
  <div class="d-flex align-items-center gap-2">
    <a href="{{ route('mobile.attendance') }}" class="btn btn-light btn-sm rounded-circle p-2">
      <i class="bi bi-arrow-left"></i>
    </a>
    <h5 class="fw-bold text-slate-900 mb-0">Riwayat Presensi</h5>
  </div>
</div>

<div class="row g-2 mb-3">
  <div class="col-6">
    <div class="card border-0 shadow-sm p-3 rounded-4 bg-white text-center">
      <span class="text-muted small">Hadir Tepat Waktu</span>
      <div class="fs-4 fw-bold text-success">{{ $totalPresent }}</div>
    </div>
  </div>
  <div class="col-6">
    <div class="card border-0 shadow-sm p-3 rounded-4 bg-white text-center">
      <span class="text-muted small">Terlambat</span>
      <div class="fs-4 fw-bold text-warning">{{ $totalLate }}</div>
    </div>
  </div>
</div>

<div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
  <h6 class="fw-bold text-slate-800 mb-3">Log Presensi Bulanan</h6>

  @forelse($attendances as $att)
    <div class="p-3 border rounded-3 mb-2 bg-light">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="fw-bold text-dark">{{ $att->date->isoFormat('dddd, D MMMM Y') }}</span>
        <span class="badge {{ $att->status === 'present' ? 'bg-success' : ($att->status === 'late' ? 'bg-warning text-dark' : 'bg-secondary') }} rounded-pill small">
          {{ ucfirst($att->status) }}
        </span>
      </div>
      <div class="row g-1 text-muted small mt-1">
        <div class="col-6">
          <i class="bi bi-box-arrow-in-right text-success me-1"></i> In: <strong>{{ $att->check_in_time ? substr($att->check_in_time, 0, 5) . ' WIB' : '-' }}</strong>
        </div>
        <div class="col-6">
          <i class="bi bi-box-arrow-right text-danger me-1"></i> Out: <strong>{{ $att->check_out_time ? substr($att->check_out_time, 0, 5) . ' WIB' : '-' }}</strong>
        </div>
        <div class="col-12 mt-1">
          <i class="bi bi-hourglass-split me-1"></i> Durasi: {{ floor($att->work_duration_minutes / 60) }}j {{ $att->work_duration_minutes % 60 }}m
          @if($att->notes)
            &bull; <span class="text-secondary">{{ $att->notes }}</span>
          @endif
        </div>
      </div>
    </div>
  @empty
    <div class="text-center py-4 text-muted small">
      Belum ada catatan presensi.
    </div>
  @endforelse

  <div class="mt-3">
    {{ $attendances->links() }}
  </div>
</div>
@endsection
