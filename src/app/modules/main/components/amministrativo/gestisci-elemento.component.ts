import {Breadcrumb, SintesiBreadcrumb} from '../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Utils} from "../../../../utils/Utils";
import {AmministrativoParentComponent} from './amministrativo-parent.component';


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

}
