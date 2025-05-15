import React, { useState } from "react";
import { FinanceProvider } from "./context/FinanceContext";
import Accounts from "./components/Accounts";
import Debts from "./components/Debts";
import Portfolio from "./components/Portfolio";
import Belongings from "./components/Belongings";
import TFSATracker from "./components/TFSATracker";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "accounts", label: "Accounts" },
    { id: "debts", label: "Debts" },
    { id: "portfolio", label: "Portfolio" },
    { id: "belongings", label: "Belongings" },
    { id: "tfsa", label: "TFSA" }
  ];

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="flex gap-2 p-4 border-b bg-white sticky top-0 z-20">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`rounded-xl px-4 py-2 font-medium transition ${tab === t.id ? "bg-black text-white" : "hover:bg-gray-200"}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <main className="max-w-4xl mx-auto">
          {tab === "dashboard" && <Dashboard />}
          {tab === "accounts" && <Accounts />}
          {tab === "debts" && <Debts />}
          {tab === "portfolio" && <Portfolio />}
          {tab === "belongings" && <Belongings />}
          {tab === "tfsa" && <TFSATracker />}
        </main>
      </div>
    </FinanceProvider>
  );
}
