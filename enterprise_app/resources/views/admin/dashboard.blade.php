@extends('layouts.admin')

@section('title', 'Executive Dashboard')
@section('page_title', 'Enterprise Overview Dashboard')

@section('content')
<!-- KPI Cards Row -->
<div class="row g-3 mb-4">
  <!-- Total Employees -->
  <div class="col-xl-3 col-md-6">
    <div class="kpi-card d-flex align-items-center justify-content-between">
      <div>
        <div class="text-muted small fw-semibold text-uppercase" style="font-size: 11px;">Total Karyawan Aktif</div>
        <div class="fs-3 fw-bold text-slate-900 mt-1">{{ $totalEmployees }}</div>
        <span class="badge bg-primary-subtle text-primary small mt-1">{{ $totalDepartments }} Departemen</span>
      </div>
      <div class="kpi-icon bg-primary-subtle text-primary">
        <i class="bi bi-people-fill"></i>
      </div>
    </div>
  </div>

  <!-- Today's Attendance -->
  <div class="col-xl-3 col-md-6">
    <div class="kpi-card d-flex align-items-center justify-content-between">
      <div>
        <div class="text-muted small fw-semibold text-uppercase" style="font-size: 11px;">Kehadiran Hari Ini</div>
        <div class="fs-3 fw-bold text-success mt-1">{{ $attendanceRate }}%</div>
        <span class="text-muted small mt-1">{{ $todayAttendanceCount }} dari {{ $totalEmployees }} Hadir</span>
      </div>
      <div class="kpi-icon bg-success-subtle text-success">
        <i class="bi bi-calendar-check-fill"></i>
      </div>
    </div>
  </div>

  <!-- Pending Approvals -->
  <div class="col-xl-3 col-md-6">
    <div class="kpi-card d-flex align-items-center justify-content-between">
      <div>
        <div class="text-muted small fw-semibold text-uppercase" style="font-size: 11px;">Menunggu Approval</div>
        <div class="fs-3 fw-bold {{ $totalPendingApprovals > 0 ? 'text-warning' : 'text-muted' }} mt-1">{{ $totalPendingApprovals }}</div>
        <span class="text-muted small mt-1">{{ $pendingLeaves }} Cuti / {{ $pendingWfh }} WFH</span>
      </div>
      <div class="kpi-icon bg-warning-subtle text-warning">
        <i class="bi bi-envelope-exclamation-fill"></i>
      </div>
    </div>
  </div>

  <!-- Total Asset Value -->
  <div class="col-xl-3 col-md-6">
    <div class="kpi-card d-flex align-items-center justify-content-between">
      <div>
        <div class="text-muted small fw-semibold text-uppercase" style="font-size: 11px;">Valuasi Aset Perusahaan</div>
        <div class="fs-4 fw-bold text-slate-900 mt-1">Rp {{ number_format($totalAssetValue / 1000000, 0) }} Juta</div>
        <span class="text-muted small mt-1">{{ $totalAssetsCount }} Unit Terinventarisir</span>
      </div>
      <div class="kpi-icon bg-info-subtle text-info">
        <i class="bi bi-laptop-fill"></i>
      </div>
    </div>
  </div>
</div>

<!-- Charts & Visual Analytics Row -->
<div class="row g-3 mb-4">
  <!-- Attendance Trend Chart -->
  <div class="col-lg-8">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-slate-900 mb-0">Tren Kehadiran Karyawan (7 Hari Terakhir)</h6>
        <span class="badge bg-light text-dark border">Real-time GPS Log</span>
      </div>
      <div style="height: 260px;">
        <canvas id="attendanceChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Department Distribution -->
  <div class="col-lg-4">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
      <h6 class="fw-bold text-slate-900 mb-3">Distribusi Karyawan per Departemen</h6>
      <div class="d-flex flex-column gap-3">
        @foreach($deptBreakdown as $dept)
          <div>
            <div class="d-flex justify-content-between small fw-semibold mb-1">
              <span>{{ $dept->name }}</span>
              <span class="text-primary">{{ $dept->employees_count }} Orang</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-primary" role="progressbar" style="width: {{ $totalEmployees > 0 ? ($dept->employees_count / $totalEmployees) * 100 : 0 }}%;"></div>
            </div>
          </div>
        @endforeach
      </div>
    </div>
  </div>
</div>

<!-- Tables Row: Live Attendance & Pending Leaves -->
<div class="row g-3">
  <!-- Live Attendance Logs -->
  <div class="col-lg-6">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-slate-900 mb-0">Presensi Masuk Hari Ini</h6>
        <a href="{{ route('admin.attendance') }}" class="small text-primary text-decoration-none fw-semibold">Lihat Semua Log</a>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small">
            <tr>
              <th>Karyawan</th>
              <th>Jam Check-In</th>
              <th>Status</th>
              <th>Foto Selfie</th>
            </tr>
          </thead>
          <tbody class="small">
            @forelse($recentAttendances as $att)
              <tr>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img src="{{ $att->employee->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($att->employee->full_name) }}" width="30" height="30" class="rounded-circle" alt="">
                    <div>
                      <div class="fw-semibold">{{ $att->employee->full_name }}</div>
                      <div class="text-muted" style="font-size: 11px;">{{ $att->employee->position }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ substr($att->check_in_time, 0, 5) }} WIB</td>
                <td>
                  <span class="badge {{ $att->status === 'present' ? 'bg-success' : 'bg-warning text-dark' }} rounded-pill">
                    {{ ucfirst($att->status) }}
                  </span>
                </td>
                <td>
                  @if($att->check_in_photo)
                    <button class="btn btn-sm btn-outline-primary py-0 px-2 rounded-pill" onclick="previewSelfieModal('{{ $att->check_in_photo }}', '{{ $att->employee->full_name }}')">
                      <i class="bi bi-image"></i> Lihat
                    </button>
                  @else
                    <span class="text-muted" style="font-size: 11px;">Check-in GPS</span>
                  @endif
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="4" class="text-center text-muted py-3">Belum ada aktivitas presensi hari ini.</td>
              </tr>
            @endforelse
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Pending Approvals Quick Action -->
  <div class="col-lg-6">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-slate-900 mb-0">Permohonan Cuti Terbaru</h6>
        <a href="{{ route('admin.leaves') }}" class="small text-primary text-decoration-none fw-semibold">Kelola Persetujuan</a>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small">
            <tr>
              <th>Karyawan</th>
              <th>Tipe & Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="small">
            @forelse($recentLeaves as $leave)
              <tr>
                <td>
                  <div class="fw-semibold">{{ $leave->employee->full_name }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $leave->employee->department->code ?? 'Dept' }}</div>
                </td>
                <td>
                  <span class="badge bg-primary-subtle text-primary text-uppercase">{{ $leave->leave_type }}</span>
                  <div class="text-muted" style="font-size: 11px;">{{ $leave->start_date->format('d M') }} - {{ $leave->end_date->format('d M Y') }}</div>
                </td>
                <td>
                  <span class="badge {{ $leave->status === 'approved' ? 'bg-success' : ($leave->status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark') }} rounded-pill">
                    {{ ucfirst($leave->status) }}
                  </span>
                </td>
                <td>
                  @if($leave->status === 'pending')
                    <a href="{{ route('admin.leaves') }}" class="btn btn-sm btn-primary rounded-pill py-0 px-2">Review</a>
                  @else
                    <span class="text-muted" style="font-size: 11px;">Selesai</span>
                  @endif
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="4" class="text-center text-muted py-3">Tidak ada permohonan cuti.</td>
              </tr>
            @endforelse
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Modal Selfie Preview -->
<div class="modal fade" id="modalSelfieView" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h6 class="modal-title fw-bold" id="selfieEmpName">Foto Selfie Check-In</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body text-center py-3">
        <img id="selfieImgTarget" src="" class="img-fluid rounded-4 shadow-sm" alt="Selfie Photo">
      </div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Render Attendance Chart
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: @json($chartDates),
      datasets: [{
        label: 'Jumlah Karyawan Hadir',
        data: @json($chartCounts),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
});

function previewSelfieModal(photoSrc, name) {
  document.getElementById('selfieEmpName').textContent = 'Selfie: ' + name;
  document.getElementById('selfieImgTarget').src = photoSrc;
  new bootstrap.Modal(document.getElementById('modalSelfieView')).show();
}
</script>
@endsection
