import { languages } from './translate.js';
import { db, Card } from './index.db';

// 找到 from 跟 to 有的語言
const getLanguages = async (key: 'from' | 'to'): Promise<string[]> => {
  const temp = languages.map(async (item) => (await db.cards.where(key).equals(item).count()) > 0);
  const booleans = await Promise.all(temp);

  return languages.filter((_, i) => booleans[i]);
};

export { getLanguages };
