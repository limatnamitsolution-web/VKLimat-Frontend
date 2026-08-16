import { computed, Directive, signal } from '@angular/core';

export function createFeeGridTabState<T extends object = Record<string, unknown>>() {
  const searchTerm = signal('');
  const showView = signal(false);
  const rows = signal<T[]>([]);
  const filteredRows = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term
      ? rows().filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term)))
      : rows();
  });

  return {
    searchTerm,
    showView,
    rows,
    filteredRows,
    updateSearch: (event: Event) => searchTerm.set((event.target as HTMLInputElement).value),
    resetSearch: () => searchTerm.set(''),
    openAddView: () => showView.set(true),
    closeView: () => showView.set(false)
  };
}

@Directive()
export abstract class FeeGridTab<T extends object = Record<string, unknown>> {
  readonly searchTerm = signal('');
  readonly showView = signal(false);
  readonly rows = signal<T[]>([]);
  readonly filteredRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.rows();
    }

    return this.rows().filter(row =>
      Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term))
    );
  });

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  resetSearch(): void {
    this.searchTerm.set('');
  }

  openAddView(): void {
    this.showView.set(true);
  }

  closeView(): void {
    this.showView.set(false);
  }
}