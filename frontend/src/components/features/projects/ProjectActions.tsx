import axios from "axios"
import { CheckLine, ClockPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"

interface ProjectActionsProps {
  projectId: string
  daysLeft?: number | null
}

export default function ProjectActions({
  projectId,
  daysLeft,
}: ProjectActionsProps) {
  const [extendingTimeline, setExtendingTimeline] = useState(false)
  const [endingProject, setEndingProject] = useState(false)

  const extendTimeline = async () => {
    setExtendingTimeline(true)
    try {
      await api.post(`/api/projects/${projectId}/extend-timeline`)
      toast.success("Timeline extended successfully")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message)
      }
    } finally {
      setExtendingTimeline(false)
    }
  }

  const endProject = async () => {
    setEndingProject(true)
    try {
      await api.post(`/api/projects/${projectId}`)
      toast.success("Project ended successfully")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to end project")
      }
    } finally {
      setEndingProject(false)
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="h-8"
            disabled={daysLeft == null || daysLeft >= 2}
          >
            <ClockPlus />
            Extend Timeline
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Extend project timeline?</AlertDialogTitle>
            <AlertDialogDescription>
              This will extend the project deadline. You can only do this when 2
              or fewer days remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={extendTimeline}
              disabled={extendingTimeline}
            >
              {extendingTimeline ? "Extending..." : "Extend Timeline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-8">
            <CheckLine />
            Complete Project
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the project as complete. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={endProject} disabled={endingProject}>
              {endingProject ? "Completing..." : "Complete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
