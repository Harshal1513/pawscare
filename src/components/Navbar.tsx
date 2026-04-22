'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'

const links = [
  { href: '/',                  label: 'Home' },
  { href: '/services',          label: 'Services & Prices' },
  { href: '/offers',            label: 'Special Offers' },
  { href: '/success-stories',   label: 'Success Stories' },
  { href: '/book',              label: 'Book Appointment', highlight: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between px-4 md:px-8 h-[64px] md:h-[72px] max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 md:w-9 h-8 md:h-9 rounded-full flex items-center justify-center text-base md:text-lg"
               style={{ background: '#F59E0B' }}>🐾</div>
          <span className="font-black text-[15px] md:text-[17px] text-gray-900">
            Paws Care <span style={{ color: '#F59E0B' }}>&amp; Heal</span>
          </span>
        </Link>

        {/* Desktop pill nav */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1.5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13.5px] font-semibold px-3 md:px-4 py-2 rounded-full transition-all whitespace-nowrap
                ${l.highlight
                  ? 'text-white font-extrabold'
                  : path === l.href
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                }`}
              style={l.highlight ? { background: '#F59E0B' } : {}}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right info */}
        {/* UPDATED WITH REAL GOOGLE DATA */}
        <div className="hidden lg:block text-right text-xs text-gray-500 leading-[1.7] shrink-0">
          <div className="font-bold text-[13px] text-gray-900">Paws Care &amp; Heal, Belagavi</div>
          <div>094838 52691</div>
          <div>☀️ 10:30 AM – 2:00 PM &nbsp;·&nbsp; 🌙 5:30 – 8:30 PM</div>
          <div className="text-[11px] text-gray-400">Mon – Sat</div>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 md:px-6 py-4 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 font-semibold border-b border-gray-50 transition-colors
                ${l.highlight ? 'font-extrabold' : 'text-gray-700 hover:text-amber-500'}`}
              style={l.highlight ? { color: '#F59E0B' } : {}}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:09483852691"
            className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-700">
            <Phone size={14} /> 094838 52691
          </a>
        </div>
      )}
    </nav>
  )
}
