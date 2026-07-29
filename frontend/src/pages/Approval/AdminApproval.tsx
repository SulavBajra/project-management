import { useMemo, useEffect, useCallback} from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef} from "@tanstack/react-table"
import axios from "axios"
import { toast } from "sonner"
import ApprovalConfirm from "@/components/features/approvals/ApprovalConfirm"
import StatusBadge from "@/components/status-badge/StatusBadge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { ApprovalList } from "@/types/Approval/ApprovalList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApprovalHistory from "./ApprovalHistory"
import { DataTable, SortableHeader } from "@/types/Expenses/data-table"
import { ClipboardClock,  RotateCcw } from "lucide-react"

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
    {
      accessorKey: "approvable_type",
      header: ({ column }) => <SortableHeader column={column} title="Approval Request" />,
      cell: ({ row }) => (<span>{ row.original.approvable_type}</span>)
    },
    {
      accessorKey: "project_name",
      header: ({ column }) => <SortableHeader column={column} title="Project Name" />,
      cell: ({ row }) => (<span>{row.original.project_name}</span>)
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => <SortableHeader column={column} title="Created By" />,
      cell: ({row}) => (<span>{row.original.created_by}</span>)
    },
    {
      accessorKey: "current_status",
      header: ({column}) => <SortableHeader column={column} title="Status"/>,
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

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-15" />
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="pending">
        <TabsList variant="line" className="pb-3">
          <TabsTrigger value="pending" className="pb-2">
            <ClipboardClock/>
            Pending
          </TabsTrigger>
          <TabsTrigger value="history" className="pb-2">
            <RotateCcw/>
            History
          </TabsTrigger>
       </TabsList>
        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={approvals}
            searchPlaceholder="Approval Name"
          />
       </TabsContent>
        <TabsContent value="history">
          <ApprovalHistory/>
       </TabsContent>
      </Tabs>
    </div>
  )
}
