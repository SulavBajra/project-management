import { SquareKanban, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardData } from "@/types/DashboardData"

export default function DashboardHeader({
  data,
}: {
  data: DashboardData | null
}) {
  if (!data) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SquareKanban className="h-4 w-4" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>{data.projectCount}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>{data.totalUsers}</CardContent>
      </Card>
    </div>
  )
}
