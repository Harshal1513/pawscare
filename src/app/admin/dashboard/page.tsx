'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type StatCard = { label: string; value: string | number; color?: string; icon: string }

export default function AdminDashboard() {
  const [stats, setStats] = useState({ appointments: 0, pets: 0, reminders: 0 })
  const [recentAppts, setRecentAppts] = useState<any[]>([])
  const [dueReminders, setDueReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0]
    const in3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

    const [apptRes, petRes, reminderRes] = await Promise.all([
      supabase.from('appointments').select('*').eq('preferred_date', today).order('preferred_time'),
      supabase.from('pets').select('id', { count: 'exact', head: true }),
      supabase.from('visits').select('*, pets(*)').gte('next_reminder_date', today).lte('next_reminder_date', in3).eq('reminder_sent', false).order('next_reminder_date'),
    ])

    setRecentAppts(apptRes.data || [])
    setDueReminders(reminderRes.data || [])
    setStats({
      appointments: apptRes.data?.length || 0,
      pets: petRes.count || 0,
      reminders: reminderRes.data?.length || 0,
    })
    setLoading(false)
  }

  const STAT_CARDS: StatCard[] = [
    { icon: '📅', label: "Today's Appointments", value: stats.appointments },
    { icon: '🐾', label: 'Total Pet Records',     value: stats.pets },
    { icon: '🔔', label: 'Due Reminders (3 days)', value: stats.reminders, color: '#EF4444' },
    { icon: '⭐', label: 'Google Rating',           value: '4.9★' },
  ]

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="font-black text-3xl" style={{ color: s.color || '#F59E0B' }}>{s.value}</div>
            <div className="text-gray-500 text-xs font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-extrabold text-base">📅 Today&apos;s Appointments</span>
            <Link href="/admin/appointments"
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: '#F59E0B' }}>View All</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : recentAppts.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              <div className="text-3xl mb-2">📋</div>No appointments today
            </div>
          ) : (
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Pet</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {recentAppts.slice(0, 5).map((a, i) => (
                  <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm font-semibold">{a.pet_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.owner_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.preferred_time || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${a.status === 'confirmed' ? 'bg-green-100 text-green-700'
                          : a.status === 'done' ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'}`}>
                        {a.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Due Reminders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-extrabold text-base text-red-500">🔴 Due Reminders</span>
            <Link href="/admin/reminders"
              className="text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-500 transition-colors">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : dueReminders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              <div className="text-3xl mb-2">✅</div>No reminders due in next 3 days
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {dueReminders.slice(0, 4).map(r => {
                const daysUntil = Math.ceil((new Date(r.next_reminder_date).getTime() - Date.now()) / 86400000)
                const borderColor = daysUntil === 0 ? '#EF4444' : daysUntil === 1 ? '#F59E0B' : '#10B981'
                return (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3.5 gap-3"
                    style={{ borderLeft: `4px solid ${borderColor}` }}>
                    <div>
                      <div className="font-bold text-sm">{r.pets?.pet_name || '—'}</div>
                      <div className="text-xs text-gray-500">{r.pets?.owner_name} · 📱 {r.pets?.mobile}</div>
                      <div className="text-xs mt-0.5" style={{ color: borderColor }}>
                        {daysUntil === 0 ? '🔴 Due Today' : daysUntil === 1 ? '🟡 Due Tomorrow' : `🟢 Due in ${daysUntil} days`}
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/91${r.pets?.mobile}?text=${encodeURIComponent(r.reminder_message || `Hi ${r.pets?.owner_name}, ${r.pets?.pet_name} is due for a visit. Please call 094838 52691 to book. - Paws Care & Heal`)}`}
                      target="_blank" rel="noreferrer"
                      className="text-xs font-bold px-3 py-2 rounded-full text-white whitespace-nowrap transition-all hover:opacity-90"
                      style={{ background: '#25D366' }}>
                      📱 Send
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="font-extrabold text-base mb-4">⚡ Quick Actions</div>
        <div className="flex flex-wrap gap-3">
          {[
            { href:'/admin/appointments', label:'+ New Appointment', bg:'#F59E0B' },
            { href:'/admin/records',      label:'+ Add Pet Visit',   bg:'#5BC8D4' },
            { href:'/admin/reminders',    label:'Send All Reminders', bg:'#10B981' },
            { href:'/book',               label:'Public Booking Page', bg:'#111827' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="inline-flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: a.bg }}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
