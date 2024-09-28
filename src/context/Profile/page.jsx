"use client";
import React, { createContext, useContext, useState } from "react";
import Default from "@/images/default-image.png";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [photoURL, setPhotoURL] = useState(Default.src); // Initial state can be null or a default image URL

  return (
    <ProfileContext.Provider value={{ photoURL, setPhotoURL }}>
      {children}
    </ProfileContext.Provider>
  );
};
