import { Component } from '@angular/core';
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, NavbarComponent, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

}
