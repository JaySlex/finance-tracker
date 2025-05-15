import React from "react";
import { useNavigate } from "react-router-dom";
import wealthsyLogo from "../img/logo.png"; // adjust path if needed

const FEATURES = [
  {
    title: "Unified Dashboard",
    desc: "See your net worth, accounts, debts, investments, belongings, and TFSA — all in one beautiful place."
  },
  {
    title: "Bank Sync",
    desc: "Optionally connect your bank and credit cards securely with Plaid. Instantly track where you spend your money — automatic transaction imports, no manual entry needed."
  },
  {
    title: "Secure Cloud Sync",
    desc: "Your data is securely synced with your Wealthsy account. Instantly access your finances from any device."
  },
  {
    title: "Accounts & Debts Tracking",
    desc: "Track bank balances, credit cards, loans, and any custom accounts. Monitor, edit, and stay in control."
  },
  {
    title: "Portfolio Insights",
    desc: "Easily track stocks and ETFs. View total value, gain/loss, and add trades in seconds."
  },
  {
    title: "Crypto Portfolio",
    desc: "Add, track, and manage your cryptocurrency holdings alongside your stocks and funds. Real-time values, simple interface."
  },
  {
    title: "TFSA Contribution Planner",
    desc: "Track TFSA annual limits, contributions, withdrawals, and available room with Canadian law compliance."
  },
  {
    title: "Minimal & Private",
    desc: "No ads. No tracking. Simple, distraction-free interface. Your data is yours alone."
  }
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src={wealthsyLogo} alt="Wealthsy Logo" className="h-10 w-auto drop-shadow-md rounded-xl" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">Wealthsy</span>
        </div>
        <button
          className="bg-black text-white px-6 py-2 rounded-xl text-lg font-semibold shadow hover:bg-gray-800 transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </header>
      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-green-100 text-green-800 rounded-xl px-4 py-2 font-bold mb-5 text-base">
          Only $1.99/month. Start your free trial today!
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4 leading-tight">
          Grow, track, and understand your <span className="text-green-700">wealth</span>.<br />
          The simplest Canadian finance tracker.
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-xl mb-10">
          All your accounts, investments (stocks &amp; crypto!), and TFSA in one private, minimalist app — free trial, then just $1.99/month.
        </p>
        {/* Features */}
        <div className="w-full max-w-3xl grid gap-8 md:grid-cols-2">
          {FEATURES.map((f, idx) => (
            <div key={idx} className="rounded-2xl bg-white shadow p-6 flex flex-col">
              <span className="text-lg font-bold mb-2 text-gray-900">{f.title}</span>
              <span className="text-gray-600">{f.desc}</span>
            </div>
          ))}
        </div>
        {/* CTA for mobile */}
        <button
          className="md:hidden mt-10 bg-black text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-gray-800 transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </main>
      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 mt-10 text-sm">
        © {new Date().getFullYear()} Wealthsy. All rights reserved.
      </footer>
    </div>
  );
}
