'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  return (
    <footer className="bg-white pt-12 pb-6 px-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Tagline */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <h2 className="font-black text-gray-900" style={{ fontSize: 'clamp(24px,4vw,42px)' }}>
            Taking care of your pet!
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-black text-xl text-gray-900">
              Paws Care <span style={{ color: '#F59E0B' }}>&amp; Heal</span>
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap justify-between gap-8 pt-8 border-t border-gray-200">
          {/* Social */}
          <div>
            <div className="font-bold text-gray-900 text-sm mb-3">Waving a paw in</div>
            <div className="flex gap-3">
              {[
                { icon: '📸', href: 'https://instagram.com' },
                { icon: '🎵', href: 'https://tiktok.com' },
                { icon: '📘', href: 'https://facebook.com' },
                { icon: '📱', href: 'https://wa.me/919483852691' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-lg hover:bg-amber-400 transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="font-bold text-gray-900 text-sm mb-3">Quick Links</div>
            <div className="space-y-2 text-sm">
              {[
                ['/book','Book Appointment'],
                ['/services','Services & Prices'],
                ['/offers','Special Offers'],
                ['/success-stories','Success Stories'],
              ].map(([href,label]) => (
                <Link key={href} href={href} className="block text-gray-500 hover:text-amber-500 transition-colors">
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-bold text-gray-900 text-sm mb-3">Contact</div>
            <div className="text-sm text-gray-500 space-y-1.5">
              {/* UPDATED WITH REAL GOOGLE DATA */}
              <div>📍 Near Ganapati Temple, Double Road</div>
              <div>Beside Shambavi Clinic, Hindalga</div>
              <div>Hanuman Nagar, Belagavi 590019</div>
              <div><a href="tel:09483852691" className="hover:text-amber-500">📞 094838 52691</a></div>
              <div>⏰ Mon–Sat: 10:30 AM – 2 PM, 5:30 – 8:30 PM</div>
              <div>🚫 Sunday: Closed</div>
            </div>
          </div>

          {/* Mailbox */}
          <div className="max-w-sm flex-1">
            <div className="font-bold text-gray-900 text-sm mb-3">Mailbox</div>
            {subbed ? (
              <div className="text-green-600 font-semibold text-sm">✅ Subscribed! Thank you.</div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  onClick={() => { if (email.trim()) setSubbed(true) }}
                  className="font-extrabold text-sm px-5 py-3 rounded-xl text-white transition-colors whitespace-nowrap"
                  style={{ background: '#F59E0B' }}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="flex justify-between flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-400">
          <span>2026 © Paws Care and Heal Pet Clinic, Belagavi</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of use</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
