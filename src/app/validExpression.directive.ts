import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ESnextParser } from 'espression';

const esParser = new ESnextParser(true);

@Directive({
  selector: '[validExpression]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidExpressionDirective, multi: true }],
})
export class ValidExpressionDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    try {
      const ast = esParser.parse(control.value);
      if (ast.type !== 'ObjectExpression')
        return { validExpression: { message: 'Context must be an Object' } };

      return null;
    } catch (e) {
      return { validExpression: { message: e.message } };
    }
  }
}
