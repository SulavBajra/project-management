<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProject = Project::count();
        $projectCount = Project::active()->count();
        $totalUser = User::count();

        return response()->json([
            "total_project" => $totalProject,
            "project_count" => $projectCount,
            "total_users" => $totalUser,
        ]);
    }
}
