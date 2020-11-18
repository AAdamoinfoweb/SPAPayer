import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Beneficiario} from '../../../../../model/ente/Beneficiario';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {BeneficiarioSingolo} from '../../../../../model/ente/BeneficiarioSingolo';
import {NgForm, NgModel} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {ContoCorrenteSingolo} from '../../../../../model/ente/ContoCorrenteSingolo';
import {DatiContoCorrenteComponent} from '../dati-conto-corrente/dati-conto-corrente.component';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {EnteService} from '../../../../../../../services/ente.service';

@Component({
  selector: 'app-dati-beneficiario',
  templateUrl: './dati-beneficiario.component.html',
  styleUrls: ['./dati-beneficiario.component.scss']
})
export class DatiBeneficiarioComponent implements OnInit, AfterViewInit {


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private enteService: EnteService) {
  }

  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina dati beneficiario';

  @Input() indexDatiBeneficiario: number;
  @Input() datiBeneficiario: Beneficiario;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onChangeDatiBeneficiario: EventEmitter<BeneficiarioSingolo> = new EventEmitter<BeneficiarioSingolo>();
  @Output()
  onDeleteDatiBeneficiario: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('datiContoCorrente', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  @ViewChild('datiBeneficiarioForm', {static: false, read: NgForm})
  formDatiBeneficiario: NgForm;

  mapContoCorrente: Map<number, ContoCorrente> = new Map<number, ContoCorrente>();
  mapControllo: Map<number, boolean> = new Map<number, boolean>();
  getListaContiCorrente = (mapContoCorrente: Map<number, ContoCorrente>) => Array.from(mapContoCorrente, ([name, value]) => value);
  getListaControllo = (mapControllo: Map<number, boolean>) => Array.from(mapControllo, ([name, value]) => value);

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCollapse' + this.indexDatiBeneficiario.toString());
    if (collapseButton != null) {
      collapseButton.dataset.target = '#collapse' + this.indexDatiBeneficiario;
      if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
        this.datiBeneficiario.listaContiCorrenti.forEach((contoCorrente) => {
          this.aggiungiContoCorrente(contoCorrente);
        });
        this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo(true));
      } else {
        this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo(false));
      }
    }
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiBeneficiario.emit(this.indexDatiBeneficiario);
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  setBeneficiarioSingolo(isFormValid: boolean): BeneficiarioSingolo {
    const beneficiarioSingolo: BeneficiarioSingolo = new BeneficiarioSingolo();
    beneficiarioSingolo.index = this.indexDatiBeneficiario;
    beneficiarioSingolo.beneficiario = this.datiBeneficiario;
    beneficiarioSingolo.isFormValid = isFormValid;
    return beneficiarioSingolo;
  }

  controlloForm(form?: NgForm): boolean {
    const listaControllo: boolean[] = this.getListaControllo(this.mapControllo);
    const isListaContiCorrentInvalid = listaControllo.length > 0 ? listaControllo.includes(false) : false;
    const isFormValid = form ? form.valid : true;
    return isFormValid && !isListaContiCorrentInvalid;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiBeneficiario[campo.name] = null;
    }
    this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo(this.controlloForm(this.formDatiBeneficiario)));
  }

  aggiungiContoCorrente(datiContoCorrente?: ContoCorrente): number {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiContoCorrenteComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const indexContoCorrente = this.target.length;
    // input
    this.componentRef.instance.indexDatiContoCorrente = indexContoCorrente;
    this.componentRef.instance.funzione = this.funzione;
    let instanceContoCorrente: ContoCorrente;
    if (datiContoCorrente == null) {
      instanceContoCorrente = new ContoCorrente();
    } else {
      instanceContoCorrente = datiContoCorrente;
    }
    this.componentRef.instance.datiContoCorrente = instanceContoCorrente;
    if (this.listaContiCorrente != null && FunzioneGestioneEnum.MODIFICA) {
      this.componentRef.instance.listaContiCorrente = this.listaContiCorrente;
    }
    // output
    this.componentRef.instance.onDeleteDatiContoCorrente.subscribe(index => {
      const contoCorrente = this.mapContoCorrente.get(index);
      const isContoCorrenteDaModificare: boolean = contoCorrente != null;
      if (isContoCorrenteDaModificare) {
        this.mapContoCorrente.delete(index);
        this.mapControllo.delete(index);
      }
      this.target.remove(index - 1);
      this.setListaContiCorrente();
    });
    this.componentRef.instance.onChangeDatiContoCorrente.subscribe((currentContoCorrente: ContoCorrenteSingolo) => {
      this.mapContoCorrente.set(currentContoCorrente.index, currentContoCorrente.contoCorrente);
      this.mapControllo.set(currentContoCorrente.index, currentContoCorrente.isFormValid);
      this.setListaContiCorrente();
    });
    this.componentRef.changeDetectorRef.detectChanges();
    return indexContoCorrente;
  }

  private setListaContiCorrente() {
    const listaContiCorrente: ContoCorrente[] = this.getListaContiCorrente(this.mapContoCorrente);
    this.datiBeneficiario.listaContiCorrenti = listaContiCorrente;
    this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo(this.controlloForm()));
  }

  disabilitaBottone(): boolean {
    return !this.controlloForm(this.formDatiBeneficiario);
  }
}
