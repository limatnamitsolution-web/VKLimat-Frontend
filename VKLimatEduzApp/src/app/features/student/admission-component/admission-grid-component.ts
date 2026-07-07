import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admission-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admission-grid-component.html',
  styleUrls: ['./admission-grid-component.scss']
})
export class AdmissionGridComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() title: string = 'Admission Grid';
  @Input() hideHeader: boolean = false;
  @Output() modify = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();

  filteredData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: Array<{ value: number; label: string }> = [];
  totalPages: number = 1;
  searchText: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedItem: any = null;
  Math = Math;

  ngOnInit() {
    this.filterData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filterData();
    }
  }

  filterData() {
    let result = [...this.data];
    // Apply search filter
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      result = result.filter(row =>
        (row.AdmNo || '').toLowerCase().includes(searchLower) ||
        (row.AdmDate || '').toLowerCase().includes(searchLower) ||
        (row.DOB || '').toLowerCase().includes(searchLower) ||
        (row.Student || '').toLowerCase().includes(searchLower) ||
        (row.Class || '').toLowerCase().includes(searchLower) ||
        (row.Sec || '').toLowerCase().includes(searchLower) ||
        (row.Father || '').toLowerCase().includes(searchLower) ||
        (row.Mother || '').toLowerCase().includes(searchLower) ||
        (row.F_MobileNo || '').toLowerCase().includes(searchLower) ||
        (row.M_MobileNo || '').toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (this.sortColumn) {
      result.sort((a, b) => {
        let aValue: any = a[this.sortColumn];
        let bValue: any = b[this.sortColumn];
        if (this.sortColumn === 'index') {
          aValue = this.data.indexOf(a);
          bValue = this.data.indexOf(b);
        }
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredData = result;
    this.updatePageSizeOptions();
    this.updatePagination();
  }

  updatePageSizeOptions() {
    const total = this.filteredData.length;
    const base = [10, 20, 50];
    const opts: Array<{ value: number; label: string }> = [];
    opts.push({ value: 10, label: '10' });
    base.forEach((n) => {
      if (n > 10 && n < total) opts.push({ value: n, label: n.toString() });
    });
    if (total > 0 && !opts.find((o) => o.value === total)) {
      const label = total === base[base.length - 1] ? total.toString() : 'All';
      opts.push({ value: total, label });
    }
    this.pageSizeOptions = opts;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterData();
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredData.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  onSearch() {
    this.currentPage = 1;
    this.filterData();
  }

  onModify(item: any) {
    this.modify.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }
}
