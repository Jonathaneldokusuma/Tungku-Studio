<?php

namespace App\Enums;

enum TrackProgressStatus: string
{
    use HasOptions, HasTransitions;

    case Pending = 'pending';
    case InReview = 'in_review';
    case Revision = 'revision';
    case Approved = 'approved';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::InReview => 'Ditinjau',
            self::Revision => 'Revisi',
            self::Approved => 'Disetujui',
        };
    }

    /**
     * Pending dan Revision keluar lewat pengiriman tautan oleh operator,
     * InReview keluar lewat keputusan Manager.
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Pending => [self::InReview],
            self::InReview => [self::Approved, self::Revision],
            self::Revision => [self::InReview],
            self::Approved => [],
        };
    }

    public function isApproved(): bool
    {
        return $this === self::Approved;
    }

    /**
     * Giliran Manager untuk meninjau.
     */
    public function awaitsManager(): bool
    {
        return $this === self::InReview;
    }

    /**
     * Giliran operator untuk mengirim atau memperbaiki.
     */
    public function awaitsOperator(): bool
    {
        return in_array($this, [self::Pending, self::Revision], true);
    }
}