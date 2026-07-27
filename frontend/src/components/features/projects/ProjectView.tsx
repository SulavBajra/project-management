import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import type { ProjectViewData} from "@/types/Project";

export default function ProjectView() {
  const { projectId } = useParams <{projectId: string} >()
  const { data: project, isPending, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api.get(`/api/projects/${projectId}`)
      return response.data.data as ProjectViewData[]
    },
    enabled: !!projectId
  })

  if (isPending) {
    return <Spinner className="size-10"/>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return <div>
    {project?.map((proj) => (
      <p key={proj.id}>{ proj.name}</p>
    ))}
  </div>
  //
}
