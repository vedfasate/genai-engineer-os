export interface UserProfile {
    id: string
    name: string
    email: string
    role: 'admin' | 'user' | 'guest'
}

export function isAdmin(user: UserProfile) {
    return user.role === 'admin'
}
