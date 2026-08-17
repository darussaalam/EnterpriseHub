@extends('layouts.mobile')

@section('title', 'Tugas Saya - EnterpriseHub')

@section('content')
<div class="mb-3">
  <div class="d-flex justify-content-between align-items-center">
    <h5 class="fw-bold text-slate-900 mb-0">Daftar Tugas Anda</h5>
    <span class="badge bg-primary rounded-pill px-3 py-1">{{ $tasks->count() }} Total Tugas</span>
  </div>
  <p class="text-muted small">Update progress dan laporkan penyelesaian pekerjaan Anda.</p>
</div>

@forelse($tasks as $task)
  <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div>
        <span class="badge {{ $task->priority === 'urgent' ? 'bg-danger' : ($task->priority === 'high' ? 'bg-warning text-dark' : 'bg-info-subtle text-info') }} rounded-pill" style="font-size: 10px;">
          {{ strtoupper($task->priority) }}
        </span>
        <span class="badge bg-light text-dark ms-1" style="font-size: 10px;">
          {{ $task->project->name ?? 'Internal Task' }}
        </span>
      </div>
      <span class="badge {{ $task->status === 'completed' ? 'bg-success' : ($task->status === 'in_progress' ? 'bg-primary' : 'bg-secondary') }} rounded-pill">
        {{ strtoupper(str_replace('_', ' ', $task->status)) }}
      </span>
    </div>

    <h6 class="fw-bold text-slate-900 mb-1">{{ $task->title }}</h6>
    <p class="text-muted small mb-3" style="font-size: 12px;">{{ $task->description }}</p>

    <div class="d-flex align-items-center justify-content-between mb-1">
      <span class="text-muted small" style="font-size: 11px;">
        <i class="bi bi-calendar-event me-1"></i> Deadline: <strong>{{ $task->deadline ? $task->deadline->format('d M Y') : 'Tidak ditentukan' }}</strong>
      </span>
      <span class="fw-bold text-primary small">{{ $task->progress_percentage }}%</span>
    </div>

    <div class="progress mb-3" style="height: 8px;">
      <div class="progress-bar bg-primary" role="progressbar" style="width: {{ $task->progress_percentage }}%;"></div>
    </div>

    <!-- Actions -->
    <div class="d-flex gap-2">
      @if($task->status === 'todo')
        <button onclick="startTaskAction({{ $task->id }})" class="btn btn-primary btn-sm flex-fill rounded-pill fw-semibold py-1">
          <i class="bi bi-play-fill me-1"></i> Mulai Kerjakan
        </button>
      @elseif($task->status !== 'completed')
        <button onclick="openProgressModal({{ $task->id }}, {{ $task->progress_percentage }}, '{{ addslashes($task->title) }}')" class="btn btn-outline-primary btn-sm flex-fill rounded-pill fw-semibold py-1">
          <i class="bi bi-sliders me-1"></i> Update Progress
        </button>
        <button onclick="completeTaskAction({{ $task->id }})" class="btn btn-success btn-sm rounded-pill fw-semibold px-3 py-1">
          <i class="bi bi-check-lg me-1"></i> Selesai
        </button>
      @else
        <button class="btn btn-light btn-sm w-100 rounded-pill text-success fw-bold py-1" disabled>
          <i class="bi bi-check2-all me-1"></i> Tugas Selesai 100%
        </button>
      @endif
    </div>
  </div>
@empty
  <div class="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
    <i class="bi bi-clipboard-check fs-1 text-success mb-2"></i>
    <h6 class="fw-bold">Tidak ada tugas aktif</h6>
    <p class="text-muted small">Semua pekerjaan Anda telah selesai atau belum ada tugas baru.</p>
  </div>
@endforelse

<!-- Modal Update Progress -->
<div class="modal fade" id="modalProgress" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered px-3">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h6 class="modal-title fw-bold" id="modalTaskTitle">Update Progress Tugas</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body py-3">
        <input type="hidden" id="modalTaskId">
        <div class="text-center my-3">
          <div class="display-5 fw-bold text-primary" id="progressValDisplay">50%</div>
          <span class="text-muted small">Tingkat Penyelesaian</span>
        </div>

        <input type="range" class="form-range" id="progressRange" min="0" max="100" step="5" oninput="document.getElementById('progressValDisplay').textContent = this.value + '%'">

        <div class="d-flex justify-content-between gap-1 mt-2">
          <button type="button" class="btn btn-sm btn-light border flex-fill" onclick="setSliderVal(25)">25%</button>
          <button type="button" class="btn btn-sm btn-light border flex-fill" onclick="setSliderVal(50)">50%</button>
          <button type="button" class="btn btn-sm btn-light border flex-fill" onclick="setSliderVal(75)">75%</button>
          <button type="button" class="btn btn-sm btn-light border flex-fill" onclick="setSliderVal(100)">100%</button>
        </div>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light rounded-pill px-3" data-bs-dismiss="modal">Batal</button>
        <button type="button" onclick="saveProgress()" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Progress</button>
      </div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
let progressModalInstance = null;

function setSliderVal(val) {
  document.getElementById('progressRange').value = val;
  document.getElementById('progressValDisplay').textContent = val + '%';
}

function openProgressModal(id, currentVal, title) {
  document.getElementById('modalTaskId').value = id;
  document.getElementById('modalTaskTitle').textContent = title;
  setSliderVal(currentVal);

  if (!progressModalInstance) {
    progressModalInstance = new bootstrap.Modal(document.getElementById('modalProgress'));
  }
  progressModalInstance.show();
}

async function saveProgress() {
  const id = document.getElementById('modalTaskId').value;
  const val = document.getElementById('progressRange').value;

  try {
    const res = await fetch(`/mobile/tasks/${id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ progress_percentage: val })
    });

    const result = await res.json();
    if (result.success) {
      progressModalInstance.hide();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: result.message,
        confirmButtonColor: '#2563eb'
      }).then(() => window.location.reload());
    }
  } catch(e) {
    Swal.fire({ icon: 'error', text: 'Gagal memperbarui progress.' });
  }
}

async function startTaskAction(id) {
  try {
    const res = await fetch(`/mobile/tasks/${id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      }
    });
    const result = await res.json();
    if (result.success) {
      window.location.reload();
    }
  } catch(e) {
    Swal.fire({ icon: 'error', text: 'Gagal memulai tugas.' });
  }
}

async function completeTaskAction(id) {
  const confirm = await Swal.fire({
    title: 'Selesaikan Tugas?',
    text: 'Tugas akan ditandai sebagai 100% selesai.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Tandai Selesai'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`/mobile/tasks/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json'
        }
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Tugas Selesai!',
          confirmButtonColor: '#16a34a'
        }).then(() => window.location.reload());
      }
    } catch(e) {
      Swal.fire({ icon: 'error', text: 'Gagal menyelesaikan tugas.' });
    }
  }
}
</script>
@endsection
