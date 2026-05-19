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
                $request->only(['name', 'description', 'code', 'is_active']) + [
                    'created_by' => $request->user()->name,
                ],
            );

            $project->users()->sync($request->user_ids);
            $timeline = $this->timelineService->createTimeline([
                'start_date' => $request->start_date,
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
