export type BudgetVsActualHead = {
  head_id: number | null
  head_name: string
  head_code: string | null
  budgeted: number
  actual: number
  variance: number
  variance_percentage: number
}

export type PeriodInfo = {
  id: number
  name: string
  start_date: string
  end_date: string
}

export type BudgetVsActualReport = {
  project: {
    id: number
    name: string
  }
  totals: {
    budgeted: number
    actual: number
    variance: number
    variance_percentage: number
  }
  heads: BudgetVsActualHead[]
  available_periods: PeriodInfo[]
  selected_period_ids: number[]
}

export type GlobalBudgetVsActual = {
  projects: {
    project_id: number
    project_name: string
    budgeted: number
    actual: number
    variance: number
    variance_percentage: number
  }[]
}
