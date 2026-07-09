<?php

namespace App\Services;

use App\Http\Requests\Project\ProjectStoreRequest;
use App\Models\BudgetPlan;
use App\Models\Expense;
use App\Models\Project;
use App\Models\Timeline;
use App\Models\TimelinePeriod;
use App\Models\User;
use Illuminate\Support\Collection;
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
                $request->only(['name', 'description', 'code', 'is_active']) + [
                    'created_by' => $request->user()->name,
                ],
            );
            if ($request->user()->hasRole('project_manager')) {
                $userIds = collect($request->user_ids ?? [])
                    ->push($request->user()->id)
                    ->unique()
                    ->values()
                    ->all();
            } else {
                $userIds = collect($request->user_ids ?? [])
                    ->unique()
                    ->values()
                    ->all();
            }
            $project->users()->sync($userIds);
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

    public function getStatOfProject(int $projectId): array
    {
        $projectEndDate = Project::find($projectId)?->timelines()->first()
            ?->end_date;
        $currentPeriod = TimelinePeriod::with('timeline')
            ->whereHas('timeline.projects', function ($query) use ($projectId) {
                $query->where('projects.id', $projectId);
            })
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
        $totalUsers = Project::find($projectId)->users()->count();

        $daysLeft = now()->diffInDays($projectEndDate, false);

        return [
            'current_period' => [
                'id' => $currentPeriod?->id,
                'name' => $currentPeriod?->name,
                'start_date' => $currentPeriod?->start_date,
                'end_date' => $currentPeriod?->end_date,
            ],
            'days_left' => (int) $daysLeft,
            'total_users' => $totalUsers,
        ];
    }

    public function getBudgetExpenseOverview(int $projectId)
    {
        $allocations = BudgetPlan::query()
            ->where('project_id', $projectId)
            ->select('id')
            ->with('items.allocations.timelinePeriod')
            ->get();

        $expenses = Expense::query()
            ->select('id')
            ->where('project_id', $projectId)
            ->with('transactions')
            ->get();

        return [
            'allocation' => $allocations,
            'expenses' => $expenses,
        ];
    }

    public function getTimeline(int $projectId)
    {
        $timelines = Timeline::with('periods')
            ->whereHas('projects', function ($query) use ($projectId) {
                $query->where('projects.id', $projectId);
            })
            ->get();

        return $timelines;
    }

    public function getUsersNotInProject(int $projectId): Collection
    {
        return User::role('employee')
            ->whereDoesntHave('projects', function ($query) use ($projectId) {
                $query->where('projects.id', $projectId);
            })
            ->withCount('projects')
            ->having('projects_count', '<', 3)
            ->get();
    }

    public function addUsers(array $users, int $projectId): void
    {
        $project = Project::find($projectId);
        foreach ($users as $user) {
        }
        $project->users()->attach($users);
    }
}
