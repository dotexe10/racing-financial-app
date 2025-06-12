"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types/transaction"
import { formatCurrency } from "@/lib/utils"

const RACERS = ["Racer 1", "Racer 2", "Racer 3", "Racer 4", "Racer 5", "Racer 6", "Racer 7", "Racer 8"]

// Updated item list without Robot Service
const ITEMS = ["Extrapart", "Harness", "Fake Plate", "Dongel", "Voucher Chip", "Repair Kit"]

// Updated prices as requested
const ITEM_PRICES = {
  Extrapart: 150,
  Harness: 1000,
  "Fake Plate": 800,
  Dongel: 5000,
  "Voucher Chip": 1500,
  "Repair Kit": 500,
}

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void
  currentBalance: number
}

export function TransactionForm({ onSubmit, currentBalance }: TransactionFormProps) {
  const [transaction, setTransaction] = useState<Omit<Transaction, "id">>({
    racer: "",
    item: "",
    quantity: 1,
    price: 0,
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (field: keyof Omit<Transaction, "id">, value: any) => {
    if (field === "item" && value && ITEM_PRICES[value as keyof typeof ITEM_PRICES]) {
      // Auto-populate price when item is selected
      setTransaction({
        ...transaction,
        [field]: value,
        price: ITEM_PRICES[value as keyof typeof ITEM_PRICES],
      })
    } else if (field !== "price") {
      // Prevent manual price changes
      setTransaction({ ...transaction, [field]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transaction.racer || !transaction.item || transaction.price <= 0) {
      return
    }
    onSubmit(transaction as Transaction)
    setTransaction({
      racer: "",
      item: "",
      quantity: 1,
      price: 0,
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Calculate total shopping
  const totalShopping = transaction.price * transaction.quantity

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="racer">Racer</Label>
          <Select value={transaction.racer} onValueChange={(value) => handleChange("racer", value)} required>
            <SelectTrigger id="racer">
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

        <div className="space-y-2">
          <Label htmlFor="item">Item</Label>
          <Select value={transaction.item} onValueChange={(value) => handleChange("item", value)} required>
            <SelectTrigger id="item">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {ITEMS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={transaction.quantity}
            onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (Auto-filled)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="price"
              type="number"
              value={transaction.price}
              className="pl-7 bg-gray-50 cursor-not-allowed"
              readOnly
              disabled
            />
          </div>
          <p className="text-xs text-gray-500">Price is automatically set based on selected item</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={transaction.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Total Shopping</Label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalShopping)}</p>
            <p className="text-sm text-green-500">
              {transaction.quantity} × {formatCurrency(transaction.price)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Current Racing Crew Balance</Label>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className={`text-2xl font-bold ${currentBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatCurrency(currentBalance)}
            </p>
            <p className="text-sm text-blue-500">Available balance</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Balance After Transaction</Label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p
              className={`text-2xl font-bold ${(currentBalance - totalShopping) >= 0 ? "text-gray-600" : "text-red-600"}`}
            >
              {formatCurrency(currentBalance - totalShopping)}
            </p>
            <p className="text-sm text-gray-500">Balance after purchase</p>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={totalShopping > currentBalance}>
        {totalShopping > currentBalance ? "Insufficient Balance" : "Add Transaction"}
      </Button>
    </form>
  )
}
