import { Directive, output } from '@angular/core';

export interface FeeMasterField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

@Directive()
export abstract class FeeMasterView {
  abstract readonly title: string;
  abstract readonly fields: FeeMasterField[];

  readonly close = output<void>();
  readonly saved = output<Record<string, string | number>>();
  readonly model: Record<string, string | number> = {};

  submit(): void {
    this.saved.emit({ ...this.model });
  }
}