<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Mobile\MobileDashboardController;
use App\Http\Controllers\Mobile\AttendanceController as MobileAttendanceController;
use App\Http\Controllers\Mobile\RequestController as MobileRequestController;
use App\Http\Controllers\Mobile\TaskController as MobileTaskController;
use App\Http\Controllers\Mobile\NotificationController as MobileNotificationController;
use App\Http\Controllers\Mobile\ProfileController as MobileProfileController;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\HRController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\AssetController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Root redirect
Route::get('/', function () {
    if (auth()->check()) {
        if (auth()->user()->isEmployee()) {
            return redirect()->route('mobile.dashboard');
        }
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('login');
});

// Authentication
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::get('/quick-login/{role}', [AuthController::class, 'quickLogin'])->name('quick.login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ==========================================
// MOBILE PWA EMPLOYEE ROUTES
// ==========================================
Route::middleware(['auth'])->prefix('mobile')->name('mobile.')->group(function () {
    Route::get('/dashboard', [MobileDashboardController::class, 'index'])->name('dashboard');
    
    // Attendance
    Route::get('/attendance', [MobileAttendanceController::class, 'index'])->name('attendance');
    Route::post('/attendance/check-in', [MobileAttendanceController::class, 'checkIn'])->name('attendance.checkin');
    Route::post('/attendance/check-out', [MobileAttendanceController::class, 'checkOut'])->name('attendance.checkout');
    Route::get('/attendance/history', [MobileAttendanceController::class, 'history'])->name('attendance.history');
    
    // Requests
    Route::get('/requests', [MobileRequestController::class, 'index'])->name('requests');
    Route::post('/requests/leave', [MobileRequestController::class, 'storeLeave'])->name('requests.leave');
    Route::post('/requests/wfh', [MobileRequestController::class, 'storeWfh'])->name('requests.wfh');
    
    // Tasks
    Route::get('/tasks', [MobileTaskController::class, 'index'])->name('tasks');
    Route::post('/tasks/{id}/progress', [MobileTaskController::class, 'updateProgress'])->name('tasks.progress');
    Route::post('/tasks/{id}/start', [MobileTaskController::class, 'startTask'])->name('tasks.start');
    Route::post('/tasks/{id}/complete', [MobileTaskController::class, 'completeTask'])->name('tasks.complete');
    
    // Notifications
    Route::get('/notifications', [MobileNotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/{id}/read', [MobileNotificationController::class, 'markAsRead'])->name('notifications.read');
    
    // Profile
    Route::get('/profile', [MobileProfileController::class, 'index'])->name('profile');
    Route::get('/profile/payslip/{id}', [MobileProfileController::class, 'slipDetail'])->name('profile.payslip');
});

// ==========================================
// WEB ADMIN DASHBOARD ROUTES
// ==========================================
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // HR Management
    Route::get('/employees', [HRController::class, 'employees'])->name('employees');
    Route::post('/employees', [HRController::class, 'storeEmployee'])->name('employees.store');
    Route::delete('/employees/{id}', [HRController::class, 'deleteEmployee'])->name('employees.delete');
    
    Route::get('/attendance', [HRController::class, 'attendance'])->name('attendance');
    Route::get('/leaves', [HRController::class, 'leaves'])->name('leaves');
    Route::post('/leaves/{id}/process', [HRController::class, 'processLeave'])->name('leaves.process');
    Route::post('/wfh/{id}/process', [HRController::class, 'processWfh'])->name('wfh.process');
    
    // Projects & Tasks
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
    Route::post('/projects', [ProjectController::class, 'storeProject'])->name('projects.store');
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/tasks', [ProjectController::class, 'storeTask'])->name('tasks.store');
    Route::post('/tasks/{id}/update', [ProjectController::class, 'updateTaskStatus'])->name('tasks.update');
    
    // Finance & Payroll
    Route::get('/payroll', [FinanceController::class, 'payroll'])->name('payroll');
    Route::post('/payroll/generate', [FinanceController::class, 'generatePayroll'])->name('payroll.generate');
    Route::post('/payroll/{id}/pay', [FinanceController::class, 'payPayroll'])->name('payroll.pay');
    
    // Assets & Inventory
    Route::get('/assets', [AssetController::class, 'index'])->name('assets');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::put('/assets/{id}', [AssetController::class, 'update'])->name('assets.update');
    Route::delete('/assets/{id}', [AssetController::class, 'destroy'])->name('assets.destroy');
    
    // Office Locations (GPS Geofence)
    Route::get('/locations', [LocationController::class, 'index'])->name('locations');
    Route::post('/locations', [LocationController::class, 'store'])->name('locations.store');
    Route::post('/locations/{id}/toggle', [LocationController::class, 'toggleActive'])->name('locations.toggle');
    
    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::post('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
});
