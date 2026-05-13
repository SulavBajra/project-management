import { createContext, useContext } from "react"

interface RolesContextValue {
  roles: string[]
}

const RolesContext = createContext<RolesContextValue>({ roles: [] })

export const useRoles = () => useContext(RolesContext)
export default RolesContext
