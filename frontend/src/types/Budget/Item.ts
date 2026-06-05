export type BudgetTimelinePeriod = {
  id: number
  name: string
  start_date: string
  end_date: string
}

export type ItemAllocation = {
  id: number
  period_id: number
  period_name: string
  period_start: string
  period_end: string
  allocated_amount: string | null
}

export type BudgetPlanItem = {
  budget_plan_id: number
  id: number
  budget_head_id: number
  budget_head_name: string
  budget_head_code: string
  allocations: ItemAllocation[]
}
