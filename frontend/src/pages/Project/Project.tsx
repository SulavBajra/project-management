import { Outlet } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export default function Project() {
  return (
    <Card>
      <CardContent>
        <Outlet />
      </CardContent>
    </Card>
  )
}
