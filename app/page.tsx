"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionTable } from "@/components/transaction-table"
import { InvestorIncomeForm } from "@/components/investor-income-form"
import { RacerTransactionForm } from "@/components/racer-transaction-form"
import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"
import {
  getTransactions,
  getInvestorIncomes,
  getRacerTransactions,
  addTransaction,
  addInvestorIncome,
  addRacerTransaction,
  deleteTransaction,
  deleteInvestorIncome,
  deleteRacerTransaction,
  addSampleData,
} from "@/services/database"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investorIncomes, setInvestorIncomes] = useState<InvestorIncome[]>([])
  const [racerTransactions, setRacerTransactions] = useState<RacerTransaction[]>([])
  const [initialBalance] = useState(0) // $0 as initial balance
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isDevelopmentMode = !isSupabaseConfigured()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [transactionsData, incomesData, racerTransactionsData] = await Promise.all([
          getTransactions(),
          getInvestorIncomes(),
          getRacerTransactions(),
        ])

        setTransactions(transactionsData)
        setInvestorIncomes(incomesData)
        setRacerTransactions(racerTransactionsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Using local storage instead.")
        // Even if there's an error, the functions should return mock data
        setTransactions([])
        setInvestorIncomes([])
        setRacerTransactions([])
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddSampleData = () => {
    addSampleData()
    // Refresh the data
    const fetchData = async () => {
      const [transactionsData, incomesData, racerTransactionsData] = await Promise.all([
        getTransactions(),
        getInvestorIncomes(),
        getRacerTransactions(),
      ])

      setTransactions(transactionsData)
      setInvestorIncomes(incomesData)
      setRacerTransactions(racerTransactionsData)
    }
    fetchData()
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = await addTransaction(transaction)
      setTransactions([newTransaction, ...transactions])
      setError(null)
    } catch (error) {
      console.error("Error adding transaction:", error)
      setError("Failed to add transaction")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      setTransactions(transactions.filter((t) => t.id !== id))
      setError(null)
    } catch (error) {
      console.error("Error deleting transaction:", error)
      setError("Failed to delete transaction")
    }
  }

  const handleAddInvestorIncome = async (income: Omit<InvestorIncome, "id">) => {
    try {
      const newIncome = await addInvestorIncome(income)
      setInvestorIncomes([newIncome, ...investorIncomes])
      setError(null)
    } catch (error) {
      console.error("Error adding investor income:", error)
      setError("Failed to add investor income")
    }
  }

  const handleDeleteInvestorIncome = async (id: string) => {
    try {
      await deleteInvestorIncome(id)
      setInvestorIncomes(investorIncomes.filter((i) => i.id !== id))
      setError(null)
    } catch (error) {
      console.error("Error deleting investor income:", error)
      setError("Failed to delete investor income")
    }
  }

  const handleAddRacerTransaction = async (transaction: Omit<RacerTransaction, "id">) => {
    try {
      const newTransaction = await addRacerTransaction(transaction)
      setRacerTransactions([newTransaction, ...racerTransactions])
      setError(null)
    } catch (error) {
      console.error("Error adding racer transaction:", error)
      setError("Failed to add racer transaction")
    }
  }

  const handleDeleteRacerTransaction = async (id: string) => {
    try {
      await deleteRacerTransaction(id)
      setRacerTransactions(racerTransactions.filter((t) => t.id !== id))
      setError(null)
    } catch (error) {
      console.error("Error deleting racer transaction:", error)
      setError("Failed to delete racer transaction")
    }
  }

  const totalExpenses = transactions.reduce((sum, t) => sum + t.price * t.quantity, 0)
  const totalInvestorIncome = investorIncomes.reduce((sum, i) => sum + i.amount, 0)

  // Calculate racer transaction impact on balance
  const racerTransactionBalance = racerTransactions.reduce((sum, rt) => {
    // If type is "buy", subtract from balance; if "sell", add to balance
    return rt.type === "buy" ? sum - rt.price : sum + rt.price
  }, 0)

  const currentBalance = initialBalance + totalInvestorIncome - totalExpenses + racerTransactionBalance

  const hasNoData = transactions.length === 0 && investorIncomes.length === 0 && racerTransactions.length === 0

  return (
    <main className="container mx-auto py-8 px-4">
      {isDevelopmentMode && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> This is a preview version. Data is stored locally and will be lost when you
            refresh the page. To enable full functionality with persistent data, deploy with Supabase configuration.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Speed Racing Syndicate</h1>
          <p className="text-gray-500">Financial Management System</p>
        </div>
        <div className="flex items-center gap-4">
          {isDevelopmentMode && hasNoData && (
            <Button variant="outline" onClick={handleAddSampleData}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sample Data
            </Button>
          )}
          <ShareButton />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Financial Management System</CardTitle>
          <CardDescription>Manage your racing team's finances</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Equipment</TabsTrigger>
              <TabsTrigger value="investor-income">Investor Income</TabsTrigger>
              <TabsTrigger value="racer-transactions">Racer Trading</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionForm onSubmit={handleAddTransaction} currentBalance={currentBalance} />
            </TabsContent>

            <TabsContent value="investor-income" className="space-y-6">
              <InvestorIncomeForm onSubmit={handleAddInvestorIncome} currentBalance={currentBalance} />
            </TabsContent>

            <TabsContent value="racer-transactions" className="space-y-6">
              <RacerTransactionForm onSubmit={handleAddRacerTransaction} currentBalance={currentBalance} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionTable
        transactions={transactions}
        investorIncomes={investorIncomes}
        racerTransactions={racerTransactions}
        onDeleteTransaction={handleDeleteTransaction}
        onDeleteInvestorIncome={handleDeleteInvestorIncome}
        onDeleteRacerTransaction={handleDeleteRacerTransaction}
        currentBalance={currentBalance}
        totalExpenses={totalExpenses}
        totalInvestorIncome={totalInvestorIncome}
        racerTransactionBalance={racerTransactionBalance}
        loading={dataLoading}
      />
    </main>
  )
}
