<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\AIService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        // $this->middleware('auth:api');
        $this->aiService = $aiService;
    }

    public function index(Request $request)
    {
        $query = auth()->user()->products();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('low_stock')) {
            $query->lowStock();
        }

        $products = $query->latest()->paginate(15);

        return response()->json(['data' => $products]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'category' => 'required|string',
            'modal' => 'required|integer|min:1',
            'jual' => 'required|integer|min:1',
            'min_stock' => 'required|integer|min:0',
            'current_stock' => 'integer|min:0',
        ]);

        // AI Categorization
        $aiResult = $this->aiService->categorizeProduct([
            'name' => $validated['name'],
            'category' => $validated['category'],
        ]);

        $validated['ai_label'] = $aiResult['label'] ?? $validated['category'];
        $validated['ai_confidence'] = $aiResult['confidence'] ?? 0;

        $product = auth()->user()->products()->create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        return response()->json(['data' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorize('update', $product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string',
            'category' => 'required|string',
            'modal' => 'required|integer|min:1',
            'jual' => 'required|integer|min:1',
            'min_stock' => 'required|integer|min:0',
            'current_stock' => 'integer|min:0',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function checkStock(Product $product)
    {
        $this->authorize('view', $product);

        return response()->json([
            'data' => [
                'product_id' => $product->id,
                'current_stock' => $product->current_stock,
                'min_stock' => $product->min_stock,
                'is_low_stock' => $product->current_stock <= $product->min_stock,
            ],
        ]);
    }
}
