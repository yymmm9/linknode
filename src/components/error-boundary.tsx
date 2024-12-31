'use client';

import React, { ErrorInfo } from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
          <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
