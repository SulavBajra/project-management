import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import { Sprout } from "lucide-react"

export default function BudgetPlan({
  budgetHeads,
  projectId,
}: {
  budgetHeads: BudgetHead[]
  projectId: string
}) {
  const [name, setName] = useState("")
  const [selectedHeads, setSelectedHeads] = useState<number[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleHead = (id: number) => {
    setSelectedHeads((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!name || selectedHeads.length === 0) return
    const parsedProjectId = Number(projectId)
    try {
      setLoading(true)
      await api.post(`/api/projects/${parsedProjectId}/budget-plan`, {
        name,
        budget_head_ids: selectedHeads,
      })
      toast.success("Budget plan created successfully")
      setOpen(false)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sprout />
          Create Budget Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogTitle>Create Budget Plan</DialogTitle>
        <FieldSet>
          <Field>
            <FieldLabel>Plan Name</FieldLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HRM-budgets"
            />
          </Field>
          <Field>
            <FieldLabel>Budget Heads</FieldLabel>
            {selectedHeads.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {selectedHeads.map((id) => {
                  const head = budgetHeads.find((h) => h.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      {head?.name}
                    </Badge>
                  )
                })}
              </div>
            )}
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
              {budgetHeads.map((head) => (
                <div key={head.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`head-${head.id}`}
                    checked={selectedHeads.includes(head.id)}
                    onCheckedChange={() => toggleHead(head.id)}
                  />
                  <label
                    htmlFor={`head-${head.id}`}
                    className="cursor-pointer text-sm"
                  >
                    {head.name}
                    <span className="ml-1 text-muted-foreground">
                      ({head.code})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </Field>
          <Button
            onClick={handleSubmit}
            disabled={!name || selectedHeads.length === 0 || loading}
          >
            {loading ? "Creating..." : "Create Plan"}
          </Button>
        </FieldSet>
      </DialogContent>
    </Dialog>
  )
}
