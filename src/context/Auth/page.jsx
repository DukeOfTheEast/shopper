"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, storage } from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user details from Firestore
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          fullName: userData?.fullName || "Default Full Name",
        });
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      createdAt: new Date(),
    });

    setCurrentUser({
      uid: user.uid,
      email: user.email,
      fullName: fullName,
    });
    return user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setCurrentUser(userCredential.user);
    return userCredential.user;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // If the user doesn't exist in Firestore, create the user document
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || "No Name",
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      // Update current user in the context
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "No Name",
        photoURL: user.photoURL,
      });

      return user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch additional user details if needed
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        photoURL: user.photoURL,
      });

      return user;
    } catch (error) {
      console.error("Error during Facebook login:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        googleSignIn,
        facebookSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
