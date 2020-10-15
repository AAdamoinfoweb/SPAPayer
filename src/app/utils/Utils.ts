import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FILESAVER from 'file-saver';

export class Utils {
  static creaLink = (testo, link) => {
    return {testo: testo, link: link};
  }

  static creaIcona = (path, color, tooltip, display) => {
    return {path, color, tooltip, display};
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

  /**
   * apertura di un file in un nuovo tab
   * @param stream lo stream del file in base64
   */
  static aperturaFile = (stream) => {
    const pdfWindow = window.open('');
    pdfWindow.document.write(
      '<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' +
      stream + '\'></iframe>'
    );
  }

  /**
   * creazione uuid
   */
  static creaUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
