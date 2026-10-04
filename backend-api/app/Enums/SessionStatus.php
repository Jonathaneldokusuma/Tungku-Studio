<?php

namespace App\Enums;

enum SessionStatus: string
{
    use HasOptions, HasTransitions;

    case Held = 'held';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Expired = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::Held => 'On Hold',
            self::Confirmed => 'Terkonfirmasi',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
            self::Expired => 'Kedaluwarsa',
        };
    }

    /**
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Held => [self::Confirmed, self::Cancelled, self::Expired],
            self::Confirmed => [self::Completed, self::Cancelled],
            self::Completed, self::Cancelled, self::Expired => [],
        };
    }

    /**
     * Status yang berpotensi menghalangi slot. Untuk Held, query tetap
     * harus mengecek held_until > sekarang, karena hold yang sudah lewat
     * tidak lagi menghalangi walaupun statusnya belum diperbarui scheduler.
     *
     * @return array<int, self>
     */
    public static function blocking(): array
    {
        return [self::Held, self::Confirmed];
    }
}