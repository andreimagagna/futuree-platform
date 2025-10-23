import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary para capturar erros do React, incluindo erros de DOM manipulation
 * que podem ocorrer durante unmount de componentes com portals
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Suprimir erros específicos de removeChild que são causados por race conditions
    // em portals do Radix UI durante navegação rápida
    if (error.message?.includes('removeChild') || error.name === 'NotFoundError') {
      console.warn('[ErrorBoundary] Suprimindo erro de removeChild:', error.message);
      // Não atualizar o estado para não mostrar fallback UI
      return { hasError: false, error: null };
    }
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log errors que não são de removeChild
    if (!error.message?.includes('removeChild') && error.name !== 'NotFoundError') {
      console.error('[ErrorBoundary] Erro capturado:', error, errorInfo);
      this.props.onError?.(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
