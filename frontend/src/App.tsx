import Layout from "./components/layouts/layout.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom"
import Budget from "./pages/Budget/Budget.tsx"
import { useAuth } from "./hooks/useAuth.ts"
import Dashboard from "./pages/Dashboard.tsx"
import ProjectLayout from "./pages/Project/ProjectLayout.tsx"
import User from "./pages/User/User.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import TimeLine from "./pages/TimeLine.tsx"
import Overview from "./pages/Project/Overview.tsx"
import Roles from "./pages/User/Roles.tsx"
import ProjectTimeline from "./pages/Project/ProjectTimeline.tsx"
import Expense from "./pages/Expense.tsx"
import Expenses from "./pages/Project/Expenses.tsx"
import { Toaster } from "@/components/ui/sonner"
import UsersData from "./pages/User/UserData.tsx"
import ProjectIndex from "./pages/Project/ProjectIndex.tsx"
import Approval from "./pages/Approval.tsx"
import ProjectBudget from "./pages/Budget/ProjectBudget.tsx"

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
              <Route path="/project" element={<ProjectIndex />} />

              <Route path="/projects/:projectId" element={<ProjectLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="timeline" element={<ProjectTimeline />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="expense" element={<Expense />} />
                <Route path="budget" element={<ProjectBudget />} />
              </Route>

              <Route path="/user" element={<User />}>
                <Route path="" element={<UsersData />} />
                <Route path="roles" element={<Roles />} />
              </Route>
              <Route path="/budget" element={<Budget />} />
              <Route path="/timeline" element={<TimeLine />} />
              <Route path="/approval" element={<Approval />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
