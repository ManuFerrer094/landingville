import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  landingsData = 'assets/landings.csv';

  constructor(private http: HttpClient) { }

  readCsvFile(): Observable<string> {
    return this.http.get(this.landingsData, { responseType: 'text' });
  }

  getUserData(userIndex: string): Observable<any> {
    return this.readCsvFile().pipe(
      map((data: string) => {
        const lines = data.split('\n');
        const fields = lines[parseInt(userIndex)].split(',');
        return {
          nombre: fields[0],
          rol: fields[1],
          descripcion: fields[2],
          email: fields[3],
          telefono: fields[4],
          linkedin: fields[5],
          github: fields[6],
          foto: fields[7],
          username: fields[8]
        };
      })
    );
  }

  getUsernameFromCsv(): Observable<string> {
    return this.readCsvFile().pipe(
      map((data: string) => {
        const lines = data.split('\n');
        const fields = lines[0].split(',');
        return fields[8];
      })
    );
  }
}
