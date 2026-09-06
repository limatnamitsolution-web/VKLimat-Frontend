import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private msgSvc = inject(MessageService);
  message = this.msgSvc.message;

  visible = computed(() => !!this.message());

  constructor() {
    effect(() => {
      // keep component reactive; no-op body
      this.message();
    });
  }

  close(): void {
    this.msgSvc.clear();
  }
}
