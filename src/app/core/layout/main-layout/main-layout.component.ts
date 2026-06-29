import { Component, signal, computed, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthResponse, AuthUser } from '../../../features/auth/interfaces/auth';
import { AuthService } from '../../../features/auth/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  styleUrl: './main-layout.component.css',
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<AuthUser | null>(null);
  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);
  avatarDropdownOpen = signal(false);
  logoutError = signal<string | null>(null);
  isLoggingOut = signal(false);

  navItems: NavItem[] = [
    { label: 'Projects',        icon: 'fa-solid fa-folder',      route: '/projects' },
    { label: 'Project Epics',   icon: 'fa-solid fa-layer-group', route: '/epics' },
    { label: 'Project Tasks',   icon: 'fa-solid fa-list-check',  route: '/tasks' },
    { label: 'Project Members', icon: 'fa-solid fa-users',       route: '/members' },
    { label: 'Project Details', icon: 'fa-solid fa-circle-info', route: '/details' },
  ];

  userName = computed(() =>
    this.user()?.user_metadata?.name || this.user()?.email || 'User'
  );

  userTitle = computed(() =>
    this.user()?.user_metadata?.job_title || ''
  );

  userInitials = computed(() => {
    const name = this.user()?.user_metadata?.name || this.user()?.email || '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0]?.slice(0, 2) || 'U').toUpperCase();
  });

  ngOnInit() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const stored = localStorage.getItem('auth_response');
    if (stored) {
      const authResponse: AuthResponse = JSON.parse(stored);
      this.user.set(authResponse.user);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  toggleAvatarDropdown() {
    this.avatarDropdownOpen.update((v) => !v);
    this.logoutError.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#avatar-menu')) {
      this.avatarDropdownOpen.set(false);
    }
  }

  logout() {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.logoutError.set(null);

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoggingOut.set(false);
        this.logoutError.set('Logout failed, please try again.');
      },
    });
  }
}