import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator for only characters
export function onlyCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[A-Za-z]*$/.test(control.value);
    return valid ? null : { onlyCharacters: true };
  };
}

// Validator for only alphanumeric characters
export function alphanumericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[A-Za-z0-9]*$/.test(control.value);
    return valid ? null : { alphanumeric: true };
  };
}

// Validator for alphanumeric characters with '@' symbol
export function alphanumericWithAtValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[A-Za-z0-9@]*$/.test(control.value);
    return valid ? null : { alphanumericWithAt: true };
  };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(control.value);
      return valid ? null : { email: true };
    };
  }
