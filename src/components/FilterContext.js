import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <FilterContext.Provider value={{ filterStatus, setFilterStatus }}>
      {children}
    </FilterContext.Provider>
  );
};