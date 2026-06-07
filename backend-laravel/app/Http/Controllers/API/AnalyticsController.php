<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api');
    }

    public function dashboard()
    {
        $user = auth()->user();
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        // Calculate totals
        $transactions = $user->transactions()
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $totalRevenue = $transactions->where('type', 'penjualan')->sum('amount');
        $totalExpenses = $transactions->whereIn('type', ['pembelian', 'pengeluaran'])->sum('amount');
        $profit = $totalRevenue - $totalExpenses;

        // Revenue trend (last 30 days)
          $revenueChart = $user->transactions()
            ->select(
                DB::raw('DATE(date) as date'),
                DB::raw('SUM(CASE WHEN type = "penjualan" THEN amount ELSE 0 END) as revenue'),
                DB::raw('SUM(CASE WHEN type IN ("pembelian","pengeluaran") THEN amount ELSE 0 END) as expense')
            )
            ->where('date', '>=', now()->subDays(30))
            ->groupBy(DB::raw('DATE(date)'))
            ->orderBy('date')
            ->get()
            ->toArray();

        // Category breakdown
        $categoryBreakdown = $user->transactions()
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('category')
            ->selectRaw('category as name, SUM(amount) as value')
            ->get()
            ->toArray();

        $recentTransactions = $user->transactions()
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get([
                'id',
                'category',
                'amount',
                'type',
                'date',
                'note'
            ])
            ->toArray();

            return response()->json([
                'data' => [
                    'total_revenue' => $totalRevenue,
                    'total_expenses' => $totalExpenses,
                    'profit' => $profit,
                    'product_count' => $user->products()->count(),
                    'revenue_chart' => $revenueChart,
                    'category_breakdown' => $categoryBreakdown,

                    // Tambahan 
                    'recent_transactions' => $recentTransactions,
                ],
            ]);
    }

    public function revenue($period = 'month')
    {
        $user = auth()->user();

        $query = $user->transactions()->where('type', 'penjualan');

        $startDate = match ($period) {
            'week' => now()->subDays(7),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->subDays(30),
        };

        $revenue = $query->where('date', '>=', $startDate)->sum('amount');

        return response()->json([
            'data' => [
                'period' => $period,
                'revenue' => $revenue,
            ],
        ]);
    }

    public function expenses($period = 'month')
    {
        $user = auth()->user();

        $query = $user->transactions()->whereIn('type', ['pembelian', 'pengeluaran']);

        $startDate = match ($period) {
            'week' => now()->subDays(7),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->subDays(30),
        };

        $expenses = $query->where('date', '>=', $startDate)->sum('amount');

        return response()->json([
            'data' => [
                'period' => $period,
                'expenses' => $expenses,
            ],
        ]);
    }

    public function profitMargin()
    {
        $user = auth()->user();

        $products = $user->products()->get();

        $margins = $products->map(function ($product) {
            return [
                'name' => $product->name,
                'margin' => $product->jual - $product->modal,
                'margin_percentage' => ($product->jual - $product->modal) / $product->jual * 100,
            ];
        });

        return response()->json([
            'data' => $margins,
        ]);
    }

    public function categoryBreakdown()
    {
        $user = auth()->user();
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        $breakdown = $user->transactions()
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('category')
            ->selectRaw('category as name, SUM(amount) as value, type')
            ->get()
            ->toArray();

        return response()->json([
            'data' => $breakdown,
        ]);
    }
}
