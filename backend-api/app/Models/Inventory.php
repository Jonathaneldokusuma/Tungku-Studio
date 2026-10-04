<?php

namespace App\Models;

use App\Enums\InventoryStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'inventory_category_id',
        'brand',
        'model',
        'serial_number',
        'purchase_date',
        'purchase_price',
        'residual_value',
        'useful_life_months',
        'status',
        'disposed_on',
        'disposal_value',
        'room_id',
        'expense_id',
        'notes',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'purchase_price' => 'integer',
            'residual_value' => 'integer',
            'useful_life_months' => 'integer',
            'status' => InventoryStatus::class,
            'disposed_on' => 'date',
            'disposal_value' => 'integer',
        ];
    }

    /**
     * Penyusutan garis lurus per bulan, dalam rupiah.
     */
    public function monthlyDepreciation(): int
    {
        if ($this->useful_life_months <= 0) {
            return 0;
        }

        return (int) round(
            ($this->purchase_price - $this->residual_value) / $this->useful_life_months
        );
    }

    /**
     * Nilai buku perkiraan pada tanggal tertentu (default hari ini).
     * Untuk barang yang sudah terjual atau dibuang, dihitung sampai disposed_on.
     * Ini angka pelacakan internal, bukan harga pasar.
     */
    public function bookValue(?CarbonInterface $asOf = null): int
    {
        $end = $asOf ?? now();

        if ($this->status->isGone() && $this->disposed_on !== null) {
            $end = $this->disposed_on;
        }

        $months = (int) $this->purchase_date->diffInMonths($end);
        $months = max(0, min($this->useful_life_months, $months));

        $value = $this->purchase_price - ($this->monthlyDepreciation() * $months);

        return max($this->residual_value, $value);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class, 'inventory_category_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}