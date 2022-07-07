import { indexDB } from './index.db';
import { langs } from './translate';

const languages = Object.keys(langs);

const cardStore = 'card';

interface cardStorageType {
  get(key: IDBValidKey): Promise<any>;
  add(value: any): Promise<IDBValidKey>;
  set(val: any): Promise<IDBValidKey>;
  del(key: number): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<IDBValidKey[]>;
  queryKeys(from: string | undefined, to: string | undefined): Promise<any>;
  queryAll(index: string, input: string, count?: number): Promise<any>;
  allLanguages(index: string): Promise<string[]>;
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
  async queryKeys(from: string | undefined, to: string | undefined) {
    if (from && to) {
      return indexDB
        .transaction(cardStore)
        .store.index('language')
        .getAllKeys(IDBKeyRange.only([from, to]));
    } else if (from) {
      return indexDB.transaction(cardStore).store.index('from').getAllKeys(from);
    } else if (to) {
      return indexDB.transaction(cardStore).store.index('to').getAllKeys(to);
    } else {
      return indexDB.getAllKeys(cardStore);
    }
  },
  async queryAll(index: string, input: string, count?: number) {
    return indexDB.transaction(cardStore).store.index(index).getAll(input, count);
  },
  async allLanguages(index: string) {
    const temp = languages.map(
      async (item) => (await indexDB.transaction(cardStore).store.index(index).count(item)) > 0,
    );
    const booleans = await Promise.all(temp);

    return languages.filter((_, i) => booleans[i]);
  },
};

export { cardStorage };
