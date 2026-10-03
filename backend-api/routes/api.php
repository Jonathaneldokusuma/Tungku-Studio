<?php

use App\Http\Controllers\Api\Client\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok']);
Route::get('/config/status', fn () => [
    'firebase_project_id_set' => filled(env('FIREBASE_PROJECT_ID')),
    'firebase_credentials_set' => filled(env('FIREBASE_CREDENTIALS')),
    'midtrans_server_key_set' => filled(env('MIDTRANS_SERVER_KEY')),
    'midtrans_client_key_set' => filled(env('MIDTRANS_CLIENT_KEY')),
    'mail_mailer' => env('MAIL_MAILER'),
]);

Route::prefix('client/payments')->group(function () {
    Route::post('/snap-token', [PaymentController::class, 'createSnapToken']);
    Route::post('/notification', [PaymentController::class, 'notification']);
});
