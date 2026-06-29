import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpPageComponent } from "./features/auth/pages/sign-up-page/sign-up-page.component";
import { NavbarComponent } from "./core/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignUpPageComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taskly-project';
}
