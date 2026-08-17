<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\WfhRequest;
use App\Models\Notification;
use Carbon\Carbon;

class HRController extends Controller
{
    // ================= EMPLOYEES =================
    public function employees(Request $request)
    {
        $query = Employee::with(['user', 'department']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('emp_code', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $employees = $query->orderBy('created_at', 'desc')->paginate(10);
        $departments = Department::all();

        return view('admin.hr.employees', compact('employees', 'departments'));
    }

    public function storeEmployee(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,hr,manager,finance,supervisor,employee',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'salary' => 'required|numeric|min:0',
            'join_date' => 'required|date',
            'bank_name' => 'nullable|string|max:50',
            'bank_account' => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name' => trim("{$request->first_name} {$request->last_name}"),
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode("{$request->first_name} {$request->last_name}") . '&background=0D8ABC&color=fff',
        ]);

        $empCode = 'EMP-' . date('Y') . '-' . str_pad(Employee::count() + 1, 3, '0', STR_PAD_LEFT);

        Employee::create([
            'user_id' => $user->id,
            'emp_code' => $empCode,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'department_id' => $request->department_id,
            'position' => $request->position,
            'phone' => $request->phone,
            'address' => $request->address,
            'join_date' => $request->join_date,
            'salary' => $request->salary,
            'bank_name' => $request->bank_name,
            'bank_account' => $request->bank_account,
            'status' => 'active',
            'avatar' => $user->avatar,
        ]);

        return redirect()->route('admin.employees')->with('success', "Karyawan {$user->name} ({$empCode}) berhasil ditambahkan!");
    }

    public function deleteEmployee($id)
    {
        $employee = Employee::findOrFail($id);
        $user = $employee->user;
        $employee->delete();
        if ($user) {
            $user->delete();
        }

        return redirect()->route('admin.employees')->with('success', 'Data karyawan berhasil dihapus.');
    }

    // ================= ATTENDANCE MONITORING =================
    public function attendance(Request $request)
    {
        $selectedDate = $request->input('date', Carbon::today()->toDateString());
        
        $query = Attendance::with(['employee.department', 'employee.user'])
            ->where('date', $selectedDate);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('check_in_time', 'desc')->paginate(15);

        $presentCount = Attendance::where('date', $selectedDate)->where('status', 'present')->count();
        $lateCount = Attendance::where('date', $selectedDate)->where('status', 'late')->count();
        $totalActive = Employee::where('status', 'active')->count();

        return view('admin.hr.attendance', compact('attendances', 'selectedDate', 'presentCount', 'lateCount', 'totalActive'));
    }

    // ================= LEAVE & WFH APPROVALS =================
    public function leaves(Request $request)
    {
        $leaveRequests = LeaveRequest::with(['employee.department', 'employee.user', 'approver'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'leaves_page');

        $wfhRequests = WfhRequest::with(['employee.department', 'employee.user', 'approver'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'wfh_page');

        return view('admin.hr.leaves', compact('leaveRequests', 'wfhRequests'));
    }

    public function processLeave(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'approval_notes' => 'nullable|string|max:500',
        ]);

        $leave = LeaveRequest::with('employee.user')->findOrFail($id);
        $leave->update([
            'status' => $request->status,
            'approved_by' => Auth::id(),
            'approval_notes' => $request->approval_notes,
        ]);

        // Send notification to employee
        if ($leave->employee && $leave->employee->user) {
            $statusText = $request->status === 'approved' ? 'DISETUJUI' : 'DITOLAK';
            Notification::create([
                'user_id' => $leave->employee->user->id,
                'title' => "Pengajuan Cuti {$statusText}",
                'message' => "Pengajuan cuti Anda untuk tanggal {$leave->start_date->format('d M Y')} s/d {$leave->end_date->format('d M Y')} telah {$statusText} oleh HR/Manager. Catatan: " . ($request->approval_notes ?? '-'),
                'type' => 'approval',
                'link_url' => '/mobile/requests',
            ]);
        }

        return redirect()->route('admin.leaves')->with('success', "Status permohonan cuti berhasil diupdate menjadi: {$request->status}");
    }

    public function processWfh(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'approval_notes' => 'nullable|string|max:500',
        ]);

        $wfh = WfhRequest::with('employee.user')->findOrFail($id);
        $wfh->update([
            'status' => $request->status,
            'approved_by' => Auth::id(),
            'approval_notes' => $request->approval_notes,
        ]);

        // Send notification to employee
        if ($wfh->employee && $wfh->employee->user) {
            $statusText = $request->status === 'approved' ? 'DISETUJUI' : 'DITOLAK';
            Notification::create([
                'user_id' => $wfh->employee->user->id,
                'title' => "Pengajuan WFH {$statusText}",
                'message' => "Pengajuan WFH Anda untuk tanggal {$wfh->date->format('d M Y')} telah {$statusText}. Catatan: " . ($request->approval_notes ?? '-'),
                'type' => 'approval',
                'link_url' => '/mobile/requests',
            ]);
        }

        return redirect()->route('admin.leaves')->with('success', "Status pengajuan WFH berhasil diupdate menjadi: {$request->status}");
    }
}
