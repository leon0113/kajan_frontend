import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const MortgageCostCalculator = () => {
    const [properties, setProperties] = useState([
        {
            id: 1,
            name: "Property 1",
            inputs: {
                // Property Information
                salePrice: 800000,
                downPaymentCMHC: 55000,
                downPaymentUninsured: 160000,
                compoundPeriod: 2,

                // Mortgage Information
                annualInterestRateCMHC: 4.100,
                annualInterestRateUninsured: 4.290,
                termOfLoanYearsCMHC: 30,
                termOfLoanYearsUninsured: 30,

                // Extra Monthly Payments
                propertyTax: 292.00,
                homeInsurance: 150.00,
                condoFee: 0,
                electricity: 0,
                heating: 0,
                wasteDisposal: 0,
                additionalExpense: 0,
                extraMonthlyPayment: 525.00,
                extraMonthlyPaymentUninsured: 0,

                // Rental Income
                rentalIncome: 1500.00,
                rentalIncomeUninsured: 1500.00,

                // Additional Costs
                landTransferTax: 12475.00,
                landTransferTaxUninsured: 12475.00,
                firstTimeHomeBuyerUninsured: 8475.00,
                firstTimeHomeBuyer: 8475.00,
                lawyerFee: 2500.00,
                lawyerFeeUninsured: 2500.00,
            }
        }
    ]);

    const addProperty = () => {
        const newId = properties.length + 1;
        setProperties(prev => [...prev, {
            id: newId,
            name: `Property ${newId}`,
            inputs: {
                // Property Information
                salePrice: 800000,
                downPaymentCMHC: 55000,
                downPaymentUninsured: 160000,
                compoundPeriod: 2,

                // Mortgage Information
                annualInterestRateCMHC: 4.100,
                annualInterestRateUninsured: 4.290,
                termOfLoanYearsCMHC: 30,
                termOfLoanYearsUninsured: 30,

                // Extra Monthly Payments
                propertyTax: 292.00,
                homeInsurance: 150.00,
                condoFee: 0,
                electricity: 0,
                heating: 0,
                wasteDisposal: 0,
                additionalExpense: 0,
                extraMonthlyPayment: 525.00,
                extraMonthlyPaymentUninsured: 0,

                // Rental Income
                rentalIncome: 1500.00,
                rentalIncomeUninsured: 1500.00,

                // Additional Costs
                landTransferTax: 12475.00,
                landTransferTaxUninsured: 12475.00,
                firstTimeHomeBuyerUninsured: 8475.00,
                firstTimeHomeBuyer: 8475.00,
                lawyerFee: 2500.00,
                lawyerFeeUninsured: 2500.00,
            }
        }]);
    };

    const removeProperty = (id) => {
        if (properties.length > 1) {
            setProperties(prev => prev.filter(property => property.id !== id));
        }
    };

    const updatePropertyName = (id, newName) => {
        setProperties(prev => prev.map(property =>
            property.id === id ? { ...property, name: newName } : property
        ));
    };

    const handleInputChange = (propertyId, field, value) => {
        setProperties(prev => prev.map(property =>
            property.id === propertyId
                ? {
                    ...property,
                    inputs: {
                        ...property.inputs,
                        [field]: parseFloat(value) || 0
                    }
                }
                : property
        ));
    };

    // Calculation functions for each property
    const calculatePropertyData = (property) => {
        const inputs = property.inputs;

        // CMHC Calculations
        const loanAmountCMHC = inputs.salePrice - inputs.downPaymentCMHC;
        const cmhcInsurance = loanAmountCMHC * 0.041;
        const totalLoanAmountCMHC = loanAmountCMHC + cmhcInsurance;

        // Monthly interest rate calculation
        const monthlyInterestRateCMHC = Math.pow(1 + (inputs.annualInterestRateCMHC / 100) / inputs.compoundPeriod, inputs.compoundPeriod / 12) - 1;
        const totalPaymentsCMHC = inputs.termOfLoanYearsCMHC * 12;
        const monthlyRateCMHC = monthlyInterestRateCMHC;

        const mortgagePaymentCMHC = totalLoanAmountCMHC *
            (monthlyRateCMHC * Math.pow(1 + monthlyRateCMHC, totalPaymentsCMHC)) /
            (Math.pow(1 + monthlyRateCMHC, totalPaymentsCMHC) - 1);

        // Uninsured Mortgage Calculations
        const loanAmountUninsured = inputs.salePrice - inputs.downPaymentUninsured;
        const totalLoanAmountUninsured = loanAmountUninsured;

        const monthlyInterestRateUninsured = Math.pow(1 + (inputs.annualInterestRateUninsured / 100) / inputs.compoundPeriod, inputs.compoundPeriod / 12) - 1;
        const monthlyRateUninsured = monthlyInterestRateUninsured;
        const totalPaymentsUninsured = inputs.termOfLoanYearsUninsured * 12;

        const mortgagePaymentUninsured = totalLoanAmountUninsured *
            (monthlyRateUninsured * Math.pow(1 + monthlyRateUninsured, totalPaymentsUninsured)) /
            (Math.pow(1 + monthlyRateUninsured, totalPaymentsUninsured) - 1);

        // Total Monthly Payments
        const totalMonthlyCMHC = mortgagePaymentCMHC + inputs.propertyTax + inputs.homeInsurance +
            inputs.condoFee + inputs.electricity + inputs.heating + inputs.wasteDisposal +
            inputs.additionalExpense;

        const totalHousingCostCMHC = totalMonthlyCMHC - inputs.rentalIncome;

        const totalMonthlyUninsured = mortgagePaymentUninsured + inputs.propertyTax + inputs.homeInsurance +
            inputs.condoFee + inputs.electricity + inputs.heating + inputs.wasteDisposal +
            inputs.additionalExpense + inputs.extraMonthlyPaymentUninsured;

        const totalHousingCostUninsured = totalMonthlyUninsured - inputs.rentalIncomeUninsured;
        const totalCostBeforeClosingCMHC = inputs.downPaymentCMHC + inputs.lawyerFee + inputs.firstTimeHomeBuyer;
        const totalCostBeforeClosingUninsured = inputs.downPaymentUninsured + inputs.lawyerFeeUninsured + inputs.firstTimeHomeBuyerUninsured;

        return {
            loanAmountCMHC,
            cmhcInsurance,
            totalLoanAmountCMHC,
            monthlyInterestRateCMHC,
            mortgagePaymentCMHC,
            loanAmountUninsured,
            totalLoanAmountUninsured,
            monthlyInterestRateUninsured,
            mortgagePaymentUninsured,
            totalMonthlyCMHC,
            totalHousingCostCMHC,
            totalMonthlyUninsured,
            totalHousingCostUninsured,
            totalCostBeforeClosingCMHC,
            totalCostBeforeClosingUninsured
        };
    };

    const propertyData = properties.map(property => ({
        ...property,
        calculations: calculatePropertyData(property)
    }));

    return (
        <div className="max-w-full mx-auto p-4 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Home className="h-6 w-6" />
                        Mortgage Cost Calculator
                    </CardTitle>
                    <button
                        onClick={addProperty}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Property
                    </button>
                </CardHeader>
                <CardContent>
                    {/* Property Headers */}
                    <div className="mb-4">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-3 text-left w-1/3 bg-gray-50"></th>
                                        {propertyData.map((property, index) => (
                                            <th key={property.id} className="border border-gray-300 p-3 text-center relative group">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Input
                                                            type="text"
                                                            value={property.name}
                                                            onChange={(e) => updatePropertyName(property.id, e.target.value)}
                                                            className="h-8 text-sm font-bold text-center min-w-[120px]"
                                                        />
                                                        {properties.length > 1 && (
                                                            <button
                                                                onClick={() => removeProperty(property.id)}
                                                                className="text-red-500 hover:text-red-700 p-1"
                                                                title="Remove property"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 w-full">
                                                        <div className="flex-1 bg-purple-100 p-2 font-bold text-sm">CMHC</div>
                                                        <div className="flex-1 bg-purple-200 p-2 font-bold text-sm">Uninsured</div>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>

                    {/* Property Information Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-teal-500 to-purple-500 text-white p-4 rounded-t-lg">
                            <h3 className="font-bold text-lg">PROPERTY INFORMATION</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-3 bg-yellow-100 font-semibold w-1/3">Sale Price</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.salePrice.toLocaleString()}
                                                                onChange={(e) => handleInputChange(property.id, 'salePrice', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 text-center flex items-center justify-center">
                                                        <span className="font-semibold">${property.inputs.salePrice.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 bg-yellow-100 font-semibold">Down Payment</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.downPaymentCMHC.toLocaleString()}
                                                                onChange={(e) => handleInputChange(property.id, 'downPaymentCMHC', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.downPaymentUninsured.toLocaleString()}
                                                                onChange={(e) => handleInputChange(property.id, 'downPaymentUninsured', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Compound Period</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <Input
                                                    type="number"
                                                    value={property.inputs.compoundPeriod}
                                                    onChange={(e) => handleInputChange(property.id, 'compoundPeriod', e.target.value)}
                                                    className="h-8 text-sm w-20 mx-auto"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mortgage Information Section */}
                    <div className="mb-8">
                        <div className="bg-gray-600 text-white p-4">
                            <h3 className="font-bold text-lg">MORTGAGE INFORMATION</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold w-1/3">Loan Amount</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 bg-green-100 text-center font-semibold">
                                                        ${property.calculations.loanAmountCMHC.toLocaleString()}
                                                    </div>
                                                    <div className="flex-1 bg-green-200 text-center font-semibold">
                                                        ${property.calculations.loanAmountUninsured.toLocaleString()}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">CMHC</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 bg-green-100 text-center font-semibold">
                                                        ${property.calculations.cmhcInsurance.toLocaleString()}
                                                    </div>
                                                    <div className="flex-1 bg-green-200 text-center">-</div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Total Loan Amount</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center font-semibold">
                                                        ${property.calculations.totalLoanAmountCMHC.toLocaleString()}
                                                    </div>
                                                    <div className="flex-1 text-center font-semibold">
                                                        ${property.calculations.totalLoanAmountUninsured.toLocaleString()}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 bg-yellow-100 font-semibold">Annual Interest Rate</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <Input
                                                                type="number"
                                                                step="0.001"
                                                                value={property.inputs.annualInterestRateCMHC}
                                                                onChange={(e) => handleInputChange(property.id, 'annualInterestRateCMHC', e.target.value)}
                                                                className="h-8 text-sm"
                                                            />
                                                            <span className="ml-2">%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <Input
                                                                type="number"
                                                                step="0.001"
                                                                value={property.inputs.annualInterestRateUninsured}
                                                                onChange={(e) => handleInputChange(property.id, 'annualInterestRateUninsured', e.target.value)}
                                                                className="h-8 text-sm"
                                                            />
                                                            <span className="ml-2">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 bg-yellow-100 font-semibold">Term of Loan (in Years)</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <Input
                                                            type="number"
                                                            value={property.inputs.termOfLoanYearsCMHC}
                                                            onChange={(e) => handleInputChange(property.id, 'termOfLoanYearsCMHC', e.target.value)}
                                                            className="h-8 text-sm w-20 mx-auto"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            type="number"
                                                            value={property.inputs.termOfLoanYearsUninsured}
                                                            onChange={(e) => handleInputChange(property.id, 'termOfLoanYearsUninsured', e.target.value)}
                                                            className="h-8 text-sm w-20 mx-auto"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Monthly Interest Rate</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center">
                                                        {(property.calculations.monthlyInterestRateCMHC * 100).toFixed(3)}%
                                                    </div>
                                                    <div className="flex-1 text-center">
                                                        {(property.calculations.monthlyInterestRateUninsured * 100).toFixed(3)}%
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Mortgage Payment (PI)</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center font-semibold text-lg">
                                                        ${property.calculations.mortgagePaymentCMHC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="flex-1 text-center font-semibold text-lg">
                                                        ${property.calculations.mortgagePaymentUninsured.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Extra Monthly Payment Section */}
                    <div className="mb-8">
                        <div className="bg-teal-600 text-white p-4">
                            <h3 className="font-bold text-lg">EXTRA MONTHLY PAYMENT</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white">
                                <tbody>
                                    {/* Property Tax Row */}
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold w-1/3">Property Tax</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.propertyTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                onChange={(e) => handleInputChange(property.id, 'propertyTax', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 text-center flex items-center justify-center">
                                                        ${property.inputs.propertyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Add other rows similarly for Home Insurance, Condo Fee, etc. */}
                                    {/* Home Insurance */}
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Home Insurance</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.homeInsurance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                onChange={(e) => handleInputChange(property.id, 'homeInsurance', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 text-center flex items-center justify-center">
                                                        ${property.inputs.homeInsurance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Continue with other rows... */}

                                    {/* Total Monthly Payment */}
                                    <tr className="bg-red-100 border-2 border-red-300">
                                        <td className="border border-gray-300 p-3 font-bold text-lg">Total MONTHLY PAYMENT</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center font-bold text-xl text-red-600">
                                                        ${property.calculations.totalMonthlyCMHC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="flex-1 text-center font-bold text-xl text-red-600">
                                                        ${property.calculations.totalMonthlyUninsured.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Rental Income */}
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Rental Income</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-2">
                                                <div className="flex gap-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.rentalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                onChange={(e) => handleInputChange(property.id, 'rentalIncome', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">$</span>
                                                            <Input
                                                                type="text"
                                                                value={property.inputs.rentalIncomeUninsured.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                onChange={(e) => handleInputChange(property.id, 'rentalIncomeUninsured', e.target.value.replace(/,/g, ''))}
                                                                className="h-8 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Total Housing Cost */}
                                    <tr>
                                        <td className="border border-gray-300 p-3 font-semibold">Total Housing Cost</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center font-semibold text-green-600">
                                                        ${property.calculations.totalHousingCostCMHC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="flex-1 text-center font-semibold text-green-600">
                                                        ${property.calculations.totalHousingCostUninsured.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Continue with remaining rows... */}

                                    {/* Total cost before closing */}
                                    <tr className="bg-green-100 border-2 border-green-300">
                                        <td className="border border-gray-300 p-3 font-bold text-lg">Total cost before closing</td>
                                        {propertyData.map((property) => (
                                            <td key={property.id} className="border border-gray-300 p-3">
                                                <div className="flex gap-1">
                                                    <div className="flex-1 text-center font-bold text-xl text-green-600">
                                                        ${property.calculations.totalCostBeforeClosingCMHC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="flex-1 text-center font-bold text-xl text-green-600">
                                                        ${property.calculations.totalCostBeforeClosingUninsured.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MortgageCostCalculator;