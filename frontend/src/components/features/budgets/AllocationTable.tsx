import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { monthRange } from "@/lib/utils"
import type { BudgetPlanItem, ItemAllocation } from "@/types/Budget/Item"
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

  const columns: ColumnDef<BudgetPlanItem>[] = useMemo(() => [
    {
      id: "budget_head",
      header: "Budget Head",
      cell: ({ row }) => (
        <>
          <div className="font-medium">{row.original.budget_head_name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.budget_head_code}
          </div>
        </>
      ),
    },
    ...periods.map((p) => ({
      id: `period_${p.period_id}`,
      header: () => (
        <div className="text-center">
          <div className="font-medium">{p.period_name}</div>
          <div className="text-xs font-normal text-muted-foreground">
            {monthRange(p.period_start, p.period_end)}
          </div>
        </div>
      ),
      cell: ({ row }: { row: { original: BudgetPlanItem } }) => {
        const alloc = row.original.allocations.find(
          (a: ItemAllocation) => a.period_id === p.period_id
        )
        return alloc?.allocated_amount ? (
          <div className="text-center">
            {parseFloat(alloc.allocated_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">—</div>
        )
      },
    })),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <AllocateDialog
            periods={row.original.allocations}
            item={row.original}
            onSubmit={onUpdate}
          />
          <AllocationClear itemId={row.original.id} onClear={onClear} />
          <AllocationRemove itemId={row.original.id} onRemove={onRemove} />
        </>
      ),
    },
  ] as ColumnDef<BudgetPlanItem>[], [periods, onUpdate, onClear, onRemove])

  const table = useReactTable({
    data: plans ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="min-w-32">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
