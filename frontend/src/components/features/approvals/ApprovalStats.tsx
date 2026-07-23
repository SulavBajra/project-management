import { GitBranch, ListChecks, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ApprovalFlow } from "@/types/ApprovalFlow"

export function ApprovalStats({
  flows,
}: {
  flows: ApprovalFlow[]
}) {
  const totalSteps = flows.reduce(
    (sum, f) => sum + (f.current_version?.steps?.length ?? 0),
    0,
  )
  const autoSteps = flows.reduce(
    (sum, f) =>
      sum + (f.current_version?.steps?.filter((s) => s.is_auto_approve).length ?? 0),
    0,
  )

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{flows.length}</p>
            <p className="text-xs text-muted-foreground">Total Flows</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
            <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalSteps}</p>
            <p className="text-xs text-muted-foreground">Total Steps</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{autoSteps}</p>
            <p className="text-xs text-muted-foreground">Auto-Approvals</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
