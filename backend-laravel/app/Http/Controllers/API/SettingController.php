<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api');
    }

    public function index()
    {
        $settings = auth()->user()->settings;

        if (!$settings) {
            $settings = Setting::create(['user_id' => auth()->id()]);
        }

        return response()->json(['data' => $settings]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_category' => 'nullable|string|max:255',
            'business_address' => 'nullable|string',
            'business_phone' => 'nullable|string|max:20',
            'business_email' => 'nullable|email',
            'business_website' => 'nullable|url',
            'sales_target' => 'nullable|integer|min:0',
            'daily_budget' => 'nullable|integer|min:0',
        ]);

        $settings = $user->settings ?? new Setting(['user_id' => $user->id]);
        $settings->update($validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $settings,
        ]);
    }

    public function getProfile()
    {
        return response()->json([
            'data' => [
                'user' => auth()->user(),
                'settings' => auth()->user()->settings,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user,
        ]);
    }
}
