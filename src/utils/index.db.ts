import Dexie, { Table } from 'dexie';

export interface Card {
  id?: number;
  origin: string;
  translate: string;
  sentence: string;
  comment?: string;
  star: number;

  from: string;
  to: string;
}

export interface Setting {
  id: number;
  objectId?: string;
  ownerId?: string;
  homeTranslate: translateSetting;
  cardTranslate: translateSetting;
  review: reviewSetting;
  airtable?: airtableSetting;
}

interface translateSetting {
  from: string;
  to: string;
  autoSpeech: boolean;
}

interface reviewSetting {
  probability: number[];
  reviewNumber: number;
}

interface airtableSetting {
  url: string;
  key: string;
}

class PhraseCards extends Dexie {
  public cards!: Table<Card, number>;
  public setting!: Table<Setting>;
  public constructor() {
    super('phrase_cards');
    this.version(1).stores({
      cards: '++id,from,to,star,origin,translate',
      setting: '++id,homeTranslate,cardTranslate,review',
    });
  }
}

export const db = new PhraseCards();
