import {EventEmitter, Injectable} from "@angular/core";
import {Servizio} from '../../../model/Servizio';

@Injectable({
  providedIn: 'root'
})
export class CompilazioneService {

  compilazioneEvent: EventEmitter<Servizio> = new EventEmitter<Servizio>();

}
