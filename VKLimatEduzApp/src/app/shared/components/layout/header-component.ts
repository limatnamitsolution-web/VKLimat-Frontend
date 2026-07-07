// app/layout/header.component.ts
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { MenuLabelService } from '../../services/menu-label.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModuleSwitcherComponent } from "../module-switcher/module-switcher.component";
import { sign } from 'crypto';

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
  currentTheme: string = 'light';
  private themeSubscription!: Subscription;
  selectedMenuLabel: string = '';
  selectedLabel=signal<string>('');

  constructor(
    private themeService: ThemeService,
    public menuLabelService: MenuLabelService,
    private cdr: ChangeDetectorRef
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
}