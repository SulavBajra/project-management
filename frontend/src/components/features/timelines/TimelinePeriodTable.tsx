import { useMemo } from "react"
import { format } from "date-fns"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Timeline, TimelinePeriod } from "@/types/Timeline"
import { Spinner } from "@/components/ui/spinner"

const fmt = (date: string) => format(new Date(date), "MMM d, yyyy")

const monthRange = (start: string, end: string) => {
  const s = format(new Date(start), "MMM")
  const e = format(new Date(end), "MMM")
  return s === e ? s : `${s} – ${e}`
}

export default function TimelinePeriodTable({
  timelines,
  isLoading,
}: {
    timelines: Timeline[]
  isLoading: boolean
}) {
  const periods = timelines.flatMap((t) => t.periods)

  const columns: ColumnDef<TimelinePeriod>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <Badge variant="secondary">{row.original.name}</Badge>,
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => fmt(row.original.start_date),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => fmt(row.original.end_date),
    },
    {
      id: "month_range",
      header: "Month Range",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {monthRange(row.original.start_date, row.original.end_date)}
        </span>
      ),
    },
  ], [])

  const table = useReactTable({
    data: periods,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full py-8">
        <Spinner className="size-18" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
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
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              No periods yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
