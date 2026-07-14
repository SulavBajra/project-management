import axios from "axios"
import { format } from "date-fns"
import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
  Field, FieldDescription, FieldLabel, FieldLegend, FieldSeparator, FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { Employee } from "@/types/User"
import TimelinePopOver from "../timelines/TimelinePopOver"
import AddUserModal from "../users/AddUserModal"

const schema = z.object({
  name: z.string().min(1, "Project name is required"),
  code: z.string().min(1, "Project code is required"),
  description: z.string().optional(),
  timeline: z.date({ required_error: "Please select a timeline" }),
  selectedEmployees: z.array(z.custom<Employee>()).min(1, "Select at least one employee"),
})

type FormValues = z.infer<typeof schema>

export default function CreateProjectForm({ onSubmit }: { onSubmit?: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", description: "", selectedEmployees: [] },
  })

  const { data: employees = [], isPending, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get<Employee[]>("api/users/employee")
      return response.data
    },
  })

  const projectMutate = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await api.post("api/projects", {
        name: values.name,
        code: values.code,
        description: values.description,
        is_active: true,
        start_date: format(values.timeline, "yyyy-MM-dd"),
        user_ids: values.selectedEmployees.map((e) => e.id),
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      form.reset()
      onSubmit?.()
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Failed to create project")
      }
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    projectMutate.mutate(values)
  })

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Create a Project</FieldLegend>
        <FieldDescription>Start a new project from here.</FieldDescription>
        <FieldSeparator />
        <Field>
          <FieldLabel>Project Name</FieldLabel>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}

          <FieldLabel>Project Code</FieldLabel>
          <Input {...form.register("code")} />
          {form.formState.errors.code && (
            <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
          )}

          <FieldLabel>Project Description</FieldLabel>
          <Textarea {...form.register("description")} />

          <FieldLabel>Select Timeline</FieldLabel>
          <Controller
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <TimelinePopOver onDateSelect={(date) => field.onChange(date)} />
            )}
          />
          {form.formState.errors.timeline && (
            <p className="text-sm text-destructive">{form.formState.errors.timeline.message}</p>
          )}

          <FieldLabel>Select employees for this project</FieldLabel>
          {isPending ? (
            <Spinner className="size-8" />
          ) : (
            <Controller
              control={form.control}
              name="selectedEmployees"
              render={({ field }) => (
                <AddUserModal
                  employees={employees}
                  selected={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          {form.formState.errors.selectedEmployees && (
            <p className="text-sm text-destructive">
              {form.formState.errors.selectedEmployees.message}
            </p>
          )}
        </Field>

        <Button type="submit" disabled={projectMutate.isPending}>
          {projectMutate.isPending ? "Creating..." : "Create Project"}
        </Button>
      </FieldSet>
    </form>
  )
}
