import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast } from "sonner"
import axios from "axios"

export const UserTable = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/api/users")
        setUsers(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message)
      }
    }
    fetchUsers()
  }, [])

  return <div></div>
}
