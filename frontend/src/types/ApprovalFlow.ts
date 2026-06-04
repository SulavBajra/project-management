export type ApprovalFlow = {
  id: number
  name: string
  description: string
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

export type Step = {
  id: number
  name: string
}
