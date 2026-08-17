@extends('layouts.admin')

@section('title', 'Lokasi Kantor GPS Geofence')
@section('page_title', 'Pengaturan Titik Kantor GPS (Geofencing)')

@section('content')
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h6 class="fw-bold text-slate-900 mb-0">Titik Koordinat Kantor & Radius Presensi</h6>
      <p class="text-muted small mb-0">Lokasi GPS ini digunakan untuk memvalidasi posisi karyawan saat melakukan check-in mobile.</p>
    </div>
    <button type="button" class="btn btn-primary rounded-pill px-4 fw-semibold" data-bs-toggle="modal" data-bs-target="#modalAddLocation">
      <i class="bi bi-plus-lg me-1"></i> Tambah Lokasi Kantor
    </button>
  </div>

  <div class="row g-3">
    @foreach($locations as $loc)
      <div class="col-md-6">
        <div class="card border rounded-4 p-3 shadow-sm bg-light h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="fw-bold text-slate-900 mb-0">{{ $loc->name }}</h5>
            <span class="badge {{ $loc->is_active ? 'bg-success' : 'bg-secondary' }} rounded-pill">
              {{ $loc->is_active ? 'AKTIF' : 'NONAKTIF' }}
            </span>
          </div>
          <p class="text-muted small mb-3">{{ $loc->address ?? 'Alamat belum diatur' }}</p>

          <div class="p-2 bg-white rounded-3 small mb-3 border">
            <div class="d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted">Latitude:</span>
              <span class="fw-bold">{{ $loc->latitude }}</span>
            </div>
            <div class="d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted">Longitude:</span>
              <span class="fw-bold">{{ $loc->longitude }}</span>
            </div>
            <div class="d-flex justify-content-between py-1 text-primary">
              <span class="text-muted">Radius Toleransi:</span>
              <span class="fw-bold">{{ $loc->radius_meters }} meter</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
            <a href="https://maps.google.com/?q={{ $loc->latitude }},{{ $loc->longitude }}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">
              <i class="bi bi-geo-alt-fill text-danger me-1"></i> Buka Google Maps
            </a>
            <form action="{{ route('admin.locations.toggle', $loc->id) }}" method="POST">
              @csrf
              <button type="submit" class="btn btn-sm {{ $loc->is_active ? 'btn-light text-muted' : 'btn-success' }} rounded-pill px-3">
                {{ $loc->is_active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    @endforeach
  </div>
</div>

<!-- Modal Add Location -->
<div class="modal fade" id="modalAddLocation" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">Tambah Titik Lokasi Kantor</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form action="{{ route('admin.locations.store') }}" method="POST">
        @csrf
        <div class="modal-body py-3">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Nama Lokasi / Kantor Cabang</label>
            <input type="text" name="name" class="form-control rounded-3" placeholder="Contoh: Kantor Cabang Bandung" required>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Alamat Lengkap</label>
            <textarea name="address" class="form-control rounded-3" rows="2" placeholder="Jl. Asia Afrika No..."></textarea>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Latitude</label>
              <input type="number" step="0.0000001" name="latitude" class="form-control rounded-3" placeholder="-6.917464" required>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Longitude</label>
              <input type="number" step="0.0000001" name="longitude" class="form-control rounded-3" placeholder="107.619123" required>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Radius Geofencing (Meter)</label>
            <input type="number" name="radius_meters" class="form-control rounded-3" value="150" required>
            <div class="text-muted" style="font-size: 11px;">Jarak toleransi lingkaran absensi (rekomendasi 100 - 300 meter).</div>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Titik GPS</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
