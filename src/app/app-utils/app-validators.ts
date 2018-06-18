import { FormControl } from "@angular/forms";
import Decimal from "decimal.js";

const DECIMAL_PLACES = 3; // todo common option

export function integerValidator(control: FormControl) {
    if (control.value % 1 != 0) {
        return {
            'notIntegerError': true
        };
    }
    return null;
}

export function validateDecimalPlaces(control: FormControl) {
    if (control.value && !new Decimal(control.value).times(Math.pow(10, DECIMAL_PLACES)).isInteger()) {
      return {
        'decimalPlacesError': true
      };
    }
    return null;
  }