"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import {
  validateShareableLink,
  getTransactions,
  getInvestorIncomes,
  getRacerTransactions,
  addTransaction,
  addInvestorIncome,
  addRacerTransaction,
  deleteTransaction,
  deleteInvestorIncome,
  deleteRacerTransaction,
  subscribeToDataChanges,
} from "@/services/database"
import { Loader2, ShieldAlert } from "lucide-react"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function AccessPage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investorIncomes, setInvestorIncomes] = useState<InvestorIncome[]>([])
  const [racerTransactions, setRacerTransactions] = useState<RacerTransaction[]>([])
  const [initialBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isDevelopmentMode = !isSupabaseConfigured()

  const redirectToMain = () => {
    window.location.href = "/"
  }

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setError(null)
      setIsRefreshing(true)

      const [transactionsData, incomesData, racerTransactionsData] = await Promise.all([
        getTransactions(),
        getInvestorIncomes(),
        getRacerTransactions(),
      ])

      setTransactions(transactionsData)
      setInvestorIncomes(incomesData)
      setRacerTransactions(racerTransactionsData)
      setLastUpdate(new Date())
      setIsConnected(true)

      console.log("Data refreshed successfully in shared access")
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data")
      setIsConnected(false)
      setTransactions([])
      setInvestorIncomes([])
      setRacerTransactions([])
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        setError(null)
        console.log("Validating share link:", shareId)

        // Validate the access link
        const valid = await validateShareableLink(shareId as string)
        setIsValid(valid)

        if (valid) {
          await fetchAllData()
        }
      } catch (error) {
        console.error("Error:", error)
        setError("Failed to load data")
        setIsValid(true) // Allow access in case of database errors
        setTransactions([])
        setInvestorIncomes([])
        setRacerTransactions([])
      } finally {
        setLoading(false)
      }
    }

    validateAndFetchData()

    // Subscribe to real-time changes if valid
    let unsubscribe: (() => void) | undefined

    if (isValid) {
      unsubscribe = subscribeToDataChanges(() => {
        console.log("Real-time update detected in shared access, refreshing data...")
        fetchAllData()
      })
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [shareId, fetchAllData, isValid])

  const handleManualRefresh = () => {
    fetchAllData()
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      await addTransaction(transaction)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
      setError("Failed to add transaction")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      setError("Failed to delete transaction")
    }
  }

  const handleAddInvestorIncome = async (income: Omit<InvestorIncome, "id">) => {
    try {
      await addInvestorIncome(income)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding investor income:", error)
      setError("Failed to add investor income")
    }
  }

  const handleDeleteInvestorIncome = async (id: string) => {
    try {
      await deleteInvestorIncome(id)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting investor income:", error)
      setError("Failed to delete investor income")
    }
  }

  const handleAddRacerTransaction = async (transaction: Omit<RacerTransaction, "id">) => {
    try {
      await addRacerTransaction(transaction)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error adding racer transaction:", error)
      setError("Failed to add racer transaction")
    }
  }

  const handleDeleteRacerTransaction = async (id: string) => {
    try {
      await deleteRacerTransaction(id)
      setError(null)
      // Real-time subscription will handle the UI update, but in mock mode we need to refresh
      if (isDevelopmentMode) {
        fetchAllData()
      }
    } catch (error) {
      console.error("Error deleting racer transaction:", error)
      setError("Failed to delete racer transaction")
    }
  }

  const totalExpenses = transactions.reduce((sum, t) => sum + t.price * t.quantity, 0)
  const totalInvestorIncome = investorIncomes.reduce((sum, i) => sum + i.amount, 0)
  const racerTransactionBalance = racerTransactions.reduce((sum, rt) => {
    return rt.type === "buy" ? sum - rt.price : sum + rt.price
  }, 0)
  const currentBalance = initialBalance + totalInvestorIncome - totalExpenses + racerTransactionBalance

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading shared access...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mb-2" />
            <CardTitle>Invalid or Expired Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              This access link is either invalid or has expired. Please request a new link from the system
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Speed Racing Syndicate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">You have access to the financial management system.</p>
          <p className="text-sm text-gray-500">Share ID: {shareId}</p>
          <Button onClick={redirectToMain} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Application
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
