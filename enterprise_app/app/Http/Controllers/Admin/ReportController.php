<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\Task;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with('generator')->orderBy('created_at', 'desc')->paginate(10);
        return view('admin.reports.index', compact('reports'));
    }

    public function generate(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:attendance,payroll,project,asset',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
        ]);

        $type = $request->report_type;
        $start = $request->period_start;
        $end = $request->period_end;
        $data = [];

        if ($type === 'attendance') {
            $totalLogs = Attendance::whereBetween('date', [$start, $end])->count();
            $present = Attendance::whereBetween('date', [$start, $end])->where('status', 'present')->count();
            $late = Attendance::whereBetween('date', [$start, $end])->where('status', 'late')->count();
            $title = "Laporan Kehadiran Karyawan ({$start} s/d {$end})";
            $data = [
                'total_presensi' => $totalLogs,
                'tepat_waktu' => $present,
                'terlambat' => $late,
                'persentase_kehadiran' => $totalLogs > 0 ? round(($present / $totalLogs) * 100, 1) . '%' : '0%',
            ];
        } elseif ($type === 'payroll') {
            $totalPaid = Payroll::whereBetween('created_at', [$start, $end])->sum('net_salary');
            $slipsCount = Payroll::whereBetween('created_at', [$start, $end])->count();
            $title = "Laporan Pengeluaran Payroll ({$start} s/d {$end})";
            $data = [
                'total_slip_diterbitkan' => $slipsCount,
                'total_nominal_gaji' => 'Rp ' . number_format($totalPaid, 0, ',', '.'),
            ];
        } else {
            $title = "Laporan Kinerja Proyek & Aset ({$start} s/d {$end})";
            $data = [
                'total_tugas_selesai' => Task::where('status', 'completed')->count(),
                'total_karyawan_aktif' => Employee::where('status', 'active')->count(),
            ];
        }

        Report::create([
            'report_type' => $type,
            'title' => $title,
            'period_start' => $start,
            'period_end' => $end,
            'generated_by' => Auth::id(),
            'data_json' => $data,
        ]);

        return redirect()->route('admin.reports')->with('success', "Laporan '{$title}' berhasil dibuat!");
    }
}
