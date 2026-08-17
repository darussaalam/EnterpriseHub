<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\WfhRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\Payroll;
use App\Models\Asset;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();
        
        $totalEmployees = Employee::where('status', 'active')->count();
        $totalDepartments = Department::count();
        
        // Attendance today
        $todayAttendanceCount = Attendance::where('date', $today)->whereIn('status', ['present', 'late'])->count();
        $attendanceRate = $totalEmployees > 0 ? round(($todayAttendanceCount / $totalEmployees) * 100, 1) : 0;
        
        // Pending approvals
        $pendingLeaves = LeaveRequest::where('status', 'pending')->count();
        $pendingWfh = WfhRequest::where('status', 'pending')->count();
        $totalPendingApprovals = $pendingLeaves + $pendingWfh;

        // Projects & Tasks
        $activeProjects = Project::whereIn('status', ['planning', 'in_progress'])->count();
        $completedTasks = Task::where('status', 'completed')->count();
        $totalTasks = Task::count();
        $taskCompletionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;

        // Total Assets
        $totalAssetsCount = Asset::count();
        $totalAssetValue = Asset::sum('purchase_price');

        // Recent Today Attendances
        $recentAttendances = Attendance::with(['employee.department'])
            ->where('date', $today)
            ->orderBy('check_in_time', 'desc')
            ->take(6)
            ->get();

        // Recent Leave Requests
        $recentLeaves = LeaveRequest::with(['employee.department'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Active Projects
        $projects = Project::with(['tasks'])
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        // Monthly Attendance Chart Data (Last 7 Days)
        $chartDates = [];
        $chartCounts = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i);
            $chartDates[] = $d->format('d M');
            $chartCounts[] = Attendance::where('date', $d->toDateString())->whereIn('status', ['present', 'late'])->count();
        }

        // Department breakdown
        $deptBreakdown = Department::withCount('employees')->get();

        return view('admin.dashboard', compact(
            'totalEmployees',
            'totalDepartments',
            'todayAttendanceCount',
            'attendanceRate',
            'totalPendingApprovals',
            'pendingLeaves',
            'pendingWfh',
            'activeProjects',
            'taskCompletionRate',
            'totalAssetsCount',
            'totalAssetValue',
            'recentAttendances',
            'recentLeaves',
            'projects',
            'chartDates',
            'chartCounts',
            'deptBreakdown'
        ));
    }
}
