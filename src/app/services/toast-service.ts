import { Injectable, TemplateRef } from '@angular/core';

export interface ToastItem {
  textOrTpl: TemplateRef<any> | null;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  toasts: ToastItem[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: ToastItem) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showSuccess(message: string) {
    this.show(message, { classname: 'bg-success text-light', delay: 5000 });
  }

  showError(message: string) {
    this.show(message, { classname: 'bg-danger text-light', delay: 15000 });
  }
}
