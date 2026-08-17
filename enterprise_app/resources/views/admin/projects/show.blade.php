@extends('layouts.admin')

@section('title', 'Detail Project - ' . $project->name)
@section('page_title', 'Project: ' . $project->name)

@section('content')
<div class="mb-3">
  <a href="{{ route('admin.projects') }}" class="btn btn-light btn-sm rounded-pill px-3">
    <i class="bi bi-arrow-left me-1"></i> Kembali ke Daftar Proyek
  </a>
</div>

<!-- Project Overview Card -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex justify-content-between align-items-start mb-3">
    <div>
      <span class="badge bg-light text-dark border">{{ $project->code }}</span>
      <h4 class="fw-bold text-slate-900 mt-1 mb-1">{{ $project->name }}</h4>
      <p class="text-muted small mb-0">Client: <strong>{{ $project->client_name ?? 'Internal' }}</strong> &bull; PM: <strong>{{ $project->manager->name ?? 'Belum ditentukan' }}</strong></p>
    </div>
    <div class="text-end">
      <span class="badge {{ $project->status === 'in_progress' ? 'bg-primary' : ($project->status === 'completed' ? 'bg-success' : 'bg-secondary') }} rounded-pill px-3 py-2 fs-6">
        {{ strtoupper(str_replace('_', ' ', $project->status)) }}
      </span>
      <div class="fw-bold text-success fs-5 mt-1">Rp {{ number_format($project->budget, 0, ',', '.') }}</div>
    </div>
  </div>

  <div class="row g-2 p-3 bg-light rounded-3 small">
    <div class="col-md-3">
      <span class="text-muted d-block">Tanggal Mulai:</span>
      <strong>{{ $project->start_date ? $project->start_date->format('d M Y') : '-' }}</strong>
    </div>
    <div class="col-md-3">
      <span class="text-muted d-block">Target Selesai:</span>
      <strong>{{ $project->end_date ? $project->end_date->format('d M Y') : '-' }}</strong>
    </div>
    <div class="col-md-3">
      <span class="text-muted d-block">Total Tugas:</span>
      <strong>{{ $project->tasks->count() }} Tugas</strong>
    </div>
    <div class="col-md-3">
      <span class="text-muted d-block">Tugas Selesai:</span>
      <strong class="text-success">{{ $project->tasks->where('status', 'completed')->count() }} Tugas</strong>
    </div>
  </div>
</div>

<!-- Tasks Assignment & Tracking Section -->
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h5 class="fw-bold text-slate-900 mb-0">Tugas & Penugasan Karyawan</h5>
      <p class="text-muted small mb-0">Tugaskan pekerjaan langsung ke aplikasi mobile masing-masing karyawan.</p>
    </div>
    <button type="button" class="btn btn-primary rounded-pill px-4 fw-semibold" data-bs-toggle="modal" data-bs-target="#modalAddTask">
      <i class="bi bi-plus-lg me-1"></i> Tambah & Tugaskan Karyawan
    </button>
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>Tugas</th>
          <th>Ditugaskan Kepada</th>
          <th>Prioritas</th>
          <th>Deadline</th>
          <th>Progress %</th>
          <th>Status</th>
          <th class="text-end">Aksi</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($project->tasks as $task)
          <tr>
            <td style="max-width: 250px;">
              <div class="fw-bold text-slate-900">{{ $task->title }}</div>
              <div class="text-muted" style="font-size: 11px;">{{ Str::limit($task->description, 60) }}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img src="{{ $task->employee->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($task->employee->full_name) }}" width="28" height="28" class="rounded-circle" alt="">
                <div>
                  <div class="fw-semibold">{{ $task->employee->full_name }}</div>
                  <div class="text-muted" style="font-size: 10px;">{{ $task->employee->position }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge {{ $task->priority === 'urgent' ? 'bg-danger' : ($task->priority === 'high' ? 'bg-warning text-dark' : 'bg-secondary') }} rounded-pill">
                {{ strtoupper($task->priority) }}
              </span>
            </td>
            <td>
              {{ $task->deadline ? $task->deadline->format('d M Y') : '-' }}
            </td>
            <td style="min-width: 140px;">
              <div class="d-flex align-items-center gap-2">
                <div class="progress flex-grow-1" style="height: 6px;">
                  <div class="progress-bar bg-primary" role="progressbar" style="width: {{ $task->progress_percentage }}%;"></div>
                </div>
                <span class="fw-bold text-primary">{{ $task->progress_percentage }}%</span>
              </div>
            </td>
            <td>
              <span class="badge {{ $task->status === 'completed' ? 'bg-success' : ($task->status === 'in_progress' ? 'bg-primary' : 'bg-secondary') }} rounded-pill">
                {{ strtoupper(str_replace('_', ' ', $task->status)) }}
              </span>
            </td>
            <td class="text-end">
              <form action="{{ route('admin.tasks.update', $task->id) }}" method="POST" class="d-inline-flex gap-1">
                @csrf
                <select name="status" class="form-select form-select-sm rounded-pill" onchange="this.form.submit()" style="width: 130px;">
                  <option value="todo" {{ $task->status === 'todo' ? 'selected' : '' }}>To Do</option>
                  <option value="in_progress" {{ $task->status === 'in_progress' ? 'selected' : '' }}>In Progress</option>
                  <option value="review" {{ $task->status === 'review' ? 'selected' : '' }}>Review</option>
                  <option value="completed" {{ $task->status === 'completed' ? 'selected' : '' }}>Completed</option>
                </select>
              </form>
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="7" class="text-center py-4 text-muted">Belum ada tugas yang dibuat untuk project ini.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>
</div>

<!-- Modal Add Task -->
<div class="modal fade" id="modalAddTask" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">Tambah & Tugaskan Tugas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form action="{{ route('admin.tasks.store') }}" method="POST">
        @csrf
        <input type="hidden" name="project_id" value="{{ $project->id }}">
        <div class="modal-body py-3">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Judul Tugas</label>
            <input type="text" name="title" class="form-control rounded-3" placeholder="Contoh: Buat Dokumentasi API & ERD" required>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Tugaskan Kepada Karyawan</label>
            <select name="employee_id" class="form-select rounded-3" required>
              <option value="">Pilih Karyawan</option>
              @foreach($employees as $emp)
                <option value="{{ $emp->id }}">{{ $emp->full_name }} ({{ $emp->position }})</option>
              @endforeach
            </select>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Prioritas</label>
              <select name="priority" class="form-select rounded-3">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Deadline</label>
              <input type="date" name="deadline" class="form-control rounded-3" value="{{ date('Y-m-d', strtotime('+7 days')) }}">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Deskripsi / Instruksi Tugas</label>
            <textarea name="description" class="form-control rounded-3" rows="3" placeholder="Jelaskan deliverable dan ekspektasi hasil..."></textarea>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Tugaskan Sekarang</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
