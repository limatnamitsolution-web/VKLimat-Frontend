import { computed, Directive, signal } from '@angular/core';

export function createFeeGridTabState<T extends object = Record<string, unknown>>() {
  const searchTerm = signal('');
  const showView = signal(false);
  const rows = signal<T[]>([]);
  const pageSize = signal(10);
  const currentPage = signal(1);
  const filteredRows = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term
      ? rows().filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term)))
      : rows();
  });
  const totalPages = computed(() => Math.ceil(filteredRows().length / pageSize()));
  const displayPage = computed(() => Math.max(1, Math.min(currentPage(), totalPages() || 1)));
  const paginatedRows = computed(() => {
    const startIndex = (displayPage() - 1) * pageSize();
    return filteredRows().slice(startIndex, startIndex + pageSize());
  });
  const startEntry = computed(() => filteredRows().length > 0 ? (displayPage() - 1) * pageSize() + 1 : 0);
  const endEntry = computed(() => Math.min(displayPage() * pageSize(), filteredRows().length));
  const pageSizeOptions = computed(() => {
    const total = filteredRows().length;
    const options = [{ value: 10, label: '10' }];

    [20, 50].forEach(value => {
      if (value < total) {
        options.push({ value, label: String(value) });
      }
    });

    if (total > 0 && !options.some(option => option.value === total)) {
      options.push({ value: total, label: total === 50 ? '50' : 'All' });
    }

    return options;
  });

  return {
    searchTerm,
    showView,
    rows,
    filteredRows,
    pageSize,
    currentPage: displayPage,
    totalPages,
    paginatedRows,
    startEntry,
    endEntry,
    pageSizeOptions,
    updateSearch: (event: Event) => {
      searchTerm.set((event.target as HTMLInputElement).value);
      pageSize.set(10);
      currentPage.set(1);
    },
    resetSearch: () => {
      searchTerm.set('');
      pageSize.set(10);
      currentPage.set(1);
    },
    previousPage: () => currentPage.set(Math.max(1, displayPage() - 1)),
    nextPage: () => currentPage.set(Math.min(totalPages(), displayPage() + 1)),
    resetPagination: () => {
      pageSize.set(10);
      currentPage.set(1);
    },
    changePageSize: (event: Event) => {
      const selectedSize = Number((event.target as HTMLSelectElement).value);
      if (Number.isInteger(selectedSize) && selectedSize > 0) {
        pageSize.set(selectedSize);
        currentPage.set(1);
      }
    },
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