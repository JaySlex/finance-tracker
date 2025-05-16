import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

export default function Portfolio() {
  const { portfolio, setPortfolio } = useFinance();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [addData, setAddData] = useState(null);
  const [shares, setShares] = useState(1);
  const [boughtPrice, setBoughtPrice] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editShares, setEditShares] = useState("");
  const [editBought, setEditBought] = useState("");
  const [globalEdit, setGlobalEdit] = useState(false);
  const API_KEY = "d0ikoshr01qrfsagpikgd0ikoshr01qrfsagpil0";

  // Search for symbols (Finnhub)
  const handleSearch = async (q) => {
    setQuery(q);
    setSearchError("");
    setResults([]);
    setAddData(null);
    if (!q || q.length < 2) return;
    setLoading(true);
    try {
      const resp = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${API_KEY}`
      );
      const data = await resp.json();
      setResults(
        (data.result || []).filter((item) => item.symbol && item.description)
      );
    } catch {
      setSearchError("Error fetching search results");
    }
    setLoading(false);
  };

  // When picking a result, fetch price from Yahoo Spark and show add form
  const handlePick = async (symbol, description) => {
    setSearchError("");
    setLoading(true);

    // Convert Finnhub's "TD:TO" to "TD.TO" for Yahoo
    let yahooSymbol = symbol;
    if (symbol.includes(":")) {
      const [base, exch] = symbol.split(":");
      yahooSymbol = `${base}.${exch}`;
    }

    try {
      const r = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(yahooSymbol)}&interval=1d`
      );
      const data = await r.json();
      let current = 0;
      let currency = "";
      if (
        data &&
        data[yahooSymbol] &&
        data[yahooSymbol].close &&
        data[yahooSymbol].close.length > 0
      ) {
        current = data[yahooSymbol].close[data[yahooSymbol].close.length - 1];
        if (data[yahooSymbol].currency) currency = data[yahooSymbol].currency;
      }
      setAddData({
        name: `${description} (${yahooSymbol})${currency ? " [" + currency + "]" : ""}`,
        symbol: yahooSymbol,
        currentPrice: current,
      });
      setShares(1);
      setBoughtPrice(current);
      setResults([]);
      setQuery("");
    } catch {
      setSearchError("Error fetching price");
    }
    setLoading(false);
  };

  // Add asset to portfolio (merges with existing symbol)
  const handleAddFinal = () => {
    const existingIndex = portfolio.findIndex(
      (item) => item.symbol === addData.symbol
    );

    if (existingIndex !== -1) {
      // Merge with existing holding
      const existing = portfolio[existingIndex];
      const totalShares = Number(existing.shares) + Number(shares);
      const totalCost =
        Number(existing.shares) * Number(existing.boughtPrice) +
        Number(shares) * Number(boughtPrice);
      const avgCost = Math.round((totalCost / totalShares) * 100) / 100;
      const updatedHolding = {
        ...existing,
        shares: totalShares,
        boughtPrice: avgCost,
        currentPrice: addData.currentPrice,
        value: Math.round(addData.currentPrice * totalShares * 100) / 100,
      };
      setPortfolio([
        ...portfolio.slice(0, existingIndex),
        updatedHolding,
        ...portfolio.slice(existingIndex + 1),
      ]);
    } else {
      // New holding
      setPortfolio([
        ...portfolio,
        {
          name: addData.name,
          symbol: addData.symbol,
          shares: Number(shares),
          boughtPrice: Number(boughtPrice),
          currentPrice: addData.currentPrice,
          value: Math.round(addData.currentPrice * shares * 100) / 100,
        },
      ]);
    }

    setAddData(null);
    setShares(1);
    setBoughtPrice(0);
  };

  // Edit asset in portfolio
  const startEdit = (i, current) => {
    setEditIndex(i);
    setEditShares(current.shares);
    setEditBought(current.boughtPrice);
  };

  const saveEdit = i => {
    setPortfolio(portfolio.map((item, idx) =>
      idx === i ? {
        ...item,
        shares: Number(editShares),
        boughtPrice: Number(editBought),
        value: Math.round(item.currentPrice * editShares * 100) / 100
      } : item
    ));
    setEditIndex(null);
    setEditShares("");
    setEditBought("");
  };

  // Remove asset
  const removeAsset = i => {
    setPortfolio(portfolio.filter((_, idx) => idx !== i));
    setEditIndex(null);
  };

  // Gain/Loss Calculation
  const gainLoss = (p) => {
    const buyTotal = p.boughtPrice * p.shares;
    const nowTotal = p.currentPrice * p.shares;
    const gain = nowTotal - buyTotal;
    const percent = buyTotal !== 0 ? (gain / buyTotal) * 100 : 0;
    return {
      gain: Math.round(gain * 100) / 100,
      percent: Math.round(percent * 100) / 100
    };
  };

  // Total calculation (for display)
  const totalValue = portfolio.reduce((a, p) => a + (Number(p.value) || 0), 0);
  const totalCost = portfolio.reduce((a, p) => a + (Number(p.shares) * Number(p.boughtPrice) || 0), 0);
  const totalGain = Math.round((totalValue - totalCost) * 100) / 100;
  const totalPct = totalCost !== 0 ? Math.round((totalGain / totalCost) * 10000) / 100 : 0;

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        <button
          className={`rounded-2xl px-4 py-2 transition font-medium ${globalEdit ? "bg-black text-white hover:bg-gray-600 cursor-pointer transition" : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition"}`}
          onClick={() => {
            setGlobalEdit(!globalEdit);
            setEditIndex(null);
            setAddData(null);
            setQuery("");
            setResults([]);
          }}
        >
          {globalEdit ? "Done" : "Edit Portfolio"}
        </button>
      </div>
      {portfolio.length > 0 && (
        <div className="flex items-baseline gap-6 mb-4">
          <span className="text-xl font-bold">
            Total Value: ${totalValue.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-lg font-semibold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGain >= 0 ? '+' : ''}{totalGain}$
            ({totalPct >= 0 ? '+' : ''}{totalPct}%)
          </span>
        </div>
      )}
      {globalEdit && (
        <div className="mb-4 relative" style={{ zIndex: 10 }}>
          <div className="text-sm text-gray-500 mb-1">Search a symbol to add</div>
          {!addData ? (
            <>
              <input
                className="border rounded-xl px-3 py-2 w-64"
                placeholder="Search symbol or company (e.g. XQQ, Tesla)"
                value={query}
                onChange={e => handleSearch(e.target.value)}
              />
              {loading && <span className="ml-2 text-sm text-gray-500">Loading…</span>}
              {searchError && <div className="text-red-500">{searchError}</div>}
              {results.length > 0 && (
                <ul className="bg-white border rounded-xl mt-2 shadow-lg max-h-40 overflow-y-auto absolute w-64">
                  {results.slice(0, 8).map((res, idx) => (
                    <li
                      key={res.symbol}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePick(res.symbol, res.description)}
                    >
                      <span className="font-semibold">{res.symbol}</span> — {res.description}
                      {res.type && (
                        <span className="text-gray-400 ml-2 text-xs">{res.type}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-2xl shadow-md p-4 flex flex-col gap-2 max-w-xs">
              <div className="font-semibold mb-1">{addData.name}</div>
              <label>
                <span className="mr-2">Shares:</span>
                <input
                  className="border rounded-xl px-2 py-1 w-20"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={shares}
                  onChange={e => setShares(e.target.value)}
                />
              </label>
              <label>
                <span className="mr-2">Bought price:</span>
                <input
                  className="border rounded-xl px-2 py-1 w-28"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={boughtPrice}
                  onChange={e => setBoughtPrice(e.target.value)}
                />
                <span className="ml-2 text-gray-500 text-xs">(Default: {addData.currentPrice})</span>
              </label>
              <button
                className="bg-blue-600 text-white rounded-xl px-4 py-1 mt-2"
                onClick={handleAddFinal}
              >
                Add to portfolio
              </button>
              <button
                className="bg-gray-300 text-gray-800 rounded-xl px-4 py-1"
                onClick={() => setAddData(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <ul>
        {portfolio.length === 0 ? (
          <li className="text-center text-gray-400 italic py-8">
            Your portfolio is empty.
          </li>
        ) : (
          portfolio.map((p, i) => {
            const { gain, percent } = gainLoss(p);
            return (
              <li key={i} className="flex justify-between items-center p-2 border-b text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  {typeof p.shares !== "undefined" && editIndex === i ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        className="border rounded-xl px-2 py-1 w-16"
                        type="number"
                        value={editShares}
                        min="0.01"
                        step="0.01"
                        onChange={e => setEditShares(e.target.value)}
                      />
                      <span>@</span>
                      <input
                        className="border rounded-xl px-2 py-1 w-28"
                        type="number"
                        value={editBought}
                        min="0.01"
                        step="0.01"
                        onChange={e => setEditBought(e.target.value)}
                      />
                      <button
                        className="bg-green-600 text-white rounded-xl px-3 py-1 ml-2"
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
                  ) : typeof p.shares !== "undefined" ? (
                    <>
                      <span>
                        {p.shares} @ ${p.boughtPrice} (Now: ${p.currentPrice})
                      </span>
                      {globalEdit && (
                        <span>
                          <button
                            className="ml-3 bg-blue-500 text-white rounded-xl px-3 py-1"
                            onClick={() => startEdit(i, p)}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-2 bg-red-500 text-white rounded-xl px-3 py-1"
                            onClick={() => removeAsset(i)}
                          >
                            Remove
                          </button>
                        </span>
                      )}
                    </>
                  ) : null}
                  <span className={`mt-1 ${gain >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                    {gain >= 0 ? '+' : ''}{gain}$ ({percent >= 0 ? '+' : ''}{percent}%)
                  </span>
                </div>
                <span className="font-semibold">
                  ${typeof p.value === "number" ? p.value.toLocaleString("en-CA", { minimumFractionDigits: 2 }) : ""}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
