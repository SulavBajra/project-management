import {
  CalendarArrowDown,
  CalendarDays,
  TriangleAlert,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { ProjectStats } from "@/types/ProjectStats"

export default function OverviewHeader({
  stat,
  loading,
}: {
  stat: ProjectStats | null
  loading: boolean
}) {
  return (
    <div className="space-y-4">
      {stat?.days_left != null &&
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
            {loading ? (
              <Spinner data-icon="inline-start" />
            ) : stat?.current_period ? (
              <div className="flex items-center gap-2">
                <CalendarArrowDown />
                <p>Current Period: {stat.current_period.name}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No active period</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div>
              {loading ? (
                <Spinner data-icon="inline-start" />
              ) : stat?.days_left != null ? (
                <div className="flex items-center gap-2">
                  <CalendarDays />
                  Days remaining: {stat.days_left} days
                </div>
              ) : (
                <span className="text-muted-foreground">No active period</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            {loading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <div className="flex items-center gap-2">
                <User />
                <p>Total Users: {stat?.total_users}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
