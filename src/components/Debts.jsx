import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

export default function Debts() {
  const { debts, setDebts } = useFinance();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editBalance, setEditBalance] = useState("");
  const [globalEdit, setGlobalEdit] = useState(false);

  const totalDebt = debts.reduce((a, d) => a + Math.abs(Number(d.balance || 0)), 0);

  const startEdit = (i, currentBalance) => {
    setEditIndex(i);
    setEditBalance(Math.abs(currentBalance));
  };

  const saveEdit = i => {
    if (isNaN(Number(editBalance))) return;
    setDebts(debts.map((debt, idx) => idx === i ? { ...debt, balance: Math.abs(Number(editBalance)) } : debt));
    setEditIndex(null);
    setEditBalance("");
  };

  const removeDebt = i => {
    setDebts(debts.filter((_, idx) => idx !== i));
    setEditIndex(null);
    setEditBalance("");
  };

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Debts</h2>
        <button
          className={`ml-4 rounded-2xl px-4 py-2 transition font-medium ${globalEdit ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          onClick={() => {
            setGlobalEdit(!globalEdit);
            setEditIndex(null);
          }}
        >
          {globalEdit ? "Done" : "Edit Debts"}
        </button>
      </div>
      {debts.length > 0 && (
        <div className="flex items-baseline gap-6 mb-4">
          <span className="text-xl font-bold text-black">
            Total Debt: ${totalDebt.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
      {globalEdit && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input className="border rounded-xl px-3 py-2" placeholder="Debt Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded-xl px-3 py-2" placeholder="Balance" type="number" min={0} value={balance} onChange={e => setBalance(e.target.value)} />
          <button
            className="bg-black text-white rounded-xl px-4 py-2"
            onClick={() => {
              if (!name || isNaN(Number(balance))) return;
              setDebts([...debts, { name, balance: Math.abs(Number(balance)) }]);
              setName(""); setBalance("");
            }}
          >
            Add
          </button>
        </div>
      )}
      {debts.length === 0 ? (
        <div className="text-center text-gray-400 italic py-8">
          You have no debts.
        </div>
      ) : (
        <ul>
          {debts.map((d, i) => (
            <li key={i} className="flex justify-between items-center p-2 border-b gap-2 text-sm">
              <span>{d.name}</span>
              {editIndex === i ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border rounded-xl px-2 py-1 w-24 mr-2"
                    type="number"
                    min={0}
                    value={editBalance}
                    onChange={e => setEditBalance(e.target.value)}
                    autoFocus
                  />
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
                  <span>${Math.abs(d.balance).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
                  {globalEdit && (
                    <>
                      <button
                        className="ml-3 bg-blue-500 text-white rounded-xl px-3 py-1"
                        onClick={() => startEdit(i, d.balance)}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 bg-red-500 text-white rounded-xl px-3 py-1"
                        onClick={() => removeDebt(i)}
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
