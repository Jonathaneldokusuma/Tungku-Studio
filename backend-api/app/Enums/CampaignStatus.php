<?php

namespace App\Enums;

enum CampaignStatus: string
{
    use HasOptions, HasTransitions;

    case Draft = 'draft';
    case Sending = 'sending';
    case Sent = 'sent';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draf',
            self::Sending => 'Mengirim',
            self::Sent => 'Terkirim',
            self::Failed => 'Gagal',
        };
    }

    /**
     * Failed boleh kembali ke Sending untuk percobaan ulang.
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Draft => [self::Sending],
            self::Sending => [self::Sent, self::Failed],
            self::Sent => [],
            self::Failed => [self::Sending],
        };
    }
}