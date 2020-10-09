import {Directive, ElementRef, HostListener} from '@angular/core';
@Directive({
  selector: '[integerNumber]'
})
export class IntegerNumberDirective {
  private regex: RegExp = new RegExp(/^[1-9]{1,1}[0-9]*$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
