import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from '../utils/icons';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  showReloadButton?: boolean;
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to an error reporting service
    if (!import.meta.env.DEV) {
      // Example: Send to error tracking service
      // reportError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallbackMessage, showReloadButton = true, showHomeButton = true } = this.props;
      const { error, errorInfo } = this.state;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              {fallbackMessage || 
                'We encountered an unexpected error. Please try again or contact support if the problem persists.'}
            </p>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Error Details (Development Mode):
                </h3>
                <div className="text-xs text-red-700 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div className="mb-2 max-h-32 overflow-y-auto">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>

              <div className="grid grid-cols-2 gap-3">
                {showReloadButton && (
                  <button
                    onClick={this.handleReload}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reload Page
                  </button>
                )}

                {showHomeButton && (
                  <button
                    onClick={this.handleGoHome}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Go Home
                  </button>
                )}
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this error persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for throwing errors manually
export const useErrorHandler = () => {
  const [, setState] = React.useState();
  
  return React.useCallback((error: Error) => {
    setState(() => {
      throw error;
    });
  }, []);
};

export default ErrorBoundary;