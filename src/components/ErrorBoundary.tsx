import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
          <div className="space-y-3 max-w-md">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Đã xảy ra sự cố hiển thị</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'Một lỗi không mong muốn đã xảy ra trong giao diện.'}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tải Lại Trang</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
