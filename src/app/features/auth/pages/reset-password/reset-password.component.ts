import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthInputComponent } from "../../components/auth-input/auth-input.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthInputComponent, NavbarComponent],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  resetForm!: FormGroup;
  accessToken: string = '';
  isValidLink: boolean = false;
  successMessage: string = '';
  errorMessage = '';

  constructor() {
    this.initForm();
  }

  initForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMismatch });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.accessToken = params['access_token'] || '';
      this.isValidLink = params['type'] === 'recovery' && !!this.accessToken;
      
      if (!this.isValidLink) {
        console.log("invalid link");
      }
    });
  }

passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';

  if (!value) return null;

  if (/\s/.test(value))
    return { hasWhitespace: true };

  if (!/[A-Z]/.test(value))
    return { noUppercase: true };

  if (!/[a-z]/.test(value))
    return { noLowercase: true };

  if (!/\d/.test(value))
    return { noDigit: true };

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    return { noSpecial: true };

  return null;
}


private get pwValue(): string {
  return this.resetForm.get('password')?.value ?? '';
}

get pwMinLength() {
  return this.pwValue.length >= 8;
}

get pwUppercase() {
  return /[A-Z]/.test(this.pwValue);
}

get pwLowercase() {
  return /[a-z]/.test(this.pwValue);
}

get pwDigit() {
  return /\d/.test(this.pwValue);
}

get pwSpecial() {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.pwValue);
}

get passwordRules() {
  return [
    {
      label: '8 - 64 characters',
      met: this.pwMinLength,
    },
    {
      label: 'Uppercase letter',
      met: this.pwUppercase,
    },
    {
      label: 'Lowercase letter',
      met: this.pwLowercase,
    },
    {
      label: 'One digit',
      met: this.pwDigit,
    },
    {
      label: 'Special character',
      met: this.pwSpecial,
    },
  ];
}

  
passwordMismatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirmPassword')?.value
    ? null
    : { passwordMismatch: true };
}

submitNewPassword() {
  if (this.resetForm.invalid) {
    this.resetForm.markAllAsTouched();
    return;
  }

  this.errorMessage = '';

  this.authService.updatePassword(this.resetForm.value.password, this.accessToken).subscribe({
    next: () => {
      this.successMessage =
        'Your password has been updated successfully. You can now log in';
      setTimeout(() => this.router.navigate(['/login']), 3000);
    },

    error: (error) => {
      switch (error.error?.error_code) {
        case 'same_password':
          this.errorMessage =
            'Your new password must be different from your current password.';
          break;

        default:
          this.errorMessage =
            error.error?.msg || 'Something went wrong. Please try again.';
      }
    }
  });
}
}