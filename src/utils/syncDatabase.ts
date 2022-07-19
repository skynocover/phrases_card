import axios from 'axios';
import queryString from 'query-string';
import * as backendless from '../libs/backendless';
import { db, Card, Setting } from './index.db';

const setSetting = async () => {
  try {
    const localSetting = await db.setting.get(1);
    if (localSetting) {
      return backendless.setSetting(localSetting);
    }
  } catch (error: any) {
    alert(error.message);
  }
};

const defaultSetting: Setting = {
  homeTranslate: { from: 'auto', to: 'zh-TW', autoSpeech: false },
  cardTranslate: { from: 'en', to: 'zh-TW', autoSpeech: false },
  review: { probability: [40, 30, 20, 5, 5], reviewNumber: 40 },
};

const getSetting = async () => {
  const localSetting = await db.setting.get(1);
  const syncSetting: any = await backendless.getSetting();
  console.log({ localSetting, syncSetting });
  if (syncSetting && localSetting) {
    return await db.setting.update(1, syncSetting);
  }
  if (syncSetting) {
    return await db.setting.add(syncSetting);
  }
  await db.setting.add(defaultSetting);
};

const setAirtable = async () => {
  const cards = await db.cards.toArray();

  const records = cards.map((item) => {
    return { fields: item };
  });

  console.log(records);

  const chunkSize = 10;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const { data } = await axios.post(
      'https://api.airtable.com/v0/appqWuXeMlWVQe7XF/Table%201',
      { records: chunk },
      {
        headers: { Authorization: 'Bearer key6C4byG3Gg1aCd3', 'Content-Type': 'application/json' },
      },
    );
    console.log(data);
  }
};

const getAirtable = async () => {
  const tempURL = '';
  const parsed = queryString.parse(tempURL);

  parsed.pageSize = '10';

  let init = true;

  let newOffset = '';
  let totalRecords: any[] = [];
  while (init || newOffset) {
    newOffset && (parsed.offset = newOffset);
    const url =
      'https://api.airtable.com/v0/appqWuXeMlWVQe7XF/Table%201' +
      '?' +
      queryString.stringify(parsed);

    const { data } = await axios.get(url, {
      headers: { Authorization: 'Bearer key6C4byG3Gg1aCd3' },
    });

    let { records, offset } = data;
    newOffset = offset;
    totalRecords = totalRecords.concat(records);
    init = false;
  }

  console.log(totalRecords);
  return totalRecords;
};

export { setSetting, getSetting, setAirtable };
