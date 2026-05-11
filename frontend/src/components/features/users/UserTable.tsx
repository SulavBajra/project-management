import type { User } from "@/types/User.ts"

export const UserTable = ({ users }: { users: User[] }) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
