<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_category',
        'business_address',
        'business_phone',
        'business_email',
        'business_website',
        'sales_target',
        'daily_budget',
    ];

    protected $casts = [
        'sales_target' => 'integer',
        'daily_budget' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
