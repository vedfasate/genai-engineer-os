export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: string
}

export const sampleNotifications: Notification[] = [
    { id: '1', title: 'Mission Completed', message: 'You completed today\'s mission!', type: 'success', timestamp: new Date().toISOString() },
    { id: '2', title: 'Interview Tomorrow', message: 'Prepare for your interview tomorrow.', type: 'info', timestamp: new Date().toISOString() },
]
