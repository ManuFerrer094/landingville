import { Component, OnInit } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-demo-profile',
  templateUrl: './demo-profile.component.html',
  styleUrls: ['./demo-profile.component.css']
})
export class DemoProfileComponent implements OnInit {
  userData = {
    nombre: 'octocat',
    rol: 'Developer',
    bio: 'Hi there! I\'m Octocat, a passionate open-source developer. I love building tools that make developers\' lives easier and contributing to amazing projects around the world.',
    email: 'octocat@github.com',
    telefono: '',
    blog: 'https://github.blog',
    github: 'https://github.com/octocat',
    foto: 'https://avatars.githubusercontent.com/u/583231?v=4',
    username: 'octocat',
    contributionsToThisRepo: 127,
    company: '@github',
    location: 'San Francisco, CA',
    twitter_username: 'githuboctocat',
    hireable: true
  };

  animatedStats = {
    repositories: 8,
    followers: 5234,
    contributions: 127
  };

  topLanguages = [
    { language: 'TypeScript', count: 45, percentage: 45 },
    { language: 'JavaScript', count: 28, percentage: 28 },
    { language: 'Python', count: 15, percentage: 15 },
    { language: 'HTML', count: 8, percentage: 8 },
    { language: 'CSS', count: 4, percentage: 4 }
  ];

  constructor(private i18nService: I18nService) {
    this.animateStats();
  }

  ngOnInit(): void {}

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  private animateStats(): void {
    this.animateValue('repositories', 0, 8, 1500);
    this.animateValue('followers', 0, 5234, 1800);
    this.animateValue('contributions', 0, 127, 2200);
  }

  private animateValue(key: keyof typeof this.animatedStats, start: number, end: number, duration: number): void {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.animatedStats[key] = Math.floor(start + (end - start) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}
