<?php

namespace App\Enums;

enum PaymentType: string
{
    use HasOptions;

    case Po = 'po';
    case Final = 'final';

    public function label(): string
    {
        return match ($this) {
            self::Po => 'PO',
            self::Final => 'Pelunasan',
        };
    }
}