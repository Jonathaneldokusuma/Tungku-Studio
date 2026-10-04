<?php

namespace App\Models;

use App\Enums\PriceUnit;
use App\Enums\StageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BasePrice extends Model
{
    protected $fillable = [
        'stage',
        'unit',
        'price',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stage' => StageType::class,
            'unit' => PriceUnit::class,
            'price' => 'integer',
        ];
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
