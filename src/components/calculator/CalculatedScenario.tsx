const ScenarioTable = ({ financialInputs }) => {
    // Helper to calculate mortgage details
    const calculateScenario = (purchasePrice: number, downPayment: number, interestRate: number, amortizationYears: number, closingCostRate = 0.022) => {
        const loanAmount = purchasePrice - downPayment;

        // Monthly mortgage payment formula
        const monthlyRate = interestRate / 100 / 12;
        const totalPayments = amortizationYears * 12;
        const monthlyPayment = loanAmount > 0
            ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
            : 0;

        // Stress test (use higher of actual or 6.99%)
        const qualifyingRate = Math.max(interestRate, 6.99);
        const qualifyingPayment = monthlyPayment * (qualifyingRate / interestRate);

        // Approx closing costs
        const closingCosts = purchasePrice * closingCostRate;

        // GDS / TDS
        const monthlyIncome = financialInputs.annualIncome / 12;
        const housingCost = monthlyPayment + financialInputs.propertyTax + financialInputs.utilities + financialInputs.condoFee;
        const gds = (housingCost / monthlyIncome) * 100;
        const tds = ((housingCost + financialInputs.carLoan + financialInputs.leasePayment + financialInputs.creditCards) / monthlyIncome) * 100;

        // CMHC Insurance (only if down < 20%)
        const downPercent = (downPayment / purchasePrice) * 100;
        const cmhcPremium = downPercent < 20 ? loanAmount * 0.0315 : 0;

        return {
            purchasePrice,
            downPayment,
            cmhcPremium,
            mortgageReq: loanAmount + cmhcPremium,
            monthlyPayment,
            qualifyingPayment,
            gds,
            tds,
            closingCosts,
        };
    };

    // Example scenarios - using values from your image
    const maxStretch = calculateScenario(639000, 639000 * 0.05, financialInputs.interestRate, financialInputs.amortizationYears);
    const balancedBudget = calculateScenario(603000, 603000 * 0.05, financialInputs.interestRate, financialInputs.amortizationYears);
    const playItSafe = calculateScenario(509000, 509000 * 0.05, financialInputs.interestRate, financialInputs.amortizationYears);

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

    const formatValue = (value: number, format: string) => {
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
                        {scenarios.map((scenario, index) => (
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