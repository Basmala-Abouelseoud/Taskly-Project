import { Component } from '@angular/core';
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, NavbarComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

}
