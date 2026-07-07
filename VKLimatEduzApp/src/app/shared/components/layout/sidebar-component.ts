// app/layout/sidebar.component.ts
import { ChangeDetectionStrategy, Component, HostListener, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
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
  isCollapsed = false;
  activeMenu: string = 'overview';
  activeSubMenu: string = '';
  expandedMenus: { [key: string]: boolean } = {
    'students': false,
    'id-cards': false,
    'library': false,
    'transport': false
  };
  selectedLabel: string = '';
  labelChanged: ((label: string) => void) | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private encryptionService: EncryptionService,
    private menuLabelService: MenuLabelService,
    private loadingMenuItemService: LoadingMenuItemService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      const items = this.loadingMenuItemService.menuItems();
      if (items && items.length) {
        items.forEach(item => {
          if (item.children && item.children.length) {
            if (!(item.key in this.expandedMenus)) {
              this.expandedMenus[item.key] = false;
            }
          }
        });
        this.cdr.markForCheck();
      }
    });
  }
  // If label$ is consumed, use signal: this.menuLabelService.label$()
  // Call this method to navigate to dashboard with encrypted key
  child: MenuItem | undefined;
  main: MenuItem | undefined;
  navigateToDashboard(menuKey: string) {
    const encryptedKey = this.encryptionService.encrypt(menuKey);
    // Find label for main or submenu
    let label = '';
     this.main = this.menuItems.find(item => item.key === menuKey);
    if (this.main) {
      label = this.main.label;     
    } else {
      for (const item of this.menuItems) {
         this.child = item.children?.find(c => c.key === menuKey);
        
        if (this.child) {
          label = this.child.label;
          break;
        }
      }
    }
    this.selectedLabel = label;
    this.menuLabelService.setLabel({ key: this.main?.label||this.child?.label||'' });
    console.log(this.main?.route,this.child?.route);
    if(this.child?.route?.includes('dashboard') || this.main?.route?.includes('dashboard'))
    this.router.navigate(['/mastersConfig/dashboard', encryptedKey]);
    else if(this.child?.route)
    this.router.navigate([this.child.route]);
    else if(this.main?.route)
    this.router.navigate([this.main.route]);
  }

  async ngOnInit(): Promise<void> {
    // fetch sidebar JSON from public folder (served as asset). Using absolute path so it works with different base href.
    this.loadingMenuItemService.setMenuItems();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubMenu(menuKey: string) {
    // Accordion behavior: collapse all other menus
    Object.keys(this.expandedMenus).forEach(key => {
      this.expandedMenus[key] = (key === menuKey) ? !this.expandedMenus[key] : false;
    });
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.activeSubMenu = '';
    const found = this.menuItems.find(item => item.key === menu);
    if (found) {
      this.selectedLabel = found.label;
      this.menuLabelService.setLabel(found);
    }
  }

  setActiveSubMenu(parentMenu: string, subMenu: string) {
    this.activeMenu = parentMenu;
    this.activeSubMenu = subMenu;
    const parent = this.menuItems.find(item => item.key === parentMenu);
    const child = parent?.children?.find(c => c.key === subMenu);
    if (child) {
      this.selectedLabel = child.label;
      this.menuLabelService.setLabel(child);
    }
  }

  isSubMenuActive(parentMenu: string, subMenuLabel: string): boolean {
    return this.activeMenu === parentMenu && this.activeSubMenu === subMenuLabel;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }
}