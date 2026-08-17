@extends('layouts.admin')

@section('title', 'Laporan & Analitik')
@section('page_title', 'Pusat Laporan & Rekapitulasi Eksekutif')

@section('content')
<!-- Generator Card -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <h6 class="fw-bold text-slate-900 mb-3">Buat Laporan Baru</h6>
  
  <form action="{{ route('admin.reports.generate') }}" method="POST" class="row g-3">
    @csrf
    <div class="col-md-4">
      <label class="form-label small fw-semibold">Tipe Laporan</label>
      <select name="report_type" class="form-select rounded-3" required>
        <option value="attendance">Laporan Rekapitulasi Presensi & Kehadiran</option>
        <option value="payroll">Laporan Pengeluaran Gaji & Payroll</option>
        <option value="project">Laporan Kinerja Proyek & Tugas</option>
      </select>
    </div>
    <div class="col-md-3">
      <label class="form-label small fw-semibold">Periode Mulai</label>
      <input type="date" name="period_start" class="form-control rounded-3" value="{{ date('Y-m-01') }}" required>
    </div>
    <div class="col-md-3">
      <label class="form-label small fw-semibold">Periode Selesai</label>
      <input type="date" name="period_end" class="form-control rounded-3" value="{{ date('Y-m-d') }}" required>
    </div>
    <div class="col-md-2 d-flex align-items-end">
      <button type="submit" class="btn btn-primary rounded-3 w-100 fw-bold">
        <i class="bi bi-file-earmark-plus me-1"></i> Generate
      </button>
    </div>
  </form>
</div>

<!-- Reports Archive List -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h6 class="fw-bold text-slate-900 mb-0">Arsip Laporan Yang Telah Dibuat</h6>
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>Judul Laporan</th>
          <th>Tipe</th>
          <th>Periode</th>
          <th>Ringkasan Data</th>
          <th>Dibuat Oleh</th>
          <th>Tanggal Generate</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($reports as $rep)
          <tr>
            <td>
              <div class="fw-bold text-slate-900">{{ $rep->title }}</div>
            </td>
            <td>
              <span class="badge bg-primary-subtle text-primary text-uppercase">{{ $rep->report_type }}</span>
            </td>
            <td>
              {{ $rep->period_start ? $rep->period_start->format('d M Y') : '-' }} s/d {{ $rep->period_end ? $rep->period_end->format('d M Y') : '-' }}
            </td>
            <td>
              @if($rep->data_json)
                <div class="p-2 rounded-3 bg-light border small" style="max-width: 350px;">
                  @foreach($rep->data_json as $k => $v)
                    <div class="d-flex justify-content-between">
                      <span class="text-muted">{{ ucwords(str_replace('_', ' ', $k)) }}:</span>
                      <strong class="text-dark">{{ is_array($v) ? json_encode($v) : $v }}</strong>
                    </div>
                  @endforeach
                </div>
              @else
                <span class="text-muted">-</span>
              @endif
            </td>
            <td>{{ $rep->generator->name ?? 'System' }}</td>
            <td>{{ $rep->created_at->format('d M Y H:i') }}</td>
          </tr>
        @empty
          <tr>
            <td colspan="6" class="text-center py-4 text-muted">Belum ada laporan yang di-generate.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="mt-3">
    {{ $reports->links() }}
  </div>
</div>
@endsection
