import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AutoApproveConfirm from "@/components/features/approvals/AutoApproveConfirm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { ApprovalStep } from "@/types/Approval/ApprovalStep"

export default function Settings() {
  const {user} = useAuth()
  const [workflows, setWorkflows] = useState<ApprovalStep[]>([])
  const roleId = Number(user?.role_id)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await api.get(`/api/approvals/steps/${roleId}`)
        setWorkflows(response.data.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to fetch workflows"
          )
        }
      }
    }

    fetchWorkflows()
  }, [roleId])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <AutoApproveConfirm
            workflows={workflows}
            onUpdated={(stepId, auto) =>
              setWorkflows((prev) =>
                prev.map((w) => ({
                  ...w,
                  steps: w.steps.map((s) =>
                    s.step_id === stepId ? { ...s, auto } : s
                  ),
                }))
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
