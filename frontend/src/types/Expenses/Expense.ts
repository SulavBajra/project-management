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
}
