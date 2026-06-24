import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { CompareData } from "@/types/Chart/Overview"

export default function OverviewChart({ data }: { data: CompareData | null }) {
  if (!data) return null
  const totalBudgeted = data.periods.reduce((s, p) => s + p.budgeted, 0)
  const totalActual = data.periods.reduce((s, p) => s + p.actual, 0)
  const remaining = totalBudgeted - totalActual

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">Total budgeted</p>
          <p className="text-2xl font-medium">
            ${totalBudgeted.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">Total Expense</p>
          <p className="text-2xl font-medium">
            ${totalActual.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            {remaining < 0 ? "Over budget" : "Remaining"}
          </p>
          <p
            className={`text-2xl font-medium ${remaining < 0 ? "text-destructive" : "text-green-600"}`}
          >
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.periods} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) =>
              `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name,
            ]}
          />
          <Legend />
          <Bar
            dataKey="budgeted"
            name="Budgeted"
            fill="#378ADD"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            name="Expense"
            fill="#1D9E75"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
