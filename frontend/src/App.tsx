import { useAuth } from "./hooks/useAuth.ts"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import Budget from "./pages/Budget.tsx"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"
import Layout from "./components/layouts/layout.tsx"
import Dashboard from "./pages/Dashboard.tsx"
import Project from "./pages/Project/Project.tsx"
import User from "./pages/User.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import TimeLine from "./pages/TimeLine.tsx"
import { Toaster } from "@/components/ui/sonner"
import Pages from "./pages/Project/Pages.tsx"

function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" closeButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Project />}>
                <Route path="/projects/pages" element={<Pages />} />
              </Route>
              <Route path="/users" element={<User />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/timeline" element={<TimeLine />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
