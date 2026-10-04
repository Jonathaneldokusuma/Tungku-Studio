<?php

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * role dan is_active sengaja tidak masuk di sini supaya tidak bisa
     * diisi lewat mass assignment dari input pengguna. Set keduanya
     * secara eksplisit di kode, misalnya Role::Client saat registrasi.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'crm_consent_at',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
            'crm_consent_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function isManager(): bool
    {
        return $this->role === Role::Manager;
    }

    public function isOperator(): bool
    {
        return $this->role === Role::Operator;
    }

    public function isClient(): bool
    {
        return $this->role === Role::Client;
    }

    /**
     * Boleh dikirimi pesan CRM: akun aktif dan sudah memberi persetujuan.
     */
    public function canReceiveCrm(): bool
    {
        return $this->is_active && $this->crm_consent_at !== null;
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeOperators(Builder $query): void
    {
        $query->where('role', Role::Operator->value);
    }

    public function scopeClients(Builder $query): void
    {
        $query->where('role', Role::Client->value);
    }

    /**
     * Project milik klien ini.
     */
    public function clientProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'client_id');
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class, 'client_id');
    }

    /**
     * Tahap produksi yang ditugaskan ke operator ini.
     */
    public function stageAssignments(): HasMany
    {
        return $this->hasMany(ProjectStage::class, 'operator_id');
    }

    public function payrollItems(): HasMany
    {
        return $this->hasMany(PayrollItem::class, 'operator_id');
    }
}
