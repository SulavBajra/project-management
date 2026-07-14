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
    <Card>
      <CardHeader>
        <CardTitle>Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">Failed to load approvals.</p>
        ) : isPending ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4">
            <ApprovalStats />
            <ApprovalCreateForm />
            <ApprovalDisplay approvals={approvalFlows} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
