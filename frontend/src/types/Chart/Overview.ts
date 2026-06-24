export type CompareData = {
  budget_plan_id: number
  periods: Period[]
}

export type Period = {
  id: number
  name: string
  label: string
  budgeted: number
  actual: number
}
