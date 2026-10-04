<?php

namespace App\Enums;

enum InventoryStatus: string
{
    use HasOptions, HasTransitions;

    case Active = 'active';
    case InRepair = 'in_repair';
    case Sold = 'sold';
    case Disposed = 'disposed';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Aktif',
            self::InRepair => 'Diperbaiki',
            self::Sold => 'Terjual',
            self::Disposed => 'Dibuang',
        };
    }

    /**
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Active => [self::InRepair, self::Sold, self::Disposed],
            self::InRepair => [self::Active, self::Sold, self::Disposed],
            self::Sold, self::Disposed => [],
        };
    }

    /**
     * Barang yang sudah tidak dimiliki: penyusutan berhenti di disposed_on.
     */
    public function isGone(): bool
    {
        return in_array($this, [self::Sold, self::Disposed], true);
    }
}