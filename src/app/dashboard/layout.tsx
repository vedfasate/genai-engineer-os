import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <div className="flex h-full flex-col gap-6">{children}</div>
}
