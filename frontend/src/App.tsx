import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layouts/layout.tsx"
import Dashboard from "./pages/Dashboard.tsx"
import Project from "./pages/Project.tsx"
import User from "./pages/User.tsx"
import Login from "./pages/Login.tsx"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/users" element={<User />} />
        </Route>
        s
      </Routes>
    </BrowserRouter>
  )
}
