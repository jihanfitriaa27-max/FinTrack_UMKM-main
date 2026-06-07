<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'sku',
        'category',
        'modal',
        'jual',
        'min_stock',
        'current_stock',
        'ai_label',
        'ai_confidence',
    ];

    protected $casts = [
        'modal' => 'integer',
        'jual' => 'integer',
        'min_stock' => 'integer',
        'current_stock' => 'integer',
        'ai_confidence' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessors
    public function getMarginAttribute()
    {
        return $this->jual - $this->modal;
    }

    public function getMarginPercentageAttribute()
    {
        return $this->modal > 0 ? (($this->margin / $this->modal) * 100) : 0;
    }

    // Scopes
    public function scopeLowStock($query)
    {
        return $query->whereRaw('current_stock <= min_stock');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
