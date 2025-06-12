export interface Transaction {
  id: string
  racer: string
  item: string
  quantity: number
  price: number
  date: string
}

export interface InvestorIncome {
  id: string
  investorName: string
  amount: number
  description: string
  date: string
}

export interface RacerTransaction {
  id: string
  racerName: string
  type: "buy" | "sell"
  price: number
  description: string
  date: string
}
