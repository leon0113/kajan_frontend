import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator as CalculatorIcon, DollarSign, Percent, Save, Download } from "lucide-react";
import MortgageCalculator from "@/components/calculator/MortgageCalculator";

export default function Calculator() {
  // Mortgage Calculator State
  const [mortgageInputs, setMortgageInputs] = useState({
    homePrice: 500000,
    downPayment: 100000,
    interestRate: 5.25,
    amortization: 25,
    paymentFrequency: "monthly",
  });

  // ROI Calculator State  
  const [roiInputs, setRoiInputs] = useState({
    purchasePrice: 400000,
    monthlyRent: 2500,
    expenses: 800,
    appreciation: 3,
    holdingPeriod: 5,
  });

  // Commission Calculator State
  const [commissionInputs, setCommissionInputs] = useState({
    salePrice: 600000,
    commissionRate: 2.5,
    splits: 50,
    brokerageFee: 500,
  });

  // Mortgage Calculations
  const loanAmount = mortgageInputs.homePrice - mortgageInputs.downPayment;
  const monthlyRate = mortgageInputs.interestRate / 100 / 12;
  const totalPayments = mortgageInputs.amortization * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // CMHC Insurance (simplified calculation for down payment < 20%)
  const downPaymentPercent = (mortgageInputs.downPayment / mortgageInputs.homePrice) * 100;
  const requiresCMHC = downPaymentPercent < 20;
  const cmhcRate = downPaymentPercent < 10 ? 0.04 : downPaymentPercent < 15 ? 0.031 : 0.028;
  const cmhcPremium = requiresCMHC ? loanAmount * cmhcRate : 0;

  // ROI Calculations
  const annualRent = roiInputs.monthlyRent * 12;
  const annualExpenses = roiInputs.expenses * 12;
  const netRentalIncome = annualRent - annualExpenses;
  const cashOnCash = (netRentalIncome / roiInputs.purchasePrice) * 100;
  const futureValue = roiInputs.purchasePrice * Math.pow(1 + roiInputs.appreciation / 100, roiInputs.holdingPeriod);
  const totalAppreciation = futureValue - roiInputs.purchasePrice;

  // Commission Calculations
  const grossCommission = (commissionInputs.salePrice * commissionInputs.commissionRate) / 100;
  const agentSplit = (grossCommission * commissionInputs.splits) / 100;
  const netCommission = agentSplit - commissionInputs.brokerageFee;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calculators</h1>
          <p className="text-muted-foreground">
            Mortgage, ROI, and commission calculators for your clients and business.
          </p>
        </div>
      </div>

      <Tabs defaultValue="mortgage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mortgage">Mortgage Calculator</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          <TabsTrigger value="commission">Commission Calculator</TabsTrigger>
        </TabsList>

        {/* Mortgage Calculator */}
        <TabsContent value="mortgage">
          <MortgageCalculator />
        </TabsContent>

        {/* ROI Calculator */}
        <TabsContent value="roi">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Investment Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (CAD)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={roiInputs.purchasePrice}
                    onChange={(e) => setRoiInputs(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent (CAD)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={roiInputs.monthlyRent}
                    onChange={(e) => setRoiInputs(prev => ({ ...prev, monthlyRent: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenses">Monthly Expenses (CAD)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={roiInputs.expenses}
                    onChange={(e) => setRoiInputs(prev => ({ ...prev, expenses: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Annual Appreciation: {roiInputs.appreciation}%</Label>
                  <Slider
                    value={[roiInputs.appreciation]}
                    onValueChange={(value) => setRoiInputs(prev => ({ ...prev, appreciation: value[0] }))}
                    max={10}
                    min={0}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Holding Period: {roiInputs.holdingPeriod} years</Label>
                  <Slider
                    value={[roiInputs.holdingPeriod]}
                    onValueChange={(value) => setRoiInputs(prev => ({ ...prev, holdingPeriod: value[0] }))}
                    max={20}
                    min={1}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Rental Income:</span>
                    <span className="font-semibold">${annualRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Expenses:</span>
                    <span className="font-semibold">${annualExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-success">
                    <span>Net Annual Income:</span>
                    <span>${netRentalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Cash-on-Cash ROI:</span>
                    <span>{cashOnCash.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Future Value:</span>
                    <span className="font-semibold">${futureValue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Total Appreciation:</span>
                    <span>${totalAppreciation.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commission Calculator */}
        <TabsContent value="commission">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Commission Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (CAD)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={commissionInputs.salePrice}
                    onChange={(e) => setCommissionInputs(prev => ({ ...prev, salePrice: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commission Rate: {commissionInputs.commissionRate}%</Label>
                  <Slider
                    value={[commissionInputs.commissionRate]}
                    onValueChange={(value) => setCommissionInputs(prev => ({ ...prev, commissionRate: value[0] }))}
                    max={7}
                    min={1}
                    step={0.25}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Agent Split: {commissionInputs.splits}%</Label>
                  <Slider
                    value={[commissionInputs.splits]}
                    onValueChange={(value) => setCommissionInputs(prev => ({ ...prev, splits: value[0] }))}
                    max={100}
                    min={30}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerageFee">Brokerage Fees (CAD)</Label>
                  <Input
                    id="brokerageFee"
                    type="number"
                    value={commissionInputs.brokerageFee}
                    onChange={(e) => setCommissionInputs(prev => ({ ...prev, brokerageFee: Number(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Price:</span>
                    <span className="font-semibold">${commissionInputs.salePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Commission:</span>
                    <span className="font-semibold">${grossCommission.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent Split ({commissionInputs.splits}%):</span>
                    <span className="font-semibold">${agentSplit.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brokerage Fees:</span>
                    <span className="font-semibold">-${commissionInputs.brokerageFee.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-success border-t pt-3">
                    <span>Net Commission:</span>
                    <span>${netCommission.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}