<?php

namespace App\Enums;

enum PaymentStatus: string
{
    use HasOptions, HasTransitions;

    case Pending = 'pending';
    case Paid = 'paid';
    case Failed = 'failed';
    case Expired = 'expired';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Paid => 'Lunas',
            self::Failed => 'Gagal',
            self::Expired => 'Kedaluwarsa',
            self::Refunded => 'Dikembalikan',
        };
    }

    /**
     * Webhook yang sama bisa datang berulang. Karena Paid tidak punya
     * transisi kembali ke Pending, notifikasi kedua mudah dikenali dan
     * diabaikan lewat canTransitionTo().
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Pending => [self::Paid, self::Failed, self::Expired],
            self::Paid => [self::Refunded],
            self::Failed, self::Expired, self::Refunded => [],
        };
    }

    public function isPaid(): bool
    {
        return $this === self::Paid;
    }
}