import * as csvParser from 'csv-parser';
import * as fs from 'fs';

export class CsvService {
  constructor() { }

  async readCsvFile(filePath: string): Promise<any[]> {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: any) => reject(error));
    });
  }
}
