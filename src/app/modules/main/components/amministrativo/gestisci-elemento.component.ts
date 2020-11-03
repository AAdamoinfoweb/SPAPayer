import {Breadcrumb, SintesiBreadcrumb} from '../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Utils} from '../../../../utils/Utils';
import {AmministrativoParentComponent} from './amministrativo-parent.component';
import {Tabella} from '../../model/tabella/Tabella';
import {Colonna} from '../../model/tabella/Colonna';
import {ToolEnum} from '../../../../enums/Tool.enum';
import {ImmaginePdf} from '../../model/tabella/ImmaginePdf';
import {environment} from "../../../../../environments/environment";
import {Observable, of} from "rxjs";
import {flatMap, map} from "rxjs/operators"


export abstract class GestisciElementoComponent extends AmministrativoParentComponent {

  protected constructor(router: Router,
                        route: ActivatedRoute, protected http: HttpClient,
                        amministrativoService: AmministrativoService) {
    super(router, route, http, amministrativoService);
  }

  abstract parentLink;
  abstract selectionElementi: any[];

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]): Breadcrumb[] {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb('Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

  aggiungiElemento(link: string) {
    this.verificaAbilitazioneSottopath(link).subscribe((header: string) => this.router.navigateByUrl(link + header));
  }

  verificaAbilitazioneSottopath(link: string): Observable<string> {
    const basePath = '/' + link.split('/')[0];

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', String(this.amministrativoService.mappaFunzioni[basePath]));
    return this.http.get(environment.bffBaseUrl + basePath + '/verificaAbilitazioneSottoPath', {
      headers: h,
      withCredentials: true
    }).pipe(flatMap(() => of('?funzione=' + btoa(String(this.amministrativoService.mappaFunzioni[basePath])))));
  }

  abstract popolaListaElementi(): void;

  abstract creaRigaTabella(oggetto: any);

  abstract eseguiAzioni(azioneTool: ToolEnum): void;

  mostraDettaglioElemento(link: string, id: number) {
    this.verificaAbilitazioneSottopath(link).subscribe((header: string) => this.router.navigate([link + header, id]));
  }

  modificaElementoSelezionato(link: string, id: number | string) {
    this.verificaAbilitazioneSottopath(link).subscribe((header: string) => this.router.navigate([link + header, id]));
  }

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

  abstract getRigheFileExcel(righe: any[]);

  esportaTabellaInFilePdf(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const colonne = this.getColonneFilePdf(copiaTabella.cols);
    const righe = this.getRigheFilePdf(copiaTabella.rows);
    let immagini = this.getImmaginiFilePdf();
    if (!immagini) {
      immagini = [];
    }
    Utils.esportaTabellaInFilePdf(colonne, righe, nomeFile, immagini);
  }

  abstract getColonneFilePdf(colonne: Colonna[]): Colonna[];

  abstract getRigheFilePdf(righe: any[]);

  abstract getImmaginiFilePdf(): ImmaginePdf[];

  abstract selezionaRigaTabella(righeSelezionate: any[]): void;

  abstract onChangeListaElementi(listaElementi: any[]): void;

  abstract getNumeroRecord(): string;
}
