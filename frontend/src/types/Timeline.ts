export interface Timeline {
  id: string
  start_date: string
  end_date: string
  periods: TimelinePeriod[]
}

export interface TimelinePeriod {
  id: number
  timeline_id: number
  name: string
  start_date: string
  end_date: string
}
