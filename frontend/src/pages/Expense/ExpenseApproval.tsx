import { ArrowRightCircle } from "lucide-react"
import ApprovalConfirm from "@/components/features/approvals/ApprovalConfirm"
import StatusBadge from "@/components/status-badge/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ExpenseStatus } from "@/types/Expenses/ExpenseStatus"
import type { ExpenseData } from "@/types/Expenses/Expense"

export default function ExpenseApproval({
  expenses,
  onAdvance,
  onReject,
}: {
  expenses: ExpenseStatus[]
  onAdvance: (comment: string | null, approvalId: number) => void
  onReject: (comment: string | null, approvalId: number) => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightCircle /> View Approval
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogHeader>
          <DialogTitle>Approval Requests</DialogTitle>
          <DialogDescription>
            Approval Request for all the expenses
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="mb-4 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                {" "}
                <div className="flex flex-col gap-2">
                  {" "}
                  <h3 className="font-medium">{expense.code}</h3>
                  <StatusBadge
                    status={expense.approval_status ?? "Unchecked"}
                    final={expense.approval_step}
                  ></StatusBadge>
                </div>
                <ApprovalConfirm
                  approvalId={expense.approval_id}
                  onAdvance={onAdvance}
                  onReject={onReject}
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
