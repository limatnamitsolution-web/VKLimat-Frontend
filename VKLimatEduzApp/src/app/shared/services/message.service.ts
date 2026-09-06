import { Injectable, signal, Signal } from '@angular/core';

export type MessageType = 'success' | 'error' | 'info';

export interface MessagePayload {
  text: string;
  type: MessageType;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private _message = signal<MessagePayload | null>(null);

  readonly message: Signal<MessagePayload | null> = this._message;

  show(text: string, type: MessageType = 'info', timeoutMs = 3000) {
    this._message.set({ text, type });
    if (timeoutMs > 0) {
      setTimeout(() => this.clear(), timeoutMs);
    }
  }

  clear() {
    this._message.set(null);
  }
}
