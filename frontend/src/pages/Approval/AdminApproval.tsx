import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {  useEffect  } from "react"
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

  const handleNext = (comment: string | null, approvalId: number) => {
    nextMutation.mutate({ comment, approvalId })
  }

  const handleReject = async (comment: string | null, approvalId: number) => {
    rejectMutation.mutate({comment, approvalId})
  }

  useEffect(() => {
    if(error) toast.error(error.message)
  },[error])

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>Approval Request</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Spinner className="size-15" />
              </TableCell>
            </TableRow>
          ) : approvals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No pending approvals
              </TableCell>
            </TableRow>
          ) : (
            approvals.map((approval, index) => (
              <TableRow key={approval.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{approval.approvable_type}</TableCell>
                <TableCell>{approval.project_name}</TableCell>
                <TableCell>{approval.created_by}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={approval.current_status}
                    final={approval.is_final}
                  />
                </TableCell>
                <TableCell>
                  {approval.current_status === "Approved" ? <Button disabled={true} variant="ghost">Approval</Button> :
                    <ApprovalConfirm
                      approvalId={approval.id}
                      onAdvance={handleNext}
                      onReject={handleReject}
                    />}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
