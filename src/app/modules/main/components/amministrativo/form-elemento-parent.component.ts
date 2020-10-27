import {SintesiBreadcrumb} from "../../dto/Breadcrumb";
import {Utils} from "../../../../utils/Utils";


export abstract class FormElementoParentComponent {

  protected constructor() {
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]) {
    const breadcrumbList: SintesiBreadcrumb[] = [];
    breadcrumbList.push(new SintesiBreadcrumb( 'Amministra Portale', null));
    breadcrumbList.push(...breadcrumbs);
    return Utils.popolaListaBreadcrumb(breadcrumbList);
  }

}
