import React, { useContext, useEffect, useState, createContext } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(undefined); // distinguish between 'not loaded' (undefined) and 'empty' (null)
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true); // NEW

  useEffect(() => {
    setLoading(true);
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        setProfileLoading(true); // loading profile
        const profileRef = doc(db, "users", user.uid);
        const snap = await getDoc(profileRef);
        setProfile(snap.exists() ? snap.data() : null);
        setProfileLoading(false); // done loading
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, profile, setProfile, loading, profileLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
