<?php

namespace App\Enums;

enum ProjectStatus: string
{
    use HasOptions, HasTransitions;

    case PendingPayment = 'pending_payment';
    case AwaitingAssignment = 'awaiting_assignment';
    case InProgress = 'in_progress';
    case AwaitingFinalPayment = 'awaiting_final_payment';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PendingPayment => 'Pembayaran PO',
            self::AwaitingAssignment => 'Penugasan',
            self::InProgress => 'In Progress',
            self::AwaitingFinalPayment => 'Pelunasan',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
        };
    }

    /**
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::PendingPayment => [self::AwaitingAssignment, self::Cancelled],
            self::AwaitingAssignment => [self::InProgress, self::Cancelled],
            self::InProgress => [self::AwaitingFinalPayment, self::Cancelled],
            // Setelah semua tahap selesai, satu-satunya jalan ke depan adalah pelunasan
            self::AwaitingFinalPayment => [self::Completed],
            self::Completed, self::Cancelled => [],
        };
    }

    /**
     * Project yang sudah dibayar PO-nya dan belum berakhir.
     */
    public function isActive(): bool
    {
        return in_array($this, [
            self::AwaitingAssignment,
            self::InProgress,
            self::AwaitingFinalPayment,
        ], true);
    }
}