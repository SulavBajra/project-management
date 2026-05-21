import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ImportExpense from "@/components/features/expenses/ImportExpense"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/axios"
import { TriangleAlert } from "lucide-react"

interface ProjectStats {
  current_period: {
    id: number
    name: string
    start_date: string
    end_date: string
  } | null
  days_left: number | null
}
export default function Overview() {
  const { projectId } = useParams<{ projectId: string }>()
  const [stat, setStat] = useState<ProjectStats | null>(null)

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
      }
    }
    fetchData()
  }, [projectId])

  return (
    <div className="space-y-4">
      {stat !== null &&
        stat.days_left !== null &&
        (stat.days_left < 0 ? (
          <p className="text-sm text-destructive">
            <TriangleAlert className="inline-block h-4" />
            Warning: Project is past due. Extend the timeline.
          </p>
        ) : stat.days_left < 3 ? (
          <p className="text-sm text-destructive">
            <TriangleAlert className="inline-block h-4" />
            Warning: Only {stat.days_left} days left. Extend the timeline.
          </p>
        ) : null)}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardContent>
            {stat?.current_period ? (
              <p>Current Period: {stat.current_period.name}</p>
            ) : (
              <p className="text-muted-foreground">No active period</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            {stat?.days_left !== null && stat?.days_left !== undefined && (
              <p>Till End Date: {stat.days_left} days</p>
            )}
          </CardContent>
        </Card>
      </div>
      <ImportExpense projectId={Number(projectId)} />
    </div>
  )
}
