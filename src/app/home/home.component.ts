import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  landings: any[] = [];

  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.csvService.readCsvFile().subscribe(
      (data: any) => {
        const lines = data.split('\n');
        lines.forEach((line: string, index: number) => {
          const fields = line.split(',');
          if (index !== 0 && fields.length === 3) {
            this.landings.push({
              id: index,
              title: fields[0],
              url: `/landing/${index}`
            });
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error al leer el archivo CSV:', error.message);
      }
    );
  }
}
