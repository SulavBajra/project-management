import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Info,
  Play,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import type { ApprovalFlow, Step } from "@/types/ApprovalFlow"
import EditStatus from "./EditStatus"
import StatusBadge from "@/components/status-badge/StatusBadge"

function StepNode({
  step,
  index,
  total,
}: {
  step: Step
  index: number
  total: number
}) {
  const isLast = index === total - 1
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
            step.is_final
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : step.is_auto_approve
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                : "border-muted-foreground/30 bg-background text-muted-foreground"
          }`}
        >
          {step.is_final ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
        </div>
        {!isLast && (
          <div className="flex h-8 w-0.5 items-center justify-center bg-muted-foreground/20">
            <ArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className={`flex-1 ${isLast ? "" : "pb-8"} ml-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{step.name}</span>
          {step.is_final && (
            <Badge variant="default" className="text-[10px] leading-none">
              Final
            </Badge>
          )}
          {step.is_auto_approve && (
            <Badge
              variant="secondary"
              className="border-blue-300 text-[10px] leading-none dark:border-blue-700"
            >
              <Play className="mr-0.5 h-2.5 w-2.5" />
              Auto
            </Badge>
          )}
        </div>
        {step.role && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Role: {step.role.name}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ApprovalDisplay({
  approvals,
}: {
  approvals: ApprovalFlow[]
}) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (!approvals.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-muted-foreground">
          No approval flows found
        </p>
        <p className="text-sm text-muted-foreground/70">
          Create your first approval flow to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const isOpen = openId === approval.id
        const currentVersion = approval.current_version

        return (
          <Collapsible
            key={approval.id}
            open={isOpen}
            onOpenChange={(isOpen) => setOpenId(isOpen ? approval.id : null)}
          >
            <Card className="transition-all duration-200 hover:shadow-md">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer rounded-t-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {approval.name}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {approval.approvable_type}
                          </span>
                          {!approval.is_active && (
                            <Badge
                              variant="outline"
                              className="border-orange-300 text-[10px] text-orange-600 dark:border-orange-700 dark:text-orange-400"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <GitBranch className="h-3 w-3" />v{" "}
                        {currentVersion.version}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Separator />
                <CardContent className="space-y-6 pt-6">
                  {approval.description && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {approval.description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">
                          Approval Pipeline
                        </h4>
                        <Badge variant="outline" className="ml-auto">
                          {currentVersion.steps.length} steps
                        </Badge>
                      </div>
                      {currentVersion.steps.length > 0 ? (
                        <div className="rounded-lg border bg-background p-4">
                          {currentVersion.steps.map((step, index) => (
                            <StepNode
                              key={step.id}
                              step={step}
                              index={index}
                              total={currentVersion.steps.length}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg border px-4 py-8 text-center text-sm text-muted-foreground">
                          No steps defined
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">
                          Statuses
                        </h4>
                        <EditStatus
                          workflowId={approval.id}
                          versionId={currentVersion.id}
                          statuses={currentVersion.statuses}
                        />
                        <Badge variant="outline" className="ml-auto">
                          {currentVersion.statuses.length}
                        </Badge>
                      </div>
                      <div className="rounded-lg border bg-background">
                        {currentVersion.statuses.length > 0 ? (
                          <ul className="divide-y">
                            {currentVersion.statuses.map((status) => (
                              <li
                                key={status.id}
                                className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/30"
                              >
                                <StatusBadge
                                  status={status.name}
                                  final={status.name === "Approved"}
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No statuses defined
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  )
}
