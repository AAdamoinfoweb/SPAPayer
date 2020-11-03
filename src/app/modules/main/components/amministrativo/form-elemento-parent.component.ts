import {SintesiBreadcrumb} from "../../dto/Breadcrumb";
import {Utils} from "../../../../utils/Utils";
import {TipoModaleEnum} from "../../../../enums/tipoModale.enum";
import {FunzioneGestioneEnum} from "../../../../enums/funzioneGestione.enum";
import {ConfirmationService} from "primeng/api";


export abstract class FormElementoParentComponent {

  protected constructor(private confirmationService: ConfirmationService) {
  }

  //abstract idFunzioneB64;
  abstract funzione: FunzioneGestioneEnum;


  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]) {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb( 'Amministra Portale', null));
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

  abstract tornaIndietro(): void;

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
