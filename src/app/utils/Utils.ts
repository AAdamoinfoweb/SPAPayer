import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FILESAVER from 'file-saver';
import * as jsPDF from 'jspdf';
import {tipoColonna} from '../enums/TipoColonna.enum';
import {ImmaginePdf} from '../modules/main/model/tabella/ImmaginePdf';
import {TipoModaleEnum} from '../enums/tipoModale.enum';
import {Breadcrumb, SintesiBreadcrumb} from '../modules/main/dto/Breadcrumb';
import {Colonna} from '../modules/main/model/tabella/Colonna';
import {Banner} from '../modules/main/model/banner/Banner';
import {getBannerType, LivelloBanner} from '../enums/livelloBanner.enum';
import {ToolEnum} from '../enums/Tool.enum';
import {OpzioneSelect} from '../modules/main/model/OpzioneSelect';

export class Utils {

  constructor() {
  }

  static FORMAT_LOCAL_DATE_TIME = 'YYYY-MM-DD[T]00:00:00';
  static FORMAT_LOCAL_DATE_TIME_ISO = 'YYYY-MM-DD[T]hh:mm:ss';
  static FORMAT_LOCAL_DATE_TIME_TO = 'YYYY-MM-DD[T]23:59:59';
  static FORMAT_DATE_CALENDAR = 'DD/MM/YYYY';
  static FORMAT_DATE_TIME_CALENDAR = 'DD/MM/YYYY hh:mm:ss';
  static ACCEPTED_FORMAT_DATES = [
    Utils.FORMAT_DATE_CALENDAR, Utils.FORMAT_DATE_TIME_CALENDAR, Utils.FORMAT_LOCAL_DATE_TIME, moment.ISO_8601
  ];
  static TIME_ZONE = 'Europe/Rome (GMT+01:00)';

  static readonly EMAIL_REGEX = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$';
  static readonly TELEFONO_REGEX = '^\\+?\\d{8,12}';
  static readonly IBAN_ITALIA_REGEX = '[IT]{2}\\d{2} ?[A-Z]\\d{3} ?\\d{4} ?\\d{4} ?\\d{4} ?\\d{4} ?\\d{3}';
  static readonly CODICE_FISCALE_REGEX = '^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$';
  static readonly CODICE_FISCALE_O_PARTITA_IVA_REGEX = '^[0-9]{11}$|^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$';
  static readonly PARTITA_IVA_REGEX = '^[0-9]{11}$';

  static creaLink = (value, link, iconHref?) => {
    return iconHref ? {value, link, iconHref} : {value, link, iconHref: null};
  }

  static getDurataSessioneFormattata(durataMillisecSessione: number): string {
    let durataFormattata = null;
    if (durataMillisecSessione) {
      let durataSecondiSessione = Math.floor(durataMillisecSessione / 1000);

      // Controllo quante ore è durata la sessione
      const ore = Math.floor(Math.floor(durataSecondiSessione / 60) / 60);

      // Controllo nel tempo residuo (durata totale - durata in ore) quanti minuti ci sono
      durataSecondiSessione = durataSecondiSessione - (ore * 60 * 60);
      const minuti = Math.floor(durataSecondiSessione / 60);

      // Controllo nel tempo residuo (durata totale - durata in ore - durata in minuti) quanti secondi ci sono
      durataSecondiSessione = durataSecondiSessione - (minuti * 60);
      const secondi = durataSecondiSessione;

      // Mostro la data come hh:mm:ss (aggiungendo gli zero se mancano)
      durataFormattata = this.paddingZero(ore)
        + ':' + this.paddingZero(minuti)
        + ':' + this.paddingZero(secondi);
    }

    return durataFormattata;
  }

  static paddingZero(numeroPositivo: number): string {
    return numeroPositivo < 10 ? '0' + numeroPositivo : '' + numeroPositivo;
  }

  static creaIcona = (path, color, tooltip, display, placement?) => {
    return placement ? {path, color, tooltip, display, placement} : {path, color, tooltip, display, placement: 'right'};
  }

  static ordinaOpzioniSelect(opzioni: OpzioneSelect[]) {
    opzioni.sort((opzione1, opzione2) => {
      if (opzione1.label > opzione2.label) {
        return 1;
      } else if (opzione1.label < opzione2.label) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  static getModale(confermaFn, tipoModale: TipoModaleEnum, titolo?, messaggio?) {
    let header;
    let message;
    switch (tipoModale) {
      case TipoModaleEnum.ANNULLA:
        header = 'Richiesta conferma';
        message = 'Attenzione, tutte le informazioni eventualmente inserite verranno cancellate. Sicuro di proseguire?';
        break;
      case TipoModaleEnum.ELIMINA:
        header = 'Richiesta conferma';
        message = 'Sei sicuro di voler procedere con la cancellazione?';
        break;
      case TipoModaleEnum.CUSTOM:
        header = titolo;
        message = messaggio;
        break;
    }
    return {
      header,
      message,
      acceptButtonStyleClass: 'okButton',
      rejectButtonStyleClass: 'undoButton',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      reject: () => {
      },
      accept: () => {
        confermaFn();
      }
    };
  }

  static esportaTabellaInFilePdf(colonne: Colonna[], righe: any[], titoloFile: string, immagini: ImmaginePdf[]): void {
    const headerColonne = colonne.map(col => col.header);
    const righePdf = [];
    righe.forEach(riga => {
      const rigaPdf = [];
      Object.keys(riga).forEach(elemento => {
        const indiceColonna = colonne.indexOf(colonne.find(col => col.field === elemento));
        if (indiceColonna > -1) {
          let elementoRigaPdf;
          switch (colonne[indiceColonna].type) {
            case tipoColonna.ICONA:
              elementoRigaPdf = riga[elemento]?.display === 'inline' ? '' : null;
              break;
            case tipoColonna.LINK:
              elementoRigaPdf = riga[elemento]?.value || null;
              break;
            case tipoColonna.TESTO:
              elementoRigaPdf = riga[elemento]?.value || null;
              break;
            case tipoColonna.IMPORTO:
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
    filePdf.autoTable(headerColonne, righePdf, {
      didDrawCell: data => {
        immagini.forEach(immagine => {
          if (Array.isArray(immagine)) {
            immagine.forEach(img => {
              this.inserisciImmagine(data, img, filePdf);
            });
          } else {
            this.inserisciImmagine(data, immagine, filePdf);
          }
        });
      }
    });
    const blob = filePdf.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  static inserisciImmagine(data: any, immagine: ImmaginePdf, filePdf: jsPDF.default) {
    if (data.section === 'body' && data.column.index === immagine.indiceColonna
      && (immagine.indiceRiga === null || data.row.index === immagine.indiceRiga)
      && data.row.raw[immagine.indiceColonna] != null) {
      const icona = new Image();
      icona.src = immagine.srcIcona;
      filePdf.addImage(icona, 'PNG', data.cell.x + immagine.posizioneX, data.cell.y + immagine.posizioneY,
        immagine.larghezza, immagine.altezza);
    }
  }

  static creaFileExcel(rows: any, headers: string[], sheet: any, sheetNames: any, workbook: any, fileName: string): void {
    let worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet = XLSX.utils.sheet_add_aoa(worksheet, [headers]);
    workbook.Sheets[sheet] = worksheet;
    workbook.SheetNames = sheetNames;
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

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
   * salvataggio di un file txt
   * @param stream  Lo stream del file in base64 da convertire in testo
   * @param fileName  Il nome da assegnare al file
   */
  static downloadBase64ToTxtFile(stream, fileName) {
    // Converto il Base64 nella rispettiva string (DECODIFICA)
    const text = atob(stream);
    // Blob per il salvataggio
    const file = new Blob([text], {type: 'text/plain'});
    // Richiamo la funzione saveAs di Blob per salvare il file in formato txt
    FILESAVER.saveAs(file, fileName);
  }

  /**
   * creazione uuidv4
   */
  static uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      // tslint:disable-next-line:no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }


  static isBefore(date: string, otherDate: string) {
    const momentDate = moment(date, Utils.FORMAT_DATE_CALENDAR)
    const momentOtherDate = moment(otherDate, Utils.FORMAT_DATE_CALENDAR);
    return moment(momentDate).isBefore(momentOtherDate);
  }

  static popolaListaBreadcrumb(breadcrumbs: SintesiBreadcrumb[]) {
    const breadcrumbList = [];
    breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    let counter = 1;
    breadcrumbs.forEach(breadcrumb => {
      breadcrumbList.push(new Breadcrumb(counter, breadcrumb.label, breadcrumb.link, null));
      counter++;
    });
    return breadcrumbList;
  }

  static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  /** recupera la posizione di una azione nella toolbar */
  static getMapToolbarIndex(toolbarIcons): Map<ToolEnum, number> {
    const mappaIndexToolbar: Map<ToolEnum, number> = new Map<ToolEnum, number>();
    const toolbarType = toolbarIcons.map(el => el.type);

    mappaIndexToolbar.set(ToolEnum.INSERT, toolbarType.indexOf(ToolEnum.INSERT));
    mappaIndexToolbar.set(ToolEnum.UPDATE, toolbarType.indexOf(ToolEnum.UPDATE));
    mappaIndexToolbar.set(ToolEnum.DELETE, toolbarType.indexOf(ToolEnum.DELETE));
    mappaIndexToolbar.set(ToolEnum.EXPORT_PDF, toolbarType.indexOf(ToolEnum.EXPORT_PDF));
    mappaIndexToolbar.set(ToolEnum.EXPORT_XLS, toolbarType.indexOf(ToolEnum.EXPORT_XLS));
    return mappaIndexToolbar;
  }

  static bannerOperazioneSuccesso(): Banner {
    const banner: Banner = {
      titolo: 'SUCCESSO',
      testo: 'Operazione conclusa con successo',
      tipo: getBannerType(LivelloBanner.SUCCESS)
    };
    return banner;
  }
}
