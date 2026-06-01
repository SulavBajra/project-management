<?php

use App\Providers\AppServiceProvider;
use Laravel\Sanctum\SanctumServiceProvider;
use Laravel\Tinker\TinkerServiceProvider;
use Maatwebsite\Excel\ExcelServiceProvider;
use Spatie\Permission\PermissionServiceProvider;

return [
    AppServiceProvider::class,
    ExcelServiceProvider::class,
    PermissionServiceProvider::class,
    SanctumServiceProvider::class,
    TinkerServiceProvider::class,
];
