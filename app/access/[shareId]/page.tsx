"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionTable } from "@/components/transaction-table"
import { InvestorIncomeForm } from "@/components/investor-income-form"
import { RacerTransactionForm } from "@/components/racer-transaction-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "@/services/database"
import { Loader2, ShieldAlert, AlertCircle } from "lucide-react"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"

export default function AccessPage() {
  const { shareId } = useParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investorIncomes, setInvestorIncomes] = useState<InvestorIncome[]>([])
  const [racerTransactions, setRacerTransactions] = useState<RacerTransaction[]>([])
  const [initialBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        setError(null)
        // Validate the access link
        const valid = await validateShareableLink(shareId as string)
        setIsValid(valid)

        if (valid) {
          // Fetch data if link is valid
          const [transactionsData, incomesData, racerTransactionsData] = await Promise.all([
            getTransactions(),
            getInvestorIncomes(),
            getRacerTransactions(),
          ])

          setTransactions(transactionsData)
          setInvestorIncomes(incomesData)
          setRacerTransactions(racerTransactionsData)
        }
      } catch (error) {
        console.error("Error:", error)
        setError("Failed to load data")
        setIsValid(true) // Allow access in case of database errors
        // Set empty arrays as fallback
        setTransactions([])
        setInvestorIncomes([])
        setRacerTransactions([])
      } finally {
        setLoading(false)
      }
    }

    validateAndFetchData()
  }, [shareId])

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
  const racerTransactionBalance = racerTransactions.reduce((sum, rt) => {
    return rt.type === "buy" ? sum - rt.price : sum + rt.price
  }, 0)
  const currentBalance = initialBalance + totalInvestorIncome - totalExpenses + racerTransactionBalance

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
    <main className="container mx-auto py-8 px-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Speed Racing Syndicate</h1>
          <p className="text-gray-500">Financial Management System - Shared Access</p>
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
        loading={false}
      />
    </main>
  )
}
