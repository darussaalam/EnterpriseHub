@extends('layouts.admin')

@section('title', 'Manajemen Karyawan')
@section('page_title', 'Data Karyawan & Personalia')

@section('content')
<div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
    <!-- Search & Filter -->
    <form action="{{ route('admin.employees') }}" method="GET" class="d-flex gap-2 flex-grow-1" style="max-width: 500px;">
      <input type="text" name="search" class="form-control rounded-3" placeholder="Cari nama, NIK, jabatan..." value="{{ request('search') }}">
      <select name="department_id" class="form-select rounded-3" style="max-width: 180px;">
        <option value="">Semua Dept</option>
        @foreach($departments as $dept)
          <option value="{{ $dept->id }}" {{ request('department_id') == $dept->id ? 'selected' : '' }}>{{ $dept->name }}</option>
        @endforeach
      </select>
      <button type="submit" class="btn btn-primary rounded-3"><i class="bi bi-search"></i></button>
    </form>

    <!-- Add Employee Button -->
    <button type="button" class="btn btn-primary rounded-pill px-4 fw-semibold" data-bs-toggle="modal" data-bs-target="#modalAddEmployee">
      <i class="bi bi-plus-lg me-1"></i> Tambah Karyawan Baru
    </button>
  </div>

  <!-- Employee Table -->
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>Karyawan</th>
          <th>NIK / ID</th>
          <th>Departemen & Jabatan</th>
          <th>Kontak</th>
          <th>Gaji Pokok</th>
          <th>Status</th>
          <th class="text-end">Aksi</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($employees as $emp)
          <tr>
            <td>
              <div class="d-flex align-items-center gap-3">
                <img src="{{ $emp->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($emp->full_name) }}" width="38" height="38" class="rounded-circle object-fit-cover shadow-sm" alt="">
                <div>
                  <div class="fw-bold text-slate-900">{{ $emp->full_name }}</div>
                  <div class="text-muted" style="font-size: 11px;">{{ $emp->user->email ?? '-' }}</div>
                </div>
              </div>
            </td>
            <td><span class="badge bg-light text-dark border">{{ $emp->emp_code }}</span></td>
            <td>
              <div class="fw-semibold text-slate-800">{{ $emp->position }}</div>
              <div class="text-muted" style="font-size: 11px;">{{ $emp->department->name ?? '-' }}</div>
            </td>
            <td>
              <div>{{ $emp->phone ?? '-' }}</div>
              <div class="text-muted" style="font-size: 11px;">Gabung: {{ $emp->join_date ? $emp->join_date->format('d M Y') : '-' }}</div>
            </td>
            <td class="fw-bold text-slate-800">Rp {{ number_format($emp->salary, 0, ',', '.') }}</td>
            <td>
              <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                {{ strtoupper($emp->status) }}
              </span>
            </td>
            <td class="text-end">
              <form action="{{ route('admin.employees.delete', $emp->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Hapus karyawan ini beserta akun penggunanya?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-outline-danger btn-sm rounded-circle p-2" title="Hapus Karyawan">
                  <i class="bi bi-trash"></i>
                </button>
              </form>
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="7" class="text-center py-4 text-muted">Tidak ada data karyawan ditemukan.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="mt-3">
    {{ $employees->links() }}
  </div>
</div>

<!-- Modal Add Employee -->
<div class="modal fade" id="modalAddEmployee" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">Tambah Data Karyawan & Akun</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form action="{{ route('admin.employees.store') }}" method="POST">
        @csrf
        <div class="modal-body py-3">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Nama Depan</label>
              <input type="text" name="first_name" class="form-control rounded-3" placeholder="Contoh: Ahmad" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Nama Belakang</label>
              <input type="text" name="last_name" class="form-control rounded-3" placeholder="Contoh: Fauzi">
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-semibold">Email Perusahaan</label>
              <input type="email" name="email" class="form-control rounded-3" placeholder="ahmad@enterprise.com" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Kata Sandi Akun</label>
              <input type="password" name="password" class="form-control rounded-3" value="password123" required>
            </div>

            <div class="col-md-4">
              <label class="form-label small fw-semibold">Hak Akses Role</label>
              <select name="role" class="form-select rounded-3" required>
                <option value="employee" selected>Employee (Mobile PWA)</option>
                <option value="admin">Super Admin</option>
                <option value="hr">HR Manager</option>
                <option value="manager">Department Manager</option>
                <option value="finance">Finance Officer</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Departemen</label>
              <select name="department_id" class="form-select rounded-3" required>
                @foreach($departments as $dept)
                  <option value="{{ $dept->id }}">{{ $dept->name }}</option>
                @endforeach
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Jabatan / Posisi</label>
              <input type="text" name="position" class="form-control rounded-3" placeholder="Contoh: QA Engineer" required>
            </div>

            <div class="col-md-4">
              <label class="form-label small fw-semibold">Nomor WhatsApp / HP</label>
              <input type="text" name="phone" class="form-control rounded-3" placeholder="08123456789">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Gaji Pokok (IDR)</label>
              <input type="number" name="salary" class="form-control rounded-3" placeholder="10000000" required>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-semibold">Tanggal Masuk</label>
              <input type="date" name="join_date" class="form-control rounded-3" value="{{ date('Y-m-d') }}" required>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-semibold">Nama Bank</label>
              <input type="text" name="bank_name" class="form-control rounded-3" placeholder="BCA / Mandiri / BNI" value="Bank BCA">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Nomor Rekening</label>
              <input type="text" name="bank_account" class="form-control rounded-3" placeholder="1234567890">
            </div>

            <div class="col-12">
              <label class="form-label small fw-semibold">Alamat Lengkap</label>
              <textarea name="address" class="form-control rounded-3" rows="2" placeholder="Alamat domisili karyawan..."></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Karyawan</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
