<?php

namespace App\Enums;

enum OfferSide: string
{
    use HasOptions;

    case Client = 'client';
    case Studio = 'studio';

    public function label(): string
    {
        return match ($this) {
            self::Client => 'Klien',
            self::Studio => 'Studio',
        };
    }

    public function opposite(): self
    {
        return match ($this) {
            self::Client => self::Studio,
            self::Studio => self::Client,
        };
    }

    public function statusAfterOffer(): QuotationStatus
    {
        return match ($this) {
            self::Client => QuotationStatus::AwaitingStudio,
            self::Studio => QuotationStatus::AwaitingClient,
        };
    }
}