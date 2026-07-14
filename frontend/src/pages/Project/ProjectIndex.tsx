import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import CreateProjectForm from "@/components/features/projects/CreateProjectForm"
import ProjectTable from "@/components/features/projects/ProjectTable"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { Meta } from "@/types/Meta"
import type { ProjectResponse } from "@/types/Project"

export default function ProjectIndex() {
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data, isPending, error } = useQuery({
    queryKey: ["projects", currentPage],
    queryFn: async () => {
      const response = await api.get(`/api/projects/?page=${currentPage}`)
      return {
        projects: response.data.data as ProjectResponse[],
        meta: response.data.meta as Meta,
      }
    },
  })

  const projects = data?.projects ?? []
  const meta = data?.meta

  const submit = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] })
    setOpen(false)
  }

  const onDelete = () => {
     queryClient.invalidateQueries({ queryKey: ["projects"] })
     setOpen(false)
   }

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Check info about all the active projects
          </CardDescription>
        </div>
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="w-5xl">
              <CreateProjectForm onSubmit={submit} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {isPending ? (
          <Spinner className="flex size-25 w-full items-center justify-center" />
        ) : (
          <>
            <ProjectTable projects={projects} user={user} onDelete={onDelete}/>
            <PaginationSimple
              currentPage={meta?.current_page ?? 1}
              totalPages={meta?.last_page ?? 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
