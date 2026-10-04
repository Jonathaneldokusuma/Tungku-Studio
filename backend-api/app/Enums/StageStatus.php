<?php

namespace App\Enums;

enum StageStatus: string
{
    use HasOptions, HasTransitions;

    case Locked = 'locked';
    case Ready = 'ready';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Locked => 'Terkunci',
            self::Ready => 'Ready',
            self::InProgress => 'In Progress',
            self::Completed => 'Selesai',
        };
    }

    /**
     * Ready bisa langsung Completed karena tahap Recording tidak punya
     * langkah konfirmasi tenggat, jadi tidak pernah lewat InProgress.
     *
     * @return array<int, self>
     */
    public function transitions(): array
    {
        return match ($this) {
            self::Locked => [self::Ready],
            self::Ready => [self::InProgress, self::Completed],
            self::InProgress => [self::Completed],
            self::Completed => [],
        };
    }

    /**
     * Operator boleh mengirim hasil kerja pada status ini.
     */
    public function acceptsSubmissions(): bool
    {
        return in_array($this, [self::Ready, self::InProgress], true);
    }
}