"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, DollarSign, TrendingUp, Users, Package, Trash2, Plus, RefreshCw } from "lucide-react"

interface Transaction {
  id: string
  racer: string
  item: string
  quantity: number
  price: number
  total: number
  timestamp: string
  type: "equipment" | "investor" | "trading"
}

const RACERS = ["Racer 1", "Racer 2", "Racer 3", "Racer 4", "Racer 5", "Racer 6", "Racer 7", "Racer 8"]

const ITEMS = [
  { name: "Extrapart", price: 150 },
  { name: "Robot Service", price: 300 },
  { name: "Harness", price: 1000 },
  { name: "Fake Plate", price: 75 },
  { name: "Dongel", price: 200 },
  { name: "Voucher Chip", price: 50 },
  { name: "Repair Kit", price: 500 },
]

export default function RacingFinancialApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [shareId, setShareId] = useState<string>("")

  // Equipment form states
  const [selectedRacer, setSelectedRacer] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)

  // Investor form states
  const [investorName, setInvestorName] = useState("")
  const [investorAmount, setInvestorAmount] = useState(0)

  // Trading form states
  const [racerName, setRacerName] = useState("")
  const [tradingAmount, setTradingAmount] = useState(0)
  const [tradingType, setTradingType] = useState<"buy" | "sell">("buy")

  // Initialize data
  useEffect(() => {
    // Generate share ID
    setShareId(Math.random().toString(36).substring(2, 15))

    // Load saved data from localStorage
    const savedTransactions = localStorage.getItem("racing-transactions-v38")
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (error) {
        console.error("Error loading saved transactions:", error)
      }
    }
  }, [])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("racing-transactions-v38", JSON.stringify(transactions))
  }, [transactions])

  // Update price when item is selected
  useEffect(() => {
    const selectedItemData = ITEMS.find((item) => item.name === selectedItem)
    if (selectedItemData) {
      setPrice(selectedItemData.price)
    }
  }, [selectedItem])

  const addEquipmentTransaction = () => {
    if (!selectedRacer || !selectedItem || quantity <= 0) return

    const total = price * quantity
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      racer: selectedRacer,
      item: selectedItem,
      quantity,
      price,
      total,
      timestamp: new Date().toLocaleString(),
      type: "equipment",
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Reset form
    setSelectedRacer("")
    setSelectedItem("")
    setQuantity(1)
    setPrice(0)
  }

  const addInvestorIncome = () => {
    if (!investorName || investorAmount <= 0) return

    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      racer: "Crew Balance",
      item: `Investor Income from ${investorName}`,
      quantity: 1,
      price: investorAmount,
      total: investorAmount,
      timestamp: new Date().toLocaleString(),
      type: "investor",
    }

    setTransactions((prev) => [newTransaction, ...prev])

    setInvestorName("")
    setInvestorAmount(0)
  }

  const addRacerTrading = () => {
    if (!racerName || tradingAmount <= 0) return

    const total = tradingAmount
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      racer: "Crew Balance",
      item: `Racer ${tradingType === "buy" ? "Purchase" : "Sale"}: ${racerName}`,
      quantity: 1,
      price: tradingType === "buy" ? -tradingAmount : tradingAmount,
      total: total,
      timestamp: new Date().toLocaleString(),
      type: "trading",
    }

    setTransactions((prev) => [newTransaction, ...prev])

    setRacerName("")
    setTradingAmount(0)
  }

  const deleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const resetAllData = () => {
    if (confirm("Are you sure you want to reset all financial data? This action cannot be undone.")) {
      setTransactions([])
      localStorage.removeItem("racing-transactions-v38")
      alert("All data has been reset successfully!")
    }
  }

  const addSampleData = () => {
    const sampleTransactions: Transaction[] = [
      {
        id: "sample-1-" + Date.now(),
        racer: "Racer 1",
        item: "Extrapart",
        quantity: 2,
        price: 150,
        total: 300,
        timestamp: new Date().toLocaleString(),
        type: "equipment",
      },
      {
        id: "sample-2-" + Date.now(),
        racer: "Crew Balance",
        item: "Investor Income from John Investor",
        quantity: 1,
        price: 5000,
        total: 5000,
        timestamp: new Date().toLocaleString(),
        type: "investor",
      },
      {
        id: "sample-3-" + Date.now(),
        racer: "Racer 2",
        item: "Harness",
        quantity: 1,
        price: 1000,
        total: 1000,
        timestamp: new Date().toLocaleString(),
        type: "equipment",
      },
      {
        id: "sample-4-" + Date.now(),
        racer: "Crew Balance",
        item: "Racer Purchase: Speed Demon",
        quantity: 1,
        price: -2500,
        total: 2500,
        timestamp: new Date().toLocaleString(),
        type: "trading",
      },
      {
        id: "sample-5-" + Date.now(),
        racer: "Crew Balance",
        item: "Racer Sale: Lightning Bolt",
        quantity: 1,
        price: 3000,
        total: 3000,
        timestamp: new Date().toLocaleString(),
        type: "trading",
      },
    ]
    setTransactions((prev) => [...sampleTransactions, ...prev])
    alert("Sample data added successfully!")
  }

  // Calculate totals
  const equipmentTransactions = transactions.filter((t) => t.type === "equipment")
  const investorTransactions = transactions.filter((t) => t.type === "investor")
  const tradingTransactions = transactions.filter((t) => t.type === "trading")

  const totalEquipmentSpending = equipmentTransactions.reduce((sum, t) => sum + t.total, 0)
  const totalInvestorIncome = investorTransactions.reduce((sum, t) => sum + t.total, 0)
  const totalTradingBalance = tradingTransactions.reduce((sum, t) => sum + t.price, 0)

  const currentBalance = totalInvestorIncome - totalEquipmentSpending + totalTradingBalance

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/access/${shareId}` : ""

  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      alert("Share link copied to clipboard!")
    }
  }

  const refreshData = () => {
    const savedTransactions = localStorage.getItem("racing-transactions-v38")
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
        alert("Data refreshed successfully!")
      } catch (error) {
        console.error("Error refreshing data:", error)
        alert("Error refreshing data!")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Speed Racing Syndicate</h1>
          <p className="text-gray-600">Financial Management System v38</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Button onClick={copyShareLink} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Access Link
            </Button>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            {transactions.length === 0 && (
              <Button onClick={addSampleData} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sample Data
              </Button>
            )}
            <Button onClick={resetAllData} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Spending</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-${totalEquipmentSpending.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{equipmentTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investor Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${totalInvestorIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{investorTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trading Balance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalTradingBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalTradingBalance >= 0 ? "+" : ""}${totalTradingBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{tradingTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${currentBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${currentBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Total: {transactions.length} transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="investor">Investor Income</TabsTrigger>
            <TabsTrigger value="trading">Racer Trading</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          {/* Equipment Form */}
          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add Equipment Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="racer">Racer</Label>
                    <Select value={selectedRacer} onValueChange={setSelectedRacer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select racer" />
                      </SelectTrigger>
                      <SelectContent>
                        {RACERS.map((racer) => (
                          <SelectItem key={racer} value={racer}>
                            {racer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="item">Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEMS.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (Auto-filled)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        readOnly
                        className="pl-8 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={addEquipmentTransaction} className="w-full" disabled={!selectedRacer || !selectedItem}>
                  Add Equipment Transaction (${(price * quantity).toFixed(2)})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investor Income */}
          <TabsContent value="investor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Add Investor Income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="investor-name">Investor Name</Label>
                    <Input
                      id="investor-name"
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="Enter investor name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="investor-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="investor-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={investorAmount}
                        onChange={(e) => setInvestorAmount(Number.parseFloat(e.target.value) || 0)}
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={addInvestorIncome} className="w-full" disabled={!investorName || investorAmount <= 0}>
                  Add Investor Income (${investorAmount.toFixed(2)})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Racer Trading */}
          <TabsContent value="trading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Racer Trading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="racer-name">Racer Name</Label>
                    <Input
                      id="racer-name"
                      value={racerName}
                      onChange={(e) => setRacerName(e.target.value)}
                      placeholder="Enter racer name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="trading-type">Type</Label>
                    <Select value={tradingType} onValueChange={(value: "buy" | "sell") => setTradingType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy Racer</SelectItem>
                        <SelectItem value="sell">Sell Racer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="trading-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="trading-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={tradingAmount}
                        onChange={(e) => setTradingAmount(Number.parseFloat(e.target.value) || 0)}
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={addRacerTrading} className="w-full" disabled={!racerName || tradingAmount <= 0}>
                  {tradingType === "buy" ? "Buy" : "Sell"} Racer (${tradingAmount.toFixed(2)})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History ({transactions.length} transactions)</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No transactions yet</p>
                    <Button onClick={addSampleData} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sample Data
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Racer</TableHead>
                          <TableHead>Item/Description</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="text-sm text-gray-500">{transaction.timestamp}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  transaction.type === "equipment"
                                    ? "destructive"
                                    : transaction.type === "investor"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.racer === "Crew Balance" ? "secondary" : "outline"}>
                                {transaction.racer}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{transaction.item}</TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>
                              <span
                                className={
                                  transaction.type === "equipment"
                                    ? "text-red-600"
                                    : transaction.type === "investor"
                                      ? "text-green-600"
                                      : transaction.price >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                              >
                                ${Math.abs(transaction.price).toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">${transaction.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => deleteTransaction(transaction.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Speed Racing Syndicate Financial Management System v38</p>
          <p>Data is automatically saved to your browser's local storage</p>
          <p className="text-xs">Share ID: {shareId}</p>
        </div>
      </div>
    </div>
  )
}
