import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private apiUrl = 'https://api.github.com/repos/';
  private repoUrl: string = '';

  constructor(private http: HttpClient) { }

  readCsvFile(): Observable<string> {
    return this.http.get('assets/landings.csv', { responseType: 'text' });
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

  getUserDetails(username: string): Observable<any> {
    const url = `https://api.github.com/users/${username}`;
    return this.http.get<any>(url);
  }

  getUserRepositories(username: string): Observable<any[]> {
    const url = `https://api.github.com/users/${username}/repos?per_page=100`;
    return this.http.get<any[]>(url);
  }

  // Get language statistics with percentages
  getLanguageStats(username: string): Observable<any> {
    return this.getUserRepositories(username).pipe(
      map((repositories: any[]) => {
        const languageCount: { [key: string]: number } = {};
        let totalRepos = 0;

        repositories.forEach((repo: any) => {
          if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            totalRepos++;
          }
        });

        // Calculate percentages and sort by count
        const languageStats = Object.entries(languageCount)
          .map(([language, count]) => ({
            language,
            count,
            percentage: totalRepos > 0 ? Math.round((count / totalRepos) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 languages

        return languageStats;
      })
    );
  }

  setRepoUrl(url: string): void {
    this.repoUrl = url;
  }

  getRepoUrl(): string {
    return this.repoUrl;
  }
}
