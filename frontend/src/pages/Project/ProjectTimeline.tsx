import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import TimelinePeriodTable from "@/components/features/timelines/TimelinePeriodTable"
import api from "@/lib/axios"
import type { Timeline } from "@/types/Timeline"
import { useQuery } from "@tanstack/react-query"

export default function ProjectTimeline() {
  const { projectId } = useParams<{ projectId: string }>()

  const { data: timelines = [], isPending, error } = useQuery({
    queryKey: ["timelines"],
    queryFn: async () => {
      const response = await api.get(`api/projects/${projectId}/timeline`)
      return response.data as Timeline[]
    }
  })

  useEffect(() => {
    if(error) toast.error(error.message)
  },[error])

  return (
    <div>
      <TimelinePeriodTable timelines={timelines} isLoading={isPending} />
    </div>
  )
}
