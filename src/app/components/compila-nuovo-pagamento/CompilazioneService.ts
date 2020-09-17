import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CompilazioneService {

  compilazioneEvent: EventEmitter<string> = new EventEmitter<string>();

}
