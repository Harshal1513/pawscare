'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ReminderRow = {
  id: string
  next_reminder_date: string
  reminder_message: string | null
  reminder_sent: boolean
  diagnosis: string
  treatment: string
  pets: { owner_name: string; mobile: string; pet_name: string; pet_type: string }[] | null
}

function makeWaUrl(r: ReminderRow) {
  const pet = r.pets?.[0]
  const msg = r.reminder_message ||
    `🐾 Dear ${pet?.owner_name}, ${pet?.pet_name} is due for a visit. Please call 094838 52691 to book a slot. - Paws Care & Heal`
  return `https://wa.me/91${pet?.mobile}?text=${encodeURIComponent(msg)}`
}

export default function AdminRemindersPage() {
  const [today, setToday]       = useState<ReminderRow[]>([])
  const [tomorrow, setTomorrow] = useState<ReminderRow[]>([])
  const [soon, setSoon]         = useState<ReminderRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [sent, setSent]         = useState<Set<string>>(new Set())
  const [sendingAll, setSendingAll] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const todayStr    = new Date().toISOString().split('T')[0]
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    const in3Str      = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

    const { data } = await supabase.from('visits')
      .select('id, next_reminder_date, reminder_message, reminder_sent, diagnosis, treatment, pets(owner_name, mobile, pet_name, pet_type)')
      .eq('reminder_sent', false)
      .gte('next_reminder_date', todayStr)
      .lte('next_reminder_date', in3Str)
      .order('next_reminder_date')

    const rows = (data || []) as ReminderRow[]
    setToday(rows.filter(r => r.next_reminder_date === todayStr))
    setTomorrow(rows.filter(r => r.next_reminder_date === tomorrowStr))
    setSoon(rows.filter(r => r.next_reminder_date > tomorrowStr && r.next_reminder_date <= in3Str))
    setLoading(false)
  }

  const markSent = async (id: string) => {
    await supabase.from('visits').update({ reminder_sent: true }).eq('id', id)
    setSent(p => new Set([...p, id]))
  }

  // Send All: open WhatsApp links one-by-one using anchor clicks, then mark all as sent
  const sendAll = async (list: ReminderRow[]) => {
    const pending = list.filter(r => !sent.has(r.id))
    if (pending.length === 0) return
    setSendingAll(true)
    for (let i = 0; i < pending.length; i++) {
      const r = pending[i]
      const url = makeWaUrl(r)
      // Open each link — user must allow popups or we fallback
      const opened = window.open(url, `_wa_${r.id}`)
      if (!opened) {
        // Popup blocked — give user direct link via alert
        alert(`Popup blocked for ${r.pets?.[0]?.pet_name}. Please open this link manually:\n${url}`)
      }
      await markSent(r.id)
      if (i < pending.length - 1) {
        // Small pause between each to prevent all links opening at once
        await new Promise(res => setTimeout(res, 800))
      }
    }
    setSendingAll(false)
  }

  const Card = ({ r, accent }: { r: ReminderRow; accent: string }) => {
    const isSent = sent.has(r.id)
    const waUrl  = makeWaUrl(r)
    const pet    = r.pets?.[0]
    return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4"
      style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${accent}20` }}>
          {pet?.pet_type === 'Cat' ? '🐈' : '🐕'}
        </div>
        <div>
          <div className="font-extrabold text-base">{pet?.pet_name}</div>
          <div className="text-sm text-gray-500">{pet?.owner_name} · 📱 {pet?.mobile}</div>
          <div className="text-xs text-gray-400 mt-1 max-w-md leading-snug">
            <span className="font-semibold text-gray-600">Last diagnosis: </span>{r.diagnosis}
          </div>
          {r.reminder_message && (
            <div className="text-xs text-gray-500 mt-1 max-w-md leading-snug italic">&ldquo;{r.reminder_message}&rdquo;</div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: accent }}>
          📅 {r.next_reminder_date}
        </div>
        {isSent ? (
          <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">✅ Sent!</div>
        ) : (
          /* Use <a> tag so mobile browsers open WhatsApp directly without popup blocking */
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => markSent(r.id)}
            className="flex items-center gap-1.5 text-white font-extrabold text-sm px-4 py-2 rounded-full transition-all hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            📱 Send WhatsApp
          </a>
        )}
      </div>
    </div>
  )}

  const Section = ({ title, items, accent, sendAllFn }:
    { title: string; items: ReminderRow[]; accent: string; sendAllFn: () => void }) => (
    items.length > 0 ? (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            {title}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: accent }}>
              {items.length}
            </span>
          </h2>
          <button onClick={sendAllFn} disabled={sendingAll}
            className="text-xs font-bold px-4 py-2 rounded-full text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#25D366' }}>
            {sendingAll ? '⏳ Sending…' : '📱 Send All'}
          </button>
        </div>
        <div className="space-y-3">
          {items.map(r => <Card key={r.id} r={r} accent={accent}/>)}
        </div>
      </div>
    ) : null
  )

  return (
    <div>
      {/* Summary badges */}
      <div className="flex gap-3 flex-wrap mb-6">
        <div className="bg-red-100 text-red-700 font-bold text-sm px-4 py-2 rounded-full">🔴 Due Today: {today.length}</div>
        <div className="bg-amber-100 text-amber-700 font-bold text-sm px-4 py-2 rounded-full">🟡 Due Tomorrow: {tomorrow.length}</div>
        <div className="bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-full">🟢 Due in 2-3 days: {soon.length}</div>
        <button onClick={() => sendAll([...today, ...tomorrow, ...soon])} disabled={sendingAll}
          className="ml-auto text-white font-extrabold text-sm px-5 py-2 rounded-full transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#111827' }}>
          {sendingAll ? '⏳ Sending…' : '📱 Send All Due'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-amber-500 font-bold text-lg">Loading reminders…</div>
      ) : today.length === 0 && tomorrow.length === 0 && soon.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">✅</div>
          <div className="font-extrabold text-xl text-green-600 mb-2">All caught up!</div>
          <div className="text-sm">No pending reminders for today or the next 3 days.</div>
        </div>
      ) : (
        <>
          <Section title="🔴 Due Today"     items={today}    accent="#EF4444" sendAllFn={() => sendAll(today)}/>
          <Section title="🟡 Due Tomorrow"  items={tomorrow} accent="#F59E0B" sendAllFn={() => sendAll(tomorrow)}/>
          <Section title="🟢 Due in 2-3 Days" items={soon}  accent="#10B981" sendAllFn={() => sendAll(soon)}/>
        </>
      )}
    </div>
  )
}
