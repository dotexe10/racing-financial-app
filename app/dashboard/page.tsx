"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionTable } from "@/components/transaction-table"
import { InvestorIncomeForm } from "@/components/investor-income-form"
import { RacerTransactionForm } from "@/components/racer-transaction-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ShareButton } from "@/components/share-button"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
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
} from "@/services/database"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investorIncomes, setInvestorIncomes] = useState<InvestorIncome[]>([])
  const [racerTransactions, setRacerTransactions] = useState<RacerTransaction[]>([])
  const [initialBalance] = useState(0) // $0 as initial balance
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = await addTransaction(transaction)
      setTransactions([newTransaction, ...transactions])
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      setTransactions(transactions.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleAddInvestorIncome = async (income: Omit<InvestorIncome, "id">) => {
    try {
      const newIncome = await addInvestorIncome(income)
      setInvestorIncomes([newIncome, ...investorIncomes])
    } catch (error) {
      console.error("Error adding investor income:", error)
    }
  }

  const handleDeleteInvestorIncome = async (id: string) => {
    try {
      await deleteInvestorIncome(id)
      setInvestorIncomes(investorIncomes.filter((i) => i.id !== id))
    } catch (error) {
      console.error("Error deleting investor income:", error)
    }
  }

  const handleAddRacerTransaction = async (transaction: Omit<RacerTransaction, "id">) => {
    try {
      const newTransaction = await addRacerTransaction(transaction)
      setRacerTransactions([newTransaction, ...racerTransactions])
    } catch (error) {
      console.error("Error adding racer transaction:", error)
    }
  }

  const handleDeleteRacerTransaction = async (id: string) => {
    try {
      await deleteRacerTransaction(id)
      setRacerTransactions(racerTransactions.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting racer transaction:", error)
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

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Speed Racing Syndicate</h1>
            <p className="text-gray-500">Welcome, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <ShareButton />
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
          loading={loading}
        />
      </main>
    </ProtectedRoute>
  )
}
