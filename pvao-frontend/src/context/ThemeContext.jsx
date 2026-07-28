import React, { createContext, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import { antdTheme } from '../styles/antdTheme';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...antdTheme,
      }}
    >
      <ThemeContext.Provider value={{}}>
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};
