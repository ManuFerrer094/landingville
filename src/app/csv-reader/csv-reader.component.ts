import { Component } from '@angular/core';
import { parse, ParseResult } from 'papaparse';

@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.css']
})
export class CsvReaderComponent {
  constructor() { }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result as string | null;

      if (csvData) {
        const results: ParseResult<any> = parse(csvData, { header: true }) || {};

        if (results.errors && results.errors.length > 0) {
          console.error('Error al parsear el archivo CSV:', results.errors);
        } else {
          console.log('Datos CSV parseados:', results.data);
        }
      } else {
        console.error('Error al leer el archivo CSV.');
      }
    };

    reader.readAsText(file);
  }
}
