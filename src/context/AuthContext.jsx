// src/context/AuthContext.jsx
import React, { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user
  const [userData, setUserData] = useState(null);       // Firestore user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            setUserData({
              ...firestoreData,
              displayName: firestoreData.displayName || user.displayName || user.email,
            });
          } else {
            setUserData({
              role: 'guest',
              displayName: user.displayName || user.email,
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserData({
            role: 'guest',
            displayName: user.displayName || user.email,
          });
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
  };

  const value = {
    currentUser,
    userData,
    setUserData,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
