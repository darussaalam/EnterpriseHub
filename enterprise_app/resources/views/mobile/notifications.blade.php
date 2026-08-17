@extends('layouts.mobile')

@section('title', 'Notifikasi & Pengumuman - EnterpriseHub')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
  <div>
    <h5 class="fw-bold text-slate-900 mb-0">Notifikasi</h5>
    <p class="text-muted small mb-0">Pembaruan sistem, status permohonan, & tugas.</p>
  </div>
  <button onclick="requestNotificationPermission()" class="btn btn-outline-primary btn-sm rounded-pill py-1 px-3">
    <i class="bi bi-bell-fill me-1"></i> Aktifkan Push
  </button>
</div>

<div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
  @forelse($notifications as $notif)
    <div class="d-flex align-items-start gap-3 p-3 border-bottom {{ !$notif->is_read ? 'bg-primary-subtle bg-opacity-25 rounded-3' : '' }}">
      <div class="p-2 rounded-circle {{ $notif->type === 'approval' ? 'bg-success text-white' : ($notif->type === 'task' ? 'bg-primary text-white' : 'bg-warning text-dark') }}">
        <i class="bi {{ $notif->type === 'approval' ? 'bi-check-circle' : ($notif->type === 'task' ? 'bi-list-task' : 'bi-megaphone') }} fs-6"></i>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="fw-bold text-slate-900 mb-1 fs-6">{{ $notif->title }}</h6>
          <span class="text-muted" style="font-size: 10px;">{{ $notif->created_at->diffForHumans() }}</span>
        </div>
        <p class="text-slate-600 small mb-1" style="font-size: 12px;">{{ $notif->message }}</p>
        @if($notif->link_url)
          <a href="{{ $notif->link_url }}" class="text-primary fw-semibold small text-decoration-none" style="font-size: 11px;">
            Buka Detail <i class="bi bi-chevron-right"></i>
          </a>
        @endif
      </div>
    </div>
  @empty
    <div class="text-center py-4 text-muted small">
      <i class="bi bi-bell-slash fs-3 text-muted d-block mb-2"></i>
      Tidak ada notifikasi saat ini.
    </div>
  @endforelse

  <div class="mt-3">
    {{ $notifications->links() }}
  </div>
</div>
@endsection
