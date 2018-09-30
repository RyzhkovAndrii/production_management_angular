import {
  FormControl
} from "@angular/forms";
import * as moment from "moment";
import Decimal from "decimal.js";

export function integerValidator(control: FormControl) {
  if (control.value % 1 != 0) {
    return {
      'notIntegerError': true
    };
  }
  return null;
}

export function validateDateNotAfterCurrent(control: FormControl) {
  if (control.value && moment(control.value, 'YYYY-MM-DD').isAfter(moment())) {
    return {
      'afterCurrentDateError': true
    };
  }
  return null;
}
export function newDecimalPlacesValidator(decimalPlaces: number): (control: FormControl) => any {
  const validator = (control: FormControl) => {
    if (control.value && !new Decimal(control.value).times(Math.pow(10, decimalPlaces)).isInteger()) {
      return {
        'decimalPlacesError': true
      };
    }
    return null;
  }
  return validator;
}
