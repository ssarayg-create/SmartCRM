import {StrictMode, Component, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL ERROR CAPTURED BY BOUNDARY:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-red-100 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Error Crítico Detectado</h1>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Lo sentimos, SmartCRM ha encontrado un problema inesperado y no pudo iniciar correctamente.
              </p>
            </div>
            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left overflow-auto max-h-40">
              <code className="text-[10px] font-mono text-rose-600 break-all">
                {this.state.error?.message || "Error desconocido"}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity active:scale-95"
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
