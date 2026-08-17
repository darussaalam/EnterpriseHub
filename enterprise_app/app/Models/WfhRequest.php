<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WfhRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'reason',
        'status', // pending, approved, rejected
        'approved_by',
        'approval_notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
