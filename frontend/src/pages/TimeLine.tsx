import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import TimelineTable from "@/components/features/timelines/TimelineTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { Timeline } from "@/types/Timeline"

export default function TimeLine() {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        setLoading(true)
        const response = await api.get("/api/timelines")
        setTimelines(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTimelines()
  }, [])

  return (
    <Card>
      <CardHeader>
        <Label>All the available timelines</Label>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <TimelineTable timelines={timelines} />
      </CardContent>
    </Card>
  )
}
