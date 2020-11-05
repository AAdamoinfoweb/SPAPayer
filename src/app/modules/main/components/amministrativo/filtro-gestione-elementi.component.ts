import {NgForm} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AmministrativoService} from "../../../../services/amministrativo.service";


export abstract class FiltroGestioneElementiComponent {

  protected constructor(protected route: ActivatedRoute, protected amministrativoService: AmministrativoService) {
    this.amministrativoService.asyncAmministrativoSubject.subscribe((isAmministrativo) => {
      if (isAmministrativo) {
        route.url.subscribe((url) => {
          const basePath = '/' + url[0].path;
          this.basePath = basePath;
          this.idFunzione = String(this.amministrativoService.mappaFunzioni[basePath]);
        });
      }
    });
  }

  abstract idFunzione;
  basePath;

  abstract listaElementi: Array<any>;

  abstract onChangeListaElementi: EventEmitter<any[]>;

  abstract pulisciFiltri(filtroForm: NgForm): void;

  abstract cercaElementi(): void;

}
