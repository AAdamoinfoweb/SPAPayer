import {Breadcrumb, SintesiBreadcrumb} from '../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Utils} from "../../../../utils/Utils";
import {AmministrativoParentComponent} from './amministrativo-parent.component';
import {Tabella} from '../../model/tabella/Tabella';
import {Colonna} from '../../model/tabella/Colonna';


export abstract class GestisciElementoComponent extends AmministrativoParentComponent {

  protected constructor(router: Router,
                        route: ActivatedRoute, http: HttpClient,
                        amministrativoService: AmministrativoService) {
    super(router, route, http, amministrativoService);
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]): Breadcrumb[] {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb( 'Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

  aggiungiElemento(link: string) {
    this.router.navigateByUrl(link);
  }

  // TODO astrarre popolaListaElementi

  // TODO generalizzare o astrarre creaRigaTabella

  // TODO generalizzare eseguiAzioni

  // TODO generalizzare mostraDettaglioElemento

  // TODO generalizzare o astrarre eliminaListaIdElementiSelezionati

  // TODO generalizzare modificaElementoSelezionato

  // TODO generalizzare esportaTabellaInFilePdf

  // TODO generalizzare o astrarre selezionaElemento

  // TODO generalizzare o astrarre onChangeListaElementi

  // TODO generalizzare getTotaliRecord

  esportaTabellaInFileExcel(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const headerColonne = this.getHeaderFileExcel(copiaTabella.cols);
    const righe = this.getRigheFileExcel(copiaTabella.rows);

    const fogli = {};
    fogli[nomeFile] = null;
    const workbook = {Sheets: fogli, SheetNames: []};
    Utils.creaFileExcel(righe, headerColonne, nomeFile, [nomeFile], workbook, 'Lista ' + nomeFile);
  }

  abstract getHeaderFileExcel(colonne: Colonna[]);
  abstract getRigheFileExcel(righe: any[]);

  abstract prova(): number;
}
