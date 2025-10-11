import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService {
  private tokenKey = 'github_access_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Check if user has a stored token
   */
  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Get the stored GitHub token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Store the GitHub token
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Remove the GitHub token (logout)
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Initiate GitHub OAuth flow
   * For a simple implementation, we'll use Personal Access Token
   */
  loginWithToken(token: string): Observable<any> {
    // Verify the token by making a test request
    const headers = { 'Authorization': `token ${token}` };
    return this.http.get('https://api.github.com/user', { headers });
  }

  /**
   * Check if the token is valid
   */
  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const headers = { 'Authorization': `token ${token}` };
    return this.http.get('https://api.github.com/user', { headers });
  }
}
