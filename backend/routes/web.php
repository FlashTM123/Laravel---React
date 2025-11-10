<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/login', [UsersController::class, 'login'])->name('users.login');

Route::prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');
});
Route::prefix('users')->group(function () {
    Route::get('/', [UsersController::class, 'index'])->name('users.index');
    Route::get('/create', [UsersController::class, 'create'])->name('users.create');
    Route::post('/store', [UsersController::class, 'store'])->name('users.store');
    Route::get('/edit/{id}', [UsersController::class, 'edit'])->name('users.edit');
    Route::put('/update/{id}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/delete/{id}', [UsersController::class, 'delete'])->name('users.delete');
});
Route::prefix('customers')->group(function () {
    Route::get('/', [CustomersController::class, 'index'])->name('customers.index');
});

// Simple JSON API for customers used by React table components
Route::get('/api/customers', [CustomersController::class, 'apiIndex']);

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
    // Accept PUT for API-style updates from the React modal
    Route::put('/{category}', [CategoryController::class, 'update'])->name('categories.update');
    // Optional: accept DELETE for form-based deletes
    Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

Route::prefix('brands')->group(function () {
    Route::get('/', [BrandController::class, 'index'])->name('brands.index');
    Route::post('/', [BrandController::class, 'store'])->name('brands.store');
    Route::put('/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::delete('/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
});


