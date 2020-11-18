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
  ViewContainerRef
} from '@angular/core';
import {Statistica} from '../../../../model/statistica/Statistica';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {Destinatario} from '../../../../model/statistica/Destinatario';
import {DatiDestinatarioComponent} from '../dati-destinatario/dati-destinatario.component';

@Component({
  selector: 'app-dati-statistica',
  templateUrl: './dati-statistica.component.html',
  styleUrls: ['./dati-statistica.component.scss']
})
export class DatiStatisticaComponent implements OnInit, OnChanges {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  @Input()
  idFunzione;
  @Input()
  datiStatistica: Statistica;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('destinatario', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  @ViewChild('datiForm', {static: false, read: NgForm})
  datiForm: NgForm;

  isSchedulazioneFormValid: boolean;

  mapDestinatari: Map<number, Destinatario> = new Map<number, Destinatario>();
  mapControllo: Map<number, boolean> = new Map<number, boolean>();
  getListaFromMap = (map: Map<number, any>) => Array.from(map, ([name, value]) => value);

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datiStatistica) {
        this.inizializzazioneDestinatari();
    }
  }

  private inizializzazioneDestinatari() {
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI && this.datiStatistica.destinatari != null && this.datiStatistica.destinatari.length > 0) {
      this.datiStatistica.destinatari.forEach(destinatario => this.aggiungiDestinatario(destinatario));
    }
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
    if (campo?.value == '') {
        this.datiStatistica[campo.name] = null;
    }

    this.formsValid(form, this.isSchedulazioneFormValid);
  }

  aggiungiDestinatario(destinatario?: Destinatario) {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiDestinatarioComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const index = this.target.length;
    // input
    this.componentRef.instance.index = index;
    this.componentRef.instance.funzione = this.funzione;
    let instance: Destinatario;
    if (destinatario == null) {
      instance = new Destinatario();
    } else {
      instance = destinatario;
    }
    this.componentRef.instance.destinatario = instance;
    // output
    this.componentRef.instance.onDeleteDatiDestinatario.subscribe(currentIndex => {
      const currentDestinatario = this.mapDestinatari.get(currentIndex);
      if (currentDestinatario != null) {
        this.mapDestinatari.delete(currentIndex);
        this.mapControllo.delete(currentIndex);
      }

      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const zeroBasedIndex = currentIndex - 1;
      const viewRef = this.target.get(zeroBasedIndex);
      if (viewRef == null && this.target.length === 1) {
        this.target.clear();
      } else {
        this.target.remove(zeroBasedIndex);
      }
      this.setListaDestinatari();
    });
    this.componentRef.instance.onChangeDatiDestinatario.subscribe((destinatarioIndex) => {
      this.mapDestinatari.set(destinatarioIndex.index, destinatarioIndex.destinatario);
      this.mapControllo.set(destinatarioIndex.index, destinatarioIndex.isFormValid);
      this.setListaDestinatari();
    });
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private setListaDestinatari() {
    const listaDestinatari: Destinatario[] = this.getListaFromMap(this.mapDestinatari);
    this.datiStatistica.destinatari = listaDestinatari;
    this.formsValid(this.datiForm, this.isSchedulazioneFormValid);
  }

  schedulazioneFormValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    this.isSchedulazioneFormValid = isSchedulazioneFormValid;
    this.formsValid(form, this.isSchedulazioneFormValid);
  }

  formsValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    const listaControllo: boolean[] = this.getListaFromMap(this.mapControllo);
    const areDestinatariNotValid = listaControllo.length > 0 ? listaControllo.includes(false) : false;
    const isValid = form.valid && isSchedulazioneFormValid && !areDestinatariNotValid;
    this.isFormValid.emit(isValid);
  }
}
