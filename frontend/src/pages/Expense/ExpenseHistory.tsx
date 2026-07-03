import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import api from "@/lib/axios"

export default function ExpenseHistory() {
  const { projectId } = useParams()
  const [history, setHistory] = useState([])

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get(`/api/expenses/${projectId}/history`)
        setHistory(response.data.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message)
        }
      }
    }

    fetchHistory()
  }, [projectId])

  return <div></div>
}
