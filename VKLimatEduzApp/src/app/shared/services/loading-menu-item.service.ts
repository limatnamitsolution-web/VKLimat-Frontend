import { Injectable, signal } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class LoadingMenuItemService {
  constructor(private http: HttpClient) {}
  // Signal array for menu items
   menuItems = signal<MenuItem[]>([]);

  async setMenuItems() {

      this.http.get<MenuItem[]>('/Frontdesk.json').subscribe({
      next: async (data) => {
    this.menuItems.set(data || []);               
      },
      error: (err) => {
        // silent fallback: keep hard-coded behavior if fetch fails
        console.error('Failed to load sidebar-data.json', err);
      }
    });

    // Simulate async if needed, e.g., for future API or storage
   
    return Promise.resolve();
  }

  getMenuItems() {
    return this.menuItems();
  }
}
