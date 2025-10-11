import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubAuthService } from '../services/github-auth.service';

@Injectable()
export class GithubAuthInterceptor implements HttpInterceptor {

  constructor(private authService: GithubAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only add token to GitHub API requests
    if (request.url.includes('api.github.com')) {
      const token = this.authService.getToken();
      
      if (token) {
        // Clone the request and add the Authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `token ${token}`
          }
        });
      }
    }
    
    return next.handle(request);
  }
}
