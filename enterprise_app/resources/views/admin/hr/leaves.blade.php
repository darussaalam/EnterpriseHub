@extends('layouts.admin')

@section('title', 'Persetujuan Cuti & WFH')
@section('page_title', 'Approval Pengajuan Cuti & Work From Home (WFH)')

@section('content')
<!-- Nav Tabs -->
<ul class="nav nav-pills bg-white p-2 rounded-4 shadow-sm mb-4" id="leaveTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active rounded-pill fw-semibold px-4" id="leave-list-tab" data-bs-toggle="tab" data-bs-target="#leave-list" type="button" role="tab">
      <i class="bi bi-calendar-event me-2"></i> Pengajuan Cuti & Izin
      @php
        $pendingLeaveCount = $leaveRequests->where('status', 'pending')->count();
      @endphp
      @if($pendingLeaveCount > 0)
        <span class="badge bg-danger ms-2 rounded-pill">{{ $pendingLeaveCount }}</span>
      @endif
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link rounded-pill fw-semibold px-4" id="wfh-list-tab" data-bs-toggle="tab" data-bs-target="#wfh-list" type="button" role="tab">
      <i class="bi bi-laptop me-2"></i> Pengajuan WFH
      @php
        $pendingWfhCount = $wfhRequests->where('status', 'pending')->count();
      @endphp
      @if($pendingWfhCount > 0)
        <span class="badge bg-warning text-dark ms-2 rounded-pill">{{ $pendingWfhCount }}</span>
      @endif
    </button>
  </li>
</ul>

<div class="tab-content" id="leaveTabContent">
  <!-- TAB 1: LEAVE REQUESTS -->
  <div class="tab-pane fade show active" id="leave-list" role="tabpanel">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small">
            <tr>
              <th>Karyawan</th>
              <th>Jenis Cuti</th>
              <th>Periode Tanggal</th>
              <th>Alasan / Keterangan</th>
              <th>Status</th>
              <th>Reviewer</th>
              <th class="text-end">Aksi Approval</th>
            </tr>
          </thead>
          <tbody class="small">
            @forelse($leaveRequests as $leave)
              <tr class="{{ $leave->status === 'pending' ? 'table-warning-subtle' : '' }}">
                <td>
                  <div class="fw-bold text-slate-900">{{ $leave->employee->full_name }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $leave->employee->department->name ?? '-' }}</div>
                </td>
                <td>
                  <span class="badge bg-primary-subtle text-primary text-uppercase">{{ $leave->leave_type }}</span>
                </td>
                <td>
                  <div class="fw-semibold text-dark">{{ $leave->start_date->format('d M Y') }} - {{ $leave->end_date->format('d M Y') }}</div>
                  <div class="text-muted" style="font-size: 11px;">({{ $leave->start_date->diffInDays($leave->end_date) + 1 }} hari)</div>
                </td>
                <td style="max-width: 250px;">
                  <div>{{ $leave->reason }}</div>
                  @if($leave->approval_notes)
                    <div class="text-secondary small mt-1 font-italic"><i class="bi bi-chat-left-text me-1"></i> "{{ $leave->approval_notes }}"</div>
                  @endif
                </td>
                <td>
                  <span class="badge {{ $leave->status === 'approved' ? 'bg-success' : ($leave->status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark') }} rounded-pill">
                    {{ strtoupper($leave->status) }}
                  </span>
                </td>
                <td>
                  {{ $leave->approver->name ?? '-' }}
                </td>
                <td class="text-end">
                  @if($leave->status === 'pending')
                    <button class="btn btn-sm btn-success rounded-pill px-3 py-1 me-1" onclick="openApprovalModal('leave', {{ $leave->id }}, '{{ $leave->employee->full_name }}', 'approved')">
                      <i class="bi bi-check-lg"></i> Setuju
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3 py-1" onclick="openApprovalModal('leave', {{ $leave->id }}, '{{ $leave->employee->full_name }}', 'rejected')">
                      <i class="bi bi-x-lg"></i> Tolak
                    </button>
                  @else
                    <span class="text-muted small">Sudah diproses</span>
                  @endif
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="7" class="text-center py-4 text-muted">Belum ada pengajuan cuti.</td>
              </tr>
            @endforelse
          </tbody>
        </table>
      </div>
      <div class="mt-3">
        {{ $leaveRequests->links() }}
      </div>
    </div>
  </div>

  <!-- TAB 2: WFH REQUESTS -->
  <div class="tab-pane fade" id="wfh-list" role="tabpanel">
    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small">
            <tr>
              <th>Karyawan</th>
              <th>Tanggal WFH</th>
              <th>Alasan / Agenda Tugas</th>
              <th>Status</th>
              <th>Reviewer</th>
              <th class="text-end">Aksi Approval</th>
            </tr>
          </thead>
          <tbody class="small">
            @forelse($wfhRequests as $wfh)
              <tr class="{{ $wfh->status === 'pending' ? 'table-warning-subtle' : '' }}">
                <td>
                  <div class="fw-bold text-slate-900">{{ $wfh->employee->full_name }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $wfh->employee->department->name ?? '-' }}</div>
                </td>
                <td>
                  <div class="fw-bold text-dark">{{ $wfh->date->format('d M Y') }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $wfh->date->isoFormat('dddd') }}</div>
                </td>
                <td style="max-width: 300px;">
                  <div>{{ $wfh->reason }}</div>
                  @if($wfh->approval_notes)
                    <div class="text-secondary small mt-1 font-italic"><i class="bi bi-chat-left-text me-1"></i> "{{ $wfh->approval_notes }}"</div>
                  @endif
                </td>
                <td>
                  <span class="badge {{ $wfh->status === 'approved' ? 'bg-success' : ($wfh->status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark') }} rounded-pill">
                    {{ strtoupper($wfh->status) }}
                  </span>
                </td>
                <td>
                  {{ $wfh->approver->name ?? '-' }}
                </td>
                <td class="text-end">
                  @if($wfh->status === 'pending')
                    <button class="btn btn-sm btn-success rounded-pill px-3 py-1 me-1" onclick="openApprovalModal('wfh', {{ $wfh->id }}, '{{ $wfh->employee->full_name }}', 'approved')">
                      <i class="bi bi-check-lg"></i> Setuju
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3 py-1" onclick="openApprovalModal('wfh', {{ $wfh->id }}, '{{ $wfh->employee->full_name }}', 'rejected')">
                      <i class="bi bi-x-lg"></i> Tolak
                    </button>
                  @else
                    <span class="text-muted small">Sudah diproses</span>
                  @endif
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="6" class="text-center py-4 text-muted">Belum ada permohonan WFH.</td>
              </tr>
            @endforelse
          </tbody>
        </table>
      </div>
      <div class="mt-3">
        {{ $wfhRequests->links() }}
      </div>
    </div>
  </div>
</div>

<!-- Modal Approval Action -->
<div class="modal fade" id="modalApproval" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold" id="approvalModalTitle">Konfirmasi Approval</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form id="approvalForm" method="POST">
        @csrf
        <div class="modal-body py-3">
          <input type="hidden" name="status" id="approvalStatusInput">
          
          <div class="p-3 rounded-3 mb-3" id="approvalAlertBox">
            <span id="approvalMessageText"></span>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Catatan Reviewer / Manajer (Opsional)</label>
            <textarea name="approval_notes" class="form-control rounded-3" rows="2" placeholder="Tuliskan alasan persetujuan / penolakan..."></textarea>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-3" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn rounded-pill px-4 fw-bold" id="approvalSubmitBtn">Kirim Keputusan</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
function openApprovalModal(type, id, empName, status) {
  const form = document.getElementById('approvalForm');
  const title = document.getElementById('approvalModalTitle');
  const alertBox = document.getElementById('approvalAlertBox');
  const messageText = document.getElementById('approvalMessageText');
  const submitBtn = document.getElementById('approvalSubmitBtn');
  const statusInput = document.getElementById('approvalStatusInput');

  statusInput.value = status;

  if (type === 'leave') {
    form.action = `/admin/leaves/${id}/process`;
  } else {
    form.action = `/admin/wfh/${id}/process`;
  }

  if (status === 'approved') {
    title.textContent = 'Persetujuan Pengajuan';
    alertBox.className = 'p-3 rounded-3 mb-3 bg-success-subtle text-success border border-success-subtle';
    messageText.textContent = `Anda akan MENYETUJUI pengajuan dari ${empName}. Notifikasi konfirmasi akan langsung dikirim ke aplikasi mobile karyawan.`;
    submitBtn.className = 'btn btn-success rounded-pill px-4 fw-bold';
    submitBtn.textContent = 'Setujui Pengajuan';
  } else {
    title.textContent = 'Penolakan Pengajuan';
    alertBox.className = 'p-3 rounded-3 mb-3 bg-danger-subtle text-danger border border-danger-subtle';
    messageText.textContent = `Anda akan MENOLAK pengajuan dari ${empName}. Berikan catatan alasan penolakan pada kolom di bawah.`;
    submitBtn.className = 'btn btn-danger rounded-pill px-4 fw-bold';
    submitBtn.textContent = 'Tolak Pengajuan';
  }

  new bootstrap.Modal(document.getElementById('modalApproval')).show();
}
</script>
@endsection
