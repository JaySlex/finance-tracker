import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

export default function Belongings() {
  const { belongings, setBelongings } = useFinance();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [globalEdit, setGlobalEdit] = useState(false);

  const belongingsTotal = belongings.reduce((a, b) => a + b.value, 0);

  const startEdit = (i, item) => {
    setEditIndex(i);
    setEditName(item.name);
    setEditValue(item.value);
  };

  const saveEdit = (i) => {
    if (!editName || isNaN(Number(editValue))) return;
    setBelongings(belongings.map((item, idx) =>
      idx === i ? { ...item, name: editName, value: Number(editValue) } : item
    ));
    setEditIndex(null);
    setEditName("");
    setEditValue("");
  };

  const removeItem = (i) => {
    setBelongings(belongings.filter((_, idx) => idx !== i));
    setEditIndex(null);
    setEditName("");
    setEditValue("");
  };

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Belongings</h2>
        <button
          className={`ml-4 rounded-2xl px-4 py-2 transition font-medium ${globalEdit ? "bg-black text-white hover:bg-gray-600 cursor-pointer transition" : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition"}`}
          onClick={() => {
            setGlobalEdit(!globalEdit);
            setEditIndex(null);
          }}
        >
          {globalEdit ? "Done" : "Edit Belongings"}
        </button>
      </div>
      {belongings.length > 0 && (
        <div className="flex items-baseline gap-6 mb-4">
          <span className="text-xl font-bold text-black">
            Total Belongings: ${belongingsTotal.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
      {globalEdit && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <input className="border rounded-xl px-3 py-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded-xl px-3 py-2" placeholder="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />
          <button
            className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-600 cursor-pointer transition"
            onClick={() => {
              if (!name || isNaN(Number(value))) return;
              setBelongings([...belongings, { name, value: Number(value) }]);
              setName(""); setValue("");
            }}
          >
            Add
          </button>
        </div>
      )}
      {belongings.length === 0 ? (
        <div className="text-center text-gray-400 italic py-8">
          You have no belongings.
        </div>
      ) : (
        <ul>
          {belongings.map((b, i) => (
            <li key={i} className="flex items-center p-2 border-b gap-2 text-sm">
              {editIndex === i ? (
                <div className="flex w-full items-center">
                  <input
                    className="border rounded-xl px-2 py-1 mr-1 flex-1 min-w-0"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="border rounded-xl px-2 py-1 w-24 mx-2"
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white rounded-xl px-3 py-1 mx-1"
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
                <>
                  <span className="flex-1 truncate">{b.name}</span>
                  <span className="ml-auto font-medium w-32 text-right">${b.value.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
                  {globalEdit && (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        className="bg-blue-500 text-white rounded-xl px-3 py-1"
                        onClick={() => startEdit(i, b)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-xl px-3 py-1"
                        onClick={() => removeItem(i)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
