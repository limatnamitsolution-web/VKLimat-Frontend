import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SearchableDropdownOption {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true,
    },
  ],
  template: `
    <div class="searchable-dropdown" [class.open]="isOpen" [class.disabled]="disabled">
      <button
        type="button"
        class="dropdown-trigger"
        [disabled]="disabled"
        [attr.aria-expanded]="isOpen"
        aria-haspopup="listbox"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)">
        <span [class.placeholder]="!selectedOption">{{ selectedOption?.name || placeholder }}</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>

      @if (isOpen) {
        <div class="dropdown-panel">
          <div class="search-box">
            <span class="search-icon" aria-hidden="true"></span>
            <input
              #searchInput
              type="search"
              [value]="searchTerm"
              [placeholder]="searchPlaceholder"
              aria-label="Search options"
              autocomplete="off"
              (input)="filterOptions($event)"
              (keydown)="onSearchKeydown($event)">
          </div>
          <div class="options" role="listbox">
            @if (allowClear && value !== null && value !== undefined && value !== '') {
              <button type="button" class="option clear-option" (click)="selectValue(null)">
                {{ placeholder }}
              </button>
            }
            @for (option of filteredOptions; track option.id; let index = $index) {
              <button
                type="button"
                class="option"
                role="option"
                [class.active]="index === activeIndex"
                [class.selected]="option.id === value"
                [attr.aria-selected]="option.id === value"
                (mouseenter)="activeIndex = index"
                (click)="selectOption(option)">
                {{ option.name }}
              </button>
            } @empty {
              <div class="empty-state">No options found</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }

    .searchable-dropdown {
      position: relative;
      width: 100%;
    }

    .dropdown-trigger {
      width: 100%;
      min-width: 0;
      min-height: 27px;
      padding: 4px 28px 4px 8px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      background: var(--surface);
      font: inherit;
      font-size: 0.8rem;
      text-align: left;
      cursor: pointer;
      position: relative;
    }

    .dropdown-trigger:focus,
    .open .dropdown-trigger {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-blue) 18%, transparent);
    }

    .placeholder,
    .empty-state {
      color: var(--text-2);
    }

    .chevron {
      position: absolute;
      top: 50%;
      right: 10px;
      width: 6px;
      height: 6px;
      border-right: 1.5px solid currentColor;
      border-bottom: 1.5px solid currentColor;
      transform: translateY(-65%) rotate(45deg);
      transition: transform 0.15s ease;
    }

    .open .chevron {
      transform: translateY(-25%) rotate(225deg);
    }

    .dropdown-panel {
      position: absolute;
      z-index: 100;
      top: calc(100% + 4px);
      left: 0;
      width: max(100%, 190px);
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      box-shadow: var(--shadow-3);
    }

    .search-box {
      position: relative;
      padding: 6px;
      border-bottom: 1px solid var(--border);
    }

    .search-box input {
      width: 100%;
      box-sizing: border-box;
      padding: 5px 8px 5px 27px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      background: var(--surface);
      font: inherit;
      font-size: 0.8rem;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary-blue);
    }

    .search-icon {
      position: absolute;
      z-index: 1;
      top: 14px;
      left: 16px;
      width: 8px;
      height: 8px;
      border: 1.5px solid var(--text-2);
      border-radius: 50%;
      pointer-events: none;
    }

    .search-icon::after {
      content: '';
      position: absolute;
      width: 5px;
      border-top: 1.5px solid var(--text-2);
      transform: rotate(45deg);
      transform-origin: left center;
      left: 7px;
      top: 8px;
    }

    .options {
      max-height: 190px;
      overflow-y: auto;
      padding: 4px;
    }

    .option {
      display: block;
      width: 100%;
      padding: 6px 8px;
      border: 0;
      border-radius: 3px;
      color: var(--text);
      background: transparent;
      font: inherit;
      font-size: 0.8rem;
      text-align: left;
      cursor: pointer;
    }

    .option:hover,
    .option.active {
      background: var(--muted-surface);
    }

    .option.selected {
      color: var(--primary-blue);
      font-weight: 600;
    }

    .clear-option {
      color: var(--text-2);
      border-bottom: 1px solid var(--border);
      margin-bottom: 3px;
    }

    .empty-state {
      padding: 10px 8px;
      font-size: 0.8rem;
      text-align: center;
    }

    .disabled {
      opacity: 0.65;
    }

    .disabled .dropdown-trigger {
      cursor: not-allowed;
    }
  `,
})
export class SearchableDropdownComponent implements ControlValueAccessor {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @Input() placeholder = 'Select';
  @Input() searchPlaceholder = 'Search...';
  @Input() allowClear = true;

  @Input()
  set options(options: SearchableDropdownOption[] | null | undefined) {
    this._options = options ?? [];
    this.applyFilter();
  }

  get selectedOption(): SearchableDropdownOption | undefined {
    return this._options.find(option => option.id === this.value);
  }

  filteredOptions: SearchableDropdownOption[] = [];
  searchTerm = '';
  activeIndex = 0;
  isOpen = false;
  disabled = false;
  value: number | string | null = null;

  private _options: SearchableDropdownOption[] = [];
  private onChange: (value: number | string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  writeValue(value: number | string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.close();
    }
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    this.isOpen = true;
    this.searchTerm = '';
    this.applyFilter();
    this.activeIndex = Math.max(0, this.filteredOptions.findIndex(option => option.id === this.value));
    setTimeout(() => this.searchInput?.nativeElement.focus());
  }

  close(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.onTouched();
  }

  filterOptions(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
    this.activeIndex = 0;
  }

  selectOption(option: SearchableDropdownOption): void {
    this.selectValue(option.id);
  }

  selectValue(value: number | string | null): void {
    this.value = value;
    this.onChange(value);
    this.close();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, this.filteredOptions.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (event.key === 'Enter' && this.filteredOptions[this.activeIndex]) {
      event.preventDefault();
      this.selectOption(this.filteredOptions[this.activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    this.filteredOptions = term
      ? this._options.filter(option => option.name.toLocaleLowerCase().includes(term))
      : [...this._options];
  }
}