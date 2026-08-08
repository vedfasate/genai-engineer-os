import {
    CheckSquare,
    FileText,
    LayoutDashboard,
    Map,
    Sparkles,
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
    { id: 'roadmap', label: 'Roadmap', href: '/roadmap', icon: Map },
    { id: 'planner', label: 'Planner', href: '/planner', icon: CheckSquare },
    { id: 'notes', label: 'Notes', href: '/notes', icon: FileText },
    { id: 'chat', label: 'Chat', href: '/chat', icon: Sparkles },
]

export const FOOTER_NAVIGATION: NavigationItem[] = []
