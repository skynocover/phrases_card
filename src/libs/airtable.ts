import airtable from 'airtable';

class Airtable {
  base: airtable.Base;
  tableId: string;
  constructor(key: string, base: string, tableId: string) {
    this.base = new airtable({ apiKey: key }).base(base);
    this.tableId = tableId;
  }

  async getAllRecords() {
    let allRecords: any[] = [];
    await this.getRecords((records: any[]) => (allRecords = allRecords.concat(records)));
    return allRecords;
  }

  async getRecords(cb: Function) {
    await this.base(this.tableId)
      .select()
      .eachPage((records, nextPage) => {
        cb(records);
        nextPage();
      });
  }

  async createRecords(records: any[]) {
    return await this.base(this.tableId).create(records);
  }

  async updateRecords(records: any[]) {
    return await this.base(this.tableId).update(records);
  }

  async deleteRecords(ids: string[]) {
    return await this.base(this.tableId).destroy(ids);
  }
}

const getBaseAndTable = (url: string) => {
  const u = new URL(url);
  const s = u.pathname.split('/');
  return { baseId: s[1], tableId: s[2] };
};

export { Airtable, getBaseAndTable };
