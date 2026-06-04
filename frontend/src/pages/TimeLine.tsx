import axios from "axios"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import TimelineTable from "@/components/features/timelines/TimelineTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import api from "@/lib/axios"
import type { Timeline } from "@/types/Timeline"

export default function TimeLine() {
  const [timelines, setTimelines] = useState<Timeline[]>([])

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        const response = await api.get("/api/timelines")
        setTimelines(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data)
        }
      }
    }

    fetchTimelines()
  }, [])

  return (
    <Card>
      <CardHeader>
        <Label>Pick a start date for your timeline</Label>
      </CardHeader>
      <CardContent>
        {/*<TimelinePopOver onDateSelect={createTimeline} />*/}
        <TimelineTable timelines={timelines} />
      </CardContent>
    </Card>
  )
}
