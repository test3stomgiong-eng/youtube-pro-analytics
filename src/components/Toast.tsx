import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/10';
      case 'error':
        return 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-500/10';
      default:
        return 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-slate-900/50';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl text-xs font-semibold ${getStyle()}`}
      >
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
