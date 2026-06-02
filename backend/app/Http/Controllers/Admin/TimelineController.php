<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timeline\TimelineStoreRequest;
use App\Http\Resources\Timeline\TimelineResource;
use App\Models\Timeline;
use App\Services\TimelineService;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function __construct(private TimelineService $timelineService)
    {
        //
    }

    public function getAllTimelines()
    {
        $timelines = Timeline::with("periods")
            ->where("end_date", ">", now())
            ->paginate(10);

        return response()->json(TimelineResource::collection($timelines));
    }

    public function createTimeline(TimelineStoreRequest $request)
    {
        $timeline = $this->$timelineService->createTimeline(
            $request->validated(),
        );

        return response()->json([
            "message" => "Timeline created successfully",
            "timeline" => $timeline,
        ]);
    }

    public function assignTimelineToProject(
        Request $request,
        Timeline $timeline,
    ) {
        $timeline->projects()->attach($request->project_id);

        return response()->json($timeline);
    }
}
