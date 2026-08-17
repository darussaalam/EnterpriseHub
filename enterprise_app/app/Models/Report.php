<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_type',
        'title',
        'period_start',
        'period_end',
        'generated_by',
        'file_path',
        'data_json',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'data_json' => 'array',
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
