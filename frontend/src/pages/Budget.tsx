import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table } from "@/components/ui/table"

export default function Budget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Budget</CardTitle>
        <p>Create, edit, and track your budget</p>
      </CardHeader>
      <CardContent>
        <Table></Table>
      </CardContent>
    </Card>
  )
}
