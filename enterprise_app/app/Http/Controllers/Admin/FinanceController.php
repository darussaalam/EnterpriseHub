<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\Notification;
use Carbon\Carbon;

class FinanceController extends Controller
{
    public function payroll(Request $request)
    {
        $currentMonth = (int) $request->input('month', Carbon::now()->month);
        $currentYear = (int) $request->input('year', Carbon::now()->year);

        $payrolls = Payroll::with(['employee.department', 'employee.user'])
            ->where('period_month', $currentMonth)
            ->where('period_year', $currentYear)
            ->orderBy('created_at', 'desc')
            ->get();

        $totalDisbursed = $payrolls->where('payment_status', 'paid')->sum('net_salary');
        $totalPending = $payrolls->where('payment_status', 'draft')->sum('net_salary');

        $employees = Employee::where('status', 'active')->get();

        return view('admin.finance.payroll', compact('payrolls', 'currentMonth', 'currentYear', 'totalDisbursed', 'totalPending', 'employees'));
    }

    public function generatePayroll(Request $request)
    {
        $request->validate([
            'period_month' => 'required|integer|min:1|max:12',
            'period_year' => 'required|integer|min:2020|max:2030',
        ]);

        $month = $request->period_month;
        $year = $request->period_year;

        $employees = Employee::where('status', 'active')->get();
        $generatedCount = 0;

        foreach ($employees as $emp) {
            $exists = Payroll::where('employee_id', $emp->id)
                ->where('period_month', $month)
                ->where('period_year', $year)
                ->exists();

            if (!$exists) {
                $basic = $emp->salary;
                $allowance = round($basic * 0.15); // 15% allowance
                $overtime = 0;
                $deductions = round($basic * 0.05); // 5% BPJS/tax
                $net = $basic + $allowance + $overtime - $deductions;

                $slipNumber = 'SLIP/' . $year . '/' . str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $emp->emp_code;

                Payroll::create([
                    'employee_id' => $emp->id,
                    'slip_number' => $slipNumber,
                    'period_month' => $month,
                    'period_year' => $year,
                    'basic_salary' => $basic,
                    'allowance' => $allowance,
                    'overtime_pay' => $overtime,
                    'deductions' => $deductions,
                    'net_salary' => $net,
                    'payment_status' => 'draft',
                ]);

                $generatedCount++;
            }
        }

        return redirect()->route('admin.payroll', ['month' => $month, 'year' => $year])
            ->with('success', "Berhasil membuat {$generatedCount} draft slip gaji untuk periode " . date('F', mktime(0, 0, 0, $month, 10)) . " {$year}!");
    }

    public function payPayroll(Request $request, $id)
    {
        $payroll = Payroll::with(['employee.user'])->findOrFail($id);
        $payroll->update([
            'payment_status' => 'paid',
            'payment_date' => Carbon::today()->toDateString(),
        ]);

        // Send notification to employee
        if ($payroll->employee && $payroll->employee->user) {
            Notification::create([
                'user_id' => $payroll->employee->user->id,
                'title' => 'Slip Gaji Diterbitkan & Ditransfer',
                'message' => "Gaji periode {$payroll->period_month}/{$payroll->period_year} sebesar Rp " . number_format($payroll->net_salary, 0, ',', '.') . " telah berhasil dicairkan.",
                'type' => 'announcement',
                'link_url' => "/mobile/profile/payslip/{$payroll->id}",
            ]);
        }

        return back()->with('success', "Slip gaji {$payroll->slip_number} berhasil dibayarkan!");
    }
}
