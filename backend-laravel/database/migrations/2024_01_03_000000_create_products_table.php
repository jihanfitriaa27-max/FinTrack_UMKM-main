<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('category');
            $table->bigInteger('modal');
            $table->bigInteger('jual');
            $table->integer('min_stock')->default(0);
            $table->integer('current_stock')->default(0);
            $table->string('ai_label')->nullable();
            $table->float('ai_confidence')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'category']);
            $table->index('current_stock');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
