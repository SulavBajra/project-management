import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BudgetForm from "@/components/features/budgets/BudgetForm"
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
import type { BudgetFormData } from "@/types/Budget/BudgetFormData"
import type { BudgetHead } from "@/types/Budget/BudgetHead"

export default function Budget() {
  const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("api/budget-heads")
        setBudgetHeads(response.data.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || "An error occurred")
        }
      }
    }
    fetchData()
  }, [])

  const createBudget = async (data: BudgetFormData) => {
    await api.post("api/budget-heads", data)
    toast.success("Budget created successfully")
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Manage Budget</CardTitle>
          <CardDescription>
            <p>Create, edit, and track your budget</p>
          </CardDescription>
        </div>
        <div>
          <BudgetForm onSubmit={createBudget} />
        </div>
      </CardHeader>
      <CardContent>
        <BudgetStats />
        <BudgetTable budgetHeads={budgetHeads} />
      </CardContent>
    </Card>
  )
}
