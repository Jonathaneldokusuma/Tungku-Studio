<?php

namespace App\Enums;

enum PaymentProvider: string
{
    use HasOptions;

    case Midtrans = 'midtrans';
    case Xendit = 'xendit';

    public function label(): string
    {
        return match ($this) {
            self::Midtrans => 'Midtrans',
            self::Xendit => 'Xendit',
        };
    }
}