<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function view(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }

    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }
}
