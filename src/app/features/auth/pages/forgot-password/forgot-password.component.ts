import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthInputComponent } from "../../components/auth-input/auth-input.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component"; 
import { map, take, timer } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthInputComponent, NavbarComponent],
  templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'

})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
private readonly cdr = inject(ChangeDetectorRef); // مهم لتحديث الواجهة

  emailForm: FormGroup;
  showSuccessMessage = false;
  showResendSection = false;
  isButtonDisabled = false;
  timer = 300; 

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  
  sendResetLink() {
    if (this.emailForm.invalid) return;

    this.isButtonDisabled = true;
    
    this.authService.forgotPassword(this.emailForm.value.email).subscribe({
      next: () => this.handleState(),
      error: () => this.handleState()
    });
  }

  private handleState() {
    this.showSuccessMessage = true;
    this.showResendSection = true;
    this.startTimer();
  }

timer$ = timer(0, 1000); 
  timeLeft = 300; 

  startTimer() {
    this.isButtonDisabled = true;
    this.timeLeft = 300;

    timer(0, 1000).pipe(
      take(301), 
      map(i => 300 - i)
    ).subscribe({
      next: (val) => {
        this.timeLeft = val;
      },
      complete: () => {
        this.isButtonDisabled = false;
        this.showResendSection = false;
        this.showSuccessMessage = false;

      }
    });
  }
}