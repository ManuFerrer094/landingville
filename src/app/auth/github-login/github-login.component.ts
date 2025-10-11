import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubAuthService } from '../../services/github-auth.service';

@Component({
  selector: 'app-github-login',
  templateUrl: './github-login.component.html',
  styleUrls: ['./github-login.component.css']
})
export class GithubLoginComponent implements OnInit {
  token: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showToken: boolean = false;

  constructor(
    private authService: GithubAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If already authenticated, redirect to home
    if (this.authService.hasToken()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    if (!this.token.trim()) {
      this.errorMessage = 'Please enter a GitHub Personal Access Token';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.loginWithToken(this.token.trim()).subscribe({
      next: (user) => {
        this.authService.setToken(this.token.trim());
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid token. Please check your GitHub Personal Access Token.';
        console.error('Login error:', error);
      }
    });
  }

  skipLogin(): void {
    this.router.navigate(['/']);
  }

  toggleTokenVisibility(): void {
    this.showToken = !this.showToken;
  }
}
