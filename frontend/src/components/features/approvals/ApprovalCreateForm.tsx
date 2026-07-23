import { Plus } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/axios"

const APPROVABLE_TYPES = [
  { value: "expense", label: "Expense" },
  { value: "budget", label: "Budget" },
]

export default function ApprovalCreateForm() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [approvableType, setApprovableType] = useState("")

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/approval-flow", {
        name,
        approvable_type: approvableType,
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      toast.success(data.message ?? "Flow created successfully")
      setOpen(false)
      setName("")
      setApprovableType("")
    },
    onError: (error) => {
      toast.error("Failed to create flow")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !approvableType) return
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Create Approval Flow</FieldLegend>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="approval_name">
                Approval Flow Name
              </FieldLabel>
              <Input
                type="text"
                id="approval_name"
                placeholder="e.g. Expense Approval"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="approvable_type">Type</FieldLabel>
              <Select value={approvableType} onValueChange={setApprovableType} required>
                <SelectTrigger id="approvable_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {APPROVABLE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
