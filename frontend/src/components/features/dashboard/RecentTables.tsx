import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardKpiData } from "@/types/DashboardData"

export default function RecentTables({
  data,
}: {
  data: DashboardKpiData | null
}) {
  if (!data) return null

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {data.recent_projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.code}
                    </p>
                  </div>
                  <Badge
                    variant={project.is_active ? "default" : "secondary"}
                  >
                    {project.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {data.recent_expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {expense.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.project?.name ?? "N/A"}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    रु{Number(expense.total).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_approvals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending approvals
            </p>
          ) : (
            <div className="space-y-3">
              {data.recent_approvals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {approval.approvable_type?.split("\\").pop() ??
                        "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {approval.current_status?.name ?? "Pending"}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {approval.current_step?.name ?? "—"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
