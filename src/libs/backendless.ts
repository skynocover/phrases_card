import Backendless from 'backendless';
import { Setting } from '../utils/index.db';

const setSetting = async (localSetting: Setting) => {
  const res = await Backendless.Data.of('user_setting').save(localSetting);
  if (res && res.objectId) {
    localSetting.objectId = res.objectId;
    await Backendless.Data.of('user_setting').save(localSetting);
  }

  return;
};

const getSetting = async () => {
  return await Backendless.Data.of('user_setting').findFirst();
};

export { setSetting, getSetting };
