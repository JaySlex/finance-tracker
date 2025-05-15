import React from "react";
import { useNavigate } from "react-router-dom";
import wealthsyLogo from "../img/logo.png"; // adjust path if needed

const VALUE_PROPS = [
  {
    icon: "🧠",
    headline: "All Your Wealth, One Smart View",
    text: "See your net worth, bank accounts, investments, crypto, debts, belongings, and TFSA in a single clean dashboard. No spreadsheets, no clutter — just clarity.",
    iconBg: "bg-green-100 text-green-700"
  },
  {
    icon: "🔒",
    headline: "Private by Design. Automated by Choice.",
    text: "Wealthsy is private-first. But if you want automation, securely sync your banks and credit cards (Plaid, optional), and we’ll categorize your spending automatically.",
    iconBg: "bg-blue-100 text-blue-700"
  },
  {
    icon: "💸",
    headline: "Understand. Grow. Never Miss a Limit.",
    text: "Track stocks, crypto, and your TFSA with ease. Get insights, know your room, and always stay on top of your goals — all for less than a coffee a month.",
    iconBg: "bg-yellow-100 text-yellow-700"
  }
];

// ADDED export as excel feature below
const FEATURES = [
  {
    icon: "📊",
    title: "Unified Net Worth Dashboard",
    desc: "See everything—accounts, investments, debts, and more—in one place."
  },
  {
    icon: "🏦",
    title: "Plaid Bank Sync (Optional)",
    desc: "Automatically import your balances & transactions, and track where you spend your money."
  },
  {
    icon: "💳",
    title: "Accounts & Debts Tracking",
    desc: "Track bank balances, credit cards, loans, and custom assets."
  },
  {
    icon: "📈",
    title: "Portfolio Insights",
    desc: "Monitor your stocks and ETFs. See total value, gain/loss, and auto-update prices."
  },
  {
    icon: "₿",
    title: "Crypto Portfolio",
    desc: "Track your cryptocurrency alongside traditional investments, with real-time updates."
  },
  {
    icon: "🍁",
    title: "TFSA Contribution Planner",
    desc: "Canada’s best TFSA tracker. Know your annual room, contributions, and withdrawals."
  },
  {
    icon: "☁️",
    title: "Secure Cloud Sync",
    desc: "Access your finance data from any device, instantly and securely."
  },
  {
    icon: "✨",
    title: "Minimal & Private",
    desc: "No ads. No tracking. Zero distractions. Only you control your data."
  },
  {
    icon: "📤",
    title: "Export to Excel",
    desc: "Download all your Wealthsy data as an Excel file for backup or analysis. Your data, your way."
  }
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src={wealthsyLogo} alt="Wealthsy Logo" className="h-10 w-auto drop-shadow-md rounded-xl" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">Wealthsy</span>
        </div>
        <button
          className="bg-black text-white px-6 py-2 rounded-xl text-lg font-semibold shadow hover:bg-gray-600 transition cursor-pointer transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </header>
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-6">
        <div className="max-w-3xl w-full flex flex-col items-center">
          <span className="bg-green-100 text-green-700 font-semibold px-4 py-1 rounded-full mb-4 text-base">
            $1.99/month. Free trial. Cancel anytime.
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4 leading-tight">
            Make every dollar work smarter.<br />
            <span className="text-green-700">Simple. Private. Canadian.</span>
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl mb-10">
            Wealthsy is your intelligent, privacy-first finance tracker. See your whole financial life at a glance, automate what you want, and always know where you stand.
          </p>
        </div>
        {/* Bold Value Propositions */}
        <section className="w-full max-w-5xl flex flex-col gap-10 mt-8">
          {VALUE_PROPS.map((vp, idx) => (
            <div
              key={vp.headline}
              className={`flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className={`flex-shrink-0 flex items-center justify-center rounded-2xl ${vp.iconBg} w-24 h-24 md:w-32 md:h-32 text-5xl md:text-6xl shadow-lg`}>
                {vp.icon}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{vp.headline}</h2>
                <p className="text-gray-600 text-lg">{vp.text}</p>
              </div>
            </div>
          ))}
        </section>
        {/* Features Panel */}
        <section className="w-full flex flex-col items-center mt-20">
          <div className="w-full max-w-5xl rounded-3xl bg-gray-900/80 shadow-2xl border border-gray-300/30 px-6 sm:px-12 py-12 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-6 tracking-tight">
              What else do you get?
            </h3>
            <ul className="w-full flex flex-col gap-6 mt-2">
              {FEATURES.map((f, idx) => (
                <li key={f.title} className="flex items-center gap-5">
                  <span className={`inline-flex items-center justify-center text-2xl sm:text-3xl font-bold
                    ${[
                      "text-green-400",
                      "text-blue-400",
                      "text-pink-400",
                      "text-purple-400",
                      "text-cyan-400",
                      "text-amber-400",
                      "text-white",
                      "text-orange-400"
                    ][idx % 8]}
                  `}
                    style={{ minWidth: "2.5rem", minHeight: "2.5rem", lineHeight: 1, alignSelf: "flex-start" }}
                  >
                    <span style={{ display: "block", lineHeight: 1.15 }}>{f.icon}</span>
                  </span>
                  <div>
                    <span className="text-lg font-bold text-white">{f.title}</span>
                    <span className="block text-gray-200 text-base font-normal mt-0.5">{f.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* CTA for mobile */}
        <button
          className="md:hidden mt-8 bg-black text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-gray-600 transition cursor-pointer transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </main>
      {/* Footer */}
      <footer className="text-center text-gray-400 py-6  text-sm">
        © {new Date().getFullYear()} Wealthsy. All rights reserved.
      </footer>
    </div>
  );
}
