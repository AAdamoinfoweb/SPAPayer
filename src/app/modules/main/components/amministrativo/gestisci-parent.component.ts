import {Breadcrumb} from '../../dto/Breadcrumb';
import * as Parent from './amministrativo-parent.component';
import {AmministrativoService} from '../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';


export interface BreadcrumbObj {
  label: string;
  link: string;
}

export abstract class GestisciParentComponent extends Parent.AmministrativoParentComponent {

  protected constructor(router: Router,
                        route: ActivatedRoute, http: HttpClient,
                        amministrativoService: AmministrativoService) {
    super(router, route, http, amministrativoService);
  }

  inizializzaBreadcrumbList(breadcrumbs: BreadcrumbObj[]): Breadcrumb[] {
    const breadcrumbList = [];
    breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    let counter = 2;
    breadcrumbs.forEach(breadcrumb => {
      breadcrumbList.push(new Breadcrumb(counter, breadcrumb.label, breadcrumb.link, null));
      counter++;
    });
    return breadcrumbList;
  }

}
