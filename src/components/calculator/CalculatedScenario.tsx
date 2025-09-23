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

    // Example scenarios
    const maxStretch = calculateScenario(441000, 22050, financialInputs.interestRate, financialInputs.amortizationYears);
    const balancedBudget = calculateScenario(399000, 19950, financialInputs.interestRate, financialInputs.amortizationYears);
    const playItSafe = calculateScenario(333000, 16650, financialInputs.interestRate, financialInputs.amortizationYears);

    const scenarios = [
        { title: "MAXIMUM STRETCH", data: maxStretch, color: "bg-red-700" },
        { title: "BALANCED BUDGET", data: balancedBudget, color: "bg-yellow-700" },
        { title: "PLAY IT SAFE", data: playItSafe, color: "bg-green-700" },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mt-6">
            {scenarios.map(({ title, data, color }) => (
                <div key={title} className="rounded-lg shadow-md overflow-hidden">
                    <div className={`${color} text-white text-center font-bold py-2`}>{title}</div>
                    <div className="p-3 bg-white space-y-2 text-sm">
                        <div className="flex justify-between"><span>Purchase Price</span><span>${data.purchasePrice.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Min Down Payment</span><span>${data.downPayment.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>CMHC Premium</span><span>${data.cmhcPremium.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Mortgage Req</span><span>${data.mortgageReq.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Mortgage Payment</span><span>${data.monthlyPayment.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Qualifying Payment</span><span>${data.qualifyingPayment.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>GDS</span><span>{data.gds.toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span>TDS</span><span>{data.tds.toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span>Closing Costs</span><span>${data.closingCosts.toLocaleString()}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default ScenarioTable;