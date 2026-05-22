<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectStoreRequest;
use App\Http\Resources\Timeline\TimelineResource;
use App\Models\Project;
use App\Services\ProjectService;
use App\Services\TimelineService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectService $projectService,
        protected TimelineService $timelineService,
    ) {
        //
    }

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

    public function getStatOfProject(Request $request)
    {
        $projectId = $request->route("id");
        $stats = $this->projectService->getStatOfProject($projectId);

        return response()->json($stats);
    }

    public function getProjectTimeline(Request $request)
    {
        $projectId = $request->route("id");
        $timeline = $this->projectService->getTimeline($projectId);

        return response()->json(TimelineResource::collection($timeline));
    }

    public function extendProjectTimeline(Request $request)
    {
        $projectId = $request->route("id");
        $data = [
            "project_id" => $projectId,
            "start_date" => $request->input("start_date"),
        ];
        $this->timelineService->extendTimeline($data);

        return response()->json([
            "message" => "Timeline extended successfully",
        ]);
    }

    public function endProject(Request $request)
    {
        $projectId = $request->route("id");
        $project = Project::findOrFail($projectId);
        $project->is_active = false;
        $project->save();

        return response()->json([
            "message" => "Project ended successfully",
        ]);
    }
}
