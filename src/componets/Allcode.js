import React, { createContext, useContext, useState, useRef } from 'react';
const AppContext = createContext();
export const useAppContext = () => {
  return useContext(AppContext);
};
export const AppContextProvider = ({ children }) => {
  const htmlRef = useRef(null);
  const cssRef = useRef(null);
  const javascriptRef = useRef(null);
  return (
    <AppContext.Provider value={{htmlRef,cssRef,javascriptRef}}>
      {children}
    </AppContext.Provider>
  );
};
