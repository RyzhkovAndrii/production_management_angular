import {
  Pipe,
  PipeTransform
} from '@angular/core';
import {
  Decimal
} from 'decimal.js';

@Pipe({
  name: 'exponent'
})
export class ExponentPipe implements PipeTransform {

  transform(value: number, degree: number = -3, digits: number = 3): string {
    if (typeof value === "number") {
      const result = new Decimal(value).times(Math.pow(10, degree)); //value * Math.pow(10, degree);
      return result.toFixed(digits);
    }
    return value;
  }

}
