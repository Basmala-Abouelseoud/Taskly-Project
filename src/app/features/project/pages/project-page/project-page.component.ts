import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Project } from '../../interfaces/project';
import { ProjectServiceService } from '../../services/project-service.service';


@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl:'./project-page.component.html',
  styleUrl: './project-page.component.css',
})
export class ProjectPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private projectService = inject(ProjectServiceService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private elRef = inject(ElementRef<HTMLElement>);

  @ViewChild('scrollSentinel') scrollSentinel?: ElementRef<HTMLElement>;

onProjectClick(projectId: string) {
  this.router.navigate(['/project', projectId, 'epics']);
}

  readonly pageSize = 5;
  readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  projects = signal<Project[]>([]);
  isLoading = signal(true); 
  isLoadingMore = signal(false); 
  error = signal<string | null>(null);

  currentPage = signal(1);
  totalCount = signal(0);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize)));

  isMobile = signal(false);

  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (e: MediaQueryListEvent) => void;
  private observer?: IntersectionObserver;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(max-width: 1023px)');
      this.isMobile.set(this.mediaQuery.matches);
      this.mediaQueryListener = (e) => this.isMobile.set(e.matches);
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    }

    this.fetchPage(1, false);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }

  fetchProjects() {
    this.fetchPage(this.currentPage(), false);
  }

  private fetchPage(page: number, append: boolean) {
    const offset = (page - 1) * this.pageSize;

    if (append) {
      this.isLoadingMore.set(true);
    } else {
      this.isLoading.set(true);
    }
    this.error.set(null);

    this.projectService.getProjects(this.pageSize, offset).subscribe({
      next: ({ data, total }) => {
        this.totalCount.set(total);
        this.currentPage.set(page);

        if (append) {
          this.projects.update((current) => [...current, ...data]);
        } else {
          this.projects.set(data);
        }

        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);

        if (err.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.error.set('Failed to load projects');
      },
    });
  }

  // ============ Desktop: numbered pagination ============
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.fetchPage(page, false);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  // ============ Mobile: infinite scroll ============
  private setupInfiniteScroll() {
    const sentinelEl = this.scrollSentinel?.nativeElement;
    if (!sentinelEl) return;

   
    const root = this.findScrollParent(this.elRef.nativeElement);

    this.observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (
          isVisible &&
          this.isMobile() &&
          !this.isLoading() &&
          !this.isLoadingMore() &&
          !this.error() &&
          this.currentPage() < this.totalPages()
        ) {
          this.fetchPage(this.currentPage() + 1, true);
        }
      },
      { root, threshold: 0.1 }
    );

    this.observer.observe(sentinelEl);
  }

  private findScrollParent(el: HTMLElement | null): HTMLElement | null {
    let node = el?.parentElement ?? null;
    while (node) {
      const style = getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY)) return node;
      node = node.parentElement;
    }
    return null; 
  }
}