import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from "@/lib/axios"
import type { GlobalBudgetVsActual } from "@/types/Report/BudgetVsActual"

export default function GlobalBudgetVsActual() {
  const navigate = useNavigate()
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", "budget-vs-actual", "global"],
    queryFn: async () => {
      const response = await api.get<GlobalBudgetVsActual>(
        "/api/reports/budget-vs-actual"
      )
      return response.data
    },
  })

  const columns = useMemo<ColumnDef<GlobalBudgetVsActual["projects"][number]>[]>(
    () => [
      {
        accessorKey: "project_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Project
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span
            className="cursor-pointer font-medium hover:underline"
            onClick={() =>
              navigate(`/projects/${row.original.project_id}/reports/budget-vs-actual`)
            }
          >
            {row.original.project_name}
          </span>
        ),
      },
      {
        accessorKey: "budgeted",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Budgeted
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => `रु${row.original.budgeted.toLocaleString()}`,
      },
      {
        accessorKey: "actual",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Actual
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => `रु${row.original.actual.toLocaleString()}`,
      },
      {
        accessorKey: "variance",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Variance
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.variance
          return (
            <span className={val < 0 ? "text-destructive" : "text-green-600"}>
              {val > 0 ? "+" : ""}रु{val.toLocaleString()}
            </span>
          )
        },
      },
      {
        accessorKey: "variance_percentage",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Variance %
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.variance_percentage
          return (
            <span className={val < 0 ? "text-destructive" : "text-green-600"}>
              {val > 0 ? "+" : ""}{val}%
            </span>
          )
        },
      },
    ],
    [navigate]
  )

  const projects = report?.projects ?? []

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error: {(error as Error).message}
      </div>
    )
  }

  if (!report || projects.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        No project budget data available.
      </div>
    )
  }

  const totalBudgeted = projects.reduce((s, p) => s + p.budgeted, 0)
  const totalActual = projects.reduce((s, p) => s + p.actual, 0)
  const totalVariance = totalBudgeted - totalActual
  const totalVariancePercentage =
    totalBudgeted > 0
      ? Number(((totalVariance / totalBudgeted) * 100).toFixed(2))
      : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">
          Budget vs Actual — All Projects (YTD)
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-medium">
            रु{totalBudgeted.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-medium">
            रु{totalActual.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Variance
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-medium ${totalVariance < 0 ? "text-destructive" : "text-green-600"}`}
          >
            {totalVariance > 0 ? "+" : ""}रु{totalVariance.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Variance %
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-medium ${totalVariancePercentage < 0 ? "text-destructive" : "text-green-600"}`}
          >
            {totalVariancePercentage > 0 ? "+" : ""}{totalVariancePercentage}%
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search projects..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        navigate(
                          `/projects/${row.original.project_id}/reports/budget-vs-actual`
                        )
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
