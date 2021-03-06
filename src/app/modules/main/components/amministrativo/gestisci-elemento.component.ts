import {Breadcrumb, SintesiBreadcrumb} from '../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Utils} from '../../../../utils/Utils';
import {AmministrativoParentComponent} from './amministrativo-parent.component';
import {Tabella} from '../../model/tabella/Tabella';
import {Colonna} from '../../model/tabella/Colonna';
import {ToolEnum} from '../../../../enums/Tool.enum';
import {ImmaginePdf} from '../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';


export abstract class GestisciElementoComponent extends AmministrativoParentComponent {

  protected constructor(router: Router,
                        route: ActivatedRoute, protected http: HttpClient,
                        amministrativoService: AmministrativoService) {
    super(router, route, http, amministrativoService);
    this.amministrativoService.asyncAmministrativoSubject.subscribe((isAmministrativo) => {
      if (isAmministrativo) {
        route.url.subscribe((url) => {
          const basePath = '/' + url[0].path;
          this.basePath = basePath;
          this.idFunzione = String(this.amministrativoService.mappaFunzioni[basePath]);
        });
      } else {
        this.router.navigateByUrl('/nonautorizzato');
      }
    });
  }

  idFunzione;
  basePath;

  abstract tableData: Tabella;

  listaElementi: any[];
  abstract filtriRicerca: any;

  abstract righeSelezionate: any[];
  waiting = true;

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[], flag?: boolean): Breadcrumb[] {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb(flag ? 'Gestisci Portale' : 'Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

  aggiungiElemento(linkFunzioneAggiungi: string) {
    this.righeSelezionate = [];
    this.router.navigateByUrl(this.basePath + linkFunzioneAggiungi);
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

  popolaListaElementi(): void {
    this.listaElementi = [];
    this.tableData.rows = [];
    this.getObservableFunzioneRicerca().subscribe(listaElementi => {
      if (listaElementi != null) {
        this.listaElementi = listaElementi;
        this.impostaTabella(this.listaElementi);
        this.callbackPopolaLista();
      }
      this.waiting = false;
    });
  }

  abstract callbackPopolaLista();

  onChangeFiltri(filtri: any): void {
    this.filtriRicerca = filtri;
    this.popolaListaElementi();
  }

  impostaTabella(listaElementi: any[]): void {
    this.tableData.rows = [];
    if (listaElementi) {
      listaElementi.forEach(elemento => {
        this.tableData.rows.push(this.creaRigaTabella(elemento));
      });
    }
  }

  abstract getObservableFunzioneRicerca(): Observable<any[] | any>;

  mostraDettaglioElemento(linkFunzioneDettaglio: string, id: number) {
    this.righeSelezionate = [];
    this.router.navigateByUrl(this.basePath + linkFunzioneDettaglio + '/' + id);
  }

  modificaElementoSelezionato(linkFunzioneModifica: string, id: number | string) {
    this.righeSelezionate = [];
    this.router.navigateByUrl(this.basePath + linkFunzioneModifica + '/' + id);
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
