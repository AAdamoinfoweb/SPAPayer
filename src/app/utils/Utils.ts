import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FILESAVER from 'file-saver';
import * as jsPDF from 'jspdf';
import {tipoColonna} from '../enums/TipoColonna.enum';
import {ImmaginePdf} from '../modules/main/model/tabella/ImmaginePdf';
import {Tabella} from '../modules/main/model/tabella/Tabella';

export class Utils {

  static FORMAT_LOCAL_DATE_TIME = 'YYYY-MM-DD[T]00:00';
  static FORMAT_DATE_CALENDAR = 'DD/MM/YYYY';

  static creaLink = (testo, link, iconHref?) => {
    return iconHref ? {testo, link, iconHref} : {testo, link};
  }

  static creaIcona = (path, color, tooltip, display) => {
    return {path, color, tooltip, display};
  }

  static esportaTabellaInFilePdf(tabella: Tabella, titoloFile: string, immagini: ImmaginePdf[]): void {
    const headerColonne = tabella.cols.map(col => col.header);
    const righePdf = [];
    tabella.rows.forEach(riga => {
      const rigaPdf = [];
      Object.keys(riga).forEach(elemento => {
        const indiceColonna = tabella.cols.indexOf(tabella.cols.find(col => col.field === elemento));
        if (indiceColonna > -1) {
          let elementoRigaPdf;
          switch (tabella.cols[indiceColonna].type) {
            case tipoColonna.ICONA:
              elementoRigaPdf = riga[elemento]?.display === 'inline' ? '' : null;
              break;
            case tipoColonna.LINK:
              elementoRigaPdf = riga[elemento]?.testo || null;
              break;
            case tipoColonna.TESTO:
              elementoRigaPdf = riga[elemento]?.value || null;
              break;
            default:
              elementoRigaPdf = null;
              break;
          }
          rigaPdf.push(elementoRigaPdf);
        }
      });
      righePdf.push(rigaPdf);
    });

    // @ts-ignore
    const filePdf = new jsPDF.default('l', 'pt', 'a4');
    filePdf.setProperties({title: titoloFile});
    // @ts-ignore
    filePdf.autoTable(headerColonne, righePdf, {didDrawCell: data => {
      immagini.forEach(immagine => {
        if (data.section === 'body' && data.column.index === immagine.indiceColonna && data.row.raw[immagine.indiceColonna] != null) {
          const icona = new Image();
          icona.src = immagine.srcIcona;
          filePdf.addImage(icona, 'PNG', data.cell.x + immagine.posizioneX, data.cell.y + immagine.posizioneY, immagine.larghezza, immagine.altezza);
        }
      });
    }});
    const blob = filePdf.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  static creaFileExcel(rows: any, headers: string[], sheet: any, sheetNames: any, workbook: any, fileName: string): void {
    let worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet = XLSX.utils.sheet_add_aoa(worksheet, [headers]);
    workbook.Sheets[sheet] = worksheet;
    workbook.SheetNames = sheetNames;
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
   * creazione uuidv4
   */
  static uuidv4() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      // tslint:disable-next-line:no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }


  static isBefore(date: string, otherDate: string){
    const momentDate = moment(date, Utils.FORMAT_DATE_CALENDAR)
    const momentOtherDate = moment(otherDate, Utils.FORMAT_DATE_CALENDAR);
    return moment(momentDate).isBefore(momentOtherDate);
  }

}
