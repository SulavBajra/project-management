import { Banknote, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function BudgetStats({
  totalHeads,
}: {
  totalHeads: number
}) {
  const stats = [
    {
      label: "Total Budget Heads",
      value: totalHeads,
      icon: Banknote,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Active Budgets",
      value: totalHeads,
      icon: Wallet,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Allocations",
      value: "—",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-950",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
