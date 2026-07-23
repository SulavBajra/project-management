export type ApprovalFlow = {
  id: number
  name: string
  description: string
  approvable_type: string
  is_active: boolean
  current_version: ApprovalFlowVersion
}

export type ApprovalFlowVersion = {
  id: number
  version: number
  is_current: boolean
  statuses: Status[]
  steps: Step[]
}

export type Status = {
  id: number
  name: string
}

export type StepRole = {
  id: number
  name: string
}

export type Step = {
  id: number
  name: string
  order_no: number
  is_final: boolean
  is_auto_approve: boolean
  role: StepRole | null
}
