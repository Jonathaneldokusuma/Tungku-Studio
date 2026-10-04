<?php

namespace App\Models;

use App\Enums\CampaignRecipientStatus;
use App\Enums\CRMChannel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CRMCampaignRecipient extends Model
{
    protected $fillable = [
        'crm_campaign_id',
        'client_id',
        'channel',
        'status',
        'sent_at',
        'error',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'channel' => CRMChannel::class,
            'status' => CampaignRecipientStatus::class,
            'sent_at' => 'datetime',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(CRMCampaign::class, 'crm_campaign_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}