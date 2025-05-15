import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";

// TFSA annual limits by year
const tfsaLimitByYear = (year) => {
  year = Number(year);
  if (year >= 2009 && year <= 2012) return 5000;
  if (year === 2013 || year === 2014) return 5500;
  if (year === 2015) return 10000;
  if (year >= 2016 && year <= 2018) return 5500;
  if (year >= 2019 && year <= 2022) return 6000;
  if (year === 2023) return 6500;
  if (year === 2024 || year === 2025) return 7000;
  if (year > 2025) return 7000;
  return 0;
};

const latestYear = 2025;

export default function TFSATracker() {
  const { tfsa, setTfsa } = useFinance();
  const { profile } = useAuth();
  const [year, setYear] = useState("");
  const [contribution, setContribution] = useState({});
  const [withdrawal, setWithdrawal] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ---- Use birth year from profile ----
  let birthYear = undefined;
  if (profile && profile.dateOfBirth) {
    // Extract the year as an integer from "YYYY-MM-DD"
    birthYear = parseInt(profile.dateOfBirth.slice(0, 4), 10);
    if (isNaN(birthYear)) birthYear = undefined;
  }

  // Dynamic min year logic
  const getMinYear = () => {
    const minByBirth = birthYear && !isNaN(Number(birthYear))
      ? Number(birthYear) + 18
      : 2009;
    return Math.max(2009, minByBirth);
  };

  // Add year with hard-coded limit
  const addYear = () => {
    const y = Number(year);
    const minYear = getMinYear();
    if (
      !year ||
      isNaN(y) ||
      y < minYear ||
      tfsa.some((t) => t.year === y) ||
      tfsaLimitByYear(y) === 0
    )
      return;
    setTfsa([
      ...tfsa,
      {
        year: y,
        limit: tfsaLimitByYear(y),
        contributions: [],
        withdrawals: [],
      },
    ]);
    setYear("");
  };

  // Remove a year
  const removeYear = (yearToRemove) => {
    setTfsa(tfsa.filter((t) => t.year !== yearToRemove));
  };

  // Add contribution
  const addContribution = (i, amount) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setTfsa(
      tfsa.map((t, idx) =>
        idx === i
          ? { ...t, contributions: [...t.contributions, Number(amount)] }
          : t
      )
    );
    setContribution((prev) => ({ ...prev, [i]: "" }));
  };

  // Add withdrawal
  const addWithdrawal = (i, amount) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setTfsa(
      tfsa.map((t, idx) =>
        idx === i
          ? { ...t, withdrawals: [...t.withdrawals, Number(amount)] }
          : t
      )
    );
    setWithdrawal((prev) => ({ ...prev, [i]: "" }));
  };

  // Delete individual contribution/withdrawal
  const deleteContribution = (i, j) => {
    setTfsa(
      tfsa.map((t, idx) =>
        idx === i
          ? { ...t, contributions: t.contributions.filter((_, k) => k !== j) }
          : t
      )
    );
  };

  const deleteWithdrawal = (i, j) => {
    setTfsa(
      tfsa.map((t, idx) =>
        idx === i
          ? { ...t, withdrawals: t.withdrawals.filter((_, k) => k !== j) }
          : t
      )
    );
  };

  // Helpers
  const totalContributed = (t) => (t.contributions ?? []).reduce((a, v) => a + v, 0);
  const totalWithdrawn = (t) => (t.withdrawals ?? []).reduce((a, v) => a + v, 0);

  // ---- Global room calculations ----

  // Which years count for THIS user?
  let eligibleYears = [];
  if (birthYear && !isNaN(Number(birthYear))) {
    const firstYear = Math.max(2009, Number(birthYear) + 18);
    for (let y = firstYear; y <= latestYear; ++y) {
      if (tfsaLimitByYear(y) > 0) eligibleYears.push(y);
    }
  }

  // Sum all possible limits for this user (based on their age)
  const totalRoom = eligibleYears.reduce((sum, y) => sum + tfsaLimitByYear(y), 0);

  // All contributions and withdrawals for those years (even if not yet added in tracker)
  let userYearsInTracker = tfsa.filter(t => eligibleYears.includes(t.year));
  let contributed = userYearsInTracker.reduce((sum, t) => sum + totalContributed(t), 0);
  let withdrawnPriorYears = 0;
  userYearsInTracker.forEach((t, idx, arr) => {
    // Withdrawals from previous years only
    for (let i = 0; i < idx; ++i) {
      withdrawnPriorYears += totalWithdrawn(arr[i]);
    }
  });

  const availableRoom = totalRoom + withdrawnPriorYears - contributed;

  // Handler for year blur: force value to min year if set
  const handleYearBlur = () => {
    const minYear = getMinYear();
    if (!year || isNaN(Number(year)) || Number(year) < minYear) {
      setYear(String(minYear));
    }
  };

  if (!birthYear) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-red-600 font-semibold text-lg">
          Could not determine your birth year from your account profile. Please set your date of birth in your profile.
        </div>
      </div>
    );
  }

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-left">TFSA Contribution Tracker</h2>
      <div className="flex flex-wrap gap-2 mb-6 items-end">
        <div>
          <div className="block text-sm font-medium mb-1">
            <span>Your birth year: </span>
            <span className="font-semibold">{birthYear}</span>
          </div>
          <div className="block text-xs text-gray-500 mb-1">
            (From your profile)
          </div>
        </div>
        {birthYear && eligibleYears.length > 0 && (
          <div className="ml-8">
            <div className="font-bold text-lg mb-1">Total Contribution Room</div>
            <div className="text-black text-xl font-bold">
              ${totalRoom.toLocaleString("en-CA")}
            </div>
            <div className="mt-2 font-bold text-lg">Available Contribution Room</div>
            <div className="text-green-700 text-xl font-bold">
              ${availableRoom.toLocaleString("en-CA")}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (Based on years from when you turned 18, withdrawals added to next year.)
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mb-4 flex-wrap text-left">
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Year"
          value={year}
          type="number"
          min={getMinYear()}
          onChange={e => setYear(e.target.value)}
          onBlur={handleYearBlur}
        />
        <button
          className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-600 cursor-pointer transition"
          onClick={addYear}
        >
          Add Year
        </button>
      </div>
      {tfsa.length === 0 ? (
        <div className="text-center text-gray-400 italic py-8">
          No TFSA years added yet.
        </div>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-2">Year</th>
              <th className="px-2 py-2">Limit</th>
              <th className="px-2 py-2">Contributions</th>
              <th className="px-2 py-2">Withdrawals</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tfsa
              .sort((a, b) => a.year - b.year)
              .map((t, i) => {
                const totalCont = totalContributed(t);
                const totalWith = totalWithdrawn(t);

                return (
                  <tr key={i} className="border-b align-top">
                    <td className="px-2 py-2 font-semibold">{t.year}</td>
                    <td className="px-2 py-2">${t.limit.toLocaleString("en-CA")}</td>
                    {/* Contributions */}
                    <td className="px-2 py-2 align-top">
                      <ul className="mb-1">
                        {t.contributions?.map((amt, j) => (
                          <li key={j} className="flex items-center justify-between text-green-700">
                            <span>+${amt.toLocaleString("en-CA")}</span>
                            <button
                              className="ml-2 text-xs text-gray-400 hover:text-red-500 cursor-pointer transition"
                              onClick={() => deleteContribution(i, j)}
                              title="Delete contribution"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                        {t.contributions?.length === 0 && (
                          <li className="text-gray-400 italic">No contributions</li>
                        )}
                      </ul>
                      <div className="flex gap-1 items-center">
                        <input
                          className="border rounded-xl px-2 py-1 w-32"
                          type="number"
                          min="1"
                          value={contribution[i] || ""}
                          placeholder="Amount"
                          onChange={e =>
                            setContribution((prev) => ({
                              ...prev,
                              [i]: e.target.value
                            }))
                          }
                        />
                        <button
                          className="bg-green-600 text-white rounded-xl px-3 py-1 cursor-pointer transition"
                          onClick={() => addContribution(i, contribution[i])}
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-gray-700">
                        Total: ${totalCont.toLocaleString("en-CA")}
                      </div>
                    </td>
                    {/* Withdrawals */}
                    <td className="px-2 py-2 align-top">
                      <ul className="mb-1">
                        {t.withdrawals?.map((amt, j) => (
                          <li key={j} className="flex items-center justify-between text-red-700">
                            <span>- ${amt.toLocaleString("en-CA")}</span>
                            <button
                              className="ml-2 text-xs text-gray-400 hover:text-red-500 cursor-pointer transition"
                              onClick={() => deleteWithdrawal(i, j)}
                              title="Delete withdrawal"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                        {t.withdrawals?.length === 0 && (
                          <li className="text-gray-400 italic">No withdrawals</li>
                        )}
                      </ul>
                      <div className="flex gap-1 items-center">
                        <input
                          className="border rounded-xl px-2 py-1 w-32"
                          type="number"
                          min="1"
                          value={withdrawal[i] || ""}
                          placeholder="Amount"
                          onChange={e =>
                            setWithdrawal((prev) => ({
                              ...prev,
                              [i]: e.target.value
                            }))
                          }
                        />
                        <button
                          className="bg-red-600 text-white rounded-xl px-3 py-1 cursor-pointer transition"
                          onClick={() => addWithdrawal(i, withdrawal[i])}
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-gray-700">
                        Total: ${totalWith.toLocaleString("en-CA")}
                      </div>
                    </td>
                    {/* Remove year */}
                    <td className="px-2 py-2 align-top">
                      <button
                        className="text-gray-400 hover:text-red-500 text-lg leading-none cursor-pointer transition"
                        title="Remove year"
                        onClick={() => removeYear(t.year)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
            <div className="mb-4 text-lg">{modalMessage}</div>
            <button
              className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer transition"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
