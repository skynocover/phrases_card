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
  homeTranslate: translateSetting;
  cardTranslate: translateSetting;
  review: reviewSetting;
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

class PhraseCards extends Dexie {
  public cards!: Table<Card, number>;
  public setting!: Table<Setting>;
  public constructor() {
    super('phrase_cards');
    this.version(1).stores({
      cards: '++id,from,to,star',
      setting: '++id,homeTranslate,cardTranslate,review',
    });

    this.version(2)
      .stores({
        cards: '++id,from,to,star,origin,translate',
        setting: '++id,homeTranslate,cardTranslate,review',
      })
      .upgrade((trans) => {
        return trans.db
          .table('setting')
          .toCollection()
          .modify((setting) => {
            setting.homeTranslate.autoSpeech = setting.homeAutoSpeech;
            delete setting.homeAutoSpeech;
          });
      });
  }
}

export const db = new PhraseCards();
