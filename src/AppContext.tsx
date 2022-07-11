import React from 'react';
import { db, Setting } from './utils/index.db';

interface AppContextProps {}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const defaultSetting: Setting = {
  homeTranslate: { from: 'auto', to: 'zh-TW', autoSpeech: false },
  cardTranslate: { from: 'en', to: 'zh-TW', autoSpeech: false },
  review: { probability: [40, 30, 20, 5, 5], reviewNumber: 40 },
};

const AppProvider = ({ children }: AppProviderProps) => {
  const init = async () => {
    try {
      const setting = await db.setting.get(1);
      if (!setting) {
        await db.setting.add(defaultSetting);
      }
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
