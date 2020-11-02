import {DomSanitizer} from '@angular/platform-browser';
import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'parseHtml'
})
export class ParseHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
