import {SintesiBreadcrumb} from "../../dto/Breadcrumb";
import {Utils} from "../../../../utils/Utils";
import {TipoModaleEnum} from "../../../../enums/tipoModale.enum";
import {FunzioneGestioneEnum} from "../../../../enums/funzioneGestione.enum";
import {ConfirmationService} from "primeng/api";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {AmministrativoService} from "../../../../services/amministrativo.service";


export abstract class FormElementoParentComponent {

  protected constructor(private confirmationService: ConfirmationService,
                        protected activatedRoute: ActivatedRoute,
                        protected amministrativoService: AmministrativoService,
                        protected http: HttpClient,
                        protected router: Router) {
    window.scroll(0, 0);
    this.amministrativoService.asyncAmministrativoSubject.subscribe((isAmministrativo) => {
      if(isAmministrativo) {
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

  abstract idFunzione;
  basePath;

  abstract funzione: FunzioneGestioneEnum;

  abstract initFormPage(snapshot: ActivatedRouteSnapshot);

  verificaAbilitazioneSottopath(): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', this.idFunzione);
    return this.http.get(environment.bffBaseUrl + this.basePath + '/verificaAbilitazioneSottoPath', {
      headers: h,
      withCredentials: true
    });
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
    this.router.navigateByUrl(this.basePath);
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
