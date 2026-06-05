import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { monthRange } from "@/lib/utils"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import type { ItemAllocation } from "@/types/Budget/Item"

export default function AddBudgetHead({
  loadBudgetHeads,
  heads,
  periods,
  onSubmit,
}: {
  loadBudgetHeads: () => void
  heads: BudgetHead[]
  periods: ItemAllocation[]
  onSubmit: (
    budgetHeadId: number,
    amounts: Record<number, string>
  ) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [selectedHeadId, setSelectedHeadId] = useState<string>("")
  const [amounts, setAmounts] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (periodId: number, value: string) => {
    setAmounts((prev) => ({ ...prev, [periodId]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedHeadId) return
    setLoading(true)
    try {
      await onSubmit(Number(selectedHeadId), amounts)
      setOpen(false)
      setSelectedHeadId("")
      setAmounts({})
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={loadBudgetHeads}>
          Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogTitle>Add Budget Head</DialogTitle>
        <DialogDescription>
          Add budget head and allocate budget for quarterly
        </DialogDescription>
        <Separator />
        <FieldSet>
          <Field>
            <FieldLabel>Budget Heads</FieldLabel>
            <Select value={selectedHeadId} onValueChange={setSelectedHeadId}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a budget head" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Budget Heads</SelectLabel>
                  {heads.map((head) => (
                    <SelectItem key={head.id} value={String(head.id)}>
                      {head.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <FieldSeparator />
          {periods.map((p) => (
            <Field key={p.period_id}>
              <FieldLabel>
                {p.period_name} — {monthRange(p.period_start, p.period_end)}
              </FieldLabel>
              <Input
                type="number"
                min="0"
                value={amounts[p.period_id] ?? ""}
                onChange={(e) => handleChange(p.period_id, e.target.value)}
                placeholder="0.00"
              />
            </Field>
          ))}
        </FieldSet>
        <Button
          type="button"
          disabled={!selectedHeadId || loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Allocations"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
