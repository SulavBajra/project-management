import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import ApprovalCreateForm from "@/components/features/approvals/ApprovalCreateForm"
import ApprovalDisplay from "@/components/features/approvals/ApprovalDisplay"
import { ApprovalStats } from "@/components/features/approvals/ApprovalStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { ApprovalFlow } from "@/types/ApprovalFlow"

export default function Approval() {
  const queryClient = useQueryClient()

  const { data: approvalFlows = [], isPending, error } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      const response = await api.get<ApprovalFlow[]>("/api/approval-flow")
      return response.data as ApprovalFlow[]
    }
  })

  useEffect(() => {
    if(error) toast.error(error.message)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approval Flows</h1>
          <p className="text-sm text-muted-foreground">
            Manage approval workflows and their steps
          </p>
        </div>
        <ApprovalCreateForm />
      </div>

      {error ? (
        <p className="text-sm text-destructive">Failed to load approvals.</p>
      ) : isPending ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-6">
          <ApprovalStats flows={approvalFlows} />
          <ApprovalDisplay approvals={approvalFlows} />
        </div>
      )}
    </div>
  )
}
