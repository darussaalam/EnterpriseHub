<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LeaveRequest;
use App\Models\WfhRequest;
use App\Models\Notification;
use App\Models\User;

class RequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;

        $leaveRequests = LeaveRequest::where('employee_id', $employee->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $wfhRequests = WfhRequest::where('employee_id', $employee->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return view('mobile.requests', compact('user', 'employee', 'leaveRequests', 'wfhRequests'));
    }

    public function storeLeave(Request $request)
    {
        $request->validate([
            'leave_type' => 'required|in:annual,sick,maternity,emergency,permission',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $employee = $user->employee;

        $leave = LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        // Notify HR / Managers
        $hrUsers = User::whereIn('role', ['admin', 'hr', 'manager'])->get();
        foreach ($hrUsers as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Pengajuan ' . ucfirst($request->leave_type) . ' Baru',
                'message' => "{$employee->full_name} mengajukan cuti/izin ({$request->start_date} s/d {$request->end_date}).",
                'type' => 'approval',
                'link_url' => '/admin/leaves',
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Permohonan cuti/izin berhasil dikirim dan sedang menunggu persetujuan HR/Manager.',
                'data' => $leave,
            ]);
        }

        return redirect()->route('mobile.requests')->with('success', 'Permohonan cuti/izin berhasil dikirim dan menunggu persetujuan.');
    }

    public function storeWfh(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'reason' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $employee = $user->employee;

        $wfh = WfhRequest::create([
            'employee_id' => $employee->id,
            'date' => $request->date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        // Notify HR / Managers
        $hrUsers = User::whereIn('role', ['admin', 'hr', 'manager'])->get();
        foreach ($hrUsers as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Pengajuan WFH Baru',
                'message' => "{$employee->full_name} mengajukan WFH untuk tanggal {$request->date}.",
                'type' => 'approval',
                'link_url' => '/admin/leaves',
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Permohonan WFH berhasil dikirim dan sedang menunggu persetujuan.',
                'data' => $wfh,
            ]);
        }

        return redirect()->route('mobile.requests')->with('success', 'Permohonan WFH berhasil dikirim dan menunggu persetujuan.');
    }
}
