<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'emp_code',
        'first_name',
        'last_name',
        'department_id',
        'position',
        'phone',
        'address',
        'join_date',
        'salary',
        'bank_name',
        'bank_account',
        'status',
        'avatar',
    ];

    protected $casts = [
        'join_date' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function wfhRequests()
    {
        return $this->hasMany(WfhRequest::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class, 'assigned_to_employee_id');
    }

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
