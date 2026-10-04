<?php

namespace App\Models;

use App\Enums\TrackProgressStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackStageProgress extends Model
{
    /**
     * Laravel akan menebak jamak menjadi track_stage_progresses,
     * jadi nama tabel ditulis eksplisit.
     */
    protected $table = 'track_stage_progress';

    protected $fillable = [
        'project_stage_id',
        'project_track_id',
        'status',
        'result_url',
        'review_notes',
        'revision_count',
        'submitted_at',
        'approved_at',
        'approved_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TrackProgressStatus::class,
            'revision_count' => 'integer',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(ProjectStage::class, 'project_stage_id');
    }

    public function track(): BelongsTo
    {
        return $this->belongsTo(ProjectTrack::class, 'project_track_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}