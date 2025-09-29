// Closing costs (approximately 2-3% of home price)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Home, PiggyBank, Plus, X } from "lucide-react";
import { useState } from "react";

const DownPaymentPlanner = () => {
    const [inputs, setInputs] = useState({
        targetHomePrice: 700000,
        targetDownPayment: 80000,
        isFirstTimeBuyer: true,
        cashBalance: 10000,
        fhsaBalance: 4000,
        rrspBalance: 8000,
        timelineYears: 3,
        annualReturn: 3,
        fhsaContributionLimit: 8000,
        fhsaLifetimeLimit: 40000,
        rrspWithdrawalLimit: 60000,
        rrspAvailable: 8000,
        repaymentPeriod: 15
    });

    const [savingsRows, setSavingsRows] = useState([
        {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            fhsaContribution: 100,
            rrspContribution: 200,
            otherSavings: 400
        }
    ]);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: field === 'isFirstTimeBuyer' ? value : (parseFloat(value) || 0)
        }));
    };

    const addSavingsRow = () => {
        const newRow = {
            id: savingsRows.length > 0 ? Math.max(...savingsRows.map(r => r.id)) + 1 : 1,
            date: new Date().toISOString().split('T')[0],
            fhsaContribution: 0,
            rrspContribution: 0,
            otherSavings: 0
        };
        setSavingsRows([...savingsRows, newRow]);
    };

    const removeSavingsRow = (id) => {
        if (savingsRows.length > 1) {
            setSavingsRows(savingsRows.filter(row => row.id !== id));
        }
    };

    const handleSavingsRowChange = (id, field, value) => {
        setSavingsRows(savingsRows.map(row =>
            row.id === id ? { ...row, [field]: field === 'date' ? value : (parseFloat(value) || 0) } : row
        ));
    };

    const calculateRowTotals = (row, previousTotal) => {
        const totalSaved = row.fhsaContribution + row.rrspContribution + row.otherSavings;
        const runningTotal = previousTotal + totalSaved;
        const savingsGrowth = totalSaved + ((totalSaved * inputs.annualReturn) / 12 / 100);
        return { totalSaved, savingsGrowth, runningTotal: runningTotal + savingsGrowth };
    };

    // Calculate down payment requirements using Excel formula
    // =IF(F6<=500000, 5%*F6, IF(AND(F6>500000, F6<=1499999), 25000+10%*(F6-500000), IF(F6>=1500000, 20%*F6, "Your Else Value")))
    const calculateDownPaymentRequired = (price) => {
        if (price <= 500000) {
            return price * 0.05;
        } else if (price > 500000 && price <= 1499999) {
            return 25000 + 0.10 * (price - 500000);
        } else if (price >= 1500000) {
            return price * 0.20;
        }
        return 0; // Default case
    };

    const minDownPayment = calculateDownPaymentRequired(inputs.targetHomePrice);
    const downPaymentPercent = (inputs.targetDownPayment / inputs.targetHomePrice) * 100;

    // CMHC Premium calculation
    const calculateCMHCPremium = (price, downPayment) => {
        const ratio = (downPayment / price) * 100;
        const loanAmount = price - downPayment;

        if (ratio >= 20) return 0;
        if (ratio >= 15 && ratio < 20) return loanAmount * 0.028;
        if (ratio >= 10 && ratio < 15) return loanAmount * 0.031;
        return loanAmount * 0.04;
    };

    const cmhcPremium = calculateCMHCPremium(inputs.targetHomePrice, inputs.targetDownPayment);

    // Current savings
    const totalCurrentSavings = savingsRows.map(row => row.fhsaContribution + row.rrspContribution + row.otherSavings).reduce((a, b) => a + b, 0)
    const shortfall = inputs.targetDownPayment - totalCurrentSavings;

    // Calculate total savings growth from all rows
    const totalSavingsGrowth = savingsRows.reduce((acc, row, index) => {
        const previousTotal = index === 0 ? totalCurrentSavings :
            savingsRows.slice(0, index).reduce((total, r) => {
                const calc = calculateRowTotals(r, index === 0 ? totalCurrentSavings : total);
                return calc.runningTotal;
            }, totalCurrentSavings);

        const { runningTotal } = calculateRowTotals(row, previousTotal);

        return runningTotal;
    }, 0);

    console.log("Total Savings Growth:", totalSavingsGrowth);
    console.log("down", inputs.targetDownPayment)
    const remainingToSave = inputs.targetDownPayment - totalCurrentSavings;

    // Monthly savings calculation
    const monthsToSave = inputs.timelineYears * 12;
    const monthlyReturn = inputs.annualReturn / 100 / 12;

    // Future value of current savings with compound interest
    const futureValueCurrentSavings = totalCurrentSavings * Math.pow(1 + monthlyReturn, monthsToSave);

    // Calculate monthly payment needed using future value of annuity formula
    const monthlySavingGoal = remainingToSave > 0
        ? (remainingToSave / (((Math.pow(1 + monthlyReturn, monthsToSave) - 1) / monthlyReturn)))
        : 0;

    // Closing costs (approximately 2-3% of home price)
    const closingCosts = inputs.targetHomePrice * 0.022;

    // Generate savings schedule
    const generateSchedule = () => {
        const schedule = [];
        let totalSaved = totalCurrentSavings;
        const monthlyFHSA = Math.min(inputs.fhsaContributionLimit / 12, monthlySavingGoal * 0.3);
        const monthlyRRSP = Math.min(monthlySavingGoal * 0.3, 500);
        const monthlyOther = monthlySavingGoal - monthlyFHSA - monthlyRRSP;

        for (let i = 1; i <= Math.min(monthsToSave, 36); i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);

            const monthlyTotal = monthlySavingGoal;
            const growth = totalSaved * monthlyReturn;
            totalSaved += monthlyTotal + growth;

            schedule.push({
                month: i,
                date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
                fhsaContribution: monthlyFHSA,
                rrspContribution: monthlyRRSP,
                otherSavings: monthlyOther,
                totalSaved: monthlyTotal,
                savingsGrowth: growth
            });
        }
        return schedule;
    };

    const schedule = generateSchedule();
    const projectedTotal = schedule.length > 0 ? schedule[schedule.length - 1].totalSaved : 0;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Home className="h-6 w-6" />
                        DOWN PAYMENT PLANNER
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Enter Values */}
                        <div className="space-y-4">
                            <div className="bg-gray-100 p-4 rounded">
                                <h3 className="font-bold mb-4">ENTER VALUES</h3>

                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-semibold">Target Home Price</Label>
                                        <div className="flex items-center">
                                            <span className="mr-2">$</span>
                                            <Input
                                                type="text"
                                                value={inputs.targetHomePrice.toLocaleString()}
                                                onChange={(e) => handleInputChange('targetHomePrice', e.target.value.replace(/,/g, ''))}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold">Target Down Payment Amount</Label>
                                        <div className="flex items-center">
                                            <span className="mr-2">$</span>
                                            <Input
                                                type="text"
                                                value={inputs.targetDownPayment.toLocaleString()}
                                                onChange={(e) => handleInputChange('targetDownPayment', e.target.value.replace(/,/g, ''))}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold">Are you a First Time Home Buyer?</Label>
                                        <select
                                            value={inputs.isFirstTimeBuyer ? "Yes" : "No"}
                                            onChange={(e) => handleInputChange('isFirstTimeBuyer', e.target.value === "Yes")}
                                            className="w-full h-9 px-3 rounded-md border border-gray-300 bg-blue-400 text-white font-bold"
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-4 rounded">
                                <h3 className="font-bold mb-4 bg-blue-600 text-white p-2 -m-4 mb-4 rounded-t">Current Savings</h3>

                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-semibold">Cash Balance (including TFSA)</Label>
                                        <div className="flex items-center">
                                            <span className="mr-2">$</span>
                                            <Input
                                                type="text"
                                                value={inputs.cashBalance.toLocaleString()}
                                                onChange={(e) => handleInputChange('cashBalance', e.target.value.replace(/,/g, ''))}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold">FHSA Balance</Label>
                                        <div className="flex items-center">
                                            <span className="mr-2">$</span>
                                            <Input
                                                type="text"
                                                value={inputs.fhsaBalance.toLocaleString()}
                                                onChange={(e) => handleInputChange('fhsaBalance', e.target.value.replace(/,/g, ''))}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold">RSP Balance</Label>
                                        <div className="flex items-center">
                                            <span className="mr-2">$</span>
                                            <Input
                                                type="text"
                                                value={inputs.rrspBalance.toLocaleString()}
                                                onChange={(e) => handleInputChange('rrspBalance', e.target.value.replace(/,/g, ''))}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-4 rounded">
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-semibold">Timeline to Save (in years)</Label>
                                        <Input
                                            type="number"
                                            value={inputs.timelineYears}
                                            onChange={(e) => handleInputChange('timelineYears', e.target.value)}
                                            className="h-9"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold">Expected Annual Return on Savings (in %age)</Label>
                                        <Input
                                            type="number"
                                            value={inputs.annualReturn}
                                            onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-500 text-white p-4 rounded flex justify-between items-center">
                                <span className="font-bold">Monthly Saving Goal</span>
                                <span className="text-2xl font-bold">${monthlySavingGoal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        {/* Middle Column - Down Payment & Sources */}
                        <div className="space-y-4">
                            {/* Down Payment Required */}
                            <div className="bg-blue-500 text-white p-4 rounded">
                                <h3 className="font-bold mb-3">Down Payment Required</h3>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-xs">${minDownPayment}</div>
                                        <div className="text-xs font-bold">Minimum Down</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-xs">${inputs.targetHomePrice * 0.1}</div>
                                        <div className="text-xs font-bold mt-3">10%</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-xs">${inputs.targetHomePrice * 0.15}</div>
                                        <div className="text-xs font-bold mt-3">15%</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-xs">${inputs.targetHomePrice * 0.2}</div>
                                        <div className="text-xs font-bold mt-3">20%</div>
                                    </div>

                                </div>
                            </div>

                            {/* CMHC Premium */}
                            <div className="bg-blue-500 text-white p-4 rounded">
                                <h3 className="font-bold mb-3">CMHC PREMIUM</h3>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-sm font-bold">${calculateCMHCPremium(inputs.targetHomePrice, minDownPayment).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-sm font-bold">${calculateCMHCPremium(inputs.targetHomePrice, inputs.targetHomePrice * 0.1).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-sm font-bold">${calculateCMHCPremium(inputs.targetHomePrice, inputs.targetHomePrice * 0.15).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                    </div>
                                    <div className="bg-blue-400 p-2 rounded">
                                        <div className="text-sm font-bold">${calculateCMHCPremium(inputs.targetHomePrice, inputs.targetHomePrice * 0.2).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Sources of Savings */}
                            {/* <div className="bg-blue-900 text-white p-4 rounded">
                                <h3 className="font-bold mb-4 text-center">SOURCES OF SAVINGS</h3>
                                <div className="flex justify-around items-end h-48">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-300 w-20 rounded-t" style={{ height: `${(inputs.cashBalance / inputs.targetDownPayment) * 150}px` }}>
                                            <div className="text-white font-bold text-xs p-2">${(inputs.cashBalance / 1000).toFixed(1)}k</div>
                                        </div>
                                        <div className="text-xs mt-2 font-bold">Cash</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-20 rounded-t" style={{ height: `${(inputs.fhsaBalance / inputs.targetDownPayment) * 150}px` }}>
                                            <div className="text-white font-bold text-xs p-2">${(inputs.fhsaBalance / 1000).toFixed(1)}k</div>
                                        </div>
                                        <div className="text-xs mt-2 font-bold">FHSA</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-200 w-20 rounded-t" style={{ height: `${(inputs.rrspBalance / inputs.targetDownPayment) * 150}px` }}>
                                            <div className="text-white font-bold text-xs p-2">${(inputs.rrspBalance / 1000).toFixed(1)}k</div>
                                        </div>
                                        <div className="text-xs mt-2 font-bold">RRSP</div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Down Payment Progress */}
                            {/* <div className="bg-blue-900 text-white p-4 rounded relative" style={{ height: '200px' }}>
                                <h3 className="font-bold mb-4 text-center">DOWN PAYMENT PROGRESS</h3>
                                <div className="relative h-40 flex items-center justify-center">
                                    <svg width="160" height="160" viewBox="0 0 160 160">
                                        <circle cx="80" cy="80" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="#93c5fd"
                                            strokeWidth="20"
                                            strokeDasharray={`${2 * Math.PI * 70 * (totalCurrentSavings / inputs.targetDownPayment)} ${2 * Math.PI * 70}`}
                                            transform="rotate(-90 80 80)"
                                        />
                                        <text x="80" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                                            Total Saved,
                                        </text>
                                        <text x="80" y="95" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
                                            ${(totalCurrentSavings / 1000).toFixed(1)}k
                                        </text>
                                    </svg>
                                    <div className="absolute bottom-0 text-center text-sm">
                                        <div>Shortfall,</div>
                                        <div className="font-bold">${(shortfall / 1000).toFixed(1)}k</div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Remaining Amount to Save */}
                            <div className="bg-blue-500 text-white p-4 rounded flex justify-between items-center">
                                <span className="font-bold text-lg">Remaining Amount to Save</span>
                                <span className="text-2xl font-bold">${remainingToSave}</span>
                            </div>
                        </div>

                        {/* Right Column - First Time Buyers & Cash Required */}
                        <div className="space-y-4">
                            <div className="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                                <h3 className="font-bold text-center mb-4 text-blue-800">For First Time Home Buyers</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">FHSA Contribution Limit (per year)</span>
                                        <span className="font-bold">${inputs.fhsaContributionLimit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">FHSA Lifetime Limit</span>
                                        <span className="font-bold">${inputs.fhsaLifetimeLimit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">RRSP Home Buyers Plan Withdrawal Limit</span>
                                        <span className="font-bold">${inputs.rrspWithdrawalLimit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">RRSP Available for Home Buyers' Plan</span>
                                        <span className="font-bold">${inputs.rrspAvailable.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-semibold">Repayment Period</span>
                                        <span className="font-bold">15 Years (starting 2nd year after withdrawal)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                                <h3 className="font-bold text-center mb-4 bg-blue-500 text-white p-2 -m-4 mb-4">Cash Required To Close</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">Down Payment</span>
                                        <span className="font-bold">${inputs.targetDownPayment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-semibold">Closing Costs (Approximately)</span>
                                        <span className="font-bold">${closingCosts.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings Schedule Table */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl">Monthly Savings Schedule</h3>
                            <Button onClick={addSavingsRow} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Row
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="border border-gray-300 p-2">Month</th>
                                        <th className="border border-gray-300 p-2">Date</th>
                                        <th className="border border-gray-300 p-2">FHSA Contribution</th>
                                        <th className="border border-gray-300 p-2">RRSP Contribution</th>
                                        <th className="border border-gray-300 p-2">Other Savings</th>
                                        <th className="border border-gray-300 p-2">Total Saved</th>
                                        <th className="border border-gray-300 p-2">Savings Growth</th>
                                        <th className="border border-gray-300 p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savingsRows.map((row, index) => {
                                        const previousTotal = index === 0 ? totalCurrentSavings :
                                            savingsRows.slice(0, index).reduce((acc, r) => {
                                                const calc = calculateRowTotals(r, index === 0 ? totalCurrentSavings : acc);
                                                return calc.runningTotal;
                                            }, totalCurrentSavings);

                                        const { totalSaved, savingsGrowth, runningTotal } = calculateRowTotals(row, previousTotal);

                                        return (
                                            <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="border border-gray-300 p-2 text-center font-semibold">{index + 1}</td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    <Input
                                                        type="date"
                                                        value={row.date}
                                                        onChange={(e) => handleSavingsRowChange(row.id, 'date', e.target.value)}
                                                        className="h-8 text-sm"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <Input
                                                        type="text"
                                                        value={row.fhsaContribution.toLocaleString()}
                                                        onChange={(e) => handleSavingsRowChange(row.id, 'fhsaContribution', e.target.value.replace(/,/g, ''))}
                                                        className="h-8 text-sm text-right"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <Input
                                                        type="text"
                                                        value={row.rrspContribution.toLocaleString()}
                                                        onChange={(e) => handleSavingsRowChange(row.id, 'rrspContribution', e.target.value.replace(/,/g, ''))}
                                                        className="h-8 text-sm text-right"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <Input
                                                        type="text"
                                                        value={row.otherSavings.toLocaleString()}
                                                        onChange={(e) => handleSavingsRowChange(row.id, 'otherSavings', e.target.value.replace(/,/g, ''))}
                                                        className="h-8 text-sm text-right"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2 text-right font-bold">
                                                    ${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                                                    ${savingsGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    <Button
                                                        onClick={() => removeSavingsRow(row.id)}
                                                        disabled={savingsRows.length === 1}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DownPaymentPlanner;