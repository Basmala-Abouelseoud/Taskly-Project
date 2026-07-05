import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment.development';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService); 

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

  isLoading = false;

  createProject() {
    if (this.projectForm.invalid) return;

    this.isLoading = true;
    const body = this.projectForm.value;

 this.http.post(`${environment.baseUrl}/rest/v1/projects`, body, {
  headers: {
    'apikey': environment.supabaseAnonKey,
    'Authorization': `Bearer ${this.authService.getAccessToken()}`,
    'Content-Type': 'application/json',
  }
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.projectForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

isInvalid(controlName: string): boolean {
  const control = this.projectForm.get(controlName);
  return !!(control && control.invalid && (control.touched || control.dirty));
}
}
