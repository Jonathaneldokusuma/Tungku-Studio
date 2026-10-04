<?php

namespace App\Enums;

/**
 * Urutan case di sini adalah urutan produksi:
 * Recording, Editing, Mixing, Mastering.
 */
enum StageType: string
{
    use HasOptions;

    case Recording = 'recording';
    case Editing = 'editing';
    case Mixing = 'mixing';
    case Mastering = 'mastering';

    public function label(): string
    {
        return match ($this) {
            self::Recording => 'Recording',
            self::Editing => 'Editing',
            self::Mixing => 'Mixing',
            self::Mastering => 'Mastering',
        };
    }

    /**
     * Nilai untuk kolom project_stages.sequence.
     */
    public function sequence(): int
    {
        return match ($this) {
            self::Recording => 1,
            self::Editing => 2,
            self::Mixing => 3,
            self::Mastering => 4,
        };
    }

    /**
     * Recording memakai jadwal slot, tahap lain ditentukan tenggatnya oleh operator.
     */
    public function requiresDeadline(): bool
    {
        return $this !== self::Recording;
    }

    /**
     * Recording dihargai per jam, tahap lain per track.
     */
    public function priceUnit(): PriceUnit
    {
        return match ($this) {
            self::Recording => PriceUnit::Hour,
            default => PriceUnit::Track,
        };
    }

    /**
     * Nama kolom toggle di tabel packages dan quotations.
     */
    public function includeColumn(): string
    {
        return 'include_' . $this->value;
    }
}