<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;
        $today = Carbon::today()->toDateString();
        
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        $locations = AttendanceLocation::where('is_active', true)->get();

        return view('mobile.attendance', compact('user', 'employee', 'todayAttendance', 'locations'));
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|string', // Base64
            'notes' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $employee = $user->employee;
        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $existing = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->check_in_time) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan Check-In hari ini pada jam ' . Carbon::parse($existing->check_in_time)->format('H:i') . ' WIB.'
            ], 422);
        }

        // Determine if late (e.g. after 09:00 AM)
        $isLate = $now->format('H:i:s') > '09:00:00';
        $status = $isLate ? 'late' : 'present';

        $attendance = Attendance::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'date' => $today,
            ],
            [
                'check_in_time' => $now->format('H:i:s'),
                'check_in_lat' => $request->latitude,
                'check_in_lng' => $request->longitude,
                'check_in_photo' => $request->photo,
                'status' => $status,
                'notes' => $request->notes ?? ($isLate ? 'Check-in terlambat' : 'Check-in tepat waktu'),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Check-In berhasil dicatat pada ' . $now->format('H:i:s') . ' WIB!',
            'data' => $attendance
        ]);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = Auth::user();
        $employee = $user->employee;
        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan Check-In hari ini!'
            ], 422);
        }

        if ($attendance->check_out_time) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan Check-Out hari ini pada jam ' . Carbon::parse($attendance->check_out_time)->format('H:i') . ' WIB.'
            ], 422);
        }

        $checkInDateTime = Carbon::parse($attendance->date->format('Y-m-d') . ' ' . $attendance->check_in_time);
        $durationMinutes = $checkInDateTime->diffInMinutes($now);

        $attendance->update([
            'check_out_time' => $now->format('H:i:s'),
            'check_out_lat' => $request->latitude,
            'check_out_lng' => $request->longitude,
            'work_duration_minutes' => $durationMinutes,
        ]);

        $hours = floor($durationMinutes / 60);
        $mins = $durationMinutes % 60;

        return response()->json([
            'success' => true,
            'message' => "Check-Out berhasil! Durasi kerja Anda hari ini: {$hours} jam {$mins} menit.",
            'data' => $attendance
        ]);
    }

    public function history()
    {
        $user = Auth::user();
        $employee = $user->employee;

        $attendances = Attendance::where('employee_id', $employee->id)
            ->orderBy('date', 'desc')
            ->paginate(15);

        $totalPresent = Attendance::where('employee_id', $employee->id)->where('status', 'present')->count();
        $totalLate = Attendance::where('employee_id', $employee->id)->where('status', 'late')->count();

        return view('mobile.attendance_history', compact('user', 'employee', 'attendances', 'totalPresent', 'totalLate'));
    }
}
