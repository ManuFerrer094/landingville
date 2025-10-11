import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsvService } from '../csv.service';
import { I18nService } from '../services/i18n.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  userData: any | undefined;
  
  // Animated stats
  animatedStats = {
    repositories: 0,
    followers: 0,
    contributions: 0
  };

  topLanguages: any[] = []; // Changed to store objects with percentage
  userProjects: any[] = []; // Store user projects

  constructor(
    private route: ActivatedRoute, 
    private csvService: CsvService,
    private i18nService: I18nService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIndex = Number(params.get('userIndex'));

      if (!isNaN(userIndex)) {
        const repoUrl = this.csvService.getRepoUrl();

        if (repoUrl) {
          this.csvService.getRepoContributors(repoUrl).subscribe(
            (contributors: any[]) => {
              const userData = contributors[userIndex];
              if (userData) {
                // Fetch full user details from GitHub
                this.csvService.getUserDetails(userData.login).subscribe(
                  (fullUserData: any) => {
                    this.userData = {
                      nombre: userData.login,
                      rol: userData.type || 'Developer',
                      bio: fullUserData.bio || '',
                      email: fullUserData.email || '',
                      telefono: userData.telefono || '',
                      blog: fullUserData.blog || '',
                      github: userData.html_url,
                      foto: userData.avatar_url,
                      username: userData.login,
                      contributionsToThisRepo: userData.contributions || 0,
                      company: fullUserData.company || '',
                      location: fullUserData.location || '',
                      twitter_username: fullUserData.twitter_username || '',
                      hireable: fullUserData.hireable,
                      name: fullUserData.name || '',
                      pronouns: fullUserData.pronouns || ''
                    };
                    
                    // Start animated stats with realistic GitHub data
                    this.startStatsAnimation();
                  },
                  (error: any) => {
                    // Fallback if detailed profile fetch fails
                    console.warn('Could not fetch detailed profile, using basic data:', error);
                    this.userData = {
                      nombre: userData.login,
                      rol: userData.type || 'Developer',
                      bio: '',
                      email: userData.email || '',
                      telefono: userData.telefono || '',
                      blog: userData.blog || '',
                      github: userData.html_url,
                      foto: userData.avatar_url,
                      username: userData.login,
                      contributionsToThisRepo: userData.contributions || 0
                    };
                    
                    // Start animated stats with realistic GitHub data
                    this.startStatsAnimation();
                  }
                );
              } else {
                console.error('No se encontraron datos para el usuario con el índice proporcionado.');
              }
            },
            (error: any) => {
              console.error('Error al cargar los datos de los contribuyentes:', error);
            }
          );
        } else {
          console.error('No se proporcionó una URL de repositorio válida desde HomeComponent.');
        }
      } else {
        console.error('El índice del usuario no es un número válido.');
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  sendEmail() {
    if (this.userData && this.userData.email) {
      window.open(`mailto:${this.userData.email}`);
    }
  }

  callPhone(): void {
    if (this.userData && this.userData.telefono) {
      window.open(`tel:${this.userData.telefono}`);
    }
  }

  private startStatsAnimation(): void {
    if (!this.userData || !this.userData.username) {
      console.error('No username available for fetching stats');
      return;
    }

    const username = this.userData.username;
    const contributionsToThisRepo = this.userData.contributionsToThisRepo || 0;

    // Fetch user details and repositories in parallel
    forkJoin({
      userDetails: this.csvService.getUserDetails(username),
      repositories: this.csvService.getUserRepositories(username),
      languageStats: this.csvService.getLanguageStats(username)
    }).subscribe(
      ({ userDetails, repositories, languageStats }) => {
        // Get real GitHub stats
        const realStats = {
          repositories: userDetails.public_repos || 0,
          followers: userDetails.followers || 0,
          // Use contributions to the current repo as proxy for total contributions
          contributions: contributionsToThisRepo
        };

        // Update userData with more complete profile information
        if (this.userData) {
          this.userData.bio = userDetails.bio || this.userData.bio;
          this.userData.company = userDetails.company || '';
          this.userData.location = userDetails.location || '';
          this.userData.twitter_username = userDetails.twitter_username || '';
          this.userData.hireable = userDetails.hireable;
          this.userData.name = userDetails.name || '';
          this.userData.pronouns = userDetails.pronouns || '';
        }

        // Store language stats with percentages
        this.topLanguages = languageStats;

        // Store projects (limit to top 10) and fetch languages for each
        const topProjects = repositories
          .filter((repo: any) => !repo.fork)
          .sort((a: any, b: any) => {
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .slice(0, 10);

        // Fetch languages and enrich project data
        const projectRequests = topProjects.map((project: any) => 
          this.csvService.getRepoLanguages(username, project.name).pipe(
            map((languages: any) => ({
              ...project,
              languages: Object.keys(languages),
              topics: project.topics || []
            })),
            catchError(() => of({
              ...project,
              languages: project.language ? [project.language] : [],
              topics: project.topics || []
            }))
          )
        );

        // Wait for all language requests to complete
        if (projectRequests.length > 0) {
          forkJoin(projectRequests).subscribe(
            (enrichedProjects: any[]) => {
              this.userProjects = enrichedProjects;
            },
            (error: any) => {
              console.error('Error fetching project languages:', error);
              this.userProjects = topProjects.map((p: any) => ({
                ...p,
                languages: p.language ? [p.language] : [],
                topics: p.topics || []
              }));
            }
          );
        } else {
          this.userProjects = [];
        }

        // Animate the stats
        this.animateValue('repositories', 0, realStats.repositories, 1500);
        this.animateValue('followers', 0, realStats.followers, 1800);
        this.animateValue('contributions', 0, realStats.contributions, 2200);
      },
      (error: any) => {
        console.error('Error fetching GitHub stats:', error);
        // Fallback to showing zeros or previous behavior
        this.animateValue('repositories', 0, 0, 1500);
        this.animateValue('followers', 0, 0, 1800);
        this.animateValue('contributions', 0, 0, 2200);
      }
    );
  }

  private animateValue(key: keyof typeof this.animatedStats, start: number, end: number, duration: number): void {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.animatedStats[key] = Math.floor(start + (end - start) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  downloadCV(): void {
    if (!this.userData) {
      return;
    }

    const cvHtml = this.generateCVHtml();
    
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.innerHTML = cvHtml;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    document.body.appendChild(container);

    // Use html2canvas to convert HTML to canvas, then to PDF
    html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Add watermark to all pages
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text('LandingVille', pdfWidth - 35, pdfHeight - 10);
        
        // Add a small logo/icon as watermark
        pdf.setFontSize(8);
        pdf.setTextColor(200, 200, 200);
        pdf.text('Powered by LandingVille', pdfWidth / 2, pdfHeight - 5, { align: 'center' });
      }

      // Save the PDF
      pdf.save(`CV_${this.userData.nombre}.pdf`);
      
      // Cleanup
      document.body.removeChild(container);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(container);
    });
  }

  private generateCVHtml(): string {
    const user = this.userData;
    const stats = this.animatedStats;
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${user.nombre}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #000;
      background: white;
      padding: 20px;
      padding-bottom: 40px;
    }
    .cv-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      display: flex;
      gap: 0;
    }
    .cv-sidebar {
      width: 250px;
      background: #f5f5f5;
      padding: 30px 20px;
      border-right: 2px solid #e0e0e0;
    }
    .cv-avatar {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      margin-bottom: 20px;
      object-fit: cover;
      display: block;
    }
    .cv-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 5px;
      color: #000;
    }
    .cv-role {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .sidebar-section {
      margin-bottom: 25px;
    }
    .sidebar-title {
      font-size: 14px;
      font-weight: 700;
      color: #000;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .sidebar-item {
      font-size: 12px;
      margin-bottom: 8px;
      color: #333;
      word-wrap: break-word;
    }
    .sidebar-label {
      font-weight: 600;
      color: #000;
      display: block;
      margin-bottom: 2px;
    }
    .cv-stat-small {
      background: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
    }
    .cv-stat-number-small {
      font-size: 24px;
      font-weight: 700;
      color: #000;
    }
    .cv-stat-label-small {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .cv-main {
      flex: 1;
      padding: 30px;
      padding-bottom: 40px;
    }
    .cv-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #000;
    }
    .cv-bio {
      font-size: 14px;
      color: #333;
      line-height: 1.8;
    }
    .cv-section {
      margin-bottom: 30px;
    }
    .cv-section-title {
      font-size: 18px;
      font-weight: 700;
      color: #000;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cv-tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cv-tech-item {
      background: #f5f5f5;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      border: 1px solid #ddd;
      color: #333;
    }
    .cv-tech-percentage {
      color: #000;
      font-weight: 600;
      margin-left: 4px;
    }
    .project-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .project-item:last-child {
      border-bottom: none;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
    }
    .project-name {
      font-size: 16px;
      font-weight: 700;
      color: #000;
    }
    .project-meta {
      font-size: 12px;
      color: #666;
    }
    .project-description {
      font-size: 13px;
      color: #333;
      margin-bottom: 5px;
      line-height: 1.6;
    }
    .project-details {
      display: flex;
      gap: 15px;
      font-size: 11px;
      color: #666;
    }
    .project-detail {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .project-languages {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .project-language {
      background: #e8f4f8;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      color: #0366d6;
    }
    .project-topics {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    .project-topic {
      background: #f1f8ff;
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 10px;
      color: #0366d6;
      border: 1px solid #c8e1ff;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="cv-sidebar">
      <img src="${user.foto}" alt="${user.nombre}" class="cv-avatar">
      <h1 class="cv-name">@${user.username}</h1>
      ${user.name ? `<p class="cv-role">${user.name}${user.pronouns ? ` (${user.pronouns})` : ''}</p>` : ''}
      ${user.rol && user.rol !== 'User' ? `<p class="cv-role">${user.rol}</p>` : ''}
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Contacto</h3>
        ${user.email ? `<div class="sidebar-item"><span class="sidebar-label">Email</span>${user.email}</div>` : ''}
        ${user.telefono ? `<div class="sidebar-item"><span class="sidebar-label">Teléfono</span>${user.telefono}</div>` : ''}
        ${user.location ? `<div class="sidebar-item"><span class="sidebar-label">Ubicación</span>${user.location}</div>` : ''}
        ${user.company ? `<div class="sidebar-item"><span class="sidebar-label">Empresa</span>${user.company}</div>` : ''}
        ${user.github ? `<div class="sidebar-item"><span class="sidebar-label">GitHub</span>${user.github.replace('https://github.com/', '')}</div>` : ''}
        ${user.blog ? `<div class="sidebar-item"><span class="sidebar-label">Website</span>${user.blog}</div>` : ''}
        ${user.twitter_username ? `<div class="sidebar-item"><span class="sidebar-label">Twitter</span>@${user.twitter_username}</div>` : ''}
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Estadísticas</h3>
        <div class="cv-stat-small">
          <div class="cv-stat-number-small">${stats.repositories}</div>
          <div class="cv-stat-label-small">Repositorios</div>
        </div>
        <div class="cv-stat-small">
          <div class="cv-stat-number-small">${stats.followers}</div>
          <div class="cv-stat-label-small">Seguidores</div>
        </div>
        <div class="cv-stat-small">
          <div class="cv-stat-number-small">${stats.contributions}</div>
          <div class="cv-stat-label-small">Contribuciones</div>
        </div>
      </div>
    </div>
    
    <div class="cv-main">
      <div class="cv-header">
        ${user.bio ? `<p class="cv-bio">${user.bio}</p>` : '<p class="cv-bio">Desarrollador apasionado por la tecnología y el código abierto.</p>'}
      </div>
      
      ${this.topLanguages.length > 0 ? `
      <div class="cv-section">
        <h3 class="cv-section-title">Tecnologías</h3>
        <div class="cv-tech-list">
          ${this.topLanguages.map(lang => 
            `<div class="cv-tech-item">${lang.language}<span class="cv-tech-percentage">${lang.percentage}%</span></div>`
          ).join('')}
        </div>
      </div>
      ` : ''}
      
      ${this.userProjects.length > 0 ? `
      <div class="cv-section">
        <h3 class="cv-section-title">Proyectos Destacados</h3>
        ${this.userProjects.map(project => `
          <div class="project-item">
            <div class="project-header">
              <span class="project-name">${project.name}</span>
              <span class="project-meta">⭐ ${project.stargazers_count}</span>
            </div>
            <p class="project-description">${project.description || 'Sin descripción'}</p>
            ${project.languages && project.languages.length > 0 ? `
              <div class="project-languages">
                ${project.languages.map((lang: string) => `<span class="project-language">${lang}</span>`).join('')}
              </div>
            ` : ''}
            ${project.topics && project.topics.length > 0 ? `
              <div class="project-topics">
                ${project.topics.map((topic: string) => `<span class="project-topic">${topic}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
  }
}
