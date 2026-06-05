import { BadgePlus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { monthRange } from "@/lib/utils"
import type { BudgetPlanItem, ItemAllocation } from "@/types/Budget/Item"

export default function AllocateDialog({
  periods,
  item,
  onSubmit,
}: {
  periods: ItemAllocation[]
  item: BudgetPlanItem
  onSubmit: (itemId: number, amounts: Record<number, string>) => void
}) {
  const [amounts, setAmounts] = useState<Record<number, string>>({})
  const [open, setOpen] = useState(false)

  const handleChange = (periodId: number, value: string) => {
    setAmounts((prev) => ({ ...prev, [periodId]: value }))
  }

  const handleSubmit = () => {
    onSubmit(item.id, amounts)
    setOpen(false)
    setAmounts({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <BadgePlus className="h-4 w-4 text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/6">
        <DialogHeader>
          <DialogTitle>{item.budget_head_name}</DialogTitle>
          <DialogDescription>
            Allocate budget for each quarter
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          {periods.map((p) => (
            <Field key={p.period_id}>
              <FieldLabel>
                {p.period_name} — {monthRange(p.period_start, p.period_end)}
              </FieldLabel>
              <Input
                type="number"
                min="0"
                value={amounts[p.period_id] ?? p.allocated_amount ?? ""}
                onChange={(e) => handleChange(p.period_id, e.target.value)}
                placeholder="0.00"
              />
            </Field>
          ))}
          <Button onClick={handleSubmit}>Save Allocations</Button>
        </FieldSet>
      </DialogContent>
    </Dialog>
  )
}
