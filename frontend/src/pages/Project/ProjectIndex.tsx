import axios from "axios"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
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
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [meta, setMeta] = useState<Meta>()
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get(`/api/projects/?page=${currentPage}`)
        setLoading(false)
        setProjects(response.data.data)
        setMeta(response.data.meta)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message)
        }
      }
    }
    fetchProjects()
  }, [currentPage])

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
              <CreateProjectForm onSubmit={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {loading ? (
          <Spinner className="flex size-25 w-full items-center justify-center" />
        ) : (
          <>
            <ProjectTable projects={projects} user={user} />
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
