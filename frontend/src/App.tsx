import Layout from "./components/layouts/layout.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"
import Budget from "./pages/Budget.tsx"
import { useAuth } from "./hooks/useAuth.ts"
import Dashboard from "./pages/Dashboard.tsx"
import Project from "./pages/Project/Project.tsx"
import User from "./pages/User/User.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import TimeLine from "./pages/TimeLine.tsx"
import Overview from "./pages/Project/Overview.tsx"
import Roles from "./pages/User/Roles.tsx"
import ProjectTimeline from "./pages/Project/ProjectTimeline.tsx"
import Expense from "./pages/Expense.tsx"
import { Toaster } from "@/components/ui/sonner"
import Expenses from "./pages/Project/Expenses.tsx"

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
              <Route path="/projects/:projectId" element={<Project />}>
                <Route path="overview" element={<Overview />} />
                <Route path="timeline" element={<ProjectTimeline />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="expense" element={<Expense />} />
              </Route>
              <Route path="/users" element={<User />}>
                <Route path="roles" element={<Roles />} />
              </Route>
              <Route path="/budget" element={<Budget />} />
              <Route path="/timeline" element={<TimeLine />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
