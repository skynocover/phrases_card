import { openDB, deleteDB, wrap, unwrap, IDBPObjectStore, IDBPDatabase } from 'idb';

const dbName = 'phrases_card';
const settingStore = 'setting';

const settingDB = await openDB(dbName, 2, {
  upgrade(db) {
    db.createObjectStore(settingStore);
  },
});

const settingStorage: any = {
  async get(key: string) {
    return settingDB.get(settingStore, key);
  },
  async set(key: string, val: any) {
    return settingDB.put(settingStore, val, key);
  },
  async del(key: string) {
    return settingDB.delete(settingStore, key);
  },
  async clear() {
    return settingDB.clear(settingStore);
  },
  async keys() {
    return settingDB.getAllKeys(settingStore);
  },
};

export { settingDB, settingStorage };
