import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {SocietaService} from '../../../../../services/societa.service';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-monitora-accessi',
  templateUrl: './monitora-accessi.component.html',
  styleUrls: ['./monitora-accessi.component.scss']
})
export class MonitoraAccessiComponent extends GestisciElementoComponent implements OnInit {

  isMenuCarico: boolean = false;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService,
              private confirmationService: ConfirmationService
  ) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
    this.waitingEmitter.subscribe(() => {

      if (this.amministrativoService.mappaFunzioni) {
        this.isMenuCarico = Object.keys(this.amministrativoService.mappaFunzioni).length > 0;
      }

      if (this.isMenuCarico) {
        this.init();
      } else {
        this.menuService.menuCaricatoEvent.subscribe(() => {
          this.init();
        });
      }
    });
  }

  init(): void {
    this.inizializzaBreadcrumbList([
      {label: 'Monitora Accessi', link: null}
    ]);
    this.popolaListaElementi();
  }

  creaRigaTabella(oggetto: any) {
    // TODO implementare metodo
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    // TODO implementare metodo
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    // TODO implementare metodo
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    // TODO implementare metodo
    return [];
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    // TODO implementare metodo
    return [];
  }

  getNumeroRecord(): string {
    // TODO implementare metodo
    return '';
  }

  getRigheFileExcel(righe: any[]) {
    // TODO implementare metodo
  }

  getRigheFilePdf(righe: any[]) {
    // TODO implementare metodo
  }

  onChangeListaElementi(listaElementi: any[]): void {
    // TODO implementare metodo
  }

  popolaListaElementi(): void {

  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    // TODO implementare metodo
  }

}
