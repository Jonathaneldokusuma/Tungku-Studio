<?php

namespace App\Enums;

enum PayrollStatus: string
{
    use HasOptions, HasTransitions;

    case Draft = 'draft';
    case Finalized = 'finalized';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draf',
            self::Finalized => 'Final',
        };
    }

    /**
     * Bulan yang sudah final tidak bisa dibuka kembali lewat enum ini.
     * Kalau nanti diperlukan, tambahkan Draft ke daftar Finalized
     * dan catat aksinya di activity log.
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Draft => [self::Finalized],
            self::Finalized => [],
        };
    }
}