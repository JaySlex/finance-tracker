import React, { createContext, useContext, useState } from "react";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [debts, setDebts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [belongings, setBelongings] = useState([]);
  const [tfsa, setTfsa] = useState([]);

  return (
    <FinanceContext.Provider value={{
      accounts,
      setAccounts,
      debts,
      setDebts,
      portfolio,
      setPortfolio,
      belongings,
      setBelongings,
      tfsa,
      setTfsa
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
