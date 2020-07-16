import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PagamentoService} from '../../services/pagamento.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.scss']
})
export class RedirectPageComponent implements OnInit {


  constructor(private route: Router, private pagamentoService: PagamentoService) {
  }

  ngOnInit(): void {
  }

  quietanza() {
    const idSessione = 'da inserire';
    const esito = 'da inserire';
    const observable = this.pagamentoService.quietanza(idSessione, esito);
    observable.subscribe();
  }
  redirectCarrello() {
    const buffer = {
      ProtocolVersion: null,
      TagOrario: '202007141003',
      CodicePortale: 'PROVA',
      // tslint:disable-next-line:max-line-length
      BufferDati: 'PFBheW1lbnRSZXF1ZXN0MT48UG9ydGFsZUlEPkN1cDIwMDA8L1BvcnRhbGVJRD48RnVuemlvbmU+\\nUEFHQU1FTlRPPC9GdW56aW9uZT48VVJMRGlSaXRvcm5vPmh0dHBzOi8vdGVzdHBhZ2FtZW50aS5j\\ndXAyMDAwLml0L2ZpbmVwYWdhbWVudG9jbC5odG0/am91cm5hbGlkPTUwOTUwPC9VUkxEaVJpdG9y\\nbm8+PFVSTERpTm90aWZpY2E+aHR0cHM6Ly90ZXN0cGFnYW1lbnRpLmN1cDIwMDAuaXQvbm90aWZp\\nY2FwYWdhbWVudG9jbC5odG0/am91cm5hbGlkPTUwOTUwPC9VUkxEaU5vdGlmaWNhPjxVUkxCYWNr\\nPmh0dHBzOi8vdGVzdHBhZ2FtZW50aS5jdXAyMDAwLml0L3BhZ2FtZW50by5odG0/d19wYWdlPTIm\\nYW1wO2pvdXJuYWxpZD01MDk1MCZhbXA7ZmlzY2FsY29kZT1TTE5WQ04wMkMzMEE5NDRZPC9VUkxC\\nYWNrPjxDb21taXROb3RpZmljYT5TPC9Db21taXROb3RpZmljYT48VXNlckRhdGE+PEVtYWlsVXRl\\nbnRlPmFsZXNzYW5kcm8ubWlnbGlhY2Npb0BsZXBpZGEuaXQ8L0VtYWlsVXRlbnRlPjxJZGVudGlm\\naWNhdGl2b1V0ZW50ZT5TTE5WQ04wMkMzMEE5NDRZPC9JZGVudGlmaWNhdGl2b1V0ZW50ZT48L1Vz\\nZXJEYXRhPjxTZXJ2aWNlRGF0YT48Q29kaWNlVXRlbnRlLz48Q29kaWNlRW50ZT4wMTYyODwvQ29k\\naWNlRW50ZT48VGlwb1VmZmljaW8+RjwvVGlwb1VmZmljaW8+PENvZGljZVVmZmljaW8+MTwvQ29k\\naWNlVWZmaWNpbz48VGlwb2xvZ2lhU2Vydml6aW8+MTM8L1RpcG9sb2dpYVNlcnZpemlvPjxOdW1l\\ncm9PcGVyYXppb25lPkdWQy1GRS1UMDAxLTAwMDE8L051bWVyb09wZXJhemlvbmU+PE51bWVyb0Rv\\nY3VtZW50bz5HVkMtRkUtVDAwMTwvTnVtZXJvRG9jdW1lbnRvPjxBbm5vRG9jdW1lbnRvPjIwMjA8\\nL0Fubm9Eb2N1bWVudG8+PFZhbHV0YT5FVVI8L1ZhbHV0YT48SW1wb3J0bz41NTgyPC9JbXBvcnRv\\nPjxDYXVzYWxlPkNBVVNBTEUgREkgUFJPVkE8L0NhdXNhbGU+PERhdGlTcGVjaWZpY2k+PC9EYXRp\\nU3BlY2lmaWNpPjwvU2VydmljZURhdGE+PEFjY291bnRpbmdEYXRhPjxSaXZlcnNhbWVudG9BdXRv\\nbWF0aWNvPnRydWU8L1JpdmVyc2FtZW50b0F1dG9tYXRpY28+PEltcG9ydGlDb250YWJpbGk+PElt\\ncG9ydGlDb250YWJpbGk+PElkZW50aWZpY2F0aXZvPklDMTwvSWRlbnRpZmljYXRpdm8+PFZhbG9y\\nZT41NTAwPC9WYWxvcmU+PC9JbXBvcnRpQ29udGFiaWxpPjxJbXBvcnRpQ29udGFiaWxpPjxJZGVu\\ndGlmaWNhdGl2bz5JQzQ8L0lkZW50aWZpY2F0aXZvPjxWYWxvcmU+ODI8L1ZhbG9yZT48L0ltcG9y\\ndGlDb250YWJpbGk+PC9JbXBvcnRpQ29udGFiaWxpPjxFbnRpRGVzdGluYXRhcmk+PEVudGlEZXN0\\naW5hdGFyaT48Q29kaWNlRW50ZVBvcnRhbGVFc3Rlcm5vPlBST1ZBPC9Db2RpY2VFbnRlUG9ydGFs\\nZUVzdGVybm8+PERlc2NyRW50ZVBvcnRhbGVFc3Rlcm5vPkRFU0NSSVpJT05FIFBST1ZBPC9EZXNj\\nckVudGVQb3J0YWxlRXN0ZXJubz48Q29kaWNlVXRlbnRlQmVuZWZpY2lhcmlvLz48Q29kaWNlRW50\\nZUJlbmVmaWNpYXJpbz4wMTYyODwvQ29kaWNlRW50ZUJlbmVmaWNpYXJpbz48VGlwb1VmZmljaW9C\\nZW5lZmljaWFyaW8+RjwvVGlwb1VmZmljaW9CZW5lZmljaWFyaW8+PENvZGljZVVmZmljaW9CZW5l\\nZmljaWFyaW8+MTwvQ29kaWNlVWZmaWNpb0JlbmVmaWNpYXJpbz48VGlwb2xvZ2lhU2Vydml6aW8v\\nPjxOdW1lcm9Eb2N1bWVudG8+R1ZDLUZFLVQwMDEuMTwvTnVtZXJvRG9jdW1lbnRvPjxBbm5vRG9j\\ndW1lbnRvPjIwMjA8L0Fubm9Eb2N1bWVudG8+PFZhbHV0YT5FVVI8L1ZhbHV0YT48VmFsb3JlPjUw\\nMDA8L1ZhbG9yZT48Q2F1c2FsZT5DQVVTQUxFIERJIFBST1ZBPC9DYXVzYWxlPjxJbXBvcnRvQ29u\\ndGFiaWxlSW5ncmVzc28vPjxJbXBvcnRvQ29udGFiaWxlVXNjaXRhLz48L0VudGlEZXN0aW5hdGFy\\naT48RW50aURlc3RpbmF0YXJpPjxDb2RpY2VFbnRlUG9ydGFsZUVzdGVybm8+UFJPVkEgMjwvQ29k\\naWNlRW50ZVBvcnRhbGVFc3Rlcm5vPjxEZXNjckVudGVQb3J0YWxlRXN0ZXJubz5ERVNDUklaSU9O\\nRSBQUk9WQSAyPC9EZXNjckVudGVQb3J0YWxlRXN0ZXJubz48Q29kaWNlVXRlbnRlQmVuZWZpY2lh\\ncmlvLz48Q29kaWNlRW50ZUJlbmVmaWNpYXJpbz4wMTYyODwvQ29kaWNlRW50ZUJlbmVmaWNpYXJp\\nbz48VGlwb1VmZmljaW9CZW5lZmljaWFyaW8+RjwvVGlwb1VmZmljaW9CZW5lZmljaWFyaW8+PENv\\nZGljZVVmZmljaW9CZW5lZmljaWFyaW8+MTwvQ29kaWNlVWZmaWNpb0JlbmVmaWNpYXJpbz48VGlw\\nb2xvZ2lhU2Vydml6aW8vPjxOdW1lcm9Eb2N1bWVudG8+R1ZDLUZFLVQwMDEuMjwvTnVtZXJvRG9j\\ndW1lbnRvPjxBbm5vRG9jdW1lbnRvPjIwMjA8L0Fubm9Eb2N1bWVudG8+PFZhbHV0YT5FVVI8L1Zh\\nbHV0YT48VmFsb3JlPjU4MjwvVmFsb3JlPjxDYXVzYWxlPkNBVVNBTEUgREkgUFJPVkEgMjwvQ2F1\\nc2FsZT48SW1wb3J0b0NvbnRhYmlsZUluZ3Jlc3NvLz48SW1wb3J0b0NvbnRhYmlsZVVzY2l0YS8+\\nPC9FbnRpRGVzdGluYXRhcmk+PC9FbnRpRGVzdGluYXRhcmk+PC9BY2NvdW50aW5nRGF0YT48L1Bh\\neW1lbnRSZXF1ZXN0MT4=',
      Hash: '6520af1b11f2be3167b31c181ebf883a'
    };
    const bufferS = "aaaa"

    const observable = this.pagamentoService.redirectCarrello(bufferS);
    observable.subscribe();
  }
}
