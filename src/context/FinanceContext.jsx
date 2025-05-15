import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  // App data state
  const [accounts, setAccounts] = useState([]);
  const [debts, setDebts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [belongings, setBelongings] = useState([]);
  const [tfsa, setTfsa] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Firestore when user changes (login)
  useEffect(() => {
    if (!user) {
      // If not logged in, clear data and stop loading
      setAccounts([]);
      setDebts([]);
      setPortfolio([]);
      setBelongings([]);
      setTfsa([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch data from Firestore
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then(snap => {
      const data = snap.data() || {};
      setAccounts(data.accounts || []);
      setDebts(data.debts || []);
      setPortfolio(data.portfolio || []);
      setBelongings(data.belongings || []);
      setTfsa(data.tfsa || []);
      setLoading(false);
    });
  }, [user]);

  // Save to Firestore on any change, but ONLY if logged in
  useEffect(() => {
    if (!user || loading) return;
    const docRef = doc(db, "users", user.uid);
    setDoc(docRef, {
      accounts,
      debts,
      portfolio,
      belongings,
      tfsa,
    }, { merge: true });
  }, [user, accounts, debts, portfolio, belongings, tfsa]);

  return (
    <FinanceContext.Provider value={{
      accounts, setAccounts,
      debts, setDebts,
      portfolio, setPortfolio,
      belongings, setBelongings,
      tfsa, setTfsa,
      loading,
    }}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen text-lg">Loading your finances...</div>
      ) : children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
