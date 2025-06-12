"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, TrendingUp, TrendingDown, Users, Loader2 } from "lucide-react"
import type { Transaction, InvestorIncome, RacerTransaction } from "@/types/transaction"
import { formatCurrency } from "@/lib/utils"

interface TransactionTableProps {
  transactions: Transaction[]
  investorIncomes: InvestorIncome[]
  racerTransactions: RacerTransaction[]
  onDeleteTransaction: (id: string) => void
  onDeleteInvestorIncome: (id: string) => void
  onDeleteRacerTransaction: (id: string) => void
  currentBalance: number
  totalExpenses: number
  totalInvestorIncome: number
  racerTransactionBalance: number
  loading?: boolean
  readOnly?: boolean
}

export function TransactionTable({
  transactions,
  investorIncomes,
  racerTransactions,
  onDeleteTransaction,
  onDeleteInvestorIncome,
  onDeleteRacerTransaction,
  currentBalance,
  totalExpenses,
  totalInvestorIncome,
  racerTransactionBalance,
  loading = false,
  readOnly = false,
}: TransactionTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <p className={`text-2xl font-bold ${currentBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {formatCurrency(currentBalance)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInvestorIncome)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Racer Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <p className={`text-2xl font-bold ${racerTransactionBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(racerTransactionBalance)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Equipment Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investment History</TabsTrigger>
            <TabsTrigger value="racers">Racer Trading History</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Racer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    {!readOnly && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-4 text-muted-foreground">
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.racer}</TableCell>
                        <TableCell>{transaction.item}</TableCell>
                        <TableCell className="text-right">{transaction.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.price)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(transaction.price * transaction.quantity)}
                        </TableCell>
                        {!readOnly && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteTransaction(transaction.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="investments">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Investor Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {!readOnly && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investorIncomes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 4 : 5} className="text-center py-4 text-muted-foreground">
                        No investments yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    investorIncomes.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell>{income.date}</TableCell>
                        <TableCell>{income.investorName}</TableCell>
                        <TableCell>{income.description || "-"}</TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">
                          +{formatCurrency(income.amount)}
                        </TableCell>
                        {!readOnly && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteInvestorIncome(income.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="racers">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Racer Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {!readOnly && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {racerTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 5 : 6} className="text-center py-4 text-muted-foreground">
                        No racer transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    racerTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.racerName}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === "buy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {transaction.type === "buy" ? "Purchase" : "Sale"}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.description || "-"}</TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            transaction.type === "buy" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {transaction.type === "buy" ? "-" : "+"}
                          {formatCurrency(transaction.price)}
                        </TableCell>
                        {!readOnly && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteRacerTransaction(transaction.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
