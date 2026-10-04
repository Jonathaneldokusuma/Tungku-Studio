<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use App\Enums\CRMChannel;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CRMCampaign extends Model
{
    protected $fillable = [
        'created_by',
        'name',
        'package_id',
        'message',
        'channels',
        'status',
        'sent_at',
    ];

    /**
     * channels disimpan sebagai JSON berisi daftar saluran, jadi memakai
     * AsEnumCollection, bukan cast enum biasa.
     *
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'channels' => AsEnumCollection::of(CRMChannel::class),
            'status' => CampaignStatus::class,
            'sent_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(CRMCampaignRecipient::class);
    }
}