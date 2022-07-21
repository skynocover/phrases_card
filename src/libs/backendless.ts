import Backendless from 'backendless';

const setSetting = async (localSetting: any) => {
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
