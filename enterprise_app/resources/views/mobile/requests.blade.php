@extends('layouts.mobile')

@section('title', 'Pengajuan Cuti & WFH - EnterpriseHub')

@section('content')
<div class="mb-3">
  <h5 class="fw-bold text-slate-900 mb-1">Pengajuan Karyawan</h5>
  <p class="text-muted small">Ajukan cuti tahunan, izin sakit, atau jadwal Work From Home (WFH).</p>
</div>

<!-- Nav Tabs -->
<ul class="nav nav-pills nav-fill bg-white p-1 rounded-4 shadow-sm mb-3" id="requestTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active rounded-4 fw-semibold py-2 small" id="cuti-tab" data-bs-toggle="tab" data-bs-target="#cuti" type="button" role="tab">
      <i class="bi bi-calendar-event me-1"></i> Form Cuti/Izin
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link rounded-4 fw-semibold py-2 small" id="wfh-tab" data-bs-toggle="tab" data-bs-target="#wfh" type="button" role="tab">
      <i class="bi bi-laptop me-1"></i> Form WFH
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link rounded-4 fw-semibold py-2 small" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab">
      <i class="bi bi-card-checklist me-1"></i> Riwayat
    </button>
  </li>
</ul>

<div class="tab-content" id="requestTabContent">
  <!-- TAB 1: FORM CUTI -->
  <div class="tab-pane fade show active" id="cuti" role="tabpanel">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <h6 class="fw-bold text-slate-800 mb-3">Permohonan Cuti / Izin</h6>
      <form action="{{ route('mobile.requests.leave') }}" method="POST">
        @csrf
        <div class="mb-3">
          <label class="form-label small fw-semibold text-muted">Jenis Permohonan</label>
          <select name="leave_type" class="form-select rounded-3" required>
            <option value="annual">Cuti Tahunan</option>
            <option value="sick">Izin Sakit</option>
            <option value="permission">Izin Tidak Masuk / Keperluan Pribadi</option>
            <option value="emergency">Cuti Darurat / Keluarga</option>
            <option value="maternity">Cuti Melahirkan</option>
          </select>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label small fw-semibold text-muted">Tanggal Mulai</label>
            <input type="date" name="start_date" class="form-control rounded-3" value="{{ date('Y-m-d') }}" required>
          </div>
          <div class="col-6">
            <label class="form-label small fw-semibold text-muted">Tanggal Selesai</label>
            <input type="date" name="end_date" class="form-control rounded-3" value="{{ date('Y-m-d') }}" required>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold text-muted">Alasan Pengajuan</label>
          <textarea name="reason" class="form-control rounded-3" rows="3" placeholder="Tuliskan keterangan detail..." required></textarea>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 rounded-3 fw-bold">
          <i class="bi bi-send-fill me-1"></i> Kirim Pengajuan Cuti
        </button>
      </form>
    </div>
  </div>

  <!-- TAB 2: FORM WFH -->
  <div class="tab-pane fade" id="wfh" role="tabpanel">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <h6 class="fw-bold text-slate-800 mb-3">Permohonan Work From Home (WFH)</h6>
      <form action="{{ route('mobile.requests.wfh') }}" method="POST">
        @csrf
        <div class="mb-3">
          <label class="form-label small fw-semibold text-muted">Tanggal WFH</label>
          <input type="date" name="date" class="form-control rounded-3" value="{{ date('Y-m-d', strtotime('+1 day')) }}" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-semibold text-muted">Alasan / Agenda Pekerjaan WFH</label>
          <textarea name="reason" class="form-control rounded-3" rows="3" placeholder="Jelaskan agenda kerja yang akan diselesaikan selama WFH..." required></textarea>
        </div>

        <button type="submit" class="btn btn-warning w-100 py-2 rounded-3 fw-bold text-dark">
          <i class="bi bi-send-fill me-1"></i> Kirim Pengajuan WFH
        </button>
      </form>
    </div>
  </div>

  <!-- TAB 3: RIWAYAT STATUS -->
  <div class="tab-pane fade" id="history" role="tabpanel">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
      <h6 class="fw-bold text-slate-800 mb-3">Daftar Pengajuan Cuti & Izin</h6>
      @forelse($leaveRequests as $leave)
        <div class="p-3 border rounded-3 mb-2 bg-light">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-primary-subtle text-primary fw-bold text-uppercase">{{ $leave->leave_type }}</span>
            <span class="badge {{ $leave->status === 'approved' ? 'bg-success' : ($leave->status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark') }} rounded-pill">
              {{ ucfirst($leave->status) }}
            </span>
          </div>
          <div class="small fw-semibold text-dark mb-1">
            {{ $leave->start_date->format('d M Y') }} s/d {{ $leave->end_date->format('d M Y') }}
          </div>
          <p class="text-muted small mb-1" style="font-size: 12px;">{{ $leave->reason }}</p>
          @if($leave->approval_notes)
            <div class="alert alert-secondary py-1 px-2 mb-0 small text-secondary" style="font-size: 11px;">
              <i class="bi bi-chat-quote me-1"></i> Catatan Reviewer: {{ $leave->approval_notes }}
            </div>
          @endif
        </div>
      @empty
        <div class="text-center py-3 text-muted small">Belum ada riwayat pengajuan cuti.</div>
      @endforelse
    </div>

    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <h6 class="fw-bold text-slate-800 mb-3">Daftar Pengajuan WFH</h6>
      @forelse($wfhRequests as $wfh)
        <div class="p-3 border rounded-3 mb-2 bg-light">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-dark small">{{ $wfh->date->format('d M Y') }}</span>
            <span class="badge {{ $wfh->status === 'approved' ? 'bg-success' : ($wfh->status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark') }} rounded-pill">
              {{ ucfirst($wfh->status) }}
            </span>
          </div>
          <p class="text-muted small mb-1" style="font-size: 12px;">{{ $wfh->reason }}</p>
          @if($wfh->approval_notes)
            <div class="alert alert-secondary py-1 px-2 mb-0 small text-secondary" style="font-size: 11px;">
              <i class="bi bi-chat-quote me-1"></i> Catatan: {{ $wfh->approval_notes }}
            </div>
          @endif
        </div>
      @empty
        <div class="text-center py-3 text-muted small">Belum ada riwayat pengajuan WFH.</div>
      @endforelse
    </div>
  </div>
</div>
@endsection
