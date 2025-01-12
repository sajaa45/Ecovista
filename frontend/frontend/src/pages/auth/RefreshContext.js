// RefreshContext.js
import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => {
  return useContext(RefreshContext);
};

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const handleSubmission = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <RefreshContext.Provider value={{ refresh, handleSubmission }}>
      {children}
    </RefreshContext.Provider>
  );
};