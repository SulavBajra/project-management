export type Expense = {
  expense_id: number
  user_id: number
  code: string
  transaction_id: number
  debit: string
  credit: string
  transaction_date: string
  account_head_id: number
  account_head: string
  status: string | null
  is_final: boolean
}

export type Transaction = {
  transaction_id: number
  account_head_id: number
  account_head: string
  debit: string
  credit: string
  transaction_date: string
}

export type ExpenseData = {
  id: number
  user_id: number
  code: string
  description: string
  total: number
  date: string
  project_id: number
  project_name: string
  user: string
  approval_id: number
  approval_status: string
  approval_step: boolean
  transactions: Transaction[]
}
