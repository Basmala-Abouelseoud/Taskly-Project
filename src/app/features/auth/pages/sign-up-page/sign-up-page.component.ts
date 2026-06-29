import { Component } from '@angular/core';
import { SignUpFormComponent } from "../../components/sign-up-form/sign-up-form.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [SignUpFormComponent, NavbarComponent],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {

}
