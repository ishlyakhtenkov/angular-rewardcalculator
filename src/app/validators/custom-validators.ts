import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        // check if string contains only whitespace
        if (control.value != null && (control.value.trim().length === 0)) {
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }

    static emailValidationPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
}