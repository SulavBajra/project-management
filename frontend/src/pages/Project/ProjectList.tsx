import { FolderKanban } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import api from "@/lib/axios"
import type { Project } from "@/types/Project"

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get<Project[]>("/api/projects")
        setProjects(response.data)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Manage and monitor your projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="rounded-xl border p-5 transition hover:bg-muted/50"
          >
            <div className="mb-4 flex items-center gap-3">
              <FolderKanban className="h-5 w-5" />
              <h2 className="font-semibold">{project.name}</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Open project workspace
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
