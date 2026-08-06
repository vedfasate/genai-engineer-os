import React from 'react'

interface ErrorBoundaryState {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: {}) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Unhandled error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please refresh the page.</div>
        }
        return this.props.children
    }
}
