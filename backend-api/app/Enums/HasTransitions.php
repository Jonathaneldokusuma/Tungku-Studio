<?php

namespace App\Enums;

/**
 * Enum yang memakai trait ini wajib mendefinisikan transitions():
 * daftar status tujuan yang boleh dicapai dari status saat ini.
 */
trait HasTransitions
{
    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->transitions(), true);
    }

    /**
     * Status akhir: tidak ada transisi lanjutan.
     */
    public function isTerminal(): bool
    {
        return $this->transitions() === [];
    }
}