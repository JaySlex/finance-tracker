import React, { useRef, useEffect, useState } from "react";
import { FinanceProvider } from "./context/FinanceContext";
import { useAuth } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OnboardingForm from "./components/OnboardingForm";
import Accounts from "./components/Accounts";
import Debts from "./components/Debts";
import Portfolio from "./components/Portfolio";
import Belongings from "./components/Belongings";
import TFSATracker from "./components/TFSATracker";
import Dashboard from "./components/Dashboard";

// Protected route helper
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><span className="text-lg font-bold">Loading...</span></div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const { user, logout, profile, profileLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Show onboarding if user logged in but missing profile
  if (user && profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-bold">Loading...</span>
      </div>
    );
  }
  if (user && (!profile || !profile.firstName || !profile.lastName || !profile.dateOfBirth)) {
    return <OnboardingForm />;
  }

  // NavBar tabs
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
      {user && (
        <nav className="flex items-center p-4 border-b bg-white sticky top-0 z-20 relative">
          {/* Centered tabs */}
          <div className="flex-1 flex justify-center gap-2">
            {TABS.map(t => (
              <NavLink
                key={t.id}
                to={`/${t.id}`}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 font-medium transition ${isActive ? "bg-black text-white" : "hover:bg-gray-200"}`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </div>
          {/* Profile dropdown on the right */}
          <div className="relative ml-4" ref={menuRef}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-800 font-medium transition-shadow shadow-sm ${
                menuOpen ? "ring-2 ring-gray-200" : ""
              }`}
              onClick={() => setMenuOpen((m) => !m)}
              aria-expanded={menuOpen}
            >
              <span>{profile?.firstName || "Profile"}</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl py-2 w-44 z-50 border border-gray-100 animate-fadeIn">
                <button
                  className="w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed font-normal"
                  disabled
                  title="Settings coming soon!"
                >
                  Settings
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-red-600 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
      <main className="max-w-4xl mx-auto">
        <Routes>
          {/* Auth pages: accessible when logged out */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected app pages */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Navigate to="/dashboard" />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/accounts"
            element={
              <RequireAuth>
                <Accounts />
              </RequireAuth>
            }
          />
          <Route
            path="/debts"
            element={
              <RequireAuth>
                <Debts />
              </RequireAuth>
            }
          />
          <Route
            path="/portfolio"
            element={
              <RequireAuth>
                <Portfolio />
              </RequireAuth>
            }
          />
          <Route
            path="/belongings"
            element={
              <RequireAuth>
                <Belongings />
              </RequireAuth>
            }
          />
          <Route
            path="/tfsa"
            element={
              <RequireAuth>
                <TFSATracker />
              </RequireAuth>
            }
          />
          {/* 404 */}
          <Route path="*" element={<div className="p-6 text-red-600">Page not found</div>} />
        </Routes>
      </main>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
