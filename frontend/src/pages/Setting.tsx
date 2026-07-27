import { useEffect } from "react"
import { toast } from "sonner"
import { Settings2 } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import AutoApproveConfirm from "@/components/features/approvals/AutoApproveConfirm"
import ProfileSection from "@/components/features/settings/ProfileSection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { ApprovalStep } from "@/types/Approval/ApprovalStep"

export default function Settings() {
  const { user } = useAuth()
  const roleId = Number(user?.role_id)
  const queryClient = useQueryClient()

  const { data: workflows = [], error } = useQuery({
    queryKey: ["workflows", roleId],
    queryFn: async () => {
      const response = await api.get(`/api/approvals/steps/${roleId}`)
      return response.data.data as ApprovalStep[]
    },
    enabled: !!roleId && !Number.isNaN(roleId),
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const handleUpdated = (stepId: number, auto: boolean) => {
    queryClient.setQueryData<ApprovalStep[]>(["workflows", roleId], (prev = []) =>
      prev.map((w) => ({
        ...w,
        steps: w.steps.map((s) =>
          s.step_id === stepId ? { ...s, auto } : s
        ),
      }))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>
      <ProfileSection />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Approval Automation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AutoApproveConfirm workflows={workflows} onUpdated={handleUpdated} />
          </CardContent>
        </Card>
    </div>
  )
}
