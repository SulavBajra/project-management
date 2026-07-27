import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

type ImportStatus = {
  id: number
  status: "pending" | "processing" | "completed" | "failed"
  rows_processed: number
  rows_failed: number
  error_message: string | null
}

export function useImportStatus(importId: number | null) {
  return useQuery({
    queryKey: ["import-status", importId],
    queryFn: async () => {
      const response = await api.get<{ data: ImportStatus }>(
        `/api/expenses/import/${importId}/status`
      )
      return response.data.data
    },
    enabled: !!importId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === "completed" || status === "failed" ? false : 2000
    },
  })
}
