<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;

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


