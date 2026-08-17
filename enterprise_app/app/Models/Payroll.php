<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $table = 'payroll';

    protected $fillable = [
        'employee_id',
        'slip_number',
        'period_month',
        'period_year',
        'basic_salary',
        'allowance',
        'overtime_pay',
        'deductions',
        'net_salary',
        'payment_status', // draft, paid
        'payment_date',
    ];

    protected $casts = [
        'period_month' => 'integer',
        'period_year' => 'integer',
        'basic_salary' => 'decimal:2',
        'allowance' => 'decimal:2',
        'overtime_pay' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
