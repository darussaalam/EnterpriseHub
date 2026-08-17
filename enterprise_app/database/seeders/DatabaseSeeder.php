<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Employee;
use App\Models\AttendanceLocation;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\WfhRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\Notification;
use App\Models\Payroll;
use App\Models\Asset;
use App\Models\Report;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $today = Carbon::today();

        // 1. Attendance Locations
        $locHQ = AttendanceLocation::create([
            'name' => 'Head Office - Jakarta Pusat',
            'address' => 'Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan 12190',
            'latitude' => -6.225588,
            'longitude' => 106.808560,
            'radius_meters' => 250,
            'is_active' => true,
        ]);

        AttendanceLocation::create([
            'name' => 'Branch Office - Surabaya Tech Hub',
            'address' => 'Jl. Pemuda No. 45, Genteng, Surabaya 60271',
            'latitude' => -7.262500,
            'longitude' => 112.748300,
            'radius_meters' => 200,
            'is_active' => true,
        ]);

        // 2. Departments
        $deptEng = Department::create(['code' => 'ENG', 'name' => 'Engineering & IT', 'description' => 'Software development and IT infrastructure']);
        $deptHR = Department::create(['code' => 'HRD', 'name' => 'Human Resources', 'description' => 'People operations, recruitment, and culture']);
        $deptFin = Department::create(['code' => 'FIN', 'name' => 'Finance & Accounting', 'description' => 'Corporate finance, payroll, and budgeting']);
        $deptMkt = Department::create(['code' => 'MKT', 'name' => 'Marketing & Growth', 'description' => 'Brand strategy, sales, and digital campaigns']);
        $deptOps = Department::create(['code' => 'OPS', 'name' => 'Operations', 'description' => 'Operational efficiency and client delivery']);

        // 3. Key Users & Roles
        $adminUser = User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        ]);

        $hrUser = User::create([
            'name' => 'Sarah Wijaya, S.Psi',
            'email' => 'hr@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'hr',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        ]);

        $mgrUser = User::create([
            'name' => 'Hendro Pratama, M.T',
            'email' => 'manager@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        ]);
        $deptEng->update(['manager_id' => $mgrUser->id]);

        $finUser = User::create([
            'name' => 'Dewi Anggraini, S.E, Ak',
            'email' => 'finance@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'finance',
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        ]);
        $deptFin->update(['manager_id' => $finUser->id]);

        $spvUser = User::create([
            'name' => 'Agus Setiawan',
            'email' => 'supervisor@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'supervisor',
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        ]);

        // 4. Employee Users
        $budiUser = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        ]);

        $sitiUser = User::create([
            'name' => 'Siti Rahmawati',
            'email' => 'siti@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        ]);

        $rezaUser = User::create([
            'name' => 'Reza Kurniawan',
            'email' => 'reza@enterprise.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        ]);

        // 5. Employee Profiles
        $empBudi = Employee::create([
            'user_id' => $budiUser->id,
            'emp_code' => 'EMP-2024-001',
            'first_name' => 'Budi',
            'last_name' => 'Santoso',
            'department_id' => $deptEng->id,
            'position' => 'Senior Fullstack Engineer',
            'phone' => '081234567890',
            'address' => 'Jl. Kebon Jeruk No. 12, Jakarta Barat',
            'join_date' => '2022-03-15',
            'salary' => 18500000,
            'bank_name' => 'Bank BCA',
            'bank_account' => '8820194821',
            'status' => 'active',
            'avatar' => $budiUser->avatar,
        ]);

        $empSiti = Employee::create([
            'user_id' => $sitiUser->id,
            'emp_code' => 'EMP-2024-002',
            'first_name' => 'Siti',
            'last_name' => 'Rahmawati',
            'department_id' => $deptEng->id,
            'position' => 'Lead UI/UX Designer',
            'phone' => '081298765432',
            'address' => 'Jl. Tebet Raya No. 45, Jakarta Selatan',
            'join_date' => '2023-01-10',
            'salary' => 15000000,
            'bank_name' => 'Bank Mandiri',
            'bank_account' => '1370019284721',
            'status' => 'active',
            'avatar' => $sitiUser->avatar,
        ]);

        $empReza = Employee::create([
            'user_id' => $rezaUser->id,
            'emp_code' => 'EMP-2024-003',
            'first_name' => 'Reza',
            'last_name' => 'Kurniawan',
            'department_id' => $deptMkt->id,
            'position' => 'Growth Marketing Specialist',
            'phone' => '081377889900',
            'address' => 'Jl. Margonda Raya No. 88, Depok',
            'join_date' => '2023-06-01',
            'salary' => 12500000,
            'bank_name' => 'Bank BNI',
            'bank_account' => '0491823741',
            'status' => 'active',
            'avatar' => $rezaUser->avatar,
        ]);

        // Create employee profiles for HR & Manager for test completeness
        $empHR = Employee::create([
            'user_id' => $hrUser->id,
            'emp_code' => 'EMP-2024-HR1',
            'first_name' => 'Sarah',
            'last_name' => 'Wijaya',
            'department_id' => $deptHR->id,
            'position' => 'HR Manager',
            'phone' => '08111222333',
            'address' => 'Jakarta Selatan',
            'join_date' => '2021-01-05',
            'salary' => 20000000,
            'bank_name' => 'Bank BCA',
            'bank_account' => '8820011223',
            'status' => 'active',
            'avatar' => $hrUser->avatar,
        ]);

        $empMgr = Employee::create([
            'user_id' => $mgrUser->id,
            'emp_code' => 'EMP-2024-MG1',
            'first_name' => 'Hendro',
            'last_name' => 'Pratama',
            'department_id' => $deptEng->id,
            'position' => 'Head of Engineering',
            'phone' => '08119988776',
            'address' => 'Jakarta Pusat',
            'join_date' => '2020-08-15',
            'salary' => 27000000,
            'bank_name' => 'Bank BCA',
            'bank_account' => '8820099887',
            'status' => 'active',
            'avatar' => $mgrUser->avatar,
        ]);

        // 6. Attendance records for Budi & Siti
        Attendance::create([
            'employee_id' => $empBudi->id,
            'date' => $today->toDateString(),
            'check_in_time' => '08:45:00',
            'check_out_time' => null,
            'check_in_lat' => -6.225600,
            'check_in_lng' => 106.808580,
            'check_in_photo' => null,
            'work_duration_minutes' => 0,
            'status' => 'present',
            'notes' => 'On-site Office Jakarta',
        ]);

        // Past attendances for Budi
        for ($i = 1; $i <= 5; $i++) {
            $pastDate = $today->copy()->subDays($i);
            if ($pastDate->isWeekday()) {
                Attendance::create([
                    'employee_id' => $empBudi->id,
                    'date' => $pastDate->toDateString(),
                    'check_in_time' => '08:50:00',
                    'check_out_time' => '17:35:00',
                    'check_in_lat' => -6.225588,
                    'check_in_lng' => 106.808560,
                    'check_out_lat' => -6.225588,
                    'check_out_lng' => 106.808560,
                    'work_duration_minutes' => 525,
                    'status' => 'present',
                    'notes' => 'Normal working day',
                ]);
            }
        }

        // 7. Leave & WFH Requests
        LeaveRequest::create([
            'employee_id' => $empBudi->id,
            'leave_type' => 'annual',
            'start_date' => $today->copy()->addDays(10)->toDateString(),
            'end_date' => $today->copy()->addDays(12)->toDateString(),
            'reason' => 'Liburan keluarga tahunan dan urusan administrasi penting.',
            'status' => 'pending',
            'approved_by' => null,
        ]);

        LeaveRequest::create([
            'employee_id' => $empSiti->id,
            'leave_type' => 'sick',
            'start_date' => $today->copy()->subDays(15)->toDateString(),
            'end_date' => $today->copy()->subDays(14)->toDateString(),
            'reason' => 'Demam tinggi dan istirahat dokter.',
            'status' => 'approved',
            'approved_by' => $mgrUser->id,
            'approval_notes' => 'Disetujui. Semoga lekas pulih.',
        ]);

        WfhRequest::create([
            'employee_id' => $empBudi->id,
            'date' => $today->copy()->addDays(3)->toDateString(),
            'reason' => 'Perbaikan instalasi fiber optic di rumah, fokus pengerjaan sprint API backend.',
            'status' => 'pending',
        ]);

        // 8. Projects & Tasks
        $proj1 = Project::create([
            'name' => 'Enterprise Nexus ERP & PWA Revamp',
            'code' => 'PRJ-2024-NX1',
            'client_name' => 'Internal Corporate',
            'start_date' => $today->copy()->subMonth()->toDateString(),
            'end_date' => $today->copy()->addMonths(2)->toDateString(),
            'budget' => 180000000,
            'status' => 'in_progress',
            'manager_id' => $mgrUser->id,
        ]);

        $proj2 = Project::create([
            'name' => 'B2B Client Portal & Gateway Payment',
            'code' => 'PRJ-2024-GW2',
            'client_name' => 'PT Nusantara Sentosa',
            'start_date' => $today->copy()->subDays(15)->toDateString(),
            'end_date' => $today->copy()->addMonths(3)->toDateString(),
            'budget' => 250000000,
            'status' => 'in_progress',
            'manager_id' => $mgrUser->id,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'employee_id' => $empBudi->id,
            'title' => 'Implementasi Modul Mobile PWA Check-In GPS & Kamera',
            'description' => 'Buat integrasi camera selfie dan geolocation geofencing di halaman mobile employee.',
            'priority' => 'urgent',
            'deadline' => $today->copy()->addDays(2)->toDateString(),
            'progress_percentage' => 80,
            'status' => 'in_progress',
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'employee_id' => $empBudi->id,
            'title' => 'Optimasi Service Worker & Offline Cache Storage',
            'description' => 'Pastikan aplikasi dapat dibuka secara instan dan memiliki offline fallback view.',
            'priority' => 'high',
            'deadline' => $today->copy()->addDays(5)->toDateString(),
            'progress_percentage' => 60,
            'status' => 'in_progress',
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'employee_id' => $empSiti->id,
            'title' => 'Redesain UI Dashboard Web Admin & Dark Header',
            'description' => 'Buat layout dashboard Bootstrap 5 yang bersih dan modern.',
            'priority' => 'medium',
            'deadline' => $today->copy()->addDays(4)->toDateString(),
            'progress_percentage' => 100,
            'status' => 'completed',
        ]);

        Task::create([
            'project_id' => $proj2->id,
            'employee_id' => $empReza->id,
            'title' => 'Penyusunan Materi Demo & Product Onboarding',
            'description' => 'Siapkan video walkthrough dan panduan operasional sistem.',
            'priority' => 'medium',
            'deadline' => $today->copy()->addDays(7)->toDateString(),
            'progress_percentage' => 40,
            'status' => 'in_progress',
        ]);

        // 9. Notifications
        Notification::create([
            'user_id' => $budiUser->id,
            'title' => 'Tugas Baru Diberikan',
            'message' => 'Anda telah ditugaskan pada tugas: Implementasi Modul Mobile PWA Check-In GPS & Kamera',
            'type' => 'task',
            'is_read' => false,
            'link_url' => '/mobile/tasks',
        ]);

        Notification::create([
            'user_id' => $budiUser->id,
            'title' => 'Pengumuman Town Hall Perusahaan',
            'message' => 'Pertemuan Town Hall Q3 akan diadakan pada Jumat pukul 14:00 WIB di Main Hall & Zoom.',
            'type' => 'announcement',
            'is_read' => true,
            'link_url' => '/mobile/notifications',
        ]);

        Notification::create([
            'user_id' => $budiUser->id,
            'title' => 'Pengingat Deadline Project',
            'message' => 'Milestone PRJ-2024-NX1 akan direview 2 hari lagi.',
            'type' => 'deadline',
            'is_read' => false,
            'link_url' => '/mobile/tasks',
        ]);

        Notification::create([
            'user_id' => $hrUser->id,
            'title' => 'Pengajuan Cuti Baru',
            'message' => 'Budi Santoso mengajukan permohonan Cuti Tahunan (3 hari). Menunggu review.',
            'type' => 'approval',
            'is_read' => false,
            'link_url' => '/admin/leaves',
        ]);

        // 10. Payroll Records
        Payroll::create([
            'employee_id' => $empBudi->id,
            'slip_number' => 'SLIP/2026/07/EMP-001',
            'period_month' => 7,
            'period_year' => 2026,
            'basic_salary' => 18500000,
            'allowance' => 2500000,
            'overtime_pay' => 1200000,
            'deductions' => 950000,
            'net_salary' => 21250000,
            'payment_status' => 'paid',
            'payment_date' => '2026-07-28',
        ]);

        Payroll::create([
            'employee_id' => $empSiti->id,
            'slip_number' => 'SLIP/2026/07/EMP-002',
            'period_month' => 7,
            'period_year' => 2026,
            'basic_salary' => 15000000,
            'allowance' => 2000000,
            'overtime_pay' => 600000,
            'deductions' => 750000,
            'net_salary' => 16850000,
            'payment_status' => 'paid',
            'payment_date' => '2026-07-28',
        ]);

        // 11. Assets
        Asset::create([
            'asset_code' => 'AST-MBP-01',
            'name' => 'MacBook Pro M2 Max 32GB',
            'category' => 'IT Equipment',
            'purchase_date' => '2023-04-10',
            'purchase_price' => 38500000,
            'assigned_to_employee_id' => $empBudi->id,
            'condition' => 'good',
            'location' => 'Engineering Desk A1',
        ]);

        Asset::create([
            'asset_code' => 'AST-MON-02',
            'name' => 'Dell UltraSharp 27" 4K Monitor',
            'category' => 'IT Equipment',
            'purchase_date' => '2023-04-10',
            'purchase_price' => 8900000,
            'assigned_to_employee_id' => $empBudi->id,
            'condition' => 'good',
            'location' => 'Engineering Desk A1',
        ]);

        Asset::create([
            'asset_code' => 'AST-VEH-01',
            'name' => 'Operational Van Toyota HiAce',
            'category' => 'Vehicles',
            'purchase_date' => '2022-09-01',
            'purchase_price' => 540000000,
            'assigned_to_employee_id' => null,
            'condition' => 'good',
            'location' => 'Main Basement Parking',
        ]);

        // 12. Reports
        Report::create([
            'report_type' => 'attendance',
            'title' => 'Laporan Rekapitulasi Presensi Bulanan - Juli 2026',
            'period_start' => '2026-07-01',
            'period_end' => '2026-07-31',
            'generated_by' => $hrUser->id,
            'data_json' => [
                'total_workdays' => 22,
                'average_attendance_rate' => '97.4%',
                'total_late_cases' => 3,
                'total_leaves' => 4,
            ],
        ]);
    }
}
