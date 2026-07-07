import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MenuLabelService {
  labelSubject = signal<MenuDisplay>({
    key: '',
  });

  label$ = this.labelSubject;

  setLabel(labelKey: MenuDisplay) {
    this.labelSubject.set(labelKey);
  }
}
