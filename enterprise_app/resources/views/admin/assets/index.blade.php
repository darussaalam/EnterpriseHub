@extends('layouts.admin')

@section('title', 'Manajemen Aset & Inventaris')
@section('page_title', 'Aset & Inventaris Perusahaan')

@section('content')
<!-- Header Stats & Add Button -->
<div class="row g-3 mb-4">
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <span class="text-muted small">Total Unit Aset</span>
      <div class="fs-4 fw-bold text-dark">{{ $totalAssets }} Item</div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <span class="text-muted small">Total Nilai Pembelian</span>
      <div class="fs-4 fw-bold text-success">Rp {{ number_format($totalValuation, 0, ',', '.') }}</div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <span class="text-muted small">Aset Digunakan Karyawan</span>
      <div class="fs-4 fw-bold text-primary">{{ $assignedCount }} Item</div>
    </div>
  </div>
</div>

<div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h6 class="fw-bold text-slate-900 mb-0">Daftar Inventaris & Perangkat</h6>
      <p class="text-muted small mb-0">Lacak serial number, kondisi perangkat, dan penanggung jawab.</p>
    </div>
    <button type="button" class="btn btn-primary rounded-pill px-4 fw-semibold" data-bs-toggle="modal" data-bs-target="#modalAddAsset">
      <i class="bi bi-plus-lg me-1"></i> Tambah Aset Baru
    </button>
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light small">
        <tr>
          <th>Kode Aset</th>
          <th>Nama Perangkat / Aset</th>
          <th>Kategori</th>
          <th>Harga Beli</th>
          <th>Pemegang Aset</th>
          <th>Kondisi</th>
          <th>Lokasi</th>
          <th class="text-end">Aksi</th>
        </tr>
      </thead>
      <tbody class="small">
        @forelse($assets as $asset)
          <tr>
            <td>
              <span class="badge bg-light text-dark border">{{ $asset->asset_code }}</span>
            </td>
            <td>
              <div class="fw-bold text-slate-900">{{ $asset->name }}</div>
              <div class="text-muted" style="font-size: 11px;">Beli: {{ $asset->purchase_date ? $asset->purchase_date->format('d M Y') : '-' }}</div>
            </td>
            <td>{{ $asset->category }}</td>
            <td class="fw-semibold">Rp {{ number_format($asset->purchase_price, 0, ',', '.') }}</td>
            <td>
              @if($asset->assignedEmployee)
                <div class="fw-semibold text-dark">{{ $asset->assignedEmployee->full_name }}</div>
                <div class="text-muted" style="font-size: 10px;">{{ $asset->assignedEmployee->position }}</div>
              @else
                <span class="badge bg-secondary-subtle text-secondary rounded-pill">Tersedia di Gudang</span>
              @endif
            </td>
            <td>
              <span class="badge {{ $asset->condition === 'good' ? 'bg-success' : ($asset->condition === 'fair' ? 'bg-warning text-dark' : 'bg-danger') }} rounded-pill">
                {{ strtoupper($asset->condition) }}
              </span>
            </td>
            <td>{{ $asset->location ?? 'Kantor Utama' }}</td>
            <td class="text-end">
              <form action="{{ route('admin.assets.destroy', $asset->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Hapus aset ini dari daftar?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-outline-danger btn-sm rounded-circle p-2" title="Hapus Aset">
                  <i class="bi bi-trash"></i>
                </button>
              </form>
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="8" class="text-center py-4 text-muted">Belum ada aset terdaftar.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <div class="mt-3">
    {{ $assets->links() }}
  </div>
</div>

<!-- Modal Add Asset -->
<div class="modal fade" id="modalAddAsset" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-bold">Tambah Aset Perusahaan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form action="{{ route('admin.assets.store') }}" method="POST">
        @csrf
        <div class="modal-body py-3">
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Kode Aset / Serial</label>
              <input type="text" name="asset_code" class="form-control rounded-3" value="AST-{{ strtoupper(Str::random(3)) }}-{{ rand(10, 99) }}" required>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Kategori</label>
              <select name="category" class="form-select rounded-3" required>
                <option value="IT Equipment">IT Equipment (Laptop/PC)</option>
                <option value="Office Furniture">Office Furniture</option>
                <option value="Vehicles">Kendaraan Operasional</option>
                <option value="Tools & Machinery">Tools & Machinery</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Nama Perangkat / Aset</label>
            <input type="text" name="name" class="form-control rounded-3" placeholder="Contoh: Dell XPS 15 32GB RAM" required>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Harga Pembelian (IDR)</label>
              <input type="number" name="purchase_price" class="form-control rounded-3" placeholder="25000000" required>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Tanggal Pembelian</label>
              <input type="date" name="purchase_date" class="form-control rounded-3" value="{{ date('Y-m-d') }}">
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-semibold">Diserahkan Kepada</label>
              <select name="assigned_to_employee_id" class="form-select rounded-3">
                <option value="">-- Disimpan di Gudang --</option>
                @foreach($employees as $emp)
                  <option value="{{ $emp->id }}">{{ $emp->full_name }} ({{ $emp->emp_code }})</option>
                @endforeach
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold">Kondisi Fisik</label>
              <select name="condition" class="form-select rounded-3">
                <option value="good" selected>Baik (Good)</option>
                <option value="fair">Cukup (Fair)</option>
                <option value="damaged">Rusak (Damaged)</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Lokasi Penempatan</label>
            <input type="text" name="location" class="form-control rounded-3" placeholder="Contoh: Lantai 2 Desk Engineering">
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold">Simpan Aset</button>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection
