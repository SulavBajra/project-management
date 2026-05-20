<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    Maatwebsite\Excel\ExcelServiceProvider::class,
    Laravel\Sanctum\SanctumServiceProvider::class,
    Laravel\Tinker\TinkerServiceProvider::class,
];
