"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { RacerTransaction } from "@/types/transaction"
import { formatCurrency } from "@/lib/utils"

interface RacerTransactionFormProps {
  onSubmit: (racerTransaction: RacerTransaction) => void
  currentBalance: number
}

export function RacerTransactionForm({ onSubmit, currentBalance }: RacerTransactionFormProps) {
  const [racerTransaction, setRacerTransaction] = useState<Omit<RacerTransaction, "id">>({
    racerName: "",
    type: "buy",
    price: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (field: keyof Omit<RacerTransaction, "id">, value: any) => {
    setRacerTransaction({ ...racerTransaction, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!racerTransaction.racerName || racerTransaction.price <= 0) {
      return
    }

    // Check if there's enough balance for buying a racer
    if (racerTransaction.type === "buy" && racerTransaction.price > currentBalance) {
      return
    }

    onSubmit(racerTransaction as RacerTransaction)
    setRacerTransaction({
      racerName: "",
      type: "buy",
      price: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Calculate new balance after transaction
  const newBalance =
    racerTransaction.type === "buy" ? currentBalance - racerTransaction.price : currentBalance + racerTransaction.price

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="racerName">Racer Name</Label>
          <Input
            id="racerName"
            type="text"
            placeholder="Enter racer name"
            value={racerTransaction.racerName}
            onChange={(e) => handleChange("racerName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <RadioGroup
            value={racerTransaction.type}
            onValueChange={(value) => handleChange("type", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="cursor-pointer">
                Buy Racer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="cursor-pointer">
                Sell Racer
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={racerTransaction.price}
              onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
              className="pl-7"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={racerTransaction.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter details about the racer, skills, experience, etc..."
          value={racerTransaction.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
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
            <p className={`text-2xl font-bold ${newBalance >= 0 ? "text-gray-600" : "text-red-600"}`}>
              {formatCurrency(newBalance)}
            </p>
            <p className="text-sm text-gray-500">
              {racerTransaction.type === "buy" ? "After purchasing racer" : "After selling racer"}
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={racerTransaction.type === "buy" && racerTransaction.price > currentBalance}
      >
        {racerTransaction.type === "buy" && racerTransaction.price > currentBalance
          ? "Insufficient Balance"
          : racerTransaction.type === "buy"
            ? "Purchase Racer"
            : "Sell Racer"}
      </Button>
    </form>
  )
}
