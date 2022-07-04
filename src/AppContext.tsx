import React from 'react';

interface AppContextProps {}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const init = async () => {
    try {
    } catch (error) {}
  };

  React.useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////////////

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
