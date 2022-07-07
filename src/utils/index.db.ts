import { openDB, deleteDB, wrap, unwrap, IDBPObjectStore, IDBPDatabase } from 'idb';

const dbName = 'phrases_card';

const cardStore = 'card';
const settingStore = 'setting';

const indexDB = await openDB(dbName, 1, {
  upgrade(db) {
    const cardTable = db.createObjectStore(cardStore, {
      keyPath: 'id',
      autoIncrement: true,
    });
    cardTable.createIndex('from', 'from');
    cardTable.createIndex('to', 'to');
    cardTable.createIndex('language', ['from', 'to']);
    cardTable.createIndex('origin', 'origin');
    cardTable.createIndex('translate', 'translate');
    cardTable.createIndex('star', 'star');
    db.createObjectStore(settingStore);
  },
});

export { indexDB };
