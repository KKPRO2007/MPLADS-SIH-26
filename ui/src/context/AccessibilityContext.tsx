"use client";

import React, { createContext, useContext, useState } from "react";

type AccessibilityContextType = {
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  reduceMotion: false,
  setReduceMotion: () => {},
});

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <AccessibilityContext.Provider value={{ reduceMotion, setReduceMotion }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
