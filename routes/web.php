<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('main');
});
Route::get('/natsana_page', function () {
    return view('merge_file');
});
/*seperate__routes*/
Route::get('/banner', function () {
    return view('banner_sec');
});
Route::get('/img_mask', function () {
    return view('img_mask_sec');
});
Route::get('/txt_img_check', function () {
    return view('txt_img');
});

Route::get('/bg-txt_sect', function () {
    return view('bg_txt_sec');
});
Route::get('/left_img_txt_sect', function () {
    return view('left_img_txt');
});
Route::get('/accordian_section', function () {
    return view('accordian_sect');
});
Route::get('/conversion_file', function () {
    return view('conversion_file');
});
/*end_seperate_routes*/

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
