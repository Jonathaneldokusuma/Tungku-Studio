<?php

namespace App\Enums;

enum QuotationStatus: string
{
    use HasOptions, HasTransitions;

    case AwaitingStudio = 'awaiting_studio'; // giliran Manager
    case AwaitingClient = 'awaiting_client'; // giliran klien
    case Accepted = 'accepted';
    case Declined = 'declined';

    public function label(): string
    {
        return match ($this) {
            self::AwaitingStudio => 'Menunggu studio',
            self::AwaitingClient => 'Menunggu klien',
            self::Accepted => 'Disetujui',
            self::Declined => 'Ditolak',
        };
    }

    /**
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::AwaitingStudio => [self::AwaitingClient, self::Accepted, self::Declined],
            self::AwaitingClient => [self::AwaitingStudio, self::Accepted, self::Declined],
            self::Accepted, self::Declined => [],
        };
    }

    public function awaitedSide(): ?OfferSide
    {
        return match ($this) {
            self::AwaitingStudio => OfferSide::Studio,
            self::AwaitingClient => OfferSide::Client,
            default => null,
        };
    }

    public function isOpen(): bool
    {
        return $this->awaitedSide() !== null;
    }
}