import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewContainerRef, ViewRef
} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {AttivitaPianificata} from "../../../../model/attivitapianificata/AttivitaPianificata";
import {ParametroAttivitaPianificata} from "../../../../model/attivitapianificata/ParametroAttivitaPianificata";
import {DatiParametroComponent} from "../dati-parametri/dati-parametro.component";
import {Utils} from "../../../../../../utils/Utils";
import {ComponenteDinamico} from "../../../../model/ComponenteDinamico";
import {FiltroSelect} from '../../../../model/servizio/FiltroSelect';
import {AttivitaPianificataService} from '../../../../../../services/attivita-pianificata.service';

@Component({
  selector: 'app-dati-attivita-pianificate',
  templateUrl: './dati-attivita-pianificate.component.html',
  styleUrls: ['./dati-attivita-pianificate.component.scss']
})
export class DatiAttivitaPianificateComponent implements OnInit, OnChanges {
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private attivitaPianificataService: AttivitaPianificataService) {
  }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  @Input()
  idFunzione;
  @Input()
  datiAttivitaPianificata: AttivitaPianificata;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('parametro', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  targetMap: Map<string, ViewRef> = new Map<string, ViewRef>();

  @ViewChild('datiForm', {static: false, read: NgForm})
  datiForm: NgForm;

  isSchedulazioneFormValid: boolean;

  opzioniAttivitaPianificataBean: FiltroSelect[];

  mapParametri: Map<string, ParametroAttivitaPianificata> = new Map<string, ParametroAttivitaPianificata>();
  mapControllo: Map<string, boolean> = new Map<string, boolean>();
  getListaFromMap = (map: Map<string, any>) => Array.from(map, ([name, value]) => value);


  ngOnInit(): void {
    this.recuperaFiltroAttivitaPianificataBean();
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.inizializzazioneChiaveValore();
  }

  private inizializzazioneChiaveValore() {
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      if (this.datiAttivitaPianificata.parametri != null && this.datiAttivitaPianificata.parametri.length > 0) {
        this.datiAttivitaPianificata.parametri.forEach(parametro => this.aggiungiChiaveValore(parametro));
      }
    } else {
      if (this.datiAttivitaPianificata.parametri == null || this.datiAttivitaPianificata.parametri.length === 0) {
        this.mapParametri = new Map<string, ParametroAttivitaPianificata>();
        this.target.clear();
        this.aggiungiChiaveValore();
      }
    }
  }

  recuperaFiltroAttivitaPianificataBean() {
    this.attivitaPianificataService.recuperaFiltroAttivitaPianificataBean(this.idFunzione).subscribe(listaOpzioni => {
      if (listaOpzioni) {
        this.opzioniAttivitaPianificataBean = listaOpzioni;
      }
    });
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  onChangeModel(form: NgForm, campo?: NgModel) {
    if (campo?.value === '') {
      this.datiAttivitaPianificata[campo.name] = null;
    }

    this.formsValid(form, this.isSchedulazioneFormValid);
  }

  schedulazioneFormValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    this.isSchedulazioneFormValid = isSchedulazioneFormValid;
    this.formsValid(form, this.isSchedulazioneFormValid);
  }

  formsValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    const listaControllo: boolean[] = this.getListaFromMap(this.mapControllo);
    const areParametriNotValid = listaControllo.length > 0 ? listaControllo.includes(false) : false;
    const isValid = form.valid && isSchedulazioneFormValid && !areParametriNotValid;
    this.isFormValid.emit(isValid);
  }

  aggiungiChiaveValore(parametro?: ParametroAttivitaPianificata) {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiParametroComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const index = this.target.length;
    // input
    const uuid = Utils.uuidv4();
    this.componentRef.instance.uuid = uuid;
    this.targetMap.set(uuid, this.componentRef.hostView);
    this.componentRef.instance.index = index;
    this.componentRef.instance.funzione = this.funzione;
    let instance: ParametroAttivitaPianificata;
    if (parametro == null) {
      instance = new ParametroAttivitaPianificata();
    } else {
      instance = parametro;
    }
    this.componentRef.instance.parametro = instance;
    // output
    this.componentRef.instance.onDeleteDatiParametro.subscribe((componenteDinamico: ComponenteDinamico) => {
      const currentParametro = this.mapParametri.get(componenteDinamico.uuid);
      if (currentParametro != null) {
        this.mapParametri.delete(componenteDinamico.uuid);
        this.mapControllo.delete(componenteDinamico.uuid);
      }

      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const viewRef = this.targetMap.get(componenteDinamico.uuid);
      const indexViewRef = this.target.indexOf(viewRef);
      if (this.target.length === 1) {
        this.target.clear();
        this.targetMap.clear();
      } else {
        this.target.remove(indexViewRef);
        this.targetMap.delete(componenteDinamico.uuid);
      }
      this.setListaParametri();
    });
    this.componentRef.instance.onChangeDatiParametro.subscribe((componenteDinamico: ComponenteDinamico) => {
      this.mapParametri.set(componenteDinamico.uuid, componenteDinamico.oggetto);
      this.mapControllo.set(componenteDinamico.uuid, componenteDinamico.isFormValid);
      this.setListaParametri();
    });
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private setListaParametri() {
    const listaParametri: ParametroAttivitaPianificata[] = this.getListaFromMap(this.mapParametri);
    this.datiAttivitaPianificata.parametri = listaParametri;
    this.formsValid(this.datiForm, this.isSchedulazioneFormValid);
  }
}
