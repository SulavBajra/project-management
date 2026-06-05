import { useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { monthRange } from "@/lib/utils"
import type { BudgetPlanItem } from "@/types/Budget/Item"
import AllocateDialog from "./AllocateDialog"
import AllocationClear from "./AllocationClear"
import AllocationRemove from "./AllocationRemove"

export function AllocationTable({
  plans,
  onUpdate,
  onClear,
  onRemove,
}: {
  plans: BudgetPlanItem[] | null
  onUpdate: (itemId: number, amounts: Record<number, string>) => void
  onClear: (itemId: number) => void
  onRemove: (itemId: number) => void
}) {
  const periods = useMemo(() => plans?.[0]?.allocations ?? [], [plans])

  if (!plans || plans.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
        No budget plan items found.
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Budget Head</TableHead>
            {periods.map((p) => (
              <TableHead key={p.period_id} className="min-w-32 text-center">
                <div className="font-medium">{p.period_name}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {monthRange(p.period_start, p.period_end)}
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.budget_head_name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.budget_head_code}
                </div>
              </TableCell>
              {item.allocations.map((alloc) => (
                <TableCell key={alloc.period_id} className="text-center">
                  {alloc.allocated_amount ? (
                    parseFloat(alloc.allocated_amount).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              ))}
              <TableCell className="">
                <AllocateDialog
                  periods={item.allocations}
                  item={item}
                  onSubmit={onUpdate}
                />
                <AllocationClear itemId={item.id} onClear={onClear} />
                <AllocationRemove itemId={item.id} onRemove={onRemove} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
