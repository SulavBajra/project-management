<?php

namespace App\Services;

use App\Http\Requests\Project\ProjectStoreRequest;
use App\Models\Project;
use App\Models\TimelinePeriod;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function __construct(protected TimelineService $timelineService)
    {
        //
    }

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

    public function getStatOfProject(int $projectId): array
    {
        $projectEndDate = Project::find($projectId)?->timelines()->first()
            ?->end_date;
        $currentPeriod = TimelinePeriod::with("timeline")
            ->whereHas("timeline.projects", function ($query) use ($projectId) {
                $query->where("projects.id", $projectId);
            })
            ->where("start_date", "<=", now())
            ->where("end_date", ">=", now())
            ->first();

        $daysLeft = now()->diffInDays($projectEndDate, false);

        return [
            "current_period" => [
                "id" => $currentPeriod?->id,
                "name" => $currentPeriod?->name,
                "start_date" => $currentPeriod?->start_date,
                "end_date" => $currentPeriod?->end_date,
            ],
            "days_left" => (int) $daysLeft,
        ];
    }
}
