<?php

namespace App\Services;

use App\Http\Requests\Project\ProjectStoreRequest;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function __construct(protected TimelineService $timelineService) {}

    public function createProject(ProjectStoreRequest $request): Project
    {
        return DB::transaction(function () use ($request) {
            $project = Project::create(
                $request->only(["name", "description", "code", "is_active"]) + [
                    "created_by" => $request->user()->name,
                ],
            );
            $userIds = collect($request->user_ids ?? [])
                ->push($request->user()->id)
                ->unique()
                ->values()
                ->all();
            $project->users()->sync($userIds);
            $timeline = $this->timelineService->createTimeline([
                "start_date" => $request->start_date,
            ]);
            $project->timelines()->sync([$timeline->id]);

            return $project;
        });
    }

    public function assignUsersToProject(Project $project, array $users): void
    {
        $project->users()->attach($users);
    }
}
