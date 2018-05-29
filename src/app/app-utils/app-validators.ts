import { FormControl } from "@angular/forms";
import * as moment from "moment";

export function integerValidator(control: FormControl) {
    if (control.value % 1 != 0) {
        return {
            'notIntegerError': true
        };
    }
    return null;
}

export function validateDateNotAfterCurrent(control: FormControl) {
    if(control.value && moment(control.value, 'YYYY-MM-DD').isAfter(moment())) {
        return {
            'afterCurrentDateError': true
        };
    }
    return null;
  }