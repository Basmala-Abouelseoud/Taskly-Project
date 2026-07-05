import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment && fragment.includes('type=recovery')) {
        const params = new URLSearchParams(fragment);
        
        this.router.navigate(['/reset-password'], { 
          queryParams: { 
            access_token: params.get('access_token'), 
            type: 'recovery' 
          } 
        });
      }
    });
  }
}