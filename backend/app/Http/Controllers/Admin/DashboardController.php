<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $projectCount = Project::active()->count();
        $totalUser = User::count();

        return response()->json([
            'projectCount' => $projectCount,
            'totalUsers' => $totalUser,
        ]);
    }
}
