import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-module-switcher',
  templateUrl: './module-switcher.component.html',
  styleUrls: ['./module-switcher.component.scss']
})
export class ModuleSwitcherComponent {
  @Input() isModuleSwitcherOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModuleSwitcher() {
    this.close.emit();
  }
}
