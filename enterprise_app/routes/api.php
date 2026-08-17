<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Mobile\AttendanceController;
use App\Http\Controllers\Mobile\RequestController;
use App\Http\Controllers\Mobile\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [ApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [ApiController::class, 'dashboard']);
    Route::post('/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/check-out', [AttendanceController::class, 'checkOut']);
    Route::post('/requests/leave', [RequestController::class, 'storeLeave']);
    Route::post('/requests/wfh', [RequestController::class, 'storeWfh']);
    Route::post('/tasks/{id}/progress', [TaskController::class, 'updateProgress']);
    Route::get('/notifications', [ApiController::class, 'notifications']);
});
