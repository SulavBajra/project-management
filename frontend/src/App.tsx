import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/layout.tsx"
import Dashboard from "./pages/Dashboard.tsx"
// import Home from "./pages/home.tsx"
// import About from "./pages/about.tsx"
// import Login from "./pages/login.tsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </BrowserRouter>
  )
}
