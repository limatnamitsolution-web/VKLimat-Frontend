// app/layout/layout.component.ts
import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header-component";
import { SidebarComponent } from "./sidebar-component";
import { LoaderComponent } from '../loader/loader.component';
import { MenuLabelService } from '../../services/menu-label.service';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, LoaderComponent],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.scss']
})
export class LayoutComponent implements OnInit {
  private menuLabelService = inject(MenuLabelService);
  readonly pageName = computed(() => this.menuLabelService.label$().key?.trim() || 'Dashboard');

  ngOnInit() {
    // Initialize global state here (e.g., from API or LocalStorage)
  }
}