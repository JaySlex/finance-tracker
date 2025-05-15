import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import CenteredPanel from "./CenteredPanel";

export default function OnboardingForm() {
  const { user, setProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (!firstName || !lastName || !dateOfBirth) {
      // Only highlight fields, do not set a general error
      return;
    }

    setError("");
    setSaving(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        dateOfBirth,
      }, { merge: true });
      setProfile({ firstName, lastName, dateOfBirth });
    } catch (err) {
      setError("Failed to save profile.");
    }
    setSaving(false);
  };

  return (
    <CenteredPanel>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Complete Your Profile</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}

        <div>
          <input
            type="text"
            className={`border rounded-xl px-3 py-2 w-full ${showValidation && !firstName ? "border-red-500" : "border-gray-300"}`}
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            autoFocus
          />
          {showValidation && !firstName && (
            <div className="text-red-500 text-xs mt-1">First name is required.</div>
          )}
        </div>

        <div>
          <input
            type="text"
            className={`border rounded-xl px-3 py-2 w-full ${showValidation && !lastName ? "border-red-500" : "border-gray-300"}`}
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          {showValidation && !lastName && (
            <div className="text-red-500 text-xs mt-1">Last name is required.</div>
          )}
        </div>

        <div>
          <input
            type="date"
            className={`border rounded-xl px-3 py-2 w-full ${showValidation && !dateOfBirth ? "border-red-500" : "border-gray-300"}`}
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          {showValidation && !dateOfBirth && (
            <div className="text-red-500 text-xs mt-1">Date of birth is required.</div>
          )}
        </div>

        <button
          className="bg-black text-white rounded-xl px-4 py-2 w-full font-semibold hover:bg-gray-600 cursor-pointer transition"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Next"}
        </button>
      </form>
    </CenteredPanel>
  );
}
