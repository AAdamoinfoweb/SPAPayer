import {HttpClient} from '@angular/common/http';
import {XsrfService} from './xsrf.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Banner} from '../modules/main/model/Banner';
import {EventEmitter, Injectable} from "@angular/core";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  caricamentoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
}
