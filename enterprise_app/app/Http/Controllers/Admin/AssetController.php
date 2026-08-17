<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Asset;
use App\Models\Employee;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::with('assignedEmployee');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        $assets = $query->orderBy('created_at', 'desc')->paginate(10);
        $employees = Employee::where('status', 'active')->get();

        $totalAssets = Asset::count();
        $totalValuation = Asset::sum('purchase_price');
        $assignedCount = Asset::whereNotNull('assigned_to_employee_id')->count();

        return view('admin.assets.index', compact('assets', 'employees', 'totalAssets', 'totalValuation', 'assignedCount'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'asset_code' => 'required|string|unique:assets,asset_code|max:50',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'required|numeric|min:0',
            'assigned_to_employee_id' => 'nullable|exists:employees,id',
            'condition' => 'required|in:good,fair,damaged,disposed',
            'location' => 'nullable|string|max:255',
        ]);

        Asset::create($request->all());

        return redirect()->route('admin.assets')->with('success', 'Aset baru berhasil dicatat dalam inventaris!');
    }

    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'purchase_price' => 'required|numeric|min:0',
            'assigned_to_employee_id' => 'nullable|exists:employees,id',
            'condition' => 'required|in:good,fair,damaged,disposed',
            'location' => 'nullable|string|max:255',
        ]);

        $asset->update($request->all());

        return redirect()->route('admin.assets')->with('success', 'Data aset berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);
        $asset->delete();

        return redirect()->route('admin.assets')->with('success', 'Aset berhasil dihapus dari inventaris.');
    }
}
