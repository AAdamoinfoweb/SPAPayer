import {Directive, ElementRef, HostListener, Input} from '@angular/core';
@Directive({
  selector: '[dayInput]'
})
export class DayInputDirective {
  private regex: RegExp = new RegExp(/^[0-9]{1,2}(\/([0-9]{1,2}(\/([0-9]{1,4})?)?)?)?$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = event['target']['value'];
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
