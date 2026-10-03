<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentService
{
    public function createSnapToken(array $payload): array
    {
        $serverKey = config('services.midtrans.server_key');

        if (! $serverKey) {
            abort(500, 'MIDTRANS_SERVER_KEY belum diisi.');
        }

        $orderId = $payload['order_id'] ?? 'TUNGKU-'.Str::upper(Str::random(10));
        $grossAmount = (int) $payload['gross_amount'];

        $response = Http::withBasicAuth($serverKey, '')
            ->acceptJson()
            ->asJson()
            ->post(config('services.midtrans.snap_url'), [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $grossAmount,
                ],
                'customer_details' => [
                    'first_name' => $payload['customer_name'],
                    'email' => $payload['customer_email'],
                    'phone' => $payload['customer_phone'] ?? null,
                ],
                'item_details' => $payload['items'] ?? [[
                    'id' => $payload['item_id'] ?? 'studio-package',
                    'price' => $grossAmount,
                    'quantity' => 1,
                    'name' => $payload['item_name'] ?? 'Tungku Studio Package',
                ]],
                'callbacks' => [
                    'finish' => rtrim(env('FRONTEND_CLIENT_URL', ''), '/').'/payment/finish',
                ],
            ]);

        if ($response->failed()) {
            abort($response->status(), $response->body());
        }

        return [
            'order_id' => $orderId,
            'snap_token' => $response->json('token'),
            'redirect_url' => $response->json('redirect_url'),
        ];
    }

    public function isValidNotificationSignature(array $payload): bool
    {
        $serverKey = config('services.midtrans.server_key');

        if (! $serverKey || empty($payload['signature_key'])) {
            return false;
        }

        $rawSignature = ($payload['order_id'] ?? '')
            .($payload['status_code'] ?? '')
            .($payload['gross_amount'] ?? '')
            .$serverKey;

        return hash_equals(hash('sha512', $rawSignature), $payload['signature_key']);
    }
}
