import { FormControl } from "@angular/forms";

export function integerValidator(control: FormControl) {
    if (control.value % 1 != 0) {
        return {
            'notIntegerError': true
        };
    }
    return null;
}