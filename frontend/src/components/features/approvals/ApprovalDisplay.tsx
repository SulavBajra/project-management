import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Info,
  ListChecks,
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
import type { ApprovalFlow } from "@/types/ApprovalFlow"
import EditStatus from "./EditStatus"

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
                        {!isOpen && approval.description && (
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {approval.description}
                          </p>
                        )}
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
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {approval.description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold">Statuses</h4>
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
                                className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted/30"
                              >
                                <div className="h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                                <span>{status.name}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                            No statuses defined
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold">Steps</h4>
                        <Badge variant="outline" className="ml-auto">
                          {currentVersion.steps.length}
                        </Badge>
                      </div>
                      <div className="rounded-lg border bg-background">
                        {currentVersion.steps.length > 0 ? (
                          <ol className="divide-y">
                            {currentVersion.steps.map((step, index) => (
                              <li
                                key={step.id}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/30"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                  {index + 1}
                                </span>
                                <span>{step.name}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                            No steps defined
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
