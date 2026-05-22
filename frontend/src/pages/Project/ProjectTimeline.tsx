import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import TimelinePeriodTable from "@/components/features/timelines/TimelinePeriodTable"
import api from "@/lib/axios"
import type { Timeline } from "@/types/Timeline"

export default function ProjectTimeline() {
  const { projectId } = useParams<{ projectId: string }>()
  const [timelines, setTimelines] = useState<Timeline[]>([])

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await api.get<Timeline[]>(
          `api/projects/${projectId}/timeline`
        )
        setTimelines(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      }
    }
    fetchTimeline()
  }, [projectId])

  return (
    <div>
      <TimelinePeriodTable timelines={timelines} />
    </div>
  )
}
