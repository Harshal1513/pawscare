'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      // Demo credentials — in production use proper auth
      if (creds.username === 'admin' && creds.password === 'clinic2026') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_auth', '1')
        }
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials. Try admin / clinic2026')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg,#FEF3C7 0%,#fff 60%)' }}>
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 max-w-md w-full">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-3 md:mb-4"
            style={{ background: '#F59E0B' }}>🐾</div>
          <h1 className="font-black text-xl md:text-2xl text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Paws Care &amp; Heal Pet Clinic</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              value={creds.username}
              onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={creds.password}
              onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-semibold">❌ {error}</div>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 md:py-3.5 text-white font-extrabold text-sm rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: '#F59E0B', fontFamily: 'Nunito,sans-serif' }}>
            {loading ? '⏳ Signing in…' : '🔐 Sign In'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 md:mt-5">
          Demo: <strong>admin</strong> / <strong>clinic2026</strong>
        </p>
      </div>
    </div>
  )
}
