import { Directive, output, Input } from '@angular/core';

export interface TransFeeMasterField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

@Directive()
export abstract class TransFeeMasterView {
  abstract readonly title: string;
  abstract readonly fields: TransFeeMasterField[];

  readonly close = output<void>();
  readonly saved = output<Record<string, string | number>>();
  @Input()
  model: Record<string, string | number> = {};

  submit(): void {
    this.saved.emit({ ...this.model });
  }
}