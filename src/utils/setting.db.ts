import { indexDB } from './index.db';

const settingStore = 'setting';

interface settingStorageType {
  get(key: string): Promise<any>;
  set(key: string, val: any): Promise<IDBValidKey>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<IDBValidKey[]>;
}

const settingStorage: settingStorageType = {
  async get(key: string) {
    return indexDB.get(settingStore, key);
  },
  async set(key: string, val: any) {
    return indexDB.put(settingStore, val, key);
  },
  async del(key: string) {
    return indexDB.delete(settingStore, key);
  },
  async clear() {
    return indexDB.clear(settingStore);
  },
  async keys() {
    return indexDB.getAllKeys(settingStore);
  },
};

export { settingStorage };
