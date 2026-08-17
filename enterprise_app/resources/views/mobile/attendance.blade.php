@extends('layouts.mobile')

@section('title', 'Absensi Kamera & GPS - EnterpriseHub')

@section('content')
<div class="mb-3">
  <div class="d-flex justify-content-between align-items-center">
    <h5 class="fw-bold text-slate-900 mb-0">Presensi Karyawan</h5>
    <a href="{{ route('mobile.attendance.history') }}" class="btn btn-outline-primary btn-sm rounded-pill py-1 px-3">
      <i class="bi bi-clock-history me-1"></i> Riwayat
    </a>
  </div>
  <p class="text-muted small">Sistem mengambil GPS lokasi kantor dan foto selfie verifikasi.</p>
</div>

<!-- Status Banner -->
<div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
  <div class="d-flex align-items-center justify-content-between">
    <div>
      <span class="text-muted small d-block">Status Hari Ini</span>
      @if($todayAttendance && $todayAttendance->check_in_time)
        @if($todayAttendance->check_out_time)
          <span class="badge bg-secondary rounded-pill px-3 py-1">Selesai (Sudah Check-Out)</span>
        @else
          <span class="badge bg-success rounded-pill px-3 py-1"><i class="bi bi-check-circle me-1"></i> Sudah Check-In ({{ substr($todayAttendance->check_in_time, 0, 5) }} WIB)</span>
        @endif
      @else
        <span class="badge bg-warning text-dark rounded-pill px-3 py-1">Belum Melakukan Presensi</span>
      @endif
    </div>
    <div class="text-end">
      <div class="fs-5 fw-bold text-primary" id="live-clock">{{ date('H:i:s') }}</div>
      <div class="text-muted small" style="font-size: 11px;">Waktu Server</div>
    </div>
  </div>
</div>

@if(!$todayAttendance || !$todayAttendance->check_in_time)
  <!-- ================= CHECK-IN FORM ================= -->
  <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
    <h6 class="fw-bold text-slate-800 mb-3 text-center">
      <i class="bi bi-camera me-1 text-primary"></i> Ambil Foto Selfie & GPS Check-In
    </h6>

    <!-- Camera Viewfinder -->
    <div class="camera-container mb-3 position-relative">
      <video id="camera-stream" autoplay playsinline muted></video>
      <canvas id="camera-canvas" class="d-none"></canvas>
      <img id="selfie-preview" class="d-none rounded-circle w-100 h-100 object-fit-cover" alt="Preview Selfie">
      <div class="camera-scanline" id="camera-scanline"></div>
    </div>

    <!-- Camera Controls -->
    <div class="d-flex justify-content-center gap-2 mb-3">
      <button type="button" id="btn-snap" onclick="snapSelfie()" class="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
        <i class="bi bi-camera-fill me-1"></i> Ambil Selfie
      </button>
      <button type="button" id="btn-retake" onclick="resetSelfie()" class="btn btn-outline-secondary rounded-pill px-3 py-2 d-none">
        <i class="bi bi-arrow-repeat me-1"></i> Ulangi
      </button>
    </div>

    <!-- GPS Geolocation Info Card -->
    <div class="p-3 bg-light rounded-3 mb-3 border">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center gap-2">
          <div class="gps-pulse">
            <i class="bi bi-geo-alt-fill text-success fs-5"></i>
          </div>
          <span class="fw-bold small text-slate-800">Lokasi GPS Anda</span>
        </div>
        <button type="button" onclick="detectGPS()" class="btn btn-sm btn-link text-primary p-0 text-decoration-none small">
          <i class="bi bi-arrow-clockwise"></i> Refresh GPS
        </button>
      </div>

      <div id="gps-status" class="small text-muted mb-2">
        <span class="spinner-border spinner-border-sm me-1 text-primary" role="status"></span> Mendeteksi koordinat GPS...
      </div>

      <div id="office-distance-info" class="p-2 rounded-2 bg-white small border d-none">
        <div class="d-flex justify-content-between">
          <span class="text-muted">Target Kantor:</span>
          <span class="fw-bold text-dark" id="target-office-name">-</span>
        </div>
        <div class="d-flex justify-content-between">
          <span class="text-muted">Jarak ke Kantor:</span>
          <span class="fw-bold text-primary" id="distance-value">-</span>
        </div>
      </div>
    </div>

    <!-- Check In Submission Form -->
    <form id="form-checkin" onsubmit="submitCheckIn(event)">
      <input type="hidden" id="selfie-base64-input" name="photo">
      <input type="hidden" id="gps-lat" name="latitude">
      <input type="hidden" id="gps-lng" name="longitude">

      <div class="mb-3">
        <input type="text" name="notes" id="checkin-notes" class="form-control rounded-3 form-control-sm" placeholder="Catatan opsional (misal: Kerja di Head Office Lt 3)">
      </div>

      <button type="submit" id="btn-submit-checkin" class="btn btn-success w-100 py-3 rounded-3 fw-bold fs-6 shadow-sm">
        <i class="bi bi-box-arrow-in-right me-1"></i> SUBMIT CHECK-IN SEKARANG
      </button>
    </form>
  </div>

@elseif(!$todayAttendance->check_out_time)
  <!-- ================= CHECK-OUT FORM ================= -->
  <div class="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white text-center">
    <div class="p-3 rounded-circle bg-success-subtle text-success d-inline-block mx-auto mb-3">
      <i class="bi bi-clock-history fs-1"></i>
    </div>
    <h5 class="fw-bold text-slate-800 mb-1">Anda Sedang Bekerja</h5>
    <p class="text-muted small mb-3">
      Check-In dicatat pada jam <strong>{{ substr($todayAttendance->check_in_time, 0, 5) }} WIB</strong>.
    </p>

    <!-- GPS Info for Check-out -->
    <div class="p-3 bg-light rounded-3 mb-3 text-start border">
      <div class="d-flex align-items-center gap-2 mb-1">
        <i class="bi bi-geo-alt-fill text-primary"></i>
        <span class="fw-bold small">Lokasi Pulang (Check-Out)</span>
      </div>
      <div id="gps-status-out" class="small text-muted">
        <span class="spinner-border spinner-border-sm me-1 text-primary" role="status"></span> Mengambil koordinat GPS...
      </div>
    </div>

    <form id="form-checkout" onsubmit="submitCheckOut(event)">
      <input type="hidden" id="gps-lat-out" name="latitude">
      <input type="hidden" id="gps-lng-out" name="longitude">

      <button type="submit" id="btn-submit-checkout" class="btn btn-danger w-100 py-3 rounded-3 fw-bold fs-6 shadow-sm">
        <i class="bi bi-box-arrow-right me-1"></i> CHECK-OUT SEKARANG (PULANG)
      </button>
    </form>
  </div>

@else
  <!-- ================= ALREADY COMPLETED ================= -->
  <div class="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white text-center">
    <div class="p-3 rounded-circle bg-primary-subtle text-primary d-inline-block mx-auto mb-3">
      <i class="bi bi-award fs-1"></i>
    </div>
    <h5 class="fw-bold text-slate-900 mb-1">Presensi Hari Ini Lengkap!</h5>
    <p class="text-muted small mb-4">Terima kasih atas kerja keras Anda hari ini.</p>

    <div class="row g-2 bg-light p-3 rounded-3 mb-3 text-start">
      <div class="col-6">
        <span class="text-muted small d-block">Jam Masuk:</span>
        <strong class="text-dark">{{ substr($todayAttendance->check_in_time, 0, 5) }} WIB</strong>
      </div>
      <div class="col-6">
        <span class="text-muted small d-block">Jam Pulang:</span>
        <strong class="text-dark">{{ substr($todayAttendance->check_out_time, 0, 5) }} WIB</strong>
      </div>
      <div class="col-12 mt-2 pt-2 border-top">
        <span class="text-muted small d-block">Durasi Kerja:</span>
        <strong class="text-primary">{{ floor($todayAttendance->work_duration_minutes / 60) }} jam {{ $todayAttendance->work_duration_minutes % 60 }} menit</strong>
      </div>
    </div>

    <a href="{{ route('mobile.dashboard') }}" class="btn btn-outline-primary rounded-pill py-2 w-100 fw-semibold">
      Kembali ke Beranda
    </a>
  </div>
@endif

<!-- Office Locations Reference Info -->
<div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
  <div class="d-flex align-items-center gap-2 mb-2">
    <i class="bi bi-buildings text-muted"></i>
    <span class="fw-bold small text-slate-800">Daftar Titik Kantor Terdaftar</span>
  </div>
  @foreach($locations as $loc)
    <div class="p-2 border rounded-3 mb-2 small bg-light">
      <div class="fw-bold text-dark">{{ $loc->name }}</div>
      <div class="text-muted" style="font-size: 11px;">{{ $loc->address }}</div>
      <div class="text-primary mt-1" style="font-size: 10px;">
        <i class="bi bi-radar"></i> Radius Geofence: {{ $loc->radius_meters }} meter
      </div>
    </div>
  @endforeach
</div>
@endsection

@section('scripts')
<script>
const officeLocations = @json($locations);
let currentCoords = { latitude: -6.225588, longitude: 106.808560 }; // Default HQ

document.addEventListener('DOMContentLoaded', () => {
  // Initialize camera if check-in form is present
  if (document.getElementById('camera-stream')) {
    initCamera('camera-stream');
    detectGPS();
  }

  if (document.getElementById('gps-status-out')) {
    detectGPSCheckout();
  }
});

function snapSelfie() {
  const photo = takeSelfieSnapshot('camera-stream', 'camera-canvas', 'selfie-preview');
  if (photo) {
    document.getElementById('btn-snap').classList.add('d-none');
    document.getElementById('btn-retake').classList.remove('d-none');
    document.getElementById('camera-scanline').classList.add('d-none');
  }
}

function resetSelfie() {
  retakeSelfie('camera-stream', 'selfie-preview');
  document.getElementById('btn-snap').classList.remove('d-none');
  document.getElementById('btn-retake').classList.add('d-none');
  document.getElementById('camera-scanline').classList.remove('d-none');
}

async function detectGPS() {
  const statusEl = document.getElementById('gps-status');
  const distInfoEl = document.getElementById('office-distance-info');

  try {
    const coords = await getGPSCoordinates();
    currentCoords = coords;
    document.getElementById('gps-lat').value = coords.latitude;
    document.getElementById('gps-lng').value = coords.longitude;

    statusEl.innerHTML = `<span class="text-success"><i class="bi bi-geo-alt-fill"></i> Terkunci: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)} (Akurasi ±${Math.round(coords.accuracy)}m)</span>`;
    
    // Check distance to closest office
    checkClosestOffice(coords.latitude, coords.longitude);
  } catch (err) {
    // Fallback default coordinates for demonstration/desktop test
    currentCoords = { latitude: -6.225588, longitude: 106.808560 };
    document.getElementById('gps-lat').value = currentCoords.latitude;
    document.getElementById('gps-lng').value = currentCoords.longitude;
    statusEl.innerHTML = `<span class="text-info"><i class="bi bi-geo-alt"></i> Lokasi GPS default Jakarta HQ aktif (${currentCoords.latitude}, ${currentCoords.longitude})</span>`;
    checkClosestOffice(currentCoords.latitude, currentCoords.longitude);
  }
}

async function detectGPSCheckout() {
  const statusEl = document.getElementById('gps-status-out');
  try {
    const coords = await getGPSCoordinates();
    document.getElementById('gps-lat-out').value = coords.latitude;
    document.getElementById('gps-lng-out').value = coords.longitude;
    statusEl.innerHTML = `<span class="text-success"><i class="bi bi-geo-alt-fill"></i> GPS Terdeteksi: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}</span>`;
  } catch(e) {
    document.getElementById('gps-lat-out').value = -6.225588;
    document.getElementById('gps-lng-out').value = 106.808560;
    statusEl.innerHTML = `<span class="text-muted"><i class="bi bi-geo-alt"></i> Menggunakan koordinat kantor HQ</span>`;
  }
}

function checkClosestOffice(lat, lng) {
  if (!officeLocations.length) return;

  let closest = officeLocations[0];
  let minDistance = calculateDistanceMeters(lat, lng, closest.latitude, closest.longitude);

  for (let i = 1; i < officeLocations.length; i++) {
    const d = calculateDistanceMeters(lat, lng, officeLocations[i].latitude, officeLocations[i].longitude);
    if (d < minDistance) {
      minDistance = d;
      closest = officeLocations[i];
    }
  }

  const distInfoEl = document.getElementById('office-distance-info');
  if (distInfoEl) {
    distInfoEl.classList.remove('d-none');
    document.getElementById('target-office-name').textContent = closest.name;
    document.getElementById('distance-value').innerHTML = `${minDistance} meter ${minDistance <= closest.radius_meters ? '<span class="badge bg-success ms-1">Dalam Radius</span>' : '<span class="badge bg-warning text-dark ms-1">Luar Radius (WFH/Dinas)</span>'}`;
  }
}

// Submit Check-In via AJAX
async function submitCheckIn(e) {
  e.preventDefault();

  const photo = document.getElementById('selfie-base64-input').value;
  const lat = document.getElementById('gps-lat').value || currentCoords.latitude;
  const lng = document.getElementById('gps-lng').value || currentCoords.longitude;
  const notes = document.getElementById('checkin-notes').value;

  const btn = document.getElementById('btn-submit-checkin');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Menyimpan presensi...';

  try {
    const res = await fetch('{{ route("mobile.attendance.checkin") }}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        photo: photo,
        notes: notes
      })
    });

    const result = await res.json();

    if (result.success) {
      stopCamera();
      Swal.fire({
        icon: 'success',
        title: 'Check-In Berhasil!',
        text: result.message,
        confirmButtonColor: '#2563eb'
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Check-In',
        text: result.message || 'Terjadi kesalahan sistem.',
        confirmButtonColor: '#2563eb'
      });
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> SUBMIT CHECK-IN SEKARANG';
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan Jaringan',
      text: 'Gagal menghubungi server.',
      confirmButtonColor: '#2563eb'
    });
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> SUBMIT CHECK-IN SEKARANG';
  }
}

// Submit Check-Out via AJAX
async function submitCheckOut(e) {
  e.preventDefault();

  const lat = document.getElementById('gps-lat-out').value || -6.225588;
  const lng = document.getElementById('gps-lng-out').value || 106.808560;

  const btn = document.getElementById('btn-submit-checkout');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Memproses check-out...';

  try {
    const res = await fetch('{{ route("mobile.attendance.checkout") }}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng
      })
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Check-Out Berhasil!',
        text: result.message,
        confirmButtonColor: '#2563eb'
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Check-Out',
        text: result.message,
        confirmButtonColor: '#2563eb'
      });
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-box-arrow-right me-1"></i> CHECK-OUT SEKARANG (PULANG)';
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan Jaringan',
      text: 'Gagal menghubungi server.',
      confirmButtonColor: '#2563eb'
    });
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-right me-1"></i> CHECK-OUT SEKARANG (PULANG)';
  }
}
</script>
@endsection
