import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import axios from 'axios';
import queryString from 'query-string';

import * as backendless from '../libs/backendless';
import { useBackendless } from '../hooks/useBackendless';
import { db, Card, Setting } from '../utils/index.db';

const defaultSetting: Setting = {
  homeTranslate: { from: 'auto', to: 'zh-TW', autoSpeech: false },
  cardTranslate: { from: 'en', to: 'zh-TW', autoSpeech: false },
  review: { probability: [40, 30, 20, 5, 5], reviewNumber: 40 },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const makeURL = (url: string) => {
  const u = new URL(url);
  if (u.origin === 'https://api.airtable.com') return url;
  const s = u.pathname.split('/');
  return `https://api.airtable.com/v0/${s[1]}/${s[2]}`;
};

export default function useSetting() {
  const [error, setError] = React.useState<Error>();

  const setting = useLiveQuery(() => db.setting.get(1)) || defaultSetting;
  const { getCurrentUser } = useBackendless();

  const syncSetting = async () => {
    try {
      const localSetting = await db.setting.get(1);
      const remoteSetting: any = await backendless.getSetting();
      console.log({ localSetting, remoteSetting });
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
      db.setting.update(1, inputSetting ? inputSetting : setting);
      await backendless.setSetting(inputSetting ? inputSetting : setting);
    } catch (error: any) {
      setError(error);
    }
  };

  const syncToAirtable = async (
    setProgressStep: React.Dispatch<React.SetStateAction<number>>,
    setProgressMax: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const airtable = setting.airtable;
    if (airtable) {
      const { url, key } = airtable;
      const trueURL = makeURL(url);
      const cards = await db.cards.toArray();

      const newRecord = cards
        .filter((card) => !card.airtableId)
        .map((card) => {
          return { fields: { ...card, id: undefined } };
        });
      const updateRecords = cards
        .filter((card) => !!card.airtableId)
        .map((card) => {
          return { fields: { ...card, airtableId: undefined, id: undefined }, id: card.airtableId };
        });

      const chunkSize = 10;
      setProgressMax(
        Math.ceil(newRecord.length / chunkSize) + Math.ceil(updateRecords.length / chunkSize),
      );

      for (let i = 0; i < newRecord.length; i += chunkSize) {
        const chunk = newRecord.slice(i, i + chunkSize);
        const { data } = await axios.post(
          trueURL,
          { records: chunk },
          {
            headers: {
              Authorization: 'Bearer ' + key,
              'Content-Type': 'application/json',
            },
          },
        );
        setProgressStep(Math.ceil(i / chunkSize));
        await sleep(210);
      }

      for (let i = 0; i < updateRecords.length; i += chunkSize) {
        const chunk = updateRecords.slice(i, i + chunkSize);
        const { data } = await axios.patch(
          trueURL,
          { records: chunk },
          {
            headers: {
              Authorization: 'Bearer ' + key,
              'Content-Type': 'application/json',
            },
          },
        );
        setProgressStep(Math.ceil((i + newRecord.length) / chunkSize));
        await sleep(210);
      }
    }
    setProgressStep(0);
    setProgressMax(0);
  };

  const syncFromAirtable = async () => {
    const airtable = setting.airtable;
    if (airtable) {
      const { url, key } = airtable;
      const trueURL = makeURL(url);

      const tempURL = '';
      const parsed = queryString.parse(tempURL);

      parsed.pageSize = '10';

      let init = true;

      let newOffset = '';
      let totalRecords: any[] = [];
      while (init || newOffset) {
        newOffset && (parsed.offset = newOffset);
        const url = trueURL + '?' + queryString.stringify(parsed);

        const { data } = await axios.get(url, {
          headers: { Authorization: 'Bearer ' + key },
        });
        await sleep(210);

        let { records, offset } = data;
        newOffset = offset;
        totalRecords = totalRecords.concat(records);
        init = false;
      }

      totalRecords.map(async (record) => {
        await db.cards.update(record.id, record);
      });

      await db.cards.clear();
      const sync = totalRecords.map((record) => {
        db.cards.add({ ...record.fields, airtableId: record.id, id: undefined });
      });

      await Promise.all(sync);
    }
  };

  return { error, setting, syncSetting, setSetting, syncToAirtable, syncFromAirtable };
}
