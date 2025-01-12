import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => {
  return useContext(RefreshContext); // Custom hook to access context
};

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false); // Initial refresh state is false

  const toggleRefresh = () => {
    setRefresh((prev) => !prev); // Toggle the refresh state between true and false
  };

  return (
    <RefreshContext.Provider value={{ refresh, toggleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
