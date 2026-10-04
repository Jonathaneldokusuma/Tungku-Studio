<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectTrack extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'position',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Progres track ini di setiap tahap.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(TrackStageProgress::class);
    }
}