import { indexDB } from './index.db';

const cardStore = 'card';

interface cardStorageType {
  get(key: IDBValidKey): Promise<any>;
  add(value: any): Promise<IDBValidKey>;
  set(key: string, val: any): Promise<IDBValidKey>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<IDBValidKey[]>;
}

const cardStorage: cardStorageType = {
  async get(key: IDBValidKey) {
    return indexDB.get(cardStore, key);
  },
  async add(value: any) {
    return indexDB.add(cardStore, value);
  },
  async set(key: string, val: any) {
    return indexDB.put(cardStore, val, key);
  },
  async del(key: string) {
    return indexDB.delete(cardStore, key);
  },
  async clear() {
    return indexDB.clear(cardStore);
  },
  async keys() {
    return indexDB.getAllKeys(cardStore);
  },
};

export { cardStorage };
