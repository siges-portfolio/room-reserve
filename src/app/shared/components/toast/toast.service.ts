import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

const DEFAULT_DURATION = 5000;

export type ToastType = 'success' | 'error' | 'pending';
export interface Toast {
  id: number,
  type: ToastType;
  message: string;
  icon?: string,
  duration?: number
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  #toasts: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.#toasts.asObservable();

  #nextIndex: number = 0;

  showToast(type: ToastType, message: string, icon: string, duration: number = DEFAULT_DURATION) {
    const toast = { id: this.#nextIndex, type, message, icon, duration };

    this.#toasts.next([...this.#toasts.value, toast]);
    timer(duration).subscribe(() => this.hideToast(toast.id));

    this.#nextIndex++;
  }

  hideToast(id: number) {
    const updatedToasts = this.#toasts.value.filter((item) => id !== item.id);
    this.#toasts.next(updatedToasts);
  }
}
