import {AmministrativoService} from "../../../../services/amministrativo.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";


export abstract class InserimentoModificaDettaglioParentComponent {

  protected constructor(router: Router,
                        route: ActivatedRoute, http: HttpClient,
                        amministrativoService: AmministrativoService) {
  }

}
