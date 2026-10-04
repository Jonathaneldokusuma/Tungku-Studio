<?php

namespace App\Models;

use App\Enums\StageStatus;
use App\Enums\StageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectStage extends Model
{
    protected $fillable = [
        'project_id',
        'stage',
        'sequence',
        'operator_id',
        'status',
        'deadline_at',
        'assigned_at',
        'started_at',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stage' => StageType::class,
            'sequence' => 'integer',
            'status' => StageStatus::class,
            'deadline_at' => 'datetime',
            'assigned_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function isOverdue(): bool
    {
        return $this->deadline_at !== null
            && $this->status !== StageStatus::Completed
            && $this->deadline_at->isPast();
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    /**
     * Progres per track untuk tahap ini.
     */
    public function trackProgress(): HasMany
    {
        return $this->hasMany(TrackStageProgress::class);
    }

    public function recordingSessions(): HasMany
    {
        return $this->hasMany(RecordingSession::class);
    }
}