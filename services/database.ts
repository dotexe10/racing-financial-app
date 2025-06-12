import { createClient } from "@supabase/supabase-js"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

// Initialize Supabase client safely
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn("Failed to initialize Supabase:", error)
  }
}

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

// Mock data for development mode
let mockTransactions: Transaction[] = []
let mockInvestorIncomes: InvestorIncome[] = []
let mockRacerTransactions: RacerTransaction[] = []

// Real-time subscription callbacks
type DataChangeCallback = () => void
let dataChangeCallbacks: DataChangeCallback[] = []

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Subscribe to real-time changes (mock implementation)
export function subscribeToDataChanges(callback: DataChangeCallback) {
  dataChangeCallbacks.push(callback)
  console.log("Subscribed to data changes (mock mode)")

  // Return cleanup function
  return () => {
    dataChangeCallbacks = dataChangeCallbacks.filter((cb) => cb !== callback)
    console.log("Unsubscribed from data changes")
  }
}

// Notify all callbacks about data changes
const notifyDataChange = () => {
  dataChangeCallbacks.forEach((callback) => {
    try {
      callback()
    } catch (error) {
      console.error("Error in data change callback:", error)
    }
  })
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  return mockTransactions
}

export async function addTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
  const newTransaction = { ...transaction, id: generateId() } as Transaction
  mockTransactions = [newTransaction, ...mockTransactions]
  notifyDataChange()
  return newTransaction
}

export async function deleteTransaction(id: string): Promise<boolean> {
  mockTransactions = mockTransactions.filter((t) => t.id !== id)
  notifyDataChange()
  return true
}

// Investor Incomes
export async function getInvestorIncomes(): Promise<InvestorIncome[]> {
  return mockInvestorIncomes
}

export async function addInvestorIncome(income: Omit<InvestorIncome, "id">): Promise<InvestorIncome> {
  const newIncome = { ...income, id: generateId() } as InvestorIncome
  mockInvestorIncomes = [newIncome, ...mockInvestorIncomes]
  notifyDataChange()
  return newIncome
}

export async function deleteInvestorIncome(id: string): Promise<boolean> {
  mockInvestorIncomes = mockInvestorIncomes.filter((i) => i.id !== id)
  notifyDataChange()
  return true
}

// Racer Transactions
export async function getRacerTransactions(): Promise<RacerTransaction[]> {
  return mockRacerTransactions
}

export async function addRacerTransaction(transaction: Omit<RacerTransaction, "id">): Promise<RacerTransaction> {
  const newTransaction = { ...transaction, id: generateId() } as RacerTransaction
  mockRacerTransactions = [newTransaction, ...mockRacerTransactions]
  notifyDataChange()
  return newTransaction
}

export async function deleteRacerTransaction(id: string): Promise<boolean> {
  mockRacerTransactions = mockRacerTransactions.filter((t) => t.id !== id)
  notifyDataChange()
  return true
}

// Generate a shareable link
export async function createShareableLink(): Promise<string> {
  return "demo-access-" + Math.random().toString(36).substring(2, 15)
}

export async function validateShareableLink(shareId: string): Promise<boolean> {
  // Always return true for demo mode
  return true
}

// Add sample data
export function addSampleData() {
  if (mockTransactions.length === 0) {
    mockTransactions = [
      {
        id: generateId(),
        racer: "Racer 1",
        item: "Extrapart",
        quantity: 2,
        price: 150,
        date: "2024-12-06",
      },
      {
        id: generateId(),
        racer: "Racer 2",
        item: "Harness",
        quantity: 1,
        price: 1000,
        date: "2024-12-05",
      },
    ]
  }

  if (mockInvestorIncomes.length === 0) {
    mockInvestorIncomes = [
      {
        id: generateId(),
        investorName: "John Investor",
        amount: 5000,
        description: "Initial funding",
        date: "2024-12-01",
      },
    ]
  }

  if (mockRacerTransactions.length === 0) {
    mockRacerTransactions = [
      {
        id: generateId(),
        racerName: "Speed Racer",
        type: "buy",
        price: 2000,
        description: "Experienced racer with good track record",
        date: "2024-12-03",
      },
    ]
  }

  notifyDataChange()
}
