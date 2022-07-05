import { indexDB } from './index.db';

const cardStore = 'card';

interface cardStorageType {
  get(key: IDBValidKey): Promise<any>;
  add(value: any): Promise<IDBValidKey>;
  set(val: any): Promise<IDBValidKey>;
  del(key: number): Promise<void>;
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
  async set(val: any) {
    return indexDB.put(cardStore, val);
  },
  async del(key: number) {
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
