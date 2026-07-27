import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"

interface CreateProps {
  mode: "create"
  onSuccess: () => void
}

interface EditProps {
  mode: "edit"
  budgetHead: BudgetHead
  onSuccess: () => void
}

type Props = CreateProps | EditProps

export default function BudgetHeadDialog(props: Props) {
  const isEdit = props.mode === "edit"
  const initialName = isEdit ? props.budgetHead.name : ""
  const initialCode = isEdit ? props.budgetHead.code : ""

  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [code, setCode] = useState(initialCode)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await api.put(`/api/budget-heads/${props.budgetHead.id}`, { name, code })
        toast.success("Budget head updated")
      } else {
        await api.post("/api/budget-heads", { name, code })
        toast.success("Budget head created")
      }
      setOpen(false)
      props.onSuccess()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Operation failed")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          setName(initialName)
          setCode(initialCode)
        }
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
        ) : (
          <Button>
            <Plus />
            Create Budget
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-3xs">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Budget Head" : "Create Budget Head"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input
                  id="code"
                  autoComplete="off"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>

            <Field orientation="horizontal">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Save" : "Create"}
              </Button>
            </Field>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
