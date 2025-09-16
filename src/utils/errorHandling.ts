// Error handling and notification utilities
import { ApiError } from '../services';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export class ErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  }

  static isAuthError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 401;
  }

  static isForbiddenError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 403;
  }

  static isNotFoundError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 404;
  }
}

export class ToastManager {
  private static notifications: ToastNotification[] = [];
  private static listeners: Array<(notifications: ToastNotification[]) => void> = [];

  static addNotification(notification: Omit<ToastNotification, 'id'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: ToastNotification = { id, duration: 5000, ...notification };

    this.notifications.push(newNotification);
    this.notifyListeners();

    if (newNotification.duration) {
      setTimeout(() => this.removeNotification(id), newNotification.duration);
    }

    return id;
  }

  static removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  static subscribe(listener: (notifications: ToastNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  static success(title: string, message?: string): string {
    return this.addNotification({ type: 'success', title, message });
  }

  static error(title: string, message?: string): string {
    return this.addNotification({ type: 'error', title, message, duration: 8000 });
  }

  static warning(title: string, message?: string): string {
    return this.addNotification({ type: 'warning', title, message });
  }

  static handleApiError(error: unknown, context?: string): void {
    const message = ErrorHandler.getErrorMessage(error);
    
    if (ErrorHandler.isAuthError(error)) {
      this.warning('Authentication Required', 'Please log in to continue.');
    } else if (ErrorHandler.isForbiddenError(error)) {
      this.warning('Access Denied', 'You do not have permission to perform this action.');
    } else if (ErrorHandler.isNotFoundError(error)) {
      this.warning('Not Found', context ? `${context} not found.` : 'The requested resource was not found.');
    } else {
      this.error(context ? `${context} Failed` : 'Operation Failed', message);
    }
  }
}