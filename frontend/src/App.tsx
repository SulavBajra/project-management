import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layouts/layout.tsx"
import Dashboard from "./pages/Dashboard.tsx"
import Project from "./pages/Project.tsx"
import User from "./pages/User.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Budget from "./pages/Budget.tsx"
import TimeLine from "./pages/TimeLine.tsx"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/users" element={<User />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/timeline" element={<TimeLine />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
