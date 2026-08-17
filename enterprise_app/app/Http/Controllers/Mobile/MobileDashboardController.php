<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use App\Models\Task;
use App\Models\Notification;
use App\Models\AttendanceLocation;
use Carbon\Carbon;

class MobileDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return redirect()->route('admin.dashboard');
        }

        $today = Carbon::today()->toDateString();
        
        // Today's attendance
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        // Active tasks
        $activeTasks = Task::with('project')
            ->where('employee_id', $employee->id)
            ->whereIn('status', ['todo', 'in_progress', 'review'])
            ->orderByRaw("CASE 
                WHEN priority = 'urgent' THEN 1 
                WHEN priority = 'high' THEN 2 
                WHEN priority = 'medium' THEN 3 
                ELSE 4 END")
            ->orderBy('deadline', 'asc')
            ->take(5)
            ->get();

        // Recent Notifications
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // Nearest office location
        $locations = AttendanceLocation::where('is_active', true)->get();

        return view('mobile.dashboard', compact(
            'user',
            'employee',
            'todayAttendance',
            'activeTasks',
            'notifications',
            'unreadCount',
            'locations'
        ));
    }
}
