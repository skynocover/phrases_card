import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import * as backendless from '../libs/backendless';
import { Airtable, getBaseAndTable } from '../libs/airtable';
import { useBackendless } from '../hooks/useBackendless';
import { db, Card, Setting } from '../utils/index.db';

const defaultSetting: Setting = {
  homeTranslate: { from: 'auto', to: 'zh-TW', autoSpeech: false },
  cardTranslate: { from: 'en', to: 'zh-TW', autoSpeech: false },
  review: { probability: [40, 30, 20, 5, 5], reviewNumber: 40 },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useSetting() {
  const [error, setError] = React.useState<Error>();

  const setting = useLiveQuery(() => db.setting.get(1)) || defaultSetting;
  const { getCurrentUser } = useBackendless();

  const clearAllCards = async () => await db.cards.clear();

  const syncSetting = async () => {
    try {
      const localSetting = await db.setting.get(1);
      const remoteSetting: any = await backendless.getSetting();
      if (remoteSetting && localSetting) {
        return await db.setting.update(1, remoteSetting);
      }
      if (remoteSetting) {
        return await db.setting.add(remoteSetting);
      }
      if (!localSetting) {
        await db.setting.add(defaultSetting);
      }
      const currentUser = await getCurrentUser();
      await db.setting.update(1, {
        ...(await db.setting.get(1)),
        objectId: remoteSetting?.objectId, //check if remoteSetting is exist
        ownerId: currentUser?.objectId, //sync the userId
      });
    } catch (error: any) {
      setError(error);
    }
  };

  const setSetting = async (inputSetting?: Setting) => {
    try {
      await db.setting.update(1, inputSetting ? inputSetting : setting);
      await backendless.setSetting(inputSetting ? inputSetting : setting);
    } catch (error: any) {
      setError(error);
    }
  };

  const exportToAirtable = async (
    setProgressStep: React.Dispatch<React.SetStateAction<number>>,
    setProgressMax: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const airtable = setting.airtable;
    if (airtable) {
      const { url, key } = airtable;
      const { baseId, tableId } = getBaseAndTable(url);
      const base = new Airtable(key, baseId, tableId);

      const cards = await db.cards.toArray();

      const chunkSize = 10;
      setProgressMax(Math.ceil(cards.length / chunkSize));

      for (let i = 0; i < cards.length; i += chunkSize) {
        const chunk = cards.slice(i, i + chunkSize);

        await base.createRecords(
          chunk.map((card) => {
            return { fields: { ...card, id: undefined } };
          }),
        );

        setProgressStep(Math.ceil(i / chunkSize));
        await sleep(210);
      }
    }
  };

  const importFromAirtable = async () => {
    const airtable = setting.airtable;
    if (airtable) {
      const { url, key } = airtable;
      const { baseId, tableId } = getBaseAndTable(url);
      const base = new Airtable(key, baseId, tableId);

      const totalRecords = await base.getAllRecords();

      const sync = totalRecords.map(async (record) => {
        await db.cards.add({ ...record.fields, airtableId: record.id, id: undefined });
      });

      await Promise.all(sync);
    }
  };

  return {
    error,
    clearAllCards,
    setting,
    syncSetting,
    setSetting,
    exportToAirtable,
    importFromAirtable,
  };
}
