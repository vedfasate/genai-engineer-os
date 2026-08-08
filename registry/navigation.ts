import {
    Briefcase,
    CheckSquare,
    FileText,
    LayoutDashboard,
    Map,
    MessageSquare,
    Settings,
    type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
    id: string
    label: string
    href: string
    icon: LucideIcon
}

export const MAIN_NAVIGATION: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', href: '/chat', icon: MessageSquare },
    { id: 'projects', label: 'Projects', href: '/projects', icon: Briefcase },
    { id: 'roadmaps', label: 'Roadmaps', href: '/roadmap', icon: Map },
    { id: 'tasks', label: 'Tasks', href: '/daily', icon: CheckSquare },
    { id: 'documents', label: 'Documents', href: '/notes', icon: FileText },
]

export const FOOTER_NAVIGATION: NavigationItem[] = [
    { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]
