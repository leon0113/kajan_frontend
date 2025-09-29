import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { useState } from "react";

const ScenarioTable = ({ financialInputs }) => {
    // Calculate monthly income after tax
    const annualIncomeAfterTax = financialInputs.annualIncome * (1 - (financialInputs.taxRate || 25) / 100);
    const monthlyIncome = annualIncomeAfterTax / 12;

    // Fixed housing costs and debts
    const monthlyHousingCost = financialInputs.propertyTax + financialInputs.utilities + financialInputs.condoFee;
    const totalMonthlyDebts = financialInputs.carLoan + financialInputs.leasePayment +
        financialInputs.lineOfCredit + financialInputs.personalLoan +
        financialInputs.creditCards + financialInputs.studentLoan;

    // Calculate maximum affordable purchase price based on TDS ratio
    const calculateMaxPurchasePrice = (tdsLimit) => {
        // Maximum total housing + debt payment allowed
        const maxTotalPayment = monthlyIncome * (tdsLimit / 100);

        // Maximum mortgage payment = maxTotalPayment - housing costs - debts
        const maxMortgagePayment = maxTotalPayment - monthlyHousingCost - totalMonthlyDebts;

        // Use qualifying rate for stress test
        const qualifyingRate = Math.max(financialInputs.interestRate, 5.99);
        const monthlyRate = qualifyingRate / 100 / 12;
        const totalPayments = financialInputs.amortizationYears * 12;

        // Calculate maximum loan amount from payment
        const maxLoanAmount = maxMortgagePayment * (Math.pow(1 + monthlyRate, totalPayments) - 1) /
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments));

        // Add down payment to get purchase price
        const purchasePrice = maxLoanAmount + financialInputs.downPaymentAmount;

        return purchasePrice;
    };

    // Helper to calculate mortgage details
    const calculateScenario = (purchasePrice, downPayment, interestRate, amortizationYears, closingCostRate = 0.022) => {
        const loanAmount = purchasePrice - downPayment;

        // CMHC Insurance (only if down < 20%)
        const downPercent = (downPayment / purchasePrice) * 100;
        let cmhcPremium = 0;
        if (downPercent < 20) {
            // CMHC premium rates based on down payment percentage
            if (downPercent >= 15) cmhcPremium = loanAmount * 0.0280;
            else if (downPercent >= 10) cmhcPremium = loanAmount * 0.0310;
            else cmhcPremium = loanAmount * 0.0400;
        }

        const totalLoanAmount = loanAmount + cmhcPremium;

        // Monthly mortgage payment formula (at actual rate)
        const monthlyRate = interestRate / 100 / 12;
        const totalPayments = amortizationYears * 12;
        const monthlyPayment = totalLoanAmount > 0
            ? totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
            : 0;

        // Qualifying payment (stress test at higher rate)
        const qualifyingRate = Math.max(interestRate, 5.99);
        const qualifyingMonthlyRate = qualifyingRate / 100 / 12;
        const qualifyingPayment = totalLoanAmount > 0
            ? totalLoanAmount * (qualifyingMonthlyRate * Math.pow(1 + qualifyingMonthlyRate, totalPayments)) / (Math.pow(1 + qualifyingMonthlyRate, totalPayments) - 1)
            : 0;

        // Approx closing costs
        const closingCosts = purchasePrice * closingCostRate;

        // GDS / TDS
        const housingCost = monthlyPayment + monthlyHousingCost;
        const gds = (housingCost / monthlyIncome) * 100;
        const tds = ((housingCost + totalMonthlyDebts) / monthlyIncome) * 100;

        return {
            purchasePrice,
            downPayment,
            cmhcPremium,
            mortgageReq: totalLoanAmount,
            monthlyPayment,
            qualifyingPayment,
            gds,
            tds,
            closingCosts,
        };
    };

    // Calculate the three scenarios
    // MAXIMUM STRETCH: Use current calculation from main component (TDS ~44%)
    const currentHomePrice = monthlyIncome * 12 * 5; // Same as main component
    const maxStretch = calculateScenario(
        currentHomePrice,
        financialInputs.downPaymentAmount,
        financialInputs.interestRate,
        financialInputs.amortizationYears
    );

    // BALANCED BUDGET: Target TDS of 40% (standard maximum)
    const balancedPrice = calculateMaxPurchasePrice(40);
    const balancedBudget = calculateScenario(
        balancedPrice,
        financialInputs.downPaymentAmount,
        financialInputs.interestRate,
        financialInputs.amortizationYears
    );

    // PLAY IT SAFE: Target TDS of 32% (conservative, GDS limit)
    const safePrice = calculateMaxPurchasePrice(32);
    const playItSafe = calculateScenario(
        safePrice,
        financialInputs.downPaymentAmount,
        financialInputs.interestRate,
        financialInputs.amortizationYears
    );

    const scenarios = [
        { title: "MAXIMUM STRETCH", data: maxStretch, color: "bg-red-600" },
        { title: "BALANCED BUDGET", data: balancedBudget, color: "bg-yellow-600" },
        { title: "PLAY IT SAFE", data: playItSafe, color: "bg-green-600" },
    ];

    const rows = [
        { label: "PURCHASE PRICE", key: "purchasePrice", format: "currency" },
        { label: "MIN DOWN PAYMENT", key: "downPayment", format: "currency" },
        { label: "CMHC PREMIUM", key: "cmhcPremium", format: "currency" },
        { label: "MORTGAGE REQ", key: "mortgageReq", format: "currency" },
        { label: "MORTGAGE PAYMENT (Per Month)", key: "monthlyPayment", format: "currency" },
        { label: "QUALIFYING PAYMENT", key: "qualifyingPayment", format: "currency" },
        { label: "GDS (Gross Debt Service)", key: "gds", format: "percentage" },
        { label: "TDS (Total Debt Service)", key: "tds", format: "percentage" },
        { label: "CLOSING COSTS (APPROX)", key: "closingCosts", format: "currency" },
    ];

    const formatValue = (value, format) => {
        if (format === "currency") {
            return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (format === "percentage") {
            return `${value.toFixed(2)}%`;
        }
        return value.toString();
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold w-1/4"></th>
                        {scenarios.map((scenario) => (
                            <th
                                key={scenario.title}
                                className={`border border-gray-300 p-3 text-center font-bold text-white ${scenario.color}`}
                            >
                                {scenario.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={row.label} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border border-gray-300 p-3 font-semibold text-gray-700">
                                {row.label}
                            </td>
                            {scenarios.map((scenario) => (
                                <td key={`${scenario.title}-${row.key}`} className="border border-gray-300 p-3 text-right font-bold">
                                    {formatValue(scenario.data[row.key], row.format)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScenarioTable;