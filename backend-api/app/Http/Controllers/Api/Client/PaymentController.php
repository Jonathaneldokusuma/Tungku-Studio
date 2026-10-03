<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function createSnapToken(Request $request, PaymentService $payments)
    {
        $payload = $request->validate([
            'order_id' => ['nullable', 'string', 'max:80'],
            'gross_amount' => ['required', 'integer', 'min:1000'],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:160'],
            'customer_phone' => ['nullable', 'string', 'max:40'],
            'item_id' => ['nullable', 'string', 'max:80'],
            'item_name' => ['nullable', 'string', 'max:120'],
            'items' => ['nullable', 'array'],
        ]);

        return response()->json($payments->createSnapToken($payload));
    }

    public function notification(Request $request, PaymentService $payments)
    {
        $payload = $request->all();

        if (! $payments->isValidNotificationSignature($payload)) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        return response()->json([
            'message' => 'Payment notification accepted',
            'order_id' => $payload['order_id'] ?? null,
            'transaction_status' => $payload['transaction_status'] ?? null,
            'payment_type' => $payload['payment_type'] ?? null,
        ]);
    }
}
