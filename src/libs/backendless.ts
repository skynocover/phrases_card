import Backendless from 'backendless';
import { Setting } from '../utils/index.db';

const setSetting = async (localSetting: Setting): Promise<Setting> => {
  const res: any = await Backendless.Data.of('user_setting').save(localSetting);

  if (res && res.oldObjectId) {
    localSetting.objectId = res.oldObjectId;
    return await Backendless.Data.of('user_setting').save(localSetting);
  }
  return res;
};

const getSetting = async () => {
  return await Backendless.Data.of('user_setting').findFirst();
};

export { setSetting, getSetting };
