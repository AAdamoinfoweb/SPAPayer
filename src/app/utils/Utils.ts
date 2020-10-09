import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FILESAVER from 'file-saver';

export class Utils {
  static creaLink = (testo, link) => {
    return {testo: testo, link: link};
  }

  static creaIcona = (path, color, tooltip, display) => {
    return {path: path, color: color, tooltip: tooltip, display: display};
  }

  static creaFileExcel(rows: any, headers: string[], sheet: any, sheetNames: any, workbook: any, fileName: string): void {
    let worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet = XLSX.utils.sheet_add_aoa(worksheet, [headers]);
    workbook['Sheets'][sheet] = worksheet;
    workbook['SheetNames'] = sheetNames;
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.salvaComeFileExcel(excelBuffer, fileName);
  }

  static salvaComeFileExcel(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FILESAVER.saveAs(data, fileName + '_export_' + moment().format('DD-MM-YYYY HH:mm') + EXCEL_EXTENSION);
  }

}
