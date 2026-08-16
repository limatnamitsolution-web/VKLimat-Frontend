import { Component, computed, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { LateFineAttendanceView } from '../views/late-fine-attendance-view/late-fine-attendance-view';

@Component({
  selector: 'app-late-fine-attendance-tab',
  imports: [LateFineAttendanceView],
  templateUrl: './late-fine-attendance-tab.html',
  styleUrl: './late-fine-attendance-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFineAttendanceTab {
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
