import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { useState } from "react";
import ScenarioTable from "./CalculatedScenario";

const MortgageCalculator = () => {

    const [mortgageInputs, setMortgageInputs] = useState({
        homePrice: 500000,
        downPayment: 100000,
        interestRate: 5.25,
        amortization: 25,
        paymentFrequency: "monthly",
    });

    // Financial Profile State
    const [financialInputs, setFinancialInputs] = useState({
        annualIncome: 105000,
        downPaymentAmount: 80000,
        interestRate: 4.99,
        amortizationYears: 30,
        propertyTax: 350,
        utilities: 400,
        condoFee: 0,
        groceries: 800,
        transportation: 400,
        carInsurance: 300,
        phoneBill: 200,
        childCare: 300,
        lifeHealthInsurance: 100,
        shopping: 400,
        restaurantFood: 300,
        subscriptions: 50,
        savingsContributions: 0,
        miscExpenses: 0,
        carLoan: 500,
        leasePayment: 0,
        lineOfCredit: 0,
        personalLoan: 0,
        creditCards: 0,
        studentLoan: 0
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

    // Mortgage calculations using financialInputs
    const monthlyIncome = financialInputs.annualIncome / 12;
    const monthlyHousingCost = financialInputs.propertyTax + financialInputs.utilities + financialInputs.condoFee;
    const totalLivingExpenses = financialInputs.groceries + financialInputs.transportation +
        financialInputs.carInsurance + financialInputs.phoneBill + financialInputs.childCare +
        financialInputs.lifeHealthInsurance + financialInputs.shopping + financialInputs.restaurantFood +
        financialInputs.subscriptions + financialInputs.savingsContributions + financialInputs.miscExpenses;
    const totalMonthlyDebts = financialInputs.carLoan + financialInputs.leasePayment +
        financialInputs.lineOfCredit + financialInputs.personalLoan + financialInputs.creditCards +
        financialInputs.studentLoan;

    // Mortgage payment calculation
    const monthlyRate = financialInputs.interestRate / 100 / 12;
    const totalPayments = financialInputs.amortizationYears * 12;
    const homePrice = monthlyIncome * 12 * 5; // Rough estimate for display
    const loanAmount = homePrice - financialInputs.downPaymentAmount;
    const monthlyPayment = loanAmount > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1) : 0;

    // Qualifying ratios
    const gds = ((monthlyPayment + monthlyHousingCost) / monthlyIncome) * 100;
    const tds = ((monthlyPayment + monthlyHousingCost + totalMonthlyDebts) / monthlyIncome) * 100;
    const minimumQualifyingRate = Math.max(financialInputs.interestRate, 6.99); // Stress test rate
    const qualifyingPayment = monthlyPayment + monthlyHousingCost;

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
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Financial Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Income Section */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                        <div>
                            <Label className="text-xs font-semibold text-slate-600">Annual Household Income</Label>
                            <Input
                                type="number"
                                value={financialInputs.annualIncome}
                                onChange={(e) => setFinancialInputs(prev => ({ ...prev, annualIncome: Number(e.target.value) }))}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-green-600">${financialInputs.annualIncome.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Mortgage Details */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 items-center border-b pb-2">
                            <Label className="text-sm font-medium">Down Payment</Label>
                            <Input
                                type="number"
                                value={financialInputs.downPaymentAmount}
                                onChange={(e) => setFinancialInputs(prev => ({ ...prev, downPaymentAmount: Number(e.target.value) }))}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center border-b pb-2">
                            <Label className="text-sm font-medium">Enter Interest Rate</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={financialInputs.interestRate}
                                onChange={(e) => setFinancialInputs(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center border-b pb-2">
                            <Label className="text-sm font-medium">Amortization (Years)</Label>
                            <Input
                                type="number"
                                value={financialInputs.amortizationYears}
                                onChange={(e) => setFinancialInputs(prev => ({ ...prev, amortizationYears: Number(e.target.value) }))}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>

                    {/* Qualifying Rate and Payment */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-red-50 rounded-lg">
                        <div>
                            <Label className="text-sm font-semibold text-red-700">Minimum Qualifying Rate</Label>
                            <div className="text-lg font-bold text-red-600">{minimumQualifyingRate.toFixed(2)}%</div>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-red-700">Qualifying Payment</Label>
                            <div className="text-lg font-bold text-red-600">${qualifyingPayment.toFixed(0)}</div>
                        </div>
                    </div>

                    {/* Monthly Housing Cost */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Label className="text-sm font-semibold text-blue-700 block mb-2">MONTHLY HOUSING COST</Label>
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label className="text-xs">Property Tax</Label>
                                <Input
                                    type="number"
                                    value={financialInputs.propertyTax}
                                    onChange={(e) => setFinancialInputs(prev => ({ ...prev, propertyTax: Number(e.target.value) }))}
                                    className="h-7 text-xs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label className="text-xs">Utilities (Hydro+Water+Heating+Ins)</Label>
                                <Input
                                    type="number"
                                    value={financialInputs.utilities}
                                    onChange={(e) => setFinancialInputs(prev => ({ ...prev, utilities: Number(e.target.value) }))}
                                    className="h-7 text-xs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label className="text-xs">Condo Fee(if applicable)</Label>
                                <Input
                                    type="number"
                                    value={financialInputs.condoFee}
                                    onChange={(e) => setFinancialInputs(prev => ({ ...prev, condoFee: Number(e.target.value) }))}
                                    className="h-7 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Living Expenses */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Label className="text-sm font-semibold text-gray-700 block mb-2">LIVING EXPENSES</Label>
                            <div className="space-y-1">
                                {[
                                    { key: 'groceries', label: 'Groceries' },
                                    { key: 'transportation', label: 'Transportation (Gas/Fare)' },
                                    { key: 'carInsurance', label: 'Car Insurance' },
                                    { key: 'phoneBill', label: 'Phone/Broadband bill' },
                                    { key: 'childCare', label: 'Child Care' },
                                    { key: 'lifeHealthInsurance', label: 'Life/Health Insurance' },
                                    { key: 'shopping', label: 'Shopping' },
                                    { key: 'restaurantFood', label: 'Restaurant/Food Bill' },
                                    { key: 'subscriptions', label: 'Monthly Subscriptions' },
                                    { key: 'savingsContributions', label: 'Contributions to savings' },
                                    { key: 'miscExpenses', label: 'Misc (if any)' }
                                ].map(({ key, label }) => (
                                    <div key={key} className="grid grid-cols-2 gap-4 items-center">
                                        <Label className="text-xs">{label}</Label>
                                        <Input
                                            type="number"
                                            value={financialInputs[key]}
                                            onChange={(e) => setFinancialInputs(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                            className="h-6 text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Debts */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <Label className="text-sm font-semibold text-gray-700 block mb-2">MONTHLY DEBTS</Label>
                            <div className="space-y-1">
                                {[
                                    { key: 'carLoan', label: 'Car Loan' },
                                    { key: 'leasePayment', label: 'Lease payment' },
                                    { key: 'lineOfCredit', label: 'Line of Credit' },
                                    { key: 'personalLoan', label: 'Personal Loan' },
                                    { key: 'creditCards', label: 'Credit Cards' },
                                    { key: 'studentLoan', label: 'Student Loan' }
                                ].map(({ key, label }) => (
                                    <div key={key} className="grid grid-cols-2 gap-4 items-center">
                                        <Label className="text-xs">{label}</Label>
                                        <Input
                                            type="number"
                                            value={financialInputs[key]}
                                            onChange={(e) => setFinancialInputs(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                            className="h-6 text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Summary & Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Monthly Income vs Expenses */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Monthly Cash Flow</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-green-600 font-medium">Monthly Income:</span>
                                <span className="font-bold text-green-600">${monthlyIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-600">Housing Costs:</span>
                                <span className="font-semibold text-blue-600">${(monthlyPayment + monthlyHousingCost).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Living Expenses:</span>
                                <span className="font-semibold text-gray-600">${totalLivingExpenses.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-600">Monthly Debts:</span>
                                <span className="font-semibold text-red-600">${totalMonthlyDebts.toFixed(0)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Remaining Cash:</span>
                                <span className={`font-bold ${(monthlyIncome - monthlyPayment - monthlyHousingCost - totalLivingExpenses - totalMonthlyDebts) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${(monthlyIncome - monthlyPayment - monthlyHousingCost - totalLivingExpenses - totalMonthlyDebts).toFixed(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mortgage Details */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Mortgage Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Home Price:</span>
                                <span className="font-semibold">${homePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Loan Amount:</span>
                                <span className="font-semibold">${loanAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl">
                                <span className="font-bold text-primary">Monthly Payment:</span>
                                <span className="font-bold text-primary">${monthlyPayment.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Interest (Life of Loan):</span>
                                <span className="font-semibold">${((monthlyPayment * totalPayments) - loanAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Debt Service Ratios */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Qualification Ratios</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">Gross Debt Service (GDS):</span>
                                    <p className="text-xs text-muted-foreground">Should be ≤ 32%</p>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold text-lg ${gds <= 32 ? 'text-green-600' : 'text-red-600'}`}>
                                        {gds.toFixed(1)}%
                                    </span>
                                    <span className={`block text-xs ${gds <= 32 ? 'text-green-600' : 'text-red-600'}`}>
                                        {gds <= 32 ? '✓ Qualified' : '✗ Too High'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">Total Debt Service (TDS):</span>
                                    <p className="text-xs text-muted-foreground">Should be ≤ 40%</p>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold text-lg ${tds <= 40 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tds.toFixed(1)}%
                                    </span>
                                    <span className={`block text-xs ${tds <= 40 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tds <= 40 ? '✓ Qualified' : '✗ Too High'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Affordability Summary */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Affordability Analysis</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Maximum Affordable Home Price:</span>
                                <span className="font-bold text-purple-600">
                                    ${(loanAmount + financialInputs.downPaymentAmount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Down Payment Required:</span>
                                <span className="font-semibold">${financialInputs.downPaymentAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Down Payment %:</span>
                                <span className="font-semibold">
                                    {((financialInputs.downPaymentAmount / (loanAmount + financialInputs.downPaymentAmount)) * 100).toFixed(1)}%
                                </span>
                            </div>
                            {((financialInputs.downPaymentAmount / (loanAmount + financialInputs.downPaymentAmount)) * 100) < 20 && (
                                <div className="p-2 bg-orange-100 rounded text-sm">
                                    <span className="text-orange-600 font-medium">⚠️ CMHC Insurance Required</span>
                                    <p className="text-xs mt-1">Down payment is less than 20%. Mortgage insurance will be added to your loan.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ROI Analysis (if applicable) */}
                    {roiInputs.monthlyRent > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">Investment Analysis</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Annual Rental Income:</span>
                                    <span className="font-semibold text-green-600">${annualRent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Net Rental Income:</span>
                                    <span className="font-semibold">${netRentalIncome.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cash-on-Cash Return:</span>
                                    <span className="font-bold text-green-600">{cashOnCash.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Commission Analysis (if applicable) */}
                    {commissionInputs.salePrice > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">Commission Breakdown</h3>
                            <div className="space-y-2">x
                                <div className="flex justify-between">
                                    <span>Gross Commission:</span>
                                    <span className="font-semibold">${grossCommission.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Agent Split ({commissionInputs.splits}%):</span>
                                    <span className="font-semibold">${agentSplit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Net Commission:</span>
                                    <span className="font-bold text-blue-600">${netCommission.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Affordability Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScenarioTable financialInputs={financialInputs} />
                </CardContent>
            </Card>
        </div>
    )
}

export default MortgageCalculator