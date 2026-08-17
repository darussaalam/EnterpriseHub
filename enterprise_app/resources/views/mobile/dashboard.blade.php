@extends('layouts.mobile')

@section('title', 'Dashboard Mobile - ' . $employee->full_name)

@section('content')
<!-- Employee Profile Header -->
<div class="d-flex align-items-center justify-content-between mb-3 pt-1">
  <div class="d-flex align-items-center gap-3">
    <img src="{{ $employee->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($employee->full_name) }}" width="52" height="52" class="rounded-circle border border-2 border-primary shadow-sm object-fit-cover" alt="Profile">
    <div>
      <div class="fw-bold fs-6 text-slate-900 mb-0">{{ $employee->full_name }}</div>
      <div class="text-muted small">{{ $employee->position }} &bull; <span class="badge bg-light text-dark">{{ $employee->department->code ?? 'STAFF' }}</span></div>
    </div>
  </div>
  <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small">
    <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i> Aktif
  </span>
</div>

<!-- Attendance Card Today -->
<div class="attendance-card mb-4">
  <div class="d-flex justify-content-between align-items-start mb-3">
    <div>
      <span class="text-white-50 text-uppercase fw-semibold" style="font-size: 11px; letter-spacing: 0.05em;">Presensi Hari Ini</span>
      <div class="fs-4 fw-black text-white" id="live-clock">{{ date('H:i:s') }} WIB</div>
      <div class="text-white-50 small">{{ \Carbon\Carbon::now()->isoFormat('dddd, D MMMM Y') }}</div>
    </div>
    <div class="text-end">
      @if($todayAttendance && $todayAttendance->check_in_time)
        @if($todayAttendance->check_out_time)
          <span class="badge bg-secondary px-2 py-1 rounded-pill">Selesai Kerja</span>
        @else
          <span class="badge bg-success px-2 py-1 rounded-pill"><i class="bi bi-geo-alt-fill me-1"></i> Sedang Bekerja</span>
        @endif
      @else
        <span class="badge bg-warning text-dark px-2 py-1 rounded-pill">Belum Check-In</span>
      @endif
    </div>
  </div>

  <div class="row g-2 mb-3 bg-white bg-opacity-10 p-2 rounded-3 text-center">
    <div class="col-6 border-end border-white border-opacity-10">
      <div class="text-white-50" style="font-size: 11px;">Check-In</div>
      <div class="fw-bold fs-6 text-white">{{ ($todayAttendance && $todayAttendance->check_in_time) ? substr($todayAttendance->check_in_time, 0, 5) . ' WIB' : '--:--' }}</div>
    </div>
    <div class="col-6">
      <div class="text-white-50" style="font-size: 11px;">Check-Out</div>
      <div class="fw-bold fs-6 text-white">{{ ($todayAttendance && $todayAttendance->check_out_time) ? substr($todayAttendance->check_out_time, 0, 5) . ' WIB' : '--:--' }}</div>
    </div>
  </div>

  <div class="d-grid">
    <a href="{{ route('mobile.attendance') }}" class="btn btn-primary fw-bold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
      <i class="bi bi-camera-fill"></i>
      @if(!$todayAttendance || !$todayAttendance->check_in_time)
        Buka Kamera & GPS (Check-In)
      @elseif(!$todayAttendance->check_out_time)
        Buka Absensi (Check-Out Pulang)
      @else
        Lihat Detail Presensi Hari Ini
      @endif
    </a>
  </div>
</div>

<!-- Quick Action Grid -->
<div class="mb-4">
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h6 class="fw-bold text-slate-800 mb-0">Menu Cepat</h6>
  </div>
  <div class="row g-2">
    <div class="col-3 text-center">
      <a href="{{ route('mobile.attendance') }}" class="card border-0 shadow-sm p-2 rounded-3 text-decoration-none text-dark bg-white h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="p-2 rounded-circle bg-primary-subtle text-primary mb-1">
          <i class="bi bi-camera-fill fs-5"></i>
        </div>
        <span class="small fw-semibold" style="font-size: 11px;">Absensi</span>
      </a>
    </div>
    <div class="col-3 text-center">
      <a href="{{ route('mobile.requests') }}" class="card border-0 shadow-sm p-2 rounded-3 text-decoration-none text-dark bg-white h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="p-2 rounded-circle bg-warning-subtle text-warning mb-1">
          <i class="bi bi-calendar2-range-fill fs-5"></i>
        </div>
        <span class="small fw-semibold" style="font-size: 11px;">Cuti/WFH</span>
      </a>
    </div>
    <div class="col-3 text-center">
      <a href="{{ route('mobile.tasks') }}" class="card border-0 shadow-sm p-2 rounded-3 text-decoration-none text-dark bg-white h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="p-2 rounded-circle bg-success-subtle text-success mb-1">
          <i class="bi bi-list-task fs-5"></i>
        </div>
        <span class="small fw-semibold" style="font-size: 11px;">Tugas</span>
      </a>
    </div>
    <div class="col-3 text-center">
      <a href="{{ route('mobile.profile') }}" class="card border-0 shadow-sm p-2 rounded-3 text-decoration-none text-dark bg-white h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="p-2 rounded-circle bg-info-subtle text-info mb-1">
          <i class="bi bi-receipt fs-5"></i>
        </div>
        <span class="small fw-semibold" style="font-size: 11px;">Slip Gaji</span>
      </a>
    </div>
  </div>
</div>

<!-- Active Tasks Section -->
<div class="mb-4">
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h6 class="fw-bold text-slate-800 mb-0">Tugas Aktif Anda ({{ $activeTasks->count() }})</h6>
    <a href="{{ route('mobile.tasks') }}" class="text-primary small text-decoration-none fw-semibold">Lihat Semua</a>
  </div>

  @forelse($activeTasks as $task)
    <div class="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
      <div class="d-flex justify-content-between align-items-start mb-1">
        <span class="badge {{ $task->priority === 'urgent' ? 'bg-danger' : ($task->priority === 'high' ? 'bg-warning text-dark' : 'bg-secondary') }} rounded-pill" style="font-size: 10px;">
          {{ strtoupper($task->priority) }}
        </span>
        <span class="text-muted small" style="font-size: 11px;">
          <i class="bi bi-clock me-1"></i> Deadline: {{ $task->deadline ? $task->deadline->format('d M Y') : '-' }}
        </span>
      </div>
      <h6 class="fw-bold text-slate-900 mb-1 fs-6">{{ $task->title }}</h6>
      <p class="text-muted small mb-2" style="font-size: 12px;">{{ Str::limit($task->description, 70) }}</p>
      
      <div class="d-flex align-items-center justify-content-between">
        <div class="flex-grow-1 me-3">
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-primary" role="progressbar" style="width: {{ $task->progress_percentage }}%;"></div>
          </div>
        </div>
        <span class="fw-bold text-primary small">{{ $task->progress_percentage }}%</span>
      </div>
    </div>
  @empty
    <div class="text-center p-3 bg-white rounded-3 shadow-sm text-muted small">
      <i class="bi bi-check2-all fs-4 text-success d-block mb-1"></i>
      Tidak ada tugas aktif saat ini.
    </div>
  @endforelse
</div>

<!-- Recent Notifications Feed -->
<div class="mb-3">
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h6 class="fw-bold text-slate-800 mb-0">Pengumuman & Notifikasi</h6>
    <a href="{{ route('mobile.notifications') }}" class="text-primary small text-decoration-none fw-semibold">Semua</a>
  </div>

  @forelse($notifications as $notif)
    <div class="d-flex align-items-start gap-3 p-2 bg-white rounded-3 shadow-sm mb-2 {{ !$notif->is_read ? 'border-start border-3 border-primary' : '' }}">
      <div class="p-2 rounded-circle {{ $notif->type === 'approval' ? 'bg-success-subtle text-success' : ($notif->type === 'task' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning') }}">
        <i class="bi {{ $notif->type === 'approval' ? 'bi-check-circle' : ($notif->type === 'task' ? 'bi-list-check' : 'bi-megaphone') }} fs-6"></i>
      </div>
      <div class="flex-grow-1">
        <div class="fw-bold text-slate-900 small">{{ $notif->title }}</div>
        <div class="text-muted small" style="font-size: 11px;">{{ Str::limit($notif->message, 80) }}</div>
        <div class="text-black-50" style="font-size: 10px;">{{ $notif->created_at->diffForHumans() }}</div>
      </div>
    </div>
  @empty
    <div class="text-center p-3 bg-white rounded-3 shadow-sm text-muted small">
      Belum ada notifikasi baru.
    </div>
  @endforelse
</div>
@endsection
