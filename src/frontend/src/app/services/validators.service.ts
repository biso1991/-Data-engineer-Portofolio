import { Injectable } from '@angular/core'
import { AbstractControl, ValidationErrors } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  constructor() {}

  passwordMatch(password: string, confirmPassword: string, action: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password)
      const confirmPasswordControl = formGroup.get(confirmPassword)

      if (!passwordControl || !confirmPasswordControl) {
        return null
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null
      }

      if (
        passwordControl.value !== confirmPasswordControl.value &&
        action === 'match'
      ) {
        confirmPasswordControl.setErrors({ passwordMismatch: true })
        return { passwordMismatch: true }
      } else if (
        passwordControl.value === confirmPasswordControl.value &&
        action === 'mismatch'
      ) {
        confirmPasswordControl.setErrors({ passwordmatch: true })
        return { passwordmatch: true }
      } else {
        confirmPasswordControl.setErrors(null)
        return null
      }
    }
  }
}
