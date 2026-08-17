<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'employee_id',
        'title',
        'description',
        'priority', // low, medium, high, urgent
        'deadline',
        'progress_percentage',
        'status', // todo, in_progress, review, completed
    ];

    protected $casts = [
        'deadline' => 'date',
        'progress_percentage' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
