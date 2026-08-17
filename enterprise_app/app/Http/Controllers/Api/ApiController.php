<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\AttendanceLocation;
use App\Models\Task;
use App\Models\Notification;
use App\Models\LeaveRequest;
use App\Models\WfhRequest;
use App\Models\Payroll;
use Carbon\Carbon;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kredensial tidak valid'
            ], 401);
        }

        $token = $user->createToken('pwa-mobile-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
            ],
            'employee' => $user->employee ? $user->employee->load('department') : null
        ]);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $employee = $user->employee;

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Bukan akun karyawan'], 403);
        }

        $today = Carbon::today()->toDateString();
        $todayAttendance = Attendance::where('employee_id', $employee->id)->where('date', $today)->first();

        $activeTasks = Task::with('project')
            ->where('employee_id', $employee->id)
            ->whereIn('status', ['todo', 'in_progress', 'review'])
            ->orderBy('deadline', 'asc')
            ->take(5)
            ->get();

        $unreadNotifications = Notification::where('user_id', $user->id)->where('is_read', false)->count();
        $locations = AttendanceLocation::where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'employee' => $employee->load('department'),
                'today_attendance' => $todayAttendance,
                'active_tasks' => $activeTasks,
                'unread_notifications' => $unreadNotifications,
                'office_locations' => $locations,
            ]
        ]);
    }

    public function notifications(Request $request)
    {
        $user = $request->user();
        $notifications = Notification::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $notifications]);
    }
}
