<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payroll;
use App\Models\Attendance;
use App\Models\LeaveRequest;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee->load('department');

        $totalPresent = Attendance::where('employee_id', $employee->id)->where('status', 'present')->count();
        $totalLate = Attendance::where('employee_id', $employee->id)->where('status', 'late')->count();
        $approvedLeaves = LeaveRequest::where('employee_id', $employee->id)->where('status', 'approved')->count();

        $payrolls = Payroll::where('employee_id', $employee->id)
            ->orderBy('period_year', 'desc')
            ->orderBy('period_month', 'desc')
            ->get();

        return view('mobile.profile', compact('user', 'employee', 'totalPresent', 'totalLate', 'approvedLeaves', 'payrolls'));
    }

    public function slipDetail($id)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $payroll = Payroll::where('id', $id)->where('employee_id', $employee->id)->firstOrFail();

        return view('mobile.payslip', compact('user', 'employee', 'payroll'));
    }
}
