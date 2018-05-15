import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'exponent'
})
export class ExponentPipe implements PipeTransform {

  transform(value: number, degree: number = -3, digits: number = 3): string {
    if (typeof value === "number") {
      const newLocal = value * Math.pow(10, degree);
      return (newLocal).toFixed(digits);
    }
    return value;
  }

}
