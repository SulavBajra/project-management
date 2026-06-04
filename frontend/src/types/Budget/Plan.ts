export type Plan = {
  id: number
  project_id: number
  name: string
  items: PlanItem[]
}

export type PlanItem = {
  id: number
  budget_plan_id: number
  budget_head_id: number
  budget_head_name: string
  budget_head_code: string
}
