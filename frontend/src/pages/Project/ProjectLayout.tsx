import { Outlet } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export default function ProjectLayout() {
  return (
    <div className="flex h-full">
      <main className="flex-1 overflow-y-auto p-1">
        <Card>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
