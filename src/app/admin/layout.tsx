'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/admin/dashboard',      icon: '📊', label: 'Dashboard' },
  { href: '/admin/appointments',   icon: '📅', label: 'Appointments' },
  { href: '/admin/records',        icon: '🗂️', label: 'Pet Records' },
  { href: '/admin/reminders',      icon: '🔔', label: 'Reminders' },
  { href: '/admin/success-stories',icon: '🌟', label: 'Success Stories' },
  { href: '/admin/services-mgmt',  icon: '🩺', label: 'Services & Prices' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip layout for login page
  if (path === '/admin/login') return <>{children}</>

  const logout = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col py-4 px-3 transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ background: '#111827' }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6 md:mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: '#F59E0B' }}>🐾</div>
          <span className="text-white font-extrabold text-sm leading-tight">Paws Care<br/>Admin</span>
        </div>
        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-2 text-[13px] font-semibold px-3 py-2.5 rounded-xl transition-all
                ${path === n.href
                  ? 'text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              style={path === n.href ? { background: '#F59E0B' } : {}}
              onClick={() => setSidebarOpen(false)}>
              <span className="flex-shrink-0">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        {/* Footer */}
        <div className="space-y-1 pt-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2.5 text-white/50 hover:text-white text-[13px] font-semibold px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all">
            <span>←</span><span>Back to Website</span>
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 text-white/50 hover:text-white text-[13px] font-semibold px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all">
            <span>🚪</span> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 sticky top-0 z-30">
          <button className="md:hidden p-1 flex-shrink-0" onClick={() => setSidebarOpen(true)}>
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" /><span className="block w-5 h-0.5 bg-gray-700 mb-1" /><span className="block w-5 h-0.5 bg-gray-700" />
          </button>
          <span className="font-extrabold text-sm md:text-base text-gray-900 truncate">
            {NAV.find(n => n.href === path)?.icon}{' '}
            {NAV.find(n => n.href === path)?.label || 'Admin'}
          </span>
          <div className="ml-auto text-xs md:text-sm text-gray-400 flex-shrink-0">
            {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
          </div>
        </div>
        {/* Content */}
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
