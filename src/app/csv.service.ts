import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  landingsData = 'assets/landings.csv';

  constructor(private http: HttpClient) { }

  readCsvFile() {
    return this.http.get(this.landingsData, { responseType: 'text' });
  }
}
