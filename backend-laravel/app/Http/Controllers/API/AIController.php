<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        // $this->middleware('auth:api');
        $this->aiService = $aiService;
    }

    public function analyzeTransaction(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|integer',
            'category' => 'required|string',
            'type' => 'required|in:penjualan,pembelian,pengeluaran',
        ]);

        $analysis = $this->aiService->analyzeTransaction(
            auth()->user(),
            $validated
        );

        return response()->json([
            'data' => $analysis,
        ]);
    }

    public function predictSales($period = 'month')
    {
        $prediction = $this->aiService->predictSales(
            auth()->user(),
            $period
        );

        return response()->json([
            'data' => $prediction,
        ]);
    }

    public function getInsights()
    {
        $insights = $this->aiService->generateInsights(auth()->user());

        return response()->json([
            'data' => $insights,
        ]);
    }

    public function categorizeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'nullable|string',
        ]);

        $categorization = $this->aiService->categorizeProduct($validated);

        return response()->json([
            'data' => $categorization,
        ]);
    }
}
