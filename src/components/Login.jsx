import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import CenteredPanel from "./CenteredPanel";
import wealthsyLogo from "../img/logo.png"; 

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [showResetPanel, setShowResetPanel] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (!email || !password || !isValidEmail(email)) return;

    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setFirebaseError("Invalid email or password.");
    }
  };

  return (
    <>
      <CenteredPanel>
        <div className="flex flex-col items-center mb-2">
          <img src={wealthsyLogo} alt="Wealthsy Logo" className="h-14 w-auto mb-2 drop-shadow-lg" />
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
          {firebaseError && <div className="text-red-500 text-center">{firebaseError}</div>}

          <div>
            <input
              type="text"
              className={`border rounded-xl px-3 py-2 w-full ${
                showValidation && (!email || !isValidEmail(email))
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            {showValidation && !email && (
              <div className="text-red-500 text-xs mt-1">Email is required.</div>
            )}
            {showValidation && email && !isValidEmail(email) && (
              <div className="text-red-500 text-xs mt-1">Enter a valid email address.</div>
            )}
          </div>

          <div>
            <input
              type="password"
              className={`border rounded-xl px-3 py-2 w-full ${
                showValidation && !password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {showValidation && !password && (
              <div className="text-red-500 text-xs mt-1">Password is required.</div>
            )}
          </div>

          <button
            className="bg-black text-white rounded-xl px-4 py-2 w-full font-semibold"
            type="submit"
          >
            Login
          </button>

          <div className="text-center text-sm mt-2">
            <button
              type="button"
              className="underline text-gray-600 hover:text-black transition"
              onClick={() => setShowResetPanel(true)}
            >
              Forgot password?
            </button>
          </div>

          <div className="text-center text-sm mt-2">
            Don't have an account?{" "}
            <button
              type="button"
              className="underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </CenteredPanel>

      {showResetPanel && (
        <PasswordResetPanel onClose={() => setShowResetPanel(false)} />
      )}
    </>
  );
}

function PasswordResetPanel({ onClose }) {
  const [email, setEmail] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [status, setStatus] = useState(""); // success, error, or empty
  const [loading, setLoading] = useState(false);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (!email || !isValidEmail(email)) return;

    setLoading(true);
    setStatus("");
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <CenteredPanel>
      <div className="relative w-full">
        {/* X button at top right, inside padding */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-black text-xl font-bold p-0 leading-none z-10"
          aria-label="Close"
          style={{
            width: "1rem",
            height: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            background: "transparent",
            border: "none",
          }}
        >
          ×
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 pt-2"
          style={{ minWidth: "300px" }}
        >
          <h2 className="text-xl font-bold text-center mb-2 mt-2">Reset Password</h2>
          <div className="text-gray-600 text-sm text-center mb-3">
            Enter your account email and we’ll send you a reset link.
          </div>
          <input
            type="text"
            className={`border rounded-xl px-3 py-2 w-full ${
              showValidation && (!email || !isValidEmail(email))
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          {showValidation && !email && (
            <div className="text-red-500 text-xs mt-1">Email is required.</div>
          )}
          {showValidation && email && !isValidEmail(email) && (
            <div className="text-red-500 text-xs mt-1">Enter a valid email address.</div>
          )}
          <button
            className="bg-black text-white rounded-xl px-4 py-2 w-full font-semibold mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
          {status === "success" && (
            <div className="text-green-600 text-center text-sm mt-2">
              Check your email for the reset link!
            </div>
          )}
          {status === "error" && (
            <div className="text-red-500 text-center text-sm mt-2">
              Could not send reset link. Please check your email and try again.
            </div>
          )}
        </form>
      </div>
    </CenteredPanel>
  );
}
