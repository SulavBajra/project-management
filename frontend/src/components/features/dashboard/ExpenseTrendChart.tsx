import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { MonthlyTrend } from "@/types/DashboardData"

export default function ExpenseTrendChart({
  data,
}: {
  data: MonthlyTrend[]
}) {
  if (!data.length) return null

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => {
              const [, m] = v.split("-")
              const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ]
              return months[parseInt(m, 10) - 1] || v
            }}
          />
          <YAxis
            tickFormatter={(v) =>
              `रु${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [
              `रु${value.toLocaleString()}`,
              "Expense",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            name="Monthly Expense"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
