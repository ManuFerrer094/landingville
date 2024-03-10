import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  landingsData = 'assets/landings.csv';
  apiUrl = 'https://api.github.com/repos/';
  repoUrl: string = '';

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
          bio: fields[2],
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

  getRepoContributors(repoUrl: string): Observable<any[]> {
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}${repoName}/contributors`;
    return this.http.get<any[]>(url);
  }

  setRepoUrl(url: string): void {
    this.repoUrl = url;
  }

  getRepoUrl(): string {
    return this.repoUrl;
  }
}
