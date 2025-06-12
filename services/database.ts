import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"

// Mock data for development mode
let mockTransactions: Transaction[] = []
let mockInvestorIncomes: InvestorIncome[] = []
let mockRacerTransactions: RacerTransaction[] = []

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  return !isSupabaseConfigured()
}

// Transactions
export async function getTransactions() {
  if (shouldUseMockData()) {
    // Return mock data in development mode
    return mockTransactions
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    return mockTransactions
  }

  try {
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      return mockTransactions
    }

    return data as Transaction[]
  } catch (error) {
    console.warn("Failed to fetch transactions, using mock data:", error)
    return mockTransactions
  }
}

export async function addTransaction(transaction: Omit<Transaction, "id">) {
  if (shouldUseMockData()) {
    // Add to mock data in development mode
    const newTransaction = { ...transaction, id: generateId() } as Transaction
    mockTransactions = [newTransaction, ...mockTransactions]
    return newTransaction
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    const newTransaction = { ...transaction, id: generateId() } as Transaction
    mockTransactions = [newTransaction, ...mockTransactions]
    return newTransaction
  }

  try {
    const { data, error } = await supabase.from("transactions").insert([transaction]).select()

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      const newTransaction = { ...transaction, id: generateId() } as Transaction
      mockTransactions = [newTransaction, ...mockTransactions]
      return newTransaction
    }

    return data[0] as Transaction
  } catch (error) {
    console.warn("Failed to add transaction, using mock data:", error)
    const newTransaction = { ...transaction, id: generateId() } as Transaction
    mockTransactions = [newTransaction, ...mockTransactions]
    return newTransaction
  }
}

export async function deleteTransaction(id: string) {
  if (shouldUseMockData()) {
    // Remove from mock data in development mode
    mockTransactions = mockTransactions.filter((t) => t.id !== id)
    return true
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    mockTransactions = mockTransactions.filter((t) => t.id !== id)
    return true
  }

  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      mockTransactions = mockTransactions.filter((t) => t.id !== id)
      return true
    }

    return true
  } catch (error) {
    console.warn("Failed to delete transaction, using mock data:", error)
    mockTransactions = mockTransactions.filter((t) => t.id !== id)
    return true
  }
}

// Investor Incomes
export async function getInvestorIncomes() {
  if (shouldUseMockData()) {
    return mockInvestorIncomes
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    return mockInvestorIncomes
  }

  try {
    const { data, error } = await supabase.from("investor_incomes").select("*").order("date", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      return mockInvestorIncomes
    }

    return data as InvestorIncome[]
  } catch (error) {
    console.warn("Failed to fetch investor incomes, using mock data:", error)
    return mockInvestorIncomes
  }
}

export async function addInvestorIncome(income: Omit<InvestorIncome, "id">) {
  if (shouldUseMockData()) {
    const newIncome = { ...income, id: generateId() } as InvestorIncome
    mockInvestorIncomes = [newIncome, ...mockInvestorIncomes]
    return newIncome
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    const newIncome = { ...income, id: generateId() } as InvestorIncome
    mockInvestorIncomes = [newIncome, ...mockInvestorIncomes]
    return newIncome
  }

  try {
    const { data, error } = await supabase.from("investor_incomes").insert([income]).select()

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      const newIncome = { ...income, id: generateId() } as InvestorIncome
      mockInvestorIncomes = [newIncome, ...mockInvestorIncomes]
      return newIncome
    }

    return data[0] as InvestorIncome
  } catch (error) {
    console.warn("Failed to add investor income, using mock data:", error)
    const newIncome = { ...income, id: generateId() } as InvestorIncome
    mockInvestorIncomes = [newIncome, ...mockInvestorIncomes]
    return newIncome
  }
}

export async function deleteInvestorIncome(id: string) {
  if (shouldUseMockData()) {
    mockInvestorIncomes = mockInvestorIncomes.filter((i) => i.id !== id)
    return true
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    mockInvestorIncomes = mockInvestorIncomes.filter((i) => i.id !== id)
    return true
  }

  try {
    const { error } = await supabase.from("investor_incomes").delete().eq("id", id)

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      mockInvestorIncomes = mockInvestorIncomes.filter((i) => i.id !== id)
      return true
    }

    return true
  } catch (error) {
    console.warn("Failed to delete investor income, using mock data:", error)
    mockInvestorIncomes = mockInvestorIncomes.filter((i) => i.id !== id)
    return true
  }
}

// Racer Transactions
export async function getRacerTransactions() {
  if (shouldUseMockData()) {
    return mockRacerTransactions
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    return mockRacerTransactions
  }

  try {
    const { data, error } = await supabase.from("racer_transactions").select("*").order("date", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      return mockRacerTransactions
    }

    return data as RacerTransaction[]
  } catch (error) {
    console.warn("Failed to fetch racer transactions, using mock data:", error)
    return mockRacerTransactions
  }
}

export async function addRacerTransaction(transaction: Omit<RacerTransaction, "id">) {
  if (shouldUseMockData()) {
    const newTransaction = { ...transaction, id: generateId() } as RacerTransaction
    mockRacerTransactions = [newTransaction, ...mockRacerTransactions]
    return newTransaction
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    const newTransaction = { ...transaction, id: generateId() } as RacerTransaction
    mockRacerTransactions = [newTransaction, ...mockRacerTransactions]
    return newTransaction
  }

  try {
    const { data, error } = await supabase.from("racer_transactions").insert([transaction]).select()

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      const newTransaction = { ...transaction, id: generateId() } as RacerTransaction
      mockRacerTransactions = [newTransaction, ...mockRacerTransactions]
      return newTransaction
    }

    return data[0] as RacerTransaction
  } catch (error) {
    console.warn("Failed to add racer transaction, using mock data:", error)
    const newTransaction = { ...transaction, id: generateId() } as RacerTransaction
    mockRacerTransactions = [newTransaction, ...mockRacerTransactions]
    return newTransaction
  }
}

export async function deleteRacerTransaction(id: string) {
  if (shouldUseMockData()) {
    mockRacerTransactions = mockRacerTransactions.filter((t) => t.id !== id)
    return true
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    mockRacerTransactions = mockRacerTransactions.filter((t) => t.id !== id)
    return true
  }

  try {
    const { error } = await supabase.from("racer_transactions").delete().eq("id", id)

    if (error) {
      console.warn("Database error, falling back to mock data:", error.message)
      mockRacerTransactions = mockRacerTransactions.filter((t) => t.id !== id)
      return true
    }

    return true
  } catch (error) {
    console.warn("Failed to delete racer transaction, using mock data:", error)
    mockRacerTransactions = mockRacerTransactions.filter((t) => t.id !== id)
    return true
  }
}

// Generate a shareable link for the current application
export async function createShareableLink() {
  if (shouldUseMockData()) {
    // In development mode, return the current URL as shareable
    return "demo-access"
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, using demo link")
    return "demo-access"
  }

  try {
    const shareId = crypto.randomUUID()

    const { error } = await supabase.from("shared_access").insert([
      {
        share_id: shareId,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
    ])

    if (error) {
      console.warn("Database error creating share link, using demo link:", error.message)
      return "demo-access"
    }

    return shareId
  } catch (error) {
    console.warn("Failed to create share link, using demo link:", error)
    return "demo-access"
  }
}

export async function validateShareableLink(shareId: string) {
  if (shouldUseMockData()) {
    // In development mode, accept any share ID
    return true
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    console.warn("Supabase not configured, allowing access")
    return true
  }

  try {
    const { data, error } = await supabase.from("shared_access").select("*").eq("share_id", shareId).single()

    if (error) {
      console.warn("Database error validating share link, allowing access:", error.message)
      return true
    }

    // Check if link is expired
    if (new Date(data.expires_at) < new Date()) {
      return false
    }

    return true
  } catch (error) {
    console.warn("Failed to validate share link, allowing access:", error)
    return true
  }
}

// Add some sample data for demonstration
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
}
