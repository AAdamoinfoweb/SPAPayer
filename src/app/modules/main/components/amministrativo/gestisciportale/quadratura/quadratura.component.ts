import { Component, OnInit } from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Tabella} from '../../../../model/tabella/Tabella';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-quadratura',
  templateUrl: './quadratura.component.html',
  styleUrls: ['./quadratura.component.scss']
})
export class QuadraturaComponent extends GestisciElementoComponent implements OnInit {

  filtriRicerca: any;
  righeSelezionate: any[];
  tableData: Tabella;

  constructor(router: Router,
              route: ActivatedRoute, protected http: HttpClient,
              amministrativoService: AmministrativoService
  ) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
  }

  callbackPopolaLista() {
  }

  creaRigaTabella(elemento: any) {
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return [];
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] | any[] {
    return undefined;
  }

  getNumeroRecord(): string {
    return '';
  }

  getObservableFunzioneRicerca(): Observable<any> {
    return undefined;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return [];
  }

  getRigheFilePdf(righe: any[]): any[] {
    return [];
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
  }

}
