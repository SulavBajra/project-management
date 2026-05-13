<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

class ProjectController extends Controller
{
    public function listActiveProjects(User $user)
    {
        $activeProjects = Project::active()->get();

        return response()->json($activeProjects);
    }
}
