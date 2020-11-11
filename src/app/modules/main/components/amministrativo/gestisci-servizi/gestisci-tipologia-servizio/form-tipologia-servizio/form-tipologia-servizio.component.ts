import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {CampoForm} from '../../../../../model/CampoForm';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import * as _ from 'lodash';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConfirmationService} from 'primeng/api';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {Utils} from "../../../../../../../utils/Utils";
import {TipoModaleEnum} from "../../../../../../../enums/tipoModale.enum";

@Component({
  selector: 'app-form-tipologia-servizio',
  templateUrl: './form-tipologia-servizio.component.html',
  styleUrls: ['./form-tipologia-servizio.component.scss']
})
export class FormTipologiaServizioComponent extends FormElementoParentComponent implements AfterViewInit {

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public items: CampoForm[] = [];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  waiting = true;

  funzione: FunzioneGestioneEnum;

  readonly lunghezzaMaxCol1: number = 5;
  readonly lunghezzaMaxCol2: number = 10;
  readonly lunghezzaMaxCol3: number = 15;

  showEditId: string;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected http: HttpClient,
    protected amministrativoService: AmministrativoService,
    private viewportRuler: ViewportRuler,
    protected confirmationService: ConfirmationService,
    private campoTipologiaServizioService: CampoTipologiaServizioService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
    this.target = null;
    this.source = null;
  }

  ngAfterViewInit() {
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.campoTipologiaServizioService.campiTipologiaServizio(13)
      .subscribe(value => {
        this.items = _.sortBy(value, 'posizione');
        this.waiting = false;
      });
  }

  onClickSalva(): void {
    // TODO onclicksalva
  }

  add() {
    let campoForm = new CampoForm();
    campoForm.titolo = "nuovo campo";
    this.items.push(campoForm);
    this.showEditId = campoForm.titolo;
  }

  removeItem(item: CampoForm) {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.items.splice(this.items.findIndex((v) => v.id === item.id), 1);
        },
        TipoModaleEnum.ELIMINA,
      )
    );
  }

  calcolaDimensioneCampo(campo: CampoForm): string {
    let classe;

    if (campo.tipoCampo === TipoCampoEnum.DATEDDMMYY || campo.tipoCampo === TipoCampoEnum.DATEMMYY || campo.tipoCampo === TipoCampoEnum.DATEYY) {
      classe = 'col-lg-2 col-md-4 col-xs-6';
    } else if (campo.tipoCampo === TipoCampoEnum.INPUT_PREZZO) {
      classe = 'col-lg-2 col-md-4 col-xs-6';
    } else {
      if (campo.lunghezza <= this.lunghezzaMaxCol1) {
        classe = 'col-lg-1 col-md-4 col-xs-6';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol2) {
        classe = 'col-lg-3 col-md-4 col-xs-6';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol3) {
        classe = 'col-lg-4 col-md-5 col-xs-6';
      } else {
        classe = 'col-lg-5 col-md-6 col-xs-6';
      }
    }
    return classe;
  }

  dropEvt(event: CdkDragDrop<{ item: CampoForm; index: number }, any>) {
    this.items[event.previousContainer.data.index] = event.container.data.item;
    this.items[event.container.data.index] = event.previousContainer.data.item;
  }

  showModal(item: CampoForm) {

  }
}
