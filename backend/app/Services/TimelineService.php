<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Timeline;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TimelineService
{
    public function createTimeline(array $data)
    {
        $startDate = Carbon::parse($data["start_date"]);
        $endDate = $startDate->copy()->addYear();
        $data["end_date"] = $endDate->toDateString();

        $existingTimeline = $this->checkIfTimelineExists($startDate, $endDate);
        if ($existingTimeline) {
            return $existingTimeline;
        }

        return DB::transaction(function () use ($data) {
            $timeline = Timeline::create($data);
            $periods = $this->generateTimelinePeriods(
                Carbon::parse($timeline->start_date),
                Carbon::parse($timeline->end_date),
            );

            foreach ($periods as $period) {
                $timeline->periods()->create($period);
            }

            return $timeline->load("periods");
        });
    }

    public static function generateTimelinePeriods(
        Carbon $startDate,
        Carbon $endDate,
    ): array {
        $periods = [];
        $quarter1_end = $startDate->copy()->addMonths(3);
        $quarter2_end = $startDate->copy()->addMonths(6);
        $quarter3_end = $startDate->copy()->addMonths(9);
        $quarter4_end = $endDate;
        $periods = [
            [
                "name" => "Q1",
                "start_date" => $startDate,
                "end_date" => $quarter1_end,
            ],
            [
                "name" => "Q2",
                "start_date" => $quarter1_end,
                "end_date" => $quarter2_end,
            ],
            [
                "name" => "Q3",
                "start_date" => $quarter2_end,
                "end_date" => $quarter3_end,
            ],
            [
                "name" => "Q4",
                "start_date" => $quarter3_end,
                "end_date" => $quarter4_end,
            ],
        ];

        return $periods;
    }

    public function checkIfTimelineExists(Carbon $startDate, Carbon $endDate)
    {
        return Timeline::where("start_date", $startDate)
            ->where("end_date", $endDate)
            ->first();
    }

    public function extendTimeline(array $data): void
    {
        $project = Project::findOrFail($data["project_id"]);

        $timeline = $this->createTimeline($data);
        $project->timelines()->attach($timeline);
    }
}
