import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Tabella} from '../../model/tabella/Tabella';
import {ToolEnum} from '../../../../enums/Tool.enum';
import {Observable} from 'rxjs';
import {Utils} from '../../../../utils/Utils';
import {Colonna} from '../../model/tabella/Colonna';
import {ImmaginePdf} from '../../model/tabella/ImmaginePdf';
import {FunzioneGestioneEnum} from '../../../../enums/funzioneGestione.enum';
import {environment} from '../../../../../environments/environment';
import {SintesiBreadcrumb} from '../../dto/Breadcrumb';

export abstract class DettaglioElementoComponent {

  protected constructor(protected activatedRoute: ActivatedRoute,
                        protected amministrativoService: AmministrativoService,
                        protected http: HttpClient,
                        protected router: Router) {
    this.amministrativoService.asyncAmministrativoSubject.subscribe((isAmministrativo) => {
      if (isAmministrativo) {
        activatedRoute.url.subscribe((url) => {
          const basePath = '/' + url[0].path;
          this.basePath = basePath;
          this.idFunzione = String(this.amministrativoService.mappaFunzioni[basePath]);
          this.verificaAbilitazioneSottopath().subscribe(() => {
            this.initFormPage(activatedRoute.snapshot);
          });
        });
      } else {
        this.router.navigateByUrl('/nonautorizzato');
      }
    });
  }

  idFunzione;
  basePath;
  abstract funzione: FunzioneGestioneEnum;

  abstract tableData: Tabella;
  listaElementi: any[];
  abstract righeSelezionate: any[];

  waiting = true;

  abstract initFormPage(snapshot: ActivatedRouteSnapshot);

  verificaAbilitazioneSottopath(): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', this.idFunzione);
    return this.http.get(environment.bffBaseUrl + this.basePath + '/verificaAbilitazioneSottoPath', {
      headers: h,
      withCredentials: true
    });
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[], flag?: boolean) {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb(flag ? 'Gestisci Portale' : 'Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

  getListaIdElementiSelezionati(): number[] {
    let listaId = [];
    if (this.righeSelezionate) {
      listaId = this.righeSelezionate.map(riga => riga.id.value);
    }
    return listaId;
  }

  abstract creaRigaTabella(elemento: any);

  abstract eseguiAzioni(azioneTool: ToolEnum): void;

  impostaTabella(listaElementi: any[]): void {
    this.tableData.rows = [];
    if (listaElementi) {
      listaElementi.forEach(elemento => {
        this.tableData.rows.push(this.creaRigaTabella(elemento));
      });
    }
  }

  abstract getObservableFunzioneRicerca(): Observable<any[] | any>;

  esportaTabellaInFileExcel(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const headerColonne = this.getColonneFileExcel(copiaTabella.cols).map(col => col.header);
    const righe = this.getRigheFileExcel(copiaTabella.rows);

    const fogli = {};
    fogli[nomeFile] = null;
    const workbook = {Sheets: fogli, SheetNames: []};
    Utils.creaFileExcel(righe, headerColonne, nomeFile, [nomeFile], workbook, nomeFile);
  }

  abstract getColonneFileExcel(colonne: Colonna[]): Colonna[];

  abstract getRigheFileExcel(righe: any[]): any[];

  esportaTabellaInFilePdf(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const colonne = this.getColonneFilePdf(copiaTabella.cols);
    const righe = this.getRigheFilePdf(copiaTabella.rows);
    let immagini = this.getImmaginiFilePdf(righe);
    if (!immagini) {
      immagini = [];
    }
    Utils.esportaTabellaInFilePdf(colonne, righe, nomeFile, immagini);
  }

  abstract getColonneFilePdf(colonne: Colonna[]): Colonna[];

  abstract getRigheFilePdf(righe: any[]): any[];

  abstract getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] | any[];

  abstract selezionaRigaTabella(righeSelezionate: any[]): void;

  abstract getNumeroRecord(): string;

}
