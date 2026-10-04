<?php

namespace App\Enums;

enum CampaignRecipientStatus: string
{
    use HasOptions, HasTransitions;

    case Pending = 'pending';
    case Sent = 'sent';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Sent => 'Terkirim',
            self::Failed => 'Gagal',
        };
    }

    /**
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Pending => [self::Sent, self::Failed],
            self::Sent => [],
            self::Failed => [self::Pending],
        };
    }
}