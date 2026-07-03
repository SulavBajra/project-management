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
import NotFound from "./pages/NotFound.tsx"
import ExpenseApproval from "./pages/Expense/ExpenseApproval.tsx"
import AdminApproval from "./pages/Approval/AdminApproval.tsx"

function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function GuestRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <Outlet />
}

function PermittedRoute({ permission }: { permission: string }) {
  const { user } = useAuth()
  return user?.permissions.includes(permission) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" closeButton />
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/project" element={<ProjectIndex />} />

              <Route path="/projects/:projectId" element={<ProjectLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="timeline" element={<ProjectTimeline />} />
                <Route path="expenses" element={<Expenses />} />
                <Route
                  path="expenses/approvals"
                  element={<ExpenseApproval />}
                />
                <Route path="expense" element={<Expense />} />
                <Route path="budget" element={<ProjectBudget />} />
              </Route>

              <Route element={<PermittedRoute permission="create_role" />}>
                <Route path="/user" element={<User />}>
                  <Route path="" element={<UsersData />} />
                  <Route path="roles" element={<Roles />} />
                </Route>
              </Route>

              <Route path="/budget" element={<Budget />} />
              <Route path="/timeline" element={<TimeLine />} />
              <Route path="/approval" element={<AdminApproval />} />
            </Route>
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
