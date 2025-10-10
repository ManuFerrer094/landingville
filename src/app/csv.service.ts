import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private apiUrl = 'https://api.github.com/';
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

  isOrganizationUrl(url: string): boolean {
    const parts = url.split('/').filter(part => part);
    // Organization URL: https://github.com/org-name (4 parts)
    // Repository URL: https://github.com/owner/repo (5 parts)
    return parts.length === 4 || (parts.length === 3 && !parts[2]);
  }

  getRepoContributors(repoUrl: string): Observable<any[]> {
    if (this.isOrganizationUrl(repoUrl)) {
      return this.getOrgMembers(repoUrl);
    }
    
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}repos/${repoName}/contributors`;

    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching contributors:', error);
        return of([]);
      })
    );
  }

  getOrgMembers(orgUrl: string): Observable<any[]> {
    const orgName = orgUrl.split('/').filter(part => part).pop();
    const url = `${this.apiUrl}orgs/${orgName}/members`;

    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching org members:', error);
        return of([]);
      })
    );
  }

  getOrgRepositories(orgUrl: string): Observable<any[]> {
    const orgName = orgUrl.split('/').filter(part => part).pop();
    const url = `${this.apiUrl}orgs/${orgName}/repos?per_page=100`;

    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching org repos:', error);
        return of([]);
      })
    );
  }

  getUserDetails(username: string): Observable<any> {
    const url = `${this.apiUrl}users/${username}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        return of({});
      })
    );
  }

  getUserRepos(username: string): Observable<any[]> {
    const url = `${this.apiUrl}users/${username}/repos?per_page=100`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching user repos:', error);
        return of([]);
      })
    );
  }

  getUserLanguages(username: string): Observable<{ [key: string]: number }> {
    return this.getUserRepos(username).pipe(
      switchMap(repos => {
        if (!repos || repos.length === 0) {
          return of({});
        }
        const languageRequests = repos.map(repo => 
          this.http.get<{ [key: string]: number }>(`${this.apiUrl}repos/${username}/${repo.name}/languages`).pipe(
            catchError(() => of({} as { [key: string]: number }))
          )
        );
        return forkJoin(languageRequests).pipe(
          map(languages => {
            const combined: { [key: string]: number } = {};
            languages.forEach(lang => {
              Object.keys(lang).forEach(key => {
                combined[key] = (combined[key] || 0) + (lang[key] || 0);
              });
            });
            return combined;
          })
        );
      })
    );
  }

  getRepoDetails(repoUrl: string): Observable<any> {
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}repos/${repoName}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error fetching repo details:', error);
        return of({});
      })
    );
  }

  getRepoReleases(repoUrl: string): Observable<any[]> {
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}repos/${repoName}/releases?per_page=10`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching releases:', error);
        return of([]);
      })
    );
  }

  getRepoLanguages(repoUrl: string): Observable<{ [key: string]: number }> {
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}repos/${repoName}/languages`;
    return this.http.get<{ [key: string]: number }>(url).pipe(
      catchError(error => {
        console.error('Error fetching repo languages:', error);
        return of({});
      })
    );
  }

  getRepoTopics(repoUrl: string): Observable<string[]> {
    const repoName = repoUrl.split('/').slice(-2).join('/');
    const url = `${this.apiUrl}repos/${repoName}/topics`;
    return this.http.get<{ names: string[] }>(url, {
      headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
    }).pipe(
      map(response => response.names || []),
      catchError(error => {
        console.error('Error fetching repo topics:', error);
        return of([]);
      })
    );
  }

  getUserContributions(username: string): Observable<number> {
    // Note: GitHub doesn't provide a direct API for contribution count
    // We'll estimate based on commit activity across repos
    return this.getUserRepos(username).pipe(
      switchMap(repos => {
        if (!repos || repos.length === 0) {
          return of(0);
        }
        const commitRequests = repos.slice(0, 10).map(repo => 
          this.http.get<any[]>(`${this.apiUrl}repos/${username}/${repo.name}/commits?author=${username}&per_page=100`).pipe(
            map(commits => commits.length),
            catchError(() => of(0))
          )
        );
        return forkJoin(commitRequests).pipe(
          map(counts => counts.reduce((sum, count) => sum + count, 0))
        );
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
