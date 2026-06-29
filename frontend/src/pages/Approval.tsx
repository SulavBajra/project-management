import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ApprovalCreateForm from "@/components/features/approvals/ApprovalCreateForm"
import ApprovalDisplay from "@/components/features/approvals/ApprovalDisplay"
import { ApprovalStats } from "@/components/features/approvals/ApprovalStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/axios"
import type { ApprovalFlow } from "@/types/ApprovalFlow"

export default function Approval() {
  const [approvalFlows, setApprovalFlows] = useState<ApprovalFlow[]>([])

  useEffect(() => {
    const fetchApprovalFlows = async () => {
      try {
        const response = await api.get<ApprovalFlow[]>("/api/approval-flow")
        setApprovalFlows(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message)
        }
      }
    }
    fetchApprovalFlows()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <ApprovalStats />
          <ApprovalCreateForm />
          <ApprovalDisplay approvals={approvalFlows} />
        </div>
      </CardContent>
    </Card>
  )
}
