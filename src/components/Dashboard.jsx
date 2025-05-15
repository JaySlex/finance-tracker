import React from "react";
import { useFinance } from "../context/FinanceContext";

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-2xl shadow-md p-6 flex flex-col items-center transition ${highlight ? "bg-green-100" : "bg-white"}`}>
      <span className="text-lg font-medium">{label}</span>
      <span className={`text-2xl font-bold mt-2 ${highlight ? "text-green-700" : ""}`}>
        ${value.toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { accounts, debts, portfolio, belongings } = useFinance();
  const accountsTotal = accounts.reduce((a, c) => a + c.balance, 0);
  const totalDebtForDisplay = debts.reduce((a, d) => a + Math.abs(Number(d.balance)), 0);
  const debtsTotal = -totalDebtForDisplay;
  const portfolioTotal = portfolio.reduce((a, p) => a + p.value, 0);
  const belongingsTotal = belongings.reduce((a, b) => a + b.value, 0);
  const netWorth = accountsTotal + portfolioTotal + belongingsTotal - totalDebtForDisplay;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Finance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stat label="Accounts Total" value={accountsTotal} />
        <Stat label="Debts Total" value={debtsTotal} />
        <Stat label="Portfolio Value" value={portfolioTotal} />
        <Stat label="Belongings" value={belongingsTotal} />
      </div>
      <div className="mt-8">
        <Stat label="Net Worth" value={netWorth} highlight />
      </div>
    </div>
  );
}
