<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectStoreRequest;
use App\Http\Resources\Project\BudgetExpenseOverviewResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Timeline\TimelineResource;
use App\Models\Project;
use App\Services\ProjectService;
use App\Services\TimelineService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService,
        private TimelineService $timelineService,
    ) {
        //
    }

    public function listActiveProjects(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json([
                'error' => 'User instance not found',
            ]);
        }

        $activeProjects = $request
            ->user()
            ->projects()
            ->active()
            ->select('id', 'code', 'name')
            ->get();

        return response()->json($activeProjects);
    }

    public function storeProject(ProjectStoreRequest $request)
    {
        $request->validated();
        $project = $this->projectService->createProject($request);

        return response()->json(
            [
                'message' => 'Project created successfully',
                'project' => $project,
            ],
            201,
        );
    }

    public function getStatOfProject(Request $request)
    {
        $projectId = $request->route('id');
        $stats = $this->projectService->getStatOfProject($projectId);

        return response()->json($stats);
    }

    public function getBudgetVsExpense(Request $request)
    {
        $projectId = $request->route('id');
        $compare = $this->projectService->getBudgetExpenseOverview($projectId);

        return new BudgetExpenseOverviewResource($compare);
    }

    public function getProjectTimeline(Request $request)
    {
        $projectId = $request->route('id');
        $timeline = $this->projectService->getTimeline($projectId);

        return response()->json(TimelineResource::collection($timeline));
    }

    public function extendProjectTimeline(Request $request)
    {
        $projectId = $request->route('id');
        $data = [
            'project_id' => $projectId,
            'start_date' => $request->input('start_date'),
        ];
        $this->timelineService->extendTimeline($data);

        return response()->json([
            'message' => 'Timeline extended successfully',
        ]);
    }

    public function endProject(Request $request)
    {
        // if (!$request->user()->can("end project")) {
        //     abort(403, "You are not authorized to end a project");
        // }

        $projectId = $request->route('id');
        $project = Project::findOrFail($projectId);
        $project->is_active = false;
        $project->save();

        return response()->json([
            'message' => 'Project ended successfully',
        ]);
    }

    public function getUsers(Request $request)
    {
        $projectId = $request->route('id');
        $users = $this->projectService->getUsersNotInProject($projectId);

        return response()->json($users);
    }

    public function addUsers(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $projectId = $request->route('id');

        Project::findOrFail($projectId)
            ->users()
            ->syncWithoutDetaching($validated['user_ids']);

        return response()->json(['message' => 'Users added successfully.']);
    }

    public function getAllProjects()
    {
        $projects = Project::withCount('users')->paginate(10);

        return ProjectResource::collection($projects);
    }

    public function destroy(Project $project)
    {
        $project->users()->detach();
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
