// app/layout/sidebar.component.ts
import { ChangeDetectionStrategy, Component, HostListener, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncryptionService } from '../../services/encryption.service';
import { MenuLabelService } from '../../services/menu-label.service';
import { LoadingMenuItemService } from '../../services/loading-menu-item.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-component.html',
  styleUrls : ['./sidebar-component.scss']
})
export class SidebarComponent implements OnInit {
  // Use signal from LoadingMenuItemService
  get menuItems(): MenuItem[] {
    return this.loadingMenuItemService.getMenuItems();
  }
  readonly isCollapsed = signal(false);
  readonly activeMenu = signal('overview');
  readonly activeSubMenu = signal('');
  readonly expandedMenus = signal<Record<string, boolean>>({
    'students': false,
    'id-cards': false,
    'library': false,
    'transport': false
  });
  readonly selectedLabel = signal('');

  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private menuLabelService: MenuLabelService,
    private loadingMenuItemService: LoadingMenuItemService
  ) {
    effect(() => {
      const items = this.loadingMenuItemService.menuItems();
      if (items && items.length) {
        this.expandedMenus.update(current => {
          const expanded = { ...current };
          items.forEach(item => {
          if (item.children && item.children.length) {
              expanded[item.key] ??= false;
            }
          });
          return expanded;
        });
      }
    });
  }
  // If label$ is consumed, use signal: this.menuLabelService.label$()
  // Call this method to navigate to dashboard with encrypted key
  navigateToDashboard(menuKey: string) {
    const encryptedKey = this.encryptionService.encrypt(menuKey);
    // Find label for main or submenu
    let label = '';
    const main = this.menuItems.find(item => item.key === menuKey);
    let child: MenuItem | undefined;
    if (main) {
      label = main.label;
    } else {
      for (const item of this.menuItems) {
        child = item.children?.find(candidate => candidate.key === menuKey);
        if (child) {
          label = child.label;
          break;
        }
      }
    }
    this.selectedLabel.set(label);
    this.menuLabelService.setLabel({ key: main?.label || child?.label || '' });
    console.log(main?.route, child?.route);
    if(child?.route?.includes('dashboard') || main?.route?.includes('dashboard'))
    this.router.navigate(['/mastersConfig/dashboard', encryptedKey]);
    else if(child?.route)
    this.router.navigate([child.route]);
    else if(main?.route)
    this.router.navigate([main.route]);
  }

  async ngOnInit(): Promise<void> {
    // fetch sidebar JSON from public folder (served as asset). Using absolute path so it works with different base href.
    this.loadingMenuItemService.setMenuItems();
  }

  toggleSidebar() {
    this.isCollapsed.update(collapsed => !collapsed);
  }

  toggleSubMenu(menuKey: string) {
    // Accordion behavior: collapse all other menus
    this.expandedMenus.update(current => {
      const expanded: Record<string, boolean> = {};
      Object.keys(current).forEach(key => {
        expanded[key] = key === menuKey ? !current[key] : false;
      });
      return expanded;
    });
  }

  setActiveMenu(menu: string) {
    this.activeMenu.set(menu);
    this.activeSubMenu.set('');
    const found = this.menuItems.find(item => item.key === menu);
    if (found) {
      this.selectedLabel.set(found.label);
      this.menuLabelService.setLabel(found);
    }
  }

  setActiveSubMenu(parentMenu: string, subMenu: string) {
    this.activeMenu.set(parentMenu);
    this.activeSubMenu.set(subMenu);
    const parent = this.menuItems.find(item => item.key === parentMenu);
    const child = parent?.children?.find(c => c.key === subMenu);
    if (child) {
      this.selectedLabel.set(child.label);
      this.menuLabelService.setLabel(child);
    }
  }

  isSubMenuActive(parentMenu: string, subMenuLabel: string): boolean {
    return this.activeMenu() === parentMenu && this.activeSubMenu() === subMenuLabel;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.isCollapsed()) {
      this.isCollapsed.set(true);
    }
  }
}