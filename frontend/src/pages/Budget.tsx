import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BudgetStats from "@/components/features/budgets/BudgetStats"
import BudgetTable from "@/components/features/budgets/BudgetTable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/BudgetHead"

export default function Budget() {
  const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("api/budget-heads")
        console.log(response.data.data)
        setBudgetHeads(response.data.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || "An error occurred")
        }
      }
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Budget</CardTitle>
        <CardDescription>
          <p>Create, edit, and track your budget</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BudgetStats />
        <BudgetTable budgetHeads={budgetHeads} />
      </CardContent>
    </Card>
  )
}
