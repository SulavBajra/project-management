<?php

use App\Providers\AppServiceProvider;
use Laravel\Sanctum\SanctumServiceProvider;
use Laravel\Tinker\TinkerServiceProvider;
use Maatwebsite\Excel\ExcelServiceProvider;

return [
    AppServiceProvider::class,
    ExcelServiceProvider::class,
    SanctumServiceProvider::class,
    TinkerServiceProvider::class,
];
