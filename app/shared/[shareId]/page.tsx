"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionTable } from "@/components/transaction-table"
import { validateShareableLink, getTransactions, getInvestorIncomes, getRacerTransactions } from "@/services/database"
import { Loader2, ShieldAlert } from "lucide-react"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"

export default function SharedView() {
  const { shareId } = useParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [investorIncomes, setInvestorIncomes] = useState<InvestorIncome[]>([])
  const [racerTransactions, setRacerTransactions] = useState<RacerTransaction[]>([])
  const [initialBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        // Validate the share link
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
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }

    validateAndFetchData()
  }, [shareId])

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
              This shared link is either invalid or has expired. Please request a new link from the account owner.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Speed Racing Syndicate - Shared Financial Overview</CardTitle>
        </CardHeader>
      </Card>

      <TransactionTable
        transactions={transactions}
        investorIncomes={investorIncomes}
        racerTransactions={racerTransactions}
        onDeleteTransaction={() => {}}
        onDeleteInvestorIncome={() => {}}
        onDeleteRacerTransaction={() => {}}
        currentBalance={currentBalance}
        totalExpenses={totalExpenses}
        totalInvestorIncome={totalInvestorIncome}
        racerTransactionBalance={racerTransactionBalance}
        loading={false}
        readOnly={true}
      />
    </main>
  )
}
