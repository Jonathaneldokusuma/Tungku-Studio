<?php

namespace App\Enums;

enum Role: string
{
    use HasOptions;

    case Manager = 'manager';
    case Operator = 'operator';
    case Client = 'client';

    public function label(): string
    {
        return match ($this) {
            self::Manager => 'Manager',
            self::Operator => 'Operator',
            self::Client => 'Klien',
        };
    }

    public function isStaff(): bool
    {
        return $this !== self::Client;
    }
}