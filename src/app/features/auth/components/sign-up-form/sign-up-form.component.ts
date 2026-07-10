import {Component, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule, AuthInputComponent, CommonModule, RouterLink],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css',
})
export class SignUpFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  redirectCounter = 3;
  labelName = 'Full Name'; 

  signUpForm!: FormGroup;

  constructor() {
    this.updateLabel(window.innerWidth);
    this.initSignUpForm();
  }

@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateLabel(event.target.innerWidth);
  }

  private updateLabel(width: number) {
    this.labelName = width >= 640 ? 'Name' : 'Full Name';
  }




  initSignUpForm(): void {
    this.signUpForm = this.fb.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.nameValidator.bind(this)]],
        email: [null, [Validators.required, Validators.email]],
        jobTitle: [null],
        password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(64), this.passwordValidator.bind(this)]],
        confirmPassword: [null, [Validators.required]],
      },
      { validators: this.passwordMismatch.bind(this) }
    );

    this.signUpForm.get('password')?.valueChanges.subscribe(() => {
      this.signUpForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.signUpForm.get(controlName);
    if (!control || !control.touched || !control.invalid) return null;

    const errors = control.errors;
    if (errors?.['required']) return 'This field is required.';
    if (errors?.['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters.`;
    if (errors?.['email']) return 'Invalid email format.';
    if (errors?.['hasNumber']) return 'Name cannot contain numbers.';
    if (errors?.['hasSpecial']) return 'Name cannot contain special characters.';
    if (errors?.['multiSpace']) return 'No consecutive spaces allowed.';
    if (errors?.['invalidName']) return 'Invalid name format.';
    if (errors?.['passwordMismatch']) return 'Passwords do not match.';
    
    return 'Invalid input.';
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (!value) return null;
    if (/\d/.test(value)) return { hasNumber: true };
    if (/[!@#$%^&*()\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return { hasSpecial: true };
    if (/  /.test(value)) return { multiSpace: true };
    if (!/^[\p{L}]+([ ][\p{L}]+)*$/u.test(value)) return { invalidName: true };
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (!value) return null;
    if (/\s/.test(value)) return { hasWhitespace: true };
    if (!/[A-Z]/.test(value)) return { noUppercase: true };
    if (!/[a-z]/.test(value)) return { noLowercase: true };
    if (!/\d/.test(value)) return { noDigit: true };
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return { noSpecial: true };
    return null;
  }

  passwordMismatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.signUpForm.get('confirmPassword');
  }

  private get pwValue(): string { return this.signUpForm.get('password')?.value ?? ''; }
  get pwMinLength(): boolean { return this.pwValue.length >= 8; }
  get pwUppercase(): boolean { return /[A-Z]/.test(this.pwValue); }
  get pwLowercase(): boolean { return /[a-z]/.test(this.pwValue); }
  get pwDigit(): boolean     { return /\d/.test(this.pwValue); }
  get pwSpecial(): boolean   { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.pwValue); }

submitData(): void {
    if (this.isLoading || this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { name, email, password, jobTitle } = this.signUpForm.value;
    
    this.authService.signUp({ email, password, data: { name, job_title: jobTitle || undefined } }).subscribe({
      next: () => {

        this.isLoading = false;
        this.router.navigateByUrl('/login');
      },
error: (error: HttpErrorResponse) => {
  this.isLoading = false;
  if (error.error?.error_code === 'user_already_exists') {
    this.errorMessage = 'This email is already registered. Please sign in instead.';
  } else {
    this.errorMessage = error.error?.msg || 'Something went wrong. Please try again.';
  }
},
    });
  }

get passwordRules() {
  return [
    { label: 'At least 8 characters',  met: this.pwMinLength },
    { label: 'One uppercase letter',    met: this.pwUppercase },
    { label: 'One lowercase letter',    met: this.pwLowercase },
    { label: 'One digit',               met: this.pwDigit },
    { label: 'One special character',   met: this.pwSpecial },
  ];
}
}