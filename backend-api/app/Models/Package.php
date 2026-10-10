<?php

namespace App\Models;

use App\Enums\StageType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'track_count',
        'recording_hours',
        'include_recording',
        'include_editing',
        'include_mixing',
        'include_mastering',
        'base_price',
        'discount_percent',
        'discount_amount',
        'price',
        'bundle_name',
        'is_active',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'track_count' => 'integer',
            'recording_hours' => 'integer',
            'include_recording' => 'boolean',
            'include_editing' => 'boolean',
            'include_mixing' => 'boolean',
            'include_mastering' => 'boolean',
            'base_price' => 'integer',
            'discount_percent' => 'integer',
            'discount_amount' => 'integer',
            'price' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Harga yang berlaku setelah diskon paket.
     * Nilai inilah yang disalin ke package_snapshot dan projects.price.
     */
    protected function price(): Attribute
    {
        return Attribute::get(
            fn (?int $value): int => $value ?? max(0, (int) $this->base_price - (int) $this->discount_amount)
        );
    }

    /**
     * Tahap yang aktif di paket ini, berurutan sesuai urutan produksi.
     *
     * @return array<int, StageType>
     */
    public function includedStages(): array
    {
        return array_values(array_filter(
            StageType::cases(),
            fn (StageType $stage) => (bool) $this->{$stage->includeColumn()},
        ));
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(CRMCampaign::class);
    }
}
