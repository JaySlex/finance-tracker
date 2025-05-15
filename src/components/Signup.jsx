import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CenteredPanel from "./CenteredPanel";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !isValidEmail(email) ||
      password !== confirmPassword
    )
      return;

    setFirebaseError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setFirebaseError("Could not create account. Please check your email.");
    }
  };

  return (
    <CenteredPanel>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Sign Up</h2>
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

        <div>
          <input
            type="password"
            className={`border rounded-xl px-3 py-2 w-full ${
              showValidation && (!confirmPassword || password !== confirmPassword)
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {showValidation && !confirmPassword && (
            <div className="text-red-500 text-xs mt-1">Please confirm your password.</div>
          )}
          {showValidation && password && confirmPassword && password !== confirmPassword && (
            <div className="text-red-500 text-xs mt-1">Passwords do not match.</div>
          )}
        </div>

        <button
          className="bg-black text-white rounded-xl px-4 py-2 w-full font-semibold"
          type="submit"
        >
          Sign Up
        </button>

        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <button
            type="button"
            className="underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </CenteredPanel>
  );
}
