<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AttendanceLocation;

class LocationController extends Controller
{
    public function index()
    {
        $locations = AttendanceLocation::orderBy('created_at', 'desc')->get();
        return view('admin.settings.locations', compact('locations'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius_meters' => 'required|integer|min:10|max:5000',
        ]);

        AttendanceLocation::create([
            'name' => $request->name,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'radius_meters' => $request->radius_meters,
            'is_active' => true,
        ]);

        return redirect()->route('admin.locations')->with('success', 'Titik lokasi kantor GPS baru berhasil ditambahkan!');
    }

    public function toggleActive($id)
    {
        $loc = AttendanceLocation::findOrFail($id);
        $loc->update(['is_active' => !$loc->is_active]);

        return redirect()->route('admin.locations')->with('success', 'Status lokasi kantor diperbarui.');
    }
}
