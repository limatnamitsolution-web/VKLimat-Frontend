// app/layout/header.component.ts
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { MenuLabelService } from '../../services/menu-label.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModuleSwitcherComponent } from "../module-switcher/module-switcher.component";
import { AppStateService } from '../../../core/services/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModuleSwitcherComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isThemeSwitcherOpen = false;
  isModuleSwitcherOpen = false;
  isProfileMenuOpen = false;
  currentTheme: string = 'light';
  private themeSubscription!: Subscription;
  selectedMenuLabel: string = '';
  selectedLabel=signal<string>('');
  readonly userFullName = computed(() => this.getFullUserName());
  readonly userInitials = computed(() => this.getUserInitials(this.userFullName()));

  constructor(
    private themeService: ThemeService,
    public menuLabelService: MenuLabelService,
    private cdr: ChangeDetectorRef,
    private appStateService: AppStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    // Use signal for menu label
    // this.selectedLabel.set(this.menuLabelService.label$().key);
    // console.log('Menu label signal:', this.selectedLabel());

  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    // No need to unsubscribe from signals
  }

  toggleThemeSwitcher(event: Event) {
    event.stopPropagation();
    this.isThemeSwitcherOpen = !this.isThemeSwitcherOpen;
  }

  @HostListener('document:click')
  closeThemeSwitcher() {
    this.isThemeSwitcherOpen = false;
    this.isProfileMenuOpen = false;
  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
    this.isThemeSwitcherOpen = false;
  }

  toggleModuleSwitcher() {
    this.isModuleSwitcherOpen = !this.isModuleSwitcherOpen;
  }

  closeModuleSwitcher() {
    this.isModuleSwitcherOpen = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.isProfileMenuOpen = false;
    this.appStateService.clearContextAndStorage();
    if (this.router) {
      this.router.navigate(['/login']);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.assign('/login');
    }
  }

  private getFullUserName(): string {
    const contextHeader = this.appStateService.getContextHeaderValue();

    if (!contextHeader) {
      return 'User';
    }

    try {
      const context = JSON.parse(contextHeader) as { userName?: string | null };
      const fullName = context.userName?.trim();
      return fullName && fullName.length > 0 ? fullName : 'User';
    } catch {
      return 'User';
    }
  }

  private getUserInitials(fullName: string): string {
    const nameParts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (nameParts.length >= 2) {
      const firstInitial = nameParts[0][0] ?? '';
      const lastInitial = nameParts[nameParts.length - 1][0] ?? '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    if (nameParts.length === 1) {
      return nameParts[0].slice(0, 2).toUpperCase();
    }

    return 'US';
  }
}