import {SintesiBreadcrumb} from "../../dto/Breadcrumb";
import {Utils} from "../../../../utils/Utils";
import {TipoModaleEnum} from "../../../../enums/tipoModale.enum";
import {FunzioneGestioneEnum} from "../../../../enums/funzioneGestione.enum";
import {ConfirmationService} from "primeng/api";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {flatMap} from "rxjs/operators";
import {AmministrativoService} from "../../../../services/amministrativo.service";


export abstract class FormElementoParentComponent {

  protected constructor(private confirmationService: ConfirmationService,
                        protected activatedRoute: ActivatedRoute,
                        protected amministrativoService: AmministrativoService,
                        protected http: HttpClient,
                        protected router: Router) {
    activatedRoute.params.subscribe((params) => {
      let path = activatedRoute.snapshot.routeConfig.path;
      this.verificaAbilitazioneSottopath(path).subscribe(() => {
        this.idFunzioneB64 = activatedRoute.snapshot.queryParams.funzione;
        this.initFormPage(activatedRoute.snapshot);
      });
    });
  }

  idFunzioneB64;
  abstract funzione: FunzioneGestioneEnum;
  abstract urlFunzione;

  abstract initFormPage(snapshot: ActivatedRouteSnapshot);

  verificaAbilitazioneSottopath(link: string): Observable<string> {
    const basePath = '/' + link.split('/')[0];

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', String(this.amministrativoService.mappaFunzioni[basePath]));
    return this.http.get(environment.bffBaseUrl + basePath + '/verificaAbilitazioneSottoPath', {
      headers: h,
      withCredentials: true
    }).pipe(flatMap(() => of('?funzione=' + btoa(String(this.amministrativoService.mappaFunzioni[basePath])))));
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]) {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb('Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

  abstract onClickSalva(): void;

  onClickAnnulla(funzione: FunzioneGestioneEnum) {
    if (funzione === FunzioneGestioneEnum.DETTAGLIO) {
      this.tornaIndietro();
    } else {
      this.confirmationService.confirm(
        Utils.getModale(() => {
            this.tornaIndietro();
          },
          TipoModaleEnum.ANNULLA
        )
      );
    }
  }

  tornaIndietro(): void {
    this.router.navigateByUrl(this.urlFunzione + '?funzione=' + this.idFunzioneB64);
  };

  getTestoFunzione(funzione: FunzioneGestioneEnum, isTitolo: boolean = true): string {
    switch (funzione) {
      case FunzioneGestioneEnum.DETTAGLIO:
        return isTitolo ? 'Dettaglio' : 'visualizzare';
        break;
      case FunzioneGestioneEnum.AGGIUNGI:
        return isTitolo ? 'Aggiungi' : 'aggiungere';
        break;
      case FunzioneGestioneEnum.MODIFICA:
        return isTitolo ? 'Modifica' : 'modificare';
        break;
      default:
        return '';
    }
  }

}
