<?php

namespace App\Enums;

enum PriceUnit: string
{
    use HasOptions;

    case Hour = 'hour';
    case Track = 'track';

    public function label(): string
    {
        return match ($this) {
            self::Hour => 'per jam',
            self::Track => 'per track',
        };
    }
}