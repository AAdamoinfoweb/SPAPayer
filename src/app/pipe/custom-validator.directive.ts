import {Directive, forwardRef, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[customvalidator][ngModel],[customvalidator][ngFormControl]',
  providers: [{
    multi: true,
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CustomValidator)
  }]
})
export class CustomValidator implements Validator {

  @Input() customvalidator: ValidatorFn;

  validate(control: AbstractControl): { [key: string]: any; } {
    return this.customvalidator(control);
  }

}
