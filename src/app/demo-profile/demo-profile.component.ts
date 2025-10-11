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
      color: #000;
      background: white;
      padding: 20px;
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
      <h1 class="cv-name">${user.nombre}</h1>
      <p class="cv-role">${user.rol}</p>
      
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
      
      ${this.demoProjects.length > 0 ? `
      <div class="cv-section">
        <h3 class="cv-section-title">Proyectos Destacados</h3>
        ${this.demoProjects.map(project => `
          <div class="project-item">
            <div class="project-header">
              <span class="project-name">${project.name}</span>
              <span class="project-meta">⭐ ${project.stargazers_count}</span>
            </div>
            <p class="project-description">${project.description || 'Sin descripción'}</p>
            <div class="project-details">
              ${project.language ? `<span class="project-detail">🔹 ${project.language}</span>` : ''}
            </div>
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
