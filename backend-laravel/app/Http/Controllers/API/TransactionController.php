<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $query = auth()->user()->transactions();

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $transactions = $query->latest('date')->paginate(15);

        return response()->json(['data' => $transactions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:penjualan,pembelian,pengeluaran',
            'category' => 'required|string',
            'amount' => 'required|integer|min:1',
            'note' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $transaction = auth()->user()->transactions()->create($validated);

        return response()->json([
            'message' => 'Transaction created successfully',
            'data' => $transaction,
        ], 201);
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        return response()->json(['data' => $transaction]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'type' => 'required|in:penjualan,pembelian,pengeluaran',
            'category' => 'required|string',
            'amount' => 'required|integer|min:1',
            'note' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $transaction->update($validated);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'data' => $transaction,
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }

    public function summary(Request $request)
    {
        $user = auth()->user();
        $dateRange = $request->input('date_range', 'month');

        $query = $user->transactions();

        // Apply date range
        $now = now();
        switch ($dateRange) {
            case 'week':
                $startDate = $now->copy()->subDays(7);
                break;
            case 'month':
                $startDate = $now->copy()->startOfMonth();
                break;
            case 'year':
                $startDate = $now->copy()->startOfYear();
                break;
            default:
                $startDate = $now->copy()->subDays(30);
        }

        $query->where('date', '>=', $startDate);

        $summary = [
            'total_income' => $query->clone()->whereIn('type', ['penjualan', 'pendapatan'])->sum('amount'),
            'total_expense' => $query->clone()->whereIn('type', ['pembelian', 'pengeluaran'])->sum('amount'),
        ];

        $summary['profit'] = $summary['total_income'] - $summary['total_expense'];

        return response()->json(['data' => $summary]);
    }
}
