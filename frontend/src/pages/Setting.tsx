import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AutoApproveConfirm from "@/components/features/approvals/AutoApproveConfirm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApprovalFlow } from "@/types/ApprovalFlow"
import api from "@/lib/axios"

export default function Settings() {
  const [workflows, setWorkflows] = useState<ApprovalFlow[]>([])

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await api.get("/api/approval-flow")
        setWorkflows(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to fetch workflows"
          )
        }
      }
    }

    fetchWorkflows()
  }, [])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <AutoApproveConfirm workflows={workflows} />
        </CardContent>
      </Card>
    </div>
  )
}
