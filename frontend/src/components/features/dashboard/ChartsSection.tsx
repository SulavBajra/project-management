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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseTrendChart from "./ExpenseTrendChart"
import type { DashboardChartData } from "@/types/DashboardData"

export default function ChartsSection({
  data,
}: {
  data: DashboardChartData | null
}) {
  if (!data) return null

  const { budget_vs_actual, monthly_expense_trend, project_comparisons } = data
  const variancePct = budget_vs_actual.variance_percentage
  const isOverBudget = budget_vs_actual.actual > budget_vs_actual.budgeted

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget vs Actual per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={project_comparisons}
                  barCategoryGap="20%"
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="project_name"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      `रु${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `रु${value.toLocaleString()}`,
                      name === "budgeted" ? "Budgeted" : "Actual",
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
                    name="Actual"
                    fill="#1D9E75"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Total Budgeted</p>
              <p className="text-xl font-bold">
                रु{budget_vs_actual.budgeted.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold">
                रु{budget_vs_actual.actual.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Variance</p>
              <p
                className={`text-xl font-bold ${isOverBudget ? "text-destructive" : "text-green-600"}`}
              >
                {isOverBudget ? "-" : "+"}
                रु{Math.abs(budget_vs_actual.variance).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                Variance %
              </p>
              <p
                className={`text-xl font-bold ${isOverBudget ? "text-destructive" : "text-green-600"}`}
              >
                {isOverBudget ? "-" : "+"}
                {Math.abs(variancePct)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Trend (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTrendChart data={monthly_expense_trend} />
        </CardContent>
      </Card>
    </div>
  )
}
