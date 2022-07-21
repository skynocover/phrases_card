import readXlsxFile, { readSheetNames } from 'read-excel-file';
import { saveAs } from 'file-saver';
import xlsx from 'json-as-xlsx';

import { db, Card } from '../utils/index.db';
import { getLanguages } from '../utils/cardQuery';

const importFromXlsx = async (e: any) => {
  const file = e.target.files[0];

  const sheetNames = await readSheetNames(file);

  for (const sheetName of sheetNames) {
    const langs = sheetName.split('_to_');
    const from = langs[0];
    const to = langs[1];

    const { rows } = await readXlsxFile<Card>(file, {
      schema: {
        origin: { prop: 'origin', type: String, required: true },
        translate: { prop: 'translate', type: String, required: true },
        sentence: { prop: 'sentence', type: String, required: true },
        comment: { prop: 'comment', type: String },
        star: { prop: 'star', type: Number, required: true },
      },
      sheet: sheetName,
    });

    for (const card of rows) {
      await db.cards.add({ ...card, from, to });
    }
  }
};

const importFromJSON = async (e: any) => {
  const file = e.target.files[0];

  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const text = e?.target?.result;
    if (typeof text === 'string') {
      const cards = JSON.parse(text);
      cards.map((card: any) => {
        const { origin, translate, sentence, comment, from, to, star } = card;
        if (
          typeof origin !== 'string' ||
          typeof translate !== 'string' ||
          typeof sentence !== 'string' ||
          (comment && typeof comment !== 'string') ||
          typeof from !== 'string' ||
          typeof to !== 'string' ||
          typeof star !== 'number'
        ) {
          alert('json format error!');
          return;
        }
      });

      cards.map(async (card: any) => {
        const temp: Card = { ...card, id: undefined };
        await db.cards.add(temp);
      });
    }
  };
  fileReader.readAsText(file);
};

const export2JSON = async () => {
  const cards = await db.cards.toArray();

  const blob = new Blob([JSON.stringify(cards)], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'phrase_cards.json');
};

const export2Xlsx = async () => {
  const froms = await getLanguages('from');
  const tos = await getLanguages('to');

  let data: any = [];
  const get = froms.map(async (from) => {
    const getTo = tos.map(async (to) => {
      const cards = await db.cards
        .where('from')
        .equals(from)
        .and((c) => c.to === to)
        .toArray();

      data.push({
        sheet: `${from}_to_${to}`,
        columns: [
          { label: 'origin', value: 'origin' },
          { label: 'translate', value: 'translate' },
          { label: 'sentence', value: 'sentence' },
          { label: 'comment', value: 'comment' },
          { label: 'star', value: 'star' },
        ],
        content: cards,
      });
    });
    await Promise.all(getTo);
  });

  await Promise.all(get);

  xlsx(data, { fileName: 'phrase_cards' });
};

export { importFromXlsx, importFromJSON, export2JSON, export2Xlsx };
