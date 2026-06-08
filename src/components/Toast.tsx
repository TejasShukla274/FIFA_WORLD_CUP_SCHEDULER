'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastCard({ toast, onClose }: { toast: ToastMessage; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle className="text-brand-green flex-shrink-0" size={18} />,
    info: <Info className="text-brand-gold flex-shrink-0" size={18} />,
    warning: <AlertCircle className="text-brand-gold flex-shrink-0" size={18} />,
    error: <AlertCircle className="text-brand-crimson flex-shrink-0" size={18} />,
  };

  const borderColors = {
    success: 'border-brand-green/30 bg-brand-green/5',
    info: 'border-brand-gold/30 bg-brand-gold/5',
    warning: 'border-brand-gold/30 bg-brand-gold/5',
    error: 'border-brand-crimson/30 bg-brand-crimson/5',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border glass-card shadow-2xl animate-in slide-in-from-bottom duration-300 ${borderColors[toast.type]}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-xs font-bold text-text-main">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 p-1 rounded-full text-text-muted hover:text-text-main hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
