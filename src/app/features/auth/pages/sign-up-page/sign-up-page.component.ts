import { Component } from '@angular/core';
import { SignUpFormComponent } from "../../components/sign-up-form/sign-up-form.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [SignUpFormComponent, NavbarComponent, RouterLink],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {

}
