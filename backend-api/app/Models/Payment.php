<?php

namespace App\Models;

use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'project_id',
        'type',
        'amount',
        'status',
        'provider',
        'order_id',
        'provider_transaction_id',
        'payment_method',
        'snap_token',
        'payment_url',
        'raw_payload',
        'expires_at',
        'paid_at',
    ];

    /**
     * Payload mentah dan token tidak ikut terkirim ke frontend.
     *
     * @var list<string>
     */
    protected $hidden = [
        'raw_payload',
        'snap_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PaymentType::class,
            'amount' => 'integer',
            'status' => PaymentStatus::class,
            'provider' => PaymentProvider::class,
            'raw_payload' => 'array',
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function scopePaid(Builder $query): void
    {
        $query->where('status', PaymentStatus::Paid->value);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}