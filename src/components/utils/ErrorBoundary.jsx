import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <p>The application encountered an error. Please try refreshing the page.</p>
          {this.props.showDetails && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          {this.props.onReset && (
            <button onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              this.props.onReset();
            }}>
              Try Again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;