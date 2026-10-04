<?php

namespace App\Models;

use App\Enums\SessionStatus;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordingSession extends Model
{
    protected $fillable = [
        'room_id',
        'project_id',
        'project_stage_id',
        'client_id',
        'start_at',
        'end_at',
        'status',
        'held_until',
        'is_extension',
        'extra_fee',
        'requested_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'status' => SessionStatus::class,
            'held_until' => 'datetime',
            'is_extension' => 'boolean',
            'extra_fee' => 'integer',
        ];
    }

    /**
     * Sesi yang sedang menghalangi slot: terkonfirmasi, atau ditahan
     * dengan batas waktu yang belum lewat. Hold kedaluwarsa tidak dihitung
     * walaupun statusnya belum diperbarui scheduler.
     */
    public function scopeBlocking(Builder $query): void
    {
        $query->where(function (Builder $outer) {
            $outer->where('status', SessionStatus::Confirmed->value)
                ->orWhere(function (Builder $held) {
                    $held->where('status', SessionStatus::Held->value)
                        ->where('held_until', '>', now());
                });
        });
    }

    /**
     * Sesi yang rentang waktunya beririsan dengan rentang yang diberikan.
     */
    public function scopeOverlapping(Builder $query, CarbonInterface $start, CarbonInterface $end): void
    {
        $query->where('start_at', '<', $end)
            ->where('end_at', '>', $start);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(ProjectStage::class, 'project_stage_id');
    }

    /**
     * Pemegang hold atau booking.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}