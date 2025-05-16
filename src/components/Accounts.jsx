import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

export default function Accounts() {
  const { accounts, setAccounts } = useFinance();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("CAD");
  const [editIndex, setEditIndex] = useState(null);
  const [editBalance, setEditBalance] = useState("");
  const [editCurrency, setEditCurrency] = useState("CAD");
  const [globalEdit, setGlobalEdit] = useState(false);

  // Exchange rates, default to 1 for CAD, fallback rates for USD/EUR if fetch fails
  const [exchangeRates, setExchangeRates] = useState({ CAD: 1, USD: 1.35, EUR: 1.48 });

  // Fetch current rates on mount
  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/CAD")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates({
            CAD: 1,
            USD: data.rates.USD ?? 1.35,
            EUR: data.rates.EUR ?? 1.48,
          });
        }
      })
      .catch(() => {
        // If fetch fails, just use fallback rates
        setExchangeRates({ CAD: 1, USD: 1.35, EUR: 1.48 });
      });
  }, []);

  // Helper: convert account's balance to CAD equivalent
  function toCad(a) {
    if (!a.currency || a.currency === "CAD") return a.balance;
    const rate = exchangeRates[a.currency] || 1;
    return Number(a.balance) / rate;
  }

  // Sum up all accounts in CAD
  const accountsTotal = accounts.reduce((a, c) => a + toCad(c), 0);

  const startEdit = (i, current) => {
    setEditIndex(i);
    setEditBalance(current.balance);
    setEditCurrency(current.currency || "CAD");
  };

  const saveEdit = (i) => {
    if (isNaN(Number(editBalance))) return;
    setAccounts(
      accounts.map((acc, idx) =>
        idx === i
          ? { ...acc, balance: Number(editBalance), currency: editCurrency }
          : acc
      )
    );
    setEditIndex(null);
    setEditBalance("");
    setEditCurrency("CAD");
  };

  const removeAccount = (i) => {
    setAccounts(accounts.filter((_, idx) => idx !== i));
    setEditIndex(null);
  };

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <button
          className={`ml-4 rounded-2xl px-4 py-2 transition font-medium ${
            globalEdit
              ? "bg-black text-white hover:bg-gray-600 cursor-pointer transition"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition"
          }`}
          onClick={() => {
            setGlobalEdit(!globalEdit);
            setEditIndex(null);
          }}
        >
          {globalEdit ? "Done" : "Edit Accounts"}
        </button>
      </div>
      {accounts.length > 0 && (
        <div className="flex items-baseline gap-6 mb-4">
          <span className="text-xl font-bold text-black">
            Total Accounts: $
            {accountsTotal.toLocaleString("en-CA", {
              minimumFractionDigits: 2,
            })}{" "}
            CAD
          </span>
        </div>
      )}
      {globalEdit && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <select
            className="border rounded-xl px-3 py-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button
            className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-600 cursor-pointer transition"
            onClick={() => {
              if (!name || isNaN(Number(balance))) return;
              setAccounts([
                ...accounts,
                { name, balance: Number(balance), currency },
              ]);
              setName("");
              setBalance("");
              setCurrency("CAD");
            }}
          >
            Add
          </button>
        </div>
      )}
      {accounts.length === 0 ? (
        <div className="text-center text-gray-400 italic py-8">
          You have no accounts.
        </div>
      ) : (
        <ul>
          {accounts.map((a, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-2 border-b gap-2 text-sm"
            >
              <span>{a.name}</span>
              {editIndex === i ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border rounded-xl px-2 py-1 w-24 mr-2"
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    autoFocus
                  />
                  <select
                    className="border rounded-xl px-2 py-1 w-24 mr-2"
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                  >
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <button
                    className="bg-green-600 text-white rounded-xl px-3 py-1 mr-1"
                    onClick={() => saveEdit(i)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 rounded-xl px-3 py-1"
                    onClick={() => setEditIndex(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  {a.currency && a.currency !== "CAD" ? (
                    <span>
                      {Number(a.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {a.currency}
                      <span className="ml-2 text-gray-500 text-xs">
                        (
                        $
                        {toCad(a).toLocaleString("en-CA", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        CAD
                        )
                      </span>
                    </span>
                  ) : (
                    <span>
                      $
                      {Number(a.balance).toLocaleString("en-CA", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      CAD
                    </span>
                  )}
                  {globalEdit && (
                    <>
                      <button
                        className="ml-3 bg-blue-500 text-white rounded-xl px-3 py-1"
                        onClick={() => startEdit(i, a)}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 bg-red-500 text-white rounded-xl px-3 py-1"
                        onClick={() => removeAccount(i)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
