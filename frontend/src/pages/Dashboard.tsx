import CreateProjectForm from "@/components/features/projects/CreateProjectForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <h1>Dashboard</h1>
      </CardHeader>
      <CardContent>
        <CreateProjectForm />
      </CardContent>
    </Card>
  )
}
