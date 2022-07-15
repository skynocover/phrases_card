import { languages } from './translate.js';
import { db, Card } from './index.db';

const getLanguages = async (key: string): Promise<string[]> => {
  const temp = languages.map(async (item) => (await db.cards.where(key).equals(item).count()) > 0);
  const booleans = await Promise.all(temp);

  return languages.filter((_, i) => booleans[i]);
};

export { getLanguages };
