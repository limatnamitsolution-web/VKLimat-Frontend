// app/layout/layout.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header-component";
import { SidebarComponent } from "./sidebar-component";
import { LoaderComponent } from '../loader/loader.component';
import { AppStateService } from '../../../core/services/app-state.service';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, LoaderComponent],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.scss']
})
export class LayoutComponent implements OnInit {
  private appState = inject(AppStateService);

  ngOnInit() {
    // Initialize global state here (e.g., from API or LocalStorage)
  }
}