@extends('layouts.admin')

@section('title', 'Project & Task Management')
@section('page_title', 'Manajemen Proyek & Penugasan Tim')

@section('content')
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h6 class="fw-bold text-slate-900 mb-0">Daftar Project Perusahaan</h6>
      <p class="text-muted small mb-0">Kelola milestone project, timeline, budget, dan penugasan karyawan.</p>
    </div>
    <button type="button" class="btn btn-primary rounded-pill px-4 fw-semibold" data-bs-toggle="modal" data-bs-target="#modalAddProject">
      <i class="bi bi-plus-lg me-1"></i> Buat Project Baru
    </button>
  </div>

  <div class="row g-3">
    @forelse($projects as $proj)
      <div class="col-md-6">
        <div class="card border rounded-4 p-3 h-100 shadow-sm hover-shadow bg-light">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="badge bg-light text-dark border">{{ $proj->code }}</span>
              <span class="badge {{ $proj->status === 'in_progress' ? 'bg-primary' : ($proj->status === 'completed' ? 'bg-success' : 'bg-secondary') }} rounded-pill ms-1">
                {{ strtoupper(str_replace('_', ' ', $proj->status)) }}
              </span>
            </div>
            <span class="fw-bold text-success small">Rp {{ number_format($proj->budget, 0, ',', '.') }}</span>
          </div>

          <h5 class="fw-bold text-slate-900 mb-1">
            <a href="{{ route('admin.projects.show', $proj->id) }}" class="text-decoration-none text-dark hover-primary">
              {{ $proj->name }}
            </a>
          </h5>
          <p class="text-muted small mb-3">Client: <strong>{{ $proj->client_name ?? 'Internal Team' }}</strong></p>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top small text-muted">
            <div>
              <i class="bi bi-list-task me-1"></i> {{ $proj->tasks_count }} Tugas
            </div>
            <div>
              <i class="bi bi-person-badge me-1"></i> PM: <strong>{{ $proj->manager->name ?? 'Belum ditentukan' }}</strong>
            </div>
            <a href="{{ route('admin.projects.show', $proj->id) }}" class="btn btn-sm btn-primary rounded-pill px-3 py-1">
              Buka Detail & Tugas &rarr;
            </a>
          </div>
        </div>
      </div>
    @empty
      <div class="col-12 text-center py-5 text-muted">
        Belum ada project yang dibuat.
      </div>
    @endforelse
  </div>

  <div class="mt-4">
    {{ $projects->links() }}
  </div>
</div>

<!-- Modal Add Project -->
<div class="modal fade" id="modalAddProject" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">Buat Project Baru</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form action="{{ route('admin.projects.store') }}" method="POST">
        @csrf
        <div class="modal-body py-3">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Nama Project</label>
            <input type="text" name="name" class="form-control rounded-3" placeholder="Contoh: Mobile App Revamp" required>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Kode Project</label>
              <input type="text" name="code" class="form-control rounded-3" value="PRJ-{{ date('Y') }}-{{ rand(100, 999) }}" required>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Klien / Sponsor</label>
              <input type="text" name="client_name" class="form-control rounded-3" placeholder="Internal / Klien PT XYZ">
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Tanggal Mulai</label>
              <input type="date" name="start_date" class="form-control rounded-3" value="{{ date('Y-m-d') }}">
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Target Selesai</label>
              <input type="date" name="end_date" class="form-control rounded-3" value="{{ date('Y-m-d', strtotime('+30 days')) }}">
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Budget (IDR)</label>
              <input type="number" name="budget" class="form-control rounded-3" value="50000000" required>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Project Manager</label>
              <select name="manager_id" class="form-select rounded-3">
                <option value="">Pilih Manager</option>
                @foreach($managers as $m)
                  <option value="{{ $m->id }}">{{ $m->name }}</option>
                @endforeach
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Status Awal</label>
            <select name="status" class="form-select rounded-3">
              <option value="planning">Planning</option>
              <option value="in_progress" selected>In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Project</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
