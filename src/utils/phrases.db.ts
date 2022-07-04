import { openDB, deleteDB, wrap, unwrap, IDBPObjectStore, IDBPDatabase } from 'idb';

const dbName = 'phrases_card';
const cardStore = 'card';

const cardDB = await openDB(dbName, 2, {
  upgrade(db) {
    db.createObjectStore(cardStore, {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

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
    return cardDB.get(cardStore, key);
  },
  async add(value: any) {
    return cardDB.add(cardStore, value);
  },
  async set(key: string, val: any) {
    return cardDB.put(cardStore, val, key);
  },
  async del(key: string) {
    return cardDB.delete(cardStore, key);
  },
  async clear() {
    return cardDB.clear(cardStore);
  },
  async keys() {
    return cardDB.getAllKeys(cardStore);
  },
};

export { cardDB, cardStorage };
