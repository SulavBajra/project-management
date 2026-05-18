<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectStoreRequest;
use App\Services\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function listActiveProjects(Request $request)
    {
        $activeProjects = $request
            ->user()
            ->projects()
            ->active()
            ->select("id", "code", "name")
            ->get();

        return response()->json($activeProjects);
    }

    public function storeProject(
        ProjectStoreRequest $request,
        ProjectService $projectService,
    ) {
        $request->validated();
        $project = $projectService->createProject($request);

        return response()->json(
            [
                "message" => "Project created successfully",
                "project" => $project,
            ],
            201,
        );
    }
}
