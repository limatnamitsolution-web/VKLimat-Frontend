// modules/fee/fee-layout.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fee-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="fee-module">
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeLayoutComponent { }