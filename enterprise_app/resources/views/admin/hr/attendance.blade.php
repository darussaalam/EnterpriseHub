@extends('layouts.admin')

@section('title', 'Monitoring Presensi Live')
@section('page_title', 'Live Monitoring Presensi & GPS Geofence')

@section('content')
<!-- Filter & Summary Bar -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
    <form action="{{ route('admin.attendance') }}" method="GET" class="d-flex gap-2 align-items-center">
      <label class="small fw-bold text-muted text-nowrap">Pilih Tanggal:</label>
      <input type="date" name="date" class="form-control rounded-3" value="{{ $selectedDate }}" onchange="this.form.submit()">
      
      <select name="status" class="form-select rounded-3" onchange="this.form.submit()">
        <option value="">Semua Status</option>
        <option value="present" {{ request('status') == 'present' ? 'selected' : '' }}>Tepat Waktu</option>
        <option value="late" {{ request('status') == 'late' ? 'selected' : '' }}>Terlambat</option>
      </select>
    </form>

    <div class="d-flex gap-2">
      <div class="px-3 py-1 bg-success-subtle text-success rounded-pill fw-semibold small">
        <i class="bi bi-check2-circle me-1"></i> Tepat Waktu: {{ $presentCount }}
      </div>
      <div class="px-3 py-1 bg-warning-subtle text-warning rounded-pill fw-semibold small">
        <i class="bi bi-exclamation-circle me-1"></i> Terlambat: {{ $lateCount }}
      </div>
      <div class="px-3 py-1 bg-primary-subtle text-primary rounded-pill fw-semibold small">
        <i class="bi bi-people me-1"></i> Total Karyawan: {{ $totalActive }}
      </div>
    </div>
  </div>
</div>

<!-- Attendance Logs Table -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>Karyawan</th>
          <th>Departemen</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Durasi Kerja</th>
          <th>Status</th>
          <th>Selfie Snapshot</th>
          <th>Lokasi GPS</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($attendances as $att)
          <tr>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img src="{{ $att->employee->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($att->employee->full_name) }}" width="32" height="32" class="rounded-circle" alt="">
                <div>
                  <div class="fw-bold text-slate-900">{{ $att->employee->full_name }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $att->employee->emp_code }}</div>
                </div>
              </div>
            </td>
            <td>{{ $att->employee->department->name ?? '-' }}</td>
            <td>
              <span class="fw-bold text-success">{{ $att->check_in_time ? substr($att->check_in_time, 0, 5) . ' WIB' : '-' }}</span>
            </td>
            <td>
              <span class="fw-bold text-danger">{{ $att->check_out_time ? substr($att->check_out_time, 0, 5) . ' WIB' : '-' }}</span>
            </td>
            <td>
              {{ floor($att->work_duration_minutes / 60) }} jam {{ $att->work_duration_minutes % 60 }} m
            </td>
            <td>
              <span class="badge {{ $att->status === 'present' ? 'bg-success' : 'bg-warning text-dark' }} rounded-pill">
                {{ ucfirst($att->status) }}
              </span>
            </td>
            <td>
              @if($att->check_in_photo)
                <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 rounded-pill" onclick="previewSelfie('{{ $att->check_in_photo }}', '{{ $att->employee->full_name }}')">
                  <i class="bi bi-camera-fill me-1"></i> Lihat Foto
                </button>
              @else
                <span class="text-muted" style="font-size: 11px;">Tidak ada foto</span>
              @endif
            </td>
            <td>
              @if($att->check_in_lat && $att->check_in_lng)
                <a href="https://maps.google.com/?q={{ $att->check_in_lat }},{{ $att->check_in_lng }}" target="_blank" class="btn btn-sm btn-light border py-0 px-2 rounded-pill text-primary" title="Buka di Google Maps">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i> Maps Link
                </a>
              @else
                <span class="text-muted">-</span>
              @endif
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="8" class="text-center py-4 text-muted">Belum ada catatan presensi pada tanggal {{ $selectedDate }}.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="mt-3">
    {{ $attendances->appends(request()->query())->links() }}
  </div>
</div>

<!-- Modal Selfie -->
<div class="modal fade" id="modalSelfie" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h6 class="modal-title fw-bold" id="selfieTitle">Foto Verifikasi Absensi</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body text-center py-3">
        <img id="selfieSrc" src="" class="img-fluid rounded-4 shadow-sm" alt="Selfie">
      </div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
function previewSelfie(src, name) {
  document.getElementById('selfieTitle').textContent = 'Selfie: ' + name;
  document.getElementById('selfieSrc').src = src;
  new bootstrap.Modal(document.getElementById('modalSelfie')).show();
}
</script>
@endsection
