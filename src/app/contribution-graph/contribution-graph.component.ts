import { Component, Input, OnInit } from '@angular/core';

interface ContributionDay {
  date: Date;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: ContributionDay[];
}

@Component({
  selector: 'app-contribution-graph',
  templateUrl: './contribution-graph.component.html',
  styleUrls: ['./contribution-graph.component.css']
})
export class ContributionGraphComponent implements OnInit {
  @Input() username: string = '';
  @Input() contributions: any[] = [];
  
  weeks: ContributionWeek[] = [];
  months: { name: string; offset: number }[] = [];
  weekdays: string[] = ['Mon', 'Wed', 'Fri'];
  totalContributions: number = 0;

  ngOnInit(): void {
    this.generateContributionGrid();
  }

  ngOnChanges(): void {
    this.generateContributionGrid();
  }

  private generateContributionGrid(): void {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Last 52 weeks
    
    // Start from the most recent Sunday
    const endDate = new Date(today);
    while (endDate.getDay() !== 0) {
      endDate.setDate(endDate.getDate() + 1);
    }

    // Go back to Sunday before start date
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    this.weeks = [];
    this.months = [];
    this.totalContributions = 0;
    
    let currentDate = new Date(startDate);
    let currentWeek: ContributionDay[] = [];
    let weekIndex = 0;
    let lastMonth = -1;

    while (currentDate <= endDate) {
      const month = currentDate.getMonth();
      if (month !== lastMonth && currentDate.getDay() === 0 && weekIndex > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.months.push({
          name: monthNames[month],
          offset: weekIndex
        });
        lastMonth = month;
      }

      const dateStr = currentDate.toISOString().split('T')[0];
      const contributionData = this.contributions.find((c: any) => c.date === dateStr);
      const count = contributionData ? contributionData.count : Math.floor(Math.random() * 10); // Random data if not available
      
      const level = this.getContributionLevel(count);
      this.totalContributions += count;

      currentWeek.push({
        date: new Date(currentDate),
        count: count,
        level: level
      });

      if (currentDate.getDay() === 6) {
        this.weeks.push({ days: [...currentWeek] });
        currentWeek = [];
        weekIndex++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      this.weeks.push({ days: currentWeek });
    }
  }

  private getContributionLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  getContributionColor(level: number): string {
    const colors = [
      'var(--contribution-level-0)',
      'var(--contribution-level-1)',
      'var(--contribution-level-2)',
      'var(--contribution-level-3)',
      'var(--contribution-level-4)'
    ];
    return colors[level] || colors[0];
  }

  getTooltipText(day: ContributionDay): string {
    const dateStr = day.date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return `${day.count} contributions on ${dateStr}`;
  }
}
