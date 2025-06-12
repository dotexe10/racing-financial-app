"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { InvestorIncome } from "@/types/transaction"
import { formatCurrency } from "@/lib/utils"

interface InvestorIncomeFormProps {
  onSubmit: (income: InvestorIncome) => void
  currentBalance: number
}

export function InvestorIncomeForm({ onSubmit, currentBalance }: InvestorIncomeFormProps) {
  const [income, setIncome] = useState<Omit<InvestorIncome, "id">>({
    investorName: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (field: keyof Omit<InvestorIncome, "id">, value: any) => {
    setIncome({ ...income, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!income.investorName || income.amount <= 0) {
      return
    }
    onSubmit(income as InvestorIncome)
    setIncome({
      investorName: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const newBalance = currentBalance + income.amount

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="investor">Investor Name</Label>
          <Input
            id="investor"
            type="text"
            placeholder="Enter investor name"
            value={income.investorName}
            onChange={(e) => handleChange("investorName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Investment Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={income.amount}
              onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value))}
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
            value={income.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>New Balance After Investment</Label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(newBalance)}</p>
            <p className="text-sm text-green-500">
              {formatCurrency(currentBalance)} + {formatCurrency(income.amount)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter investment description or notes..."
          value={income.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Current Racing Crew Balance</Label>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className={`text-2xl font-bold ${currentBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {formatCurrency(currentBalance)}
          </p>
          <p className="text-sm text-blue-500">Available balance</p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Investment
      </Button>
    </form>
  )
}
