import { Component } from 'react'

/**
 * Catches JS errors (including lazy chunk load failures) so the app
 * doesn't fully break. Shows a retry option to help with refresh issues.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl border border-warm-200 dark:border-dark-border p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-darkwood dark:text-white mb-2">Something went wrong</h1>
            <p className="text-darkwood/60 dark:text-white text-sm mb-6">
              The page didn&apos;t load correctly. This can happen after an update or on a slow connection.
            </p>
            <button
              onClick={this.handleRetry}
              className="w-full py-3 px-6 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
