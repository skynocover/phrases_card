import { openDB, deleteDB, wrap, unwrap, IDBPObjectStore, IDBPDatabase } from 'idb';

const dbName = 'phrases_card';

const cardStore = 'card';
const settingStore = 'setting';

const indexDB = await openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(cardStore, {
      keyPath: 'id',
      autoIncrement: true,
    });
    db.createObjectStore(settingStore);
  },
});

export { indexDB };
