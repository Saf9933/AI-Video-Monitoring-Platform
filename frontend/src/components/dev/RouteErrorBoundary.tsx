import React from 'react';

interface RouteErrorBoundaryState {
  err?: Error;
}

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export default class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { err: undefined };
  }

  static getDerivedStateFromError(err: Error): RouteErrorBoundaryState {
    return { err };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="mx-auto max-w-7xl p-6">
          <div className="rounded-xl border border-red-700/50 bg-red-950/40 p-6">
            <h2 className="text-lg font-semibold text-red-200 mb-3">页面加载错误 / Page Load Error</h2>
            <pre className="text-sm text-red-300 whitespace-pre-wrap overflow-auto">
              {this.state.err.message}
              {this.state.err.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-400 hover:text-red-300">
                    显示详细信息 / Show Details
                  </summary>
                  <div className="mt-2 text-xs text-red-400">
                    {this.state.err.stack}
                  </div>
                </details>
              )}
            </pre>
            <button 
              onClick={() => this.setState({ err: undefined })}
              className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            >
              重试 / Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}