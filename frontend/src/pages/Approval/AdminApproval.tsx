import { useMemo, useEffect, useCallback} from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import axios from "axios"
import { toast } from "sonner"
import ApprovalConfirm from "@/components/features/approvals/ApprovalConfirm"
import StatusBadge from "@/components/status-badge/StatusBadge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { ApprovalList } from "@/types/Approval/ApprovalList"

export default function AdminApproval() {
  const { user } = useAuth()
  const roleId = Number(user?.role_id)
  const queryClient = useQueryClient()

  const { data: approvals = [], isPending, error } = useQuery({
    queryKey: ["approvals", roleId],
    queryFn: async () => {
      const response = await api.get(`/api/approvals/${roleId}`)
      return response.data.data as ApprovalList[]
    },
    enabled: !!roleId
  })

  const nextMutation = useMutation({
    mutationFn: async ({ comment, approvalId }: { comment: string | null, approvalId: number }) => {
      const response = await api.post(`/api/approvals/${approvalId}`, { comment })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['approvals']})
      toast.success(data.message)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to advance")
      }
    }
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ comment, approvalId }: { comment: string | null, approvalId: number }) => {
      const response = await api.post(`/api/approvals/${approvalId}/reject`, { comment })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast.success(data.message)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to reject")
      }
    }
  })

  const handleNext = useCallback((comment: string | null, approvalId: number) => {
    nextMutation.mutate({ comment, approvalId })
  }, [nextMutation])

  const handleReject = useCallback((comment: string | null, approvalId: number) => {
    rejectMutation.mutate({ comment, approvalId })
  }, [rejectMutation])

  useEffect(() => {
    if(error) toast.error(error.message)
  },[error])

  const columns: ColumnDef<ApprovalList>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    { accessorKey: "approvable_type", header: "Approval Request" },
    { accessorKey: "project_name", header: "Project Name" },
    { accessorKey: "created_by", header: "Created By" },
    {
      accessorKey: "current_status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.current_status}
          final={row.original.is_final}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        row.original.current_status === "Approved"
          ? <Button disabled variant="ghost">Approval</Button>
          : <ApprovalConfirm
              approvalId={row.original.id}
              onAdvance={handleNext}
              onReject={handleReject}
            />
      ),
    },
  ], [handleNext, handleReject])

  const table = useReactTable({
    data: approvals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-15" />
      </div>
    )
  }

  return (
    <div>
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
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No pending approvals
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
