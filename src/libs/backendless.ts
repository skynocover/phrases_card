import Backendless from 'backendless';
import { db, Card, Setting } from '../utils/index.db';

const setSetting = async (localSetting: any) => {
  const setting: any = await getSetting();

  if (setting) {
    localSetting.objectId = setting.objectId;
  }

  console.log(localSetting);

  return await Backendless.Data.of('user_setting').save(localSetting);
};

const getSetting = async () => {
  return await Backendless.Data.of('user_setting').findFirst();
};

export { setSetting, getSetting };
