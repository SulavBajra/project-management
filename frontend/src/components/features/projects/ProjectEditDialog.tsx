import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ProjectResponse } from "@/types/Project"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldError } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function ProjectEditDialog({ data }: { data: ProjectResponse }) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      description: data.description,
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const response = await api.put(`/api/projects/${data.id}`, values)
      return response.data
    },
    onSuccess: () => {
      toast.success("Project updated")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to update project")
      }
    },
  })

  const onSubmit = (values: ProjectFormValues) => {
    updateMutation.mutate(values)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogHeader>Edit Project Details</DialogHeader>
        <form id="project-edit-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
            <Field>
              <Label htmlFor="code">Code</Label>
              <Input id="code" type="text" {...register("code")} />
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="project-edit-form" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
