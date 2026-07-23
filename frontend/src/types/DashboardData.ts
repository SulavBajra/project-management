export type RecentProject = {
  id: number
  code: string
  name: string
  is_active: boolean
  created_at: string
}

export type RecentExpense = {
  id: number
  code: string
  description: string
  total: number
  transaction_date: string
  project_id: number
  project: { id: number; code: string; name: string } | null
}

export type RecentApproval = {
  id: number
  approvable_type: string
  created_at: string
  current_step: { id: number; name: string } | null
  current_status: { id: number; name: string } | null
  approvable: Record<string, unknown> | null
}

export type DashboardKpiData = {
  total_projects: number
  active_projects: number
  total_users: number
  pending_approvals: number
  total_budgeted: number
  total_expenses: number
  budget_utilization_percentage: number
  active_timelines: number
  overdue_projects: number
  recent_projects: RecentProject[]
  recent_expenses: RecentExpense[]
  recent_approvals: RecentApproval[]
}

export type MonthlyTrend = {
  month: string
  amount: number
}

export type ProjectComparison = {
  project_id: number
  project_name: string
  budgeted: number
  actual: number
}

export type DashboardChartData = {
  budget_vs_actual: {
    budgeted: number
    actual: number
    variance: number
    variance_percentage: number
  }
  monthly_expense_trend: MonthlyTrend[]
  project_comparisons: ProjectComparison[]
}
