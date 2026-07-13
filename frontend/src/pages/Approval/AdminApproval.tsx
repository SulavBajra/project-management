import axios from "axios"
import { useCallback, useEffect, useState } from "react"
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
  const [loading, setLoading] = useState(true)
  const [approvals, setApprovals] = useState<ApprovalList[]>([])
  const roleId = Number(user?.role_id)

  const fetchApprovals = useCallback(async () => {
    if (!roleId) return
    try {
      const response = await api.get(`/api/approvals/${roleId}`)
      setApprovals(response.data.data)
      setLoading(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load approvals")
      }
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  const handleNext = async (comment: string | null, approvalId: number) => {
    try {
      const response = await api.post(`/api/approvals/${approvalId}`, {
        comment,
      })
      toast.success(response.data.message)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to advance")
      }
    }
  }

  const handleReject = async (comment: string | null, approvalId: number) => {
    try {
      const response = await api.post(`/api/approvals/${approvalId}/reject`, {
        comment,
      })
      toast.success(response.data.message)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to advance")
      }
    }
  }

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
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Spinner className="size-6" />
              </TableCell>
            </TableRow>
          ) : approvals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
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
                      approvalId={approval.approvable_id}
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
