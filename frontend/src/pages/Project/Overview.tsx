import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import OverviewHeader from "@/components/features/projects/OverviewHeader"
import ProjectActions from "@/components/features/projects/ProjectActions"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import type { ProjectStats } from "@/types/ProjectStats"

export default function Overview() {
  const { projectId } = useParams<{ projectId: string }>()
  const [stat, setStat] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<ProjectStats>(
          `/api/projects/${projectId}/stat`
        )
        setStat(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader stat={stat} loading={loading} />
      <div className="flex gap-2">
        <Button asChild>
          <Link to={`/projects/${projectId}/expense`}>Add Expenses</Link>
        </Button>
        {projectId && (
          <ProjectActions projectId={projectId} daysLeft={stat?.days_left} />
        )}
      </div>
    </div>
  )
}
