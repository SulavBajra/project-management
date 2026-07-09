import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from "@/lib/axios"
import type { ApprovalStep } from "@/types/Approval/ApprovalStep"
import { Badge } from "@/components/ui/badge"

export default function AutoApproveConfirm({
  workflows,
  onUpdated,
}: {
  workflows: ApprovalStep[]
  onUpdated: (stepId: number, auto: boolean) => void
}) {
  // seed selection from current backend state (steps already auto === true)
  const initialSelected = new Set(
    workflows.flatMap((w) =>
      w.steps.filter((s) => s.auto).map((s) => s.step_id)
    )
  )
  const [selectedIds, setSelectedIds] = useState<Set<number>>(initialSelected)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const toggleStep = (stepId: number, value: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (value) next.add(stepId)
      else next.delete(stepId)
      return next
    })
  }

  const handleConfirm = async () => {
    // only send steps whose selection actually changed vs. current backend state
    const allSteps = workflows.flatMap((w) => w.steps)
    const changed = allSteps.filter(
      (step) => selectedIds.has(step.step_id) !== step.auto
    )

    if (changed.length === 0) {
      setOpen(false)
      return
    }

    setIsSubmitting(true)
    try {
      await Promise.all(
        changed.map((step) =>
          api.patch(`/api/approvals/steps/${step.step_id}`, {
            auto: selectedIds.has(step.step_id),
          })
        )
      )
      changed.forEach((step) =>
        onUpdated(step.step_id, selectedIds.has(step.step_id))
      )
      toast.success("Auto-approve settings updated")
      setOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to update auto-approve settings"
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Approval auto</Button>
      </DialogTrigger>
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle>Automate Approval</DialogTitle>
          <DialogDescription>
            Auto-approve requests reaching your review step, without manual
            review.
          </DialogDescription>
        </DialogHeader>

        {workflows.map((workflow) =>
          workflow.steps.map((step) => (
            <div
              key={step.step_id}
              className="flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-medium">{workflow.workflow_name}</p>
                <p className="text-xs text-muted-foreground">
                  {step.step_name}
                </p>
              </div>
              <Badge variant={step.auto ? "default" : "secondary"}>{step.auto ? "Active" : "Inactive"} </Badge>
              <Checkbox
                checked={selectedIds.has(step.step_id)}
                onCheckedChange={(value) =>
                  toggleStep(step.step_id, value === true)
                }
              />
            </div>
          ))
        )}

        <div className="flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
