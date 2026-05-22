export interface ProjectStats {
  current_period: {
    id: number
    name: string
    start_date: string
    end_date: string
  } | null
  days_left: number | null
  total_users: number
}
