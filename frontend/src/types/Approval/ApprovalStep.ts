export type ApprovalStep = {
  id: number
  approval_workflow_id: number
  version: number
  steps: Step[]
  workflow_name: string
}

export type Step = {
  step_id: number
  step_name: string
  version_id: number
  auto: boolean
}
