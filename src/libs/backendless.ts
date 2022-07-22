import Backendless from 'backendless';
import { Setting } from '../utils/index.db';

const setSetting = async (localSetting: Setting) => {
  const setting: any = await getSetting();

  if (setting) {
    localSetting.objectId = setting.objectId;
  }

  return await Backendless.Data.of('user_setting').save(localSetting);
};

const getSetting = async () => {
  return await Backendless.Data.of('user_setting').findFirst();
};

export { setSetting, getSetting };
