<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class AIService
{
    private $aiCategories = [
        'Makanan & Minuman' => ['kopi', 'teh', 'makanan', 'minuman', 'snack', 'jajanan'],
        'Bumbu & Rempah' => ['sambal', 'bumbu', 'rempah', 'garam', 'gula', 'minyak'],
        'Bahan Pangan' => ['tepung', 'beras', 'gula', 'garam', 'bahan baku', 'raw material'],
        'Minyak & Lemak' => ['minyak goreng', 'minyak kelapa', 'lemak', 'minyak'],
        'Peralatan Dapur' => ['panci', 'wajan', 'piring', 'gelas', 'sendok'],
        'Kemasan' => ['kantong', 'kotak', 'kertas', 'plastik', 'tas'],
        'Kebersihan' => ['sabun', 'deterjen', 'pembersih', 'tisu', 'serbet'],
    ];

    public function analyzeTransaction(User $user, array $transactionData)
    {
        $insights = [];

        // Analisis berdasarkan kategori
        $recentTransactions = $user->transactions()
            ->where('category', $transactionData['category'])
            ->where('type', $transactionData['type'])
            ->where('date', '>=', now()->subDays(30))
            ->get();

        $averageAmount = $recentTransactions->avg('amount') ?? 0;

        if ($transactionData['amount'] > $averageAmount * 1.5 && $transactionData['amount'] > 0) {
            $insights[] = [
                'type' => 'warning',
                'message' => 'Transaksi ini lebih tinggi dari rata-rata kategori Anda.',
            ];
        }

        // Saran berdasarkan pola
        if ($transactionData['type'] === 'penjualan' && $recentTransactions->count() > 0) {
            $insights[] = [
                'type' => 'info',
                'message' => 'Penjualan kategori ini menunjukkan tren positif. Pertahankan momentum!',
            ];
        }

        return [
            'is_anomaly' => $transactionData['amount'] > $averageAmount * 2,
            'average_amount' => (int)$averageAmount,
            'insights' => $insights,
        ];
    }

    public function predictSales(User $user, string $period = 'month')
    {
        $days = match ($period) {
            'week' => 7,
            'month' => 30,
            'quarter' => 90,
            'year' => 365,
            default => 30,
        };

        $startDate = now()->subDays($days);
        $transactions = $user->transactions()
            ->where('type', 'penjualan')
            ->where('date', '>=', $startDate)
            ->get();

        $totalSales = $transactions->sum('amount');
        $averageDaily = $transactions->groupBy(function ($item) {
            return $item->date->format('Y-m-d');
        })->map->sum('amount')->avg();

        // Simple linear prediction
        $predictedSales = $averageDaily * $days;

        return [
            'period' => $period,
            'historical_sales' => $totalSales,
            'average_daily' => (int)$averageDaily,
            'predicted_sales' => (int)$predictedSales,
            'growth_rate' => 0.15, // 15% growth assumption
        ];
    }

    public function generateInsights(User $user)
    {
        $insights = [];
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        // Total revenue insight
        $totalRevenue = $user->transactions()
            ->where('type', 'penjualan')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        if ($totalRevenue > 0) {
            $insights[] = [
                'title' => '💰 Total Pendapatan Bulan Ini',
                'message' => 'Anda telah mendapatkan Rp ' . number_format($totalRevenue, 0, ',', '.') . ' dari penjualan bulan ini.',
            ];
        }

        // Top performing category
        $topCategory = $user->transactions()
            ->where('type', 'penjualan')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('category')
            ->selectRaw('category, SUM(amount) as total')
            ->orderBy('total', 'DESC')
            ->first();

        if ($topCategory) {
            $insights[] = [
                'title' => '📈 Kategori Terbaik',
                'message' => 'Kategori "' . $topCategory->category . '" adalah performa terbaik Anda dengan total Rp ' . number_format($topCategory->total, 0, ',', '.'),
            ];
        }

        // Low stock warning
        $lowStockProducts = $user->products()->lowStock()->count();

        if ($lowStockProducts > 0) {
            $insights[] = [
                'title' => '⚠️ Stok Terbatas',
                'message' => 'Anda memiliki ' . $lowStockProducts . ' produk dengan stok di bawah minimum. Segera lakukan restock!',
            ];
        }

        // Expense analysis
        $totalExpense = $user->transactions()
            ->whereIn('type', ['pembelian', 'pengeluaran'])
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        $expenseRatio = $totalRevenue > 0 ? ($totalExpense / $totalRevenue) * 100 : 0;

        if ($expenseRatio > 50) {
            $insights[] = [
                'title' => '💡 Optimasi Biaya',
                'message' => 'Pengeluaran Anda mencapai ' . round($expenseRatio, 1) . '% dari pendapatan. Pertimbangkan untuk mengoptimalkan biaya.',
            ];
        } elseif ($expenseRatio < 30) {
            $insights[] = [
                'title' => '✅ Manajemen Biaya Bagus',
                'message' => 'Pengeluaran Anda hanya ' . round($expenseRatio, 1) . '% dari pendapatan. Pertahankan efisiensi ini!',
            ];
        }

        // Profit margin insight
        $avgMargin = $user->products()
            ->selectRaw('AVG((jual - modal) / jual * 100) as margin')
            ->value('margin') ?? 0;

        if ($avgMargin > 0) {
            $insights[] = [
                'title' => '📊 Margin Keuntungan',
                'message' => 'Rata-rata margin keuntungan produk Anda adalah ' . round($avgMargin, 1) . '%',
            ];
        }

        return array_slice($insights, 0, 5); // Limit to 5 insights
    }

    // public function categorizeProduct(array $data)
    // {
    //     $name = strtolower($data['name']);
    //     $category = strtolower($data['category']);

    //     $confidence = 0.5;
    //     $bestMatch = $data['category'];

    //     foreach ($this->aiCategories as $aiCategory => $keywords) {
    //         $matches = 0;
    //         foreach ($keywords as $keyword) {
    //             if (str_contains($name, $keyword) || str_contains($category, $keyword)) {
    //                 $matches++;
    //             }
    //         }

    //         if ($matches > 0) {
    //             $newConfidence = min(0.98, 0.5 + ($matches * 0.2));
    //             if ($newConfidence > $confidence) {
    //                 $confidence = $newConfidence;
    //                 $bestMatch = $aiCategory;
    //             }
    //         }
    //     }

    //     return [
    //         'label' => $bestMatch,
    //         'confidence' => $confidence,
    //         'original_category' => $data['category'],
    //     ];
    // }

    public function categorizeProduct(array $data)
    {
        $name = strtolower($data['name'] ?? '');
        $category = strtolower($data['category'] ?? '');

        $confidence = 0.5;
        $bestMatch = 'Lainnya';

        foreach ($this->aiCategories as $aiCategory => $keywords) {
            $matches = 0;

            foreach ($keywords as $keyword) {
                if (
                    str_contains($name, $keyword) ||
                    str_contains($category, $keyword)
                ) {
                    $matches++;
                }
            }

            if ($matches > 0) {
                $newConfidence = min(
                    0.98,
                    0.5 + ($matches * 0.2)
                );

                if ($newConfidence > $confidence) {
                    $confidence = $newConfidence;
                    $bestMatch = $aiCategory;
                }
            }
        }

        return [
            'label' => $bestMatch,
            'confidence' => $confidence,
            'original_category' => $category,
        ];
    }
}
