import {
  FolderKanban,
  SquareKanban,
  User,
  Clock,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ListChecks,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardKpiData } from "@/types/DashboardData"

const statCards = [
  {
    key: "total_projects" as const,
    title: "Total Projects",
    icon: FolderKanban,
    color: "text-blue-600",
  },
  {
    key: "active_projects" as const,
    title: "Active Projects",
    icon: SquareKanban,
    color: "text-green-600",
  },
  {
    key: "total_users" as const,
    title: "Total Users",
    icon: User,
    color: "text-violet-600",
  },
  {
    key: "pending_approvals" as const,
    title: "Pending Approvals",
    icon: ListChecks,
    color: "text-amber-600",
  },
  {
    key: "total_budgeted" as const,
    title: "Total Budgeted",
    icon: Wallet,
    color: "text-emerald-600",
    format: true,
  },
  {
    key: "total_expenses" as const,
    title: "Total Expenses",
    icon: TrendingUp,
    color: "text-rose-600",
    format: true,
  },
  {
    key: "budget_utilization_percentage" as const,
    title: "Budget Utilization",
    icon: AlertTriangle,
    color: "text-indigo-600",
    suffix: "%",
  },
  {
    key: "active_timelines" as const,
    title: "Active Timelines",
    icon: Clock,
    color: "text-cyan-600",
  },
]

export default function DashboardHeader({
  data,
}: {
  data: DashboardKpiData | null
}) {
  if (!data) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = data[card.key]
        const displayValue =
          typeof value === "number" && card.format
            ? "रु" + value.toLocaleString()
            : typeof value === "number" && card.suffix
              ? value + card.suffix
              : String(value ?? 0)

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{displayValue}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
