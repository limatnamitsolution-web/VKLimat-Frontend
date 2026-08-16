import { Component, computed, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ConcessionDetailsView } from '../views/concession-details-view/concession-details-view';

@Component({
  selector: 'app-concession-details-tab',
  imports: [ConcessionDetailsView],
  templateUrl: './concession-details-tab.html',
  styleUrl: './concession-details-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConcessionDetailsTab {
  readonly searchTerm = signal('');
  readonly showView = signal(false);
  readonly rows = signal<Record<string, unknown>[]>([]);
  readonly displayedRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return term
      ? this.rows().filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term)))
      : this.rows();
  });

  updateSearch(event: Event): void { this.searchTerm.set((event.target as HTMLInputElement).value); }
  resetSearch(): void { this.searchTerm.set(''); }
  openAddView(): void { this.showView.set(true); }
  closeView(): void { this.showView.set(false); }
}
