import { useState } from "react"
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
import type { ApprovalFlow } from "@/types/ApprovalFlow"

export default function AutoApproveConfirm({
  workflows,
}: {
  workflows: ApprovalFlow[]
}) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleWorkflow = (id: number, value: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (value) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      // e.g. await api.post("/approvals/auto-approve", { workflowIds: Array.from(selectedIds) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Approval auto</Button>
      </DialogTrigger>
      <DialogContent className="w-1/4">
        <DialogHeader>
          <DialogTitle>Automate Approval</DialogTitle>
          <DialogDescription>
            Auto approve the approval requested to you.
          </DialogDescription>
        </DialogHeader>

        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="flex items-center justify-between gap-3"
          >
            <p>{workflow.name}</p>
            <Checkbox
              checked={selectedIds.has(workflow.id)}
              onCheckedChange={(value) =>
                toggleWorkflow(workflow.id, value === true)
              }
            />
          </div>
        ))}

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
