<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\AnalyticsController;
use App\Http\Controllers\API\AIController;
use App\Http\Controllers\API\SettingController;

// ====================
// PUBLIC ROUTES
// ====================

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ====================
// PROTECTED ROUTES
// ====================

Route::middleware('auth:api')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
    Route::get('/transactions/summary', [TransactionController::class, 'summary']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::get('/products/{product}/stock', [ProductController::class, 'checkStock']);

    // Analytics
    Route::get('/analytics/dashboard', [AnalyticsController::class, 'dashboard']);
    Route::get('/analytics/revenue', [AnalyticsController::class, 'revenue']);
    Route::get('/analytics/expenses', [AnalyticsController::class, 'expenses']);
    Route::get('/analytics/profit-margin', [AnalyticsController::class, 'profitMargin']);
    Route::get('/analytics/category-breakdown', [AnalyticsController::class, 'categoryBreakdown']);

    // AI
    Route::post('/ai/analyze-transaction', [AIController::class, 'analyzeTransaction']);
    Route::get('/ai/predict-sales', [AIController::class, 'predictSales']);
    Route::get('/ai/insights', [AIController::class, 'getInsights']);
    Route::post('/ai/categorize-product', [AIController::class, 'categorizeProduct']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::get('/settings/profile', [SettingController::class, 'getProfile']);
    Route::put('/settings/profile', [SettingController::class, 'updateProfile']);
});