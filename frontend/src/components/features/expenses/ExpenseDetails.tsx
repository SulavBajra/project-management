import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExpenseDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  code: string
  onCodeChange: (value: string) => void
  transactionDate: string
  onTransactionDateChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  isBalanced: boolean
}

export default function ExpenseDetails({
  open,
  onOpenChange,
  code,
  onCodeChange,
  transactionDate,
  onTransactionDateChange,
  description,
  onDescriptionChange,
  isBalanced,
}: ExpenseDetailsProps) {
  const canContinue = code.trim() !== "" && transactionDate !== "" && isBalanced

  const handleContinue = () => {
    if (canContinue) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enter expense details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-rows-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="e.g. EXP-001"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transaction_date">
              Transaction Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="transaction_date"
              type="date"
              value={transactionDate}
              onChange={(e) => onTransactionDateChange(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional note..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="h-13 min-h-0 resize-none"
            />
          </div>
        </div>
        {!isBalanced && (
          <p className="text-sm text-muted-foreground">
            Add balanced transactions before submitting.
          </p>
        )}
        <DialogFooter>
          <Button onClick={handleContinue} disabled={!canContinue} size="sm">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
