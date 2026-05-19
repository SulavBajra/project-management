import { Card, CardContent } from "@/components/ui/card"

export default function BudgetStats() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card>
        <CardContent>Total Budget</CardContent>
      </Card>
      <Card>
        <CardContent>Waiting for Approval</CardContent>
      </Card>
      <Card>
        <CardContent>Approved</CardContent>
      </Card>
      <Card>
        <CardContent>Placeholder</CardContent>
      </Card>
    </div>
  )
}
