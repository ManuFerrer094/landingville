import { Component, OnInit } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  demoProjects = [
    { name: 'awesome-project', description: 'An awesome open source project', language: 'TypeScript', stargazers_count: 1234 },
    { name: 'web-app', description: 'Modern web application', language: 'JavaScript', stargazers_count: 567 },
    { name: 'python-tool', description: 'Useful Python tool for developers', language: 'Python', stargazers_count: 234 },
    { name: 'mobile-app', description: 'Cross-platform mobile application', language: 'TypeScript', stargazers_count: 189 },
    { name: 'data-analyzer', description: 'Data analysis and visualization tool', language: 'Python', stargazers_count: 145 }
  ];

  constructor(private i18nService: I18nService, private http: HttpClient) {
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

  downloadCV(): void {
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
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .cv-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .cv-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .cv-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid white;
      margin-bottom: 20px;
      object-fit: cover;
    }
    .cv-name {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .cv-role {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 15px;
    }
    .cv-bio {
      font-size: 14px;
      opacity: 0.85;
      max-width: 600px;
      margin: 0 auto;
    }
    .cv-content {
      padding: 40px;
    }
    .cv-section {
      margin-bottom: 30px;
    }
    .cv-section-title {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .cv-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .cv-info-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cv-info-label {
      font-weight: 600;
      color: #667eea;
    }
    .cv-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }
    .cv-stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #e0e0e0;
    }
    .cv-stat-number {
      font-size: 32px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 5px;
    }
    .cv-stat-label {
      font-size: 14px;
      color: #666;
    }
    .cv-tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .cv-tech-item {
      background: #f8f9fa;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      border: 1px solid #e0e0e0;
    }
    .cv-tech-percentage {
      color: #667eea;
      font-weight: 600;
      margin-left: 5px;
    }
    .projects-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .projects-table th,
    .projects-table td {
      border: 1px solid #e0e0e0;
      padding: 10px;
      text-align: left;
    }
    .projects-table th {
      background: #667eea;
      color: white;
      font-weight: 600;
    }
    .projects-table tr:nth-child(even) {
      background: #f8f9fa;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .cv-container {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="cv-header">
      <img src="${user.foto}" alt="${user.nombre}" class="cv-avatar">
      <h1 class="cv-name">${user.nombre}</h1>
      <h2 class="cv-role">${user.rol}</h2>
      ${user.bio ? `<p class="cv-bio">${user.bio}</p>` : ''}
    </div>
    
    <div class="cv-content">
      <div class="cv-section">
        <h3 class="cv-section-title">Información de Contacto</h3>
        <div class="cv-info-grid">
          ${user.email ? `<div class="cv-info-item"><span class="cv-info-label">Email:</span> ${user.email}</div>` : ''}
          ${user.telefono ? `<div class="cv-info-item"><span class="cv-info-label">Teléfono:</span> ${user.telefono}</div>` : ''}
          ${user.location ? `<div class="cv-info-item"><span class="cv-info-label">Ubicación:</span> ${user.location}</div>` : ''}
          ${user.company ? `<div class="cv-info-item"><span class="cv-info-label">Empresa:</span> ${user.company}</div>` : ''}
          ${user.github ? `<div class="cv-info-item"><span class="cv-info-label">GitHub:</span> <a href="${user.github}">${user.github}</a></div>` : ''}
          ${user.blog ? `<div class="cv-info-item"><span class="cv-info-label">Website:</span> <a href="${user.blog}">${user.blog}</a></div>` : ''}
          ${user.twitter_username ? `<div class="cv-info-item"><span class="cv-info-label">Twitter:</span> @${user.twitter_username}</div>` : ''}
        </div>
      </div>
      
      <div class="cv-section">
        <h3 class="cv-section-title">Estadísticas de GitHub</h3>
        <div class="cv-stats-grid">
          <div class="cv-stat-card">
            <div class="cv-stat-number">${stats.repositories}</div>
            <div class="cv-stat-label">Repositorios</div>
          </div>
          <div class="cv-stat-card">
            <div class="cv-stat-number">${stats.followers}</div>
            <div class="cv-stat-label">Seguidores</div>
          </div>
          <div class="cv-stat-card">
            <div class="cv-stat-number">${stats.contributions}</div>
            <div class="cv-stat-label">Contribuciones</div>
          </div>
        </div>
      </div>
      
      ${this.topLanguages.length > 0 ? `
      <div class="cv-section">
        <h3 class="cv-section-title">Tecnologías Principales</h3>
        <div class="cv-tech-list">
          ${this.topLanguages.map(lang => 
            `<div class="cv-tech-item">${lang.language}<span class="cv-tech-percentage">${lang.percentage}%</span></div>`
          ).join('')}
        </div>
      </div>
      ` : ''}
      
      ${this.demoProjects.length > 0 ? `
      <div class="cv-section">
        <h3 class="cv-section-title">Proyectos</h3>
        <table class="projects-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Lenguaje</th>
              <th>⭐ Stars</th>
            </tr>
          </thead>
          <tbody>
            ${this.demoProjects.map(project => `
              <tr>
                <td><strong>${project.name}</strong></td>
                <td>${project.description || 'Sin descripción'}</td>
                <td>${project.language || 'N/A'}</td>
                <td>${project.stargazers_count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
  }
}
