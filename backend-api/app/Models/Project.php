<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Enums\ProjectStatus;
use App\Enums\SessionStatus;
use App\Enums\StageStatus;
use App\Enums\TrackProgressStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    protected $fillable = [
        'code',
        'client_id',
        'package_id',
        'quotation_id',
        'name',
        'package_snapshot',
        'price',
        'po_amount',
        'status',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'package_snapshot' => 'array',
            'price' => 'integer',
            'po_amount' => 'integer',
            'status' => ProjectStatus::class,
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Project yang PO-nya sudah lunas dan belum berakhir.
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereIn('status', [
            ProjectStatus::AwaitingAssignment->value,
            ProjectStatus::InProgress->value,
            ProjectStatus::AwaitingFinalPayment->value,
        ]);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function tracks(): HasMany
    {
        return $this->hasMany(ProjectTrack::class)->orderBy('position');
    }

    public function stages(): HasMany
    {
        return $this->hasMany(ProjectStage::class)->orderBy('sequence');
    }

    /**
     * Tahap aktif pertama yang belum selesai.
     */
    public function currentStage(): HasOne
    {
        return $this->hasOne(ProjectStage::class)->ofMany(
            ['sequence' => 'min'],
            function (Builder $query) {
                $query->where('status', '!=', StageStatus::Completed->value);
            },
        );
    }

    /**
     * Tahap terakhir dalam paket. Tautan hasilnya adalah hasil akhir untuk klien.
     */
    public function finalStage(): HasOne
    {
        return $this->hasOne(ProjectStage::class)->ofMany('sequence', 'max');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function recordingSessions(): HasMany
    {
        return $this->hasMany(RecordingSession::class);
    }

    /**
     * Total biaya perpanjangan dari sesi tambahan yang sah.
     */
    public function extensionFeeTotal(): int
    {
        return (int) $this->recordingSessions()
            ->where('is_extension', true)
            ->whereIn('status', [
                SessionStatus::Confirmed->value,
                SessionStatus::Completed->value,
            ])
            ->sum('extra_fee');
    }

    /**
     * Harga paket ditambah biaya perpanjangan.
     */
    public function totalDue(): int
    {
        return $this->price + $this->extensionFeeTotal();
    }

    public function paidAmount(): int
    {
        return (int) $this->payments()
            ->where('status', PaymentStatus::Paid->value)
            ->sum('amount');
    }

    /**
     * Nominal pelunasan: total tagihan dikurangi yang sudah dibayar.
     */
    public function remainingAmount(): int
    {
        return max(0, $this->totalDue() - $this->paidAmount());
    }

    /**
     * Persentase progres produksi: sel track x tahap yang sudah disetujui
     * dibagi seluruh sel. Dihitung saat dibaca, tidak disimpan.
     */
    public function progressPercent(): int
    {
        $stats = TrackStageProgress::query()
            ->whereHas('stage', fn (Builder $query) => $query->where('project_id', $this->id))
            ->selectRaw(
                'COUNT(*) as total, COALESCE(SUM(status = ?), 0) as approved',
                [TrackProgressStatus::Approved->value],
            )
            ->first();

        $total = (int) ($stats->total ?? 0);

        if ($total === 0) {
            return 0;
        }

        return (int) round(((int) $stats->approved) / $total * 100);
    }
}