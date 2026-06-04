import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const monthRange = (start: string, end: string) => {
  const s = format(new Date(start), "MMM")
  const e = format(new Date(end), "MMM")
  return s === e ? s : `${s} – ${e}`
}
