import axios from "axios"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import type { Employee } from "@/types/User"
import TimelinePopOver from "../timelines/TimelinePopOver"
import AddUserModal from "../users/AddUserModal"
import { useNavigate } from "react-router-dom"
import BudgetPlan from "../budgets/BudgetPlan"

export default function CreateProjectForm({
  onSubmit,
}: {
  onSubmit?: () => void
}) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [timeline, setTimeline] = useState<Date>()
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await api.get<Employee[]>("api/users/employee")
        setEmployees(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Failed to load employees"
          )
        }
      }
    }
    fetchEmployees()
  }, [])

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!timeline) {
      toast.error("Please select a timeline")
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post("api/projects", {
        name,
        code,
        description,
        is_active: true,
        start_date: format(timeline, "yyyy-MM-dd"),
        user_ids: selectedEmployees.map((e) => e.id),
      })
      toast.success(response.data.message)
      setName("")
      setCode("")
      setDescription("")
      setTimeline(undefined)
      setSelectedEmployees([])
      onSubmit?.()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to create project")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={createProject}>
      <FieldSet>
        <FieldLegend>Create a Project</FieldLegend>
        <FieldDescription>Start a new project from here.</FieldDescription>
        <FieldSeparator />
        <Field>
          <FieldLabel>Project Name</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FieldLabel>Project Code</FieldLabel>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <FieldLabel>Project Description</FieldLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FieldLabel>Select Timeline</FieldLabel>
          <TimelinePopOver onDateSelect={(date) => setTimeline(date)} />
          <FieldLabel>Select employees for this project</FieldLabel>
          <AddUserModal
            employees={employees}
            selected={selectedEmployees}
            onChange={setSelectedEmployees}
          />
        </Field>
        <BudgetPlan/>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Project"}
        </Button>
      </FieldSet>
    </form>
  )
}
