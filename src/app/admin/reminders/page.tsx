'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Supabase returns the joined `pets` row as a plain OBJECT (not array)
// for many-to-one FK joins. Type it as object, not array[].
type PetInfo = { owner_name: string; mobile: string; pet_name: string; pet_type: string }

type ReminderRow = {
  id: string
  next_reminder_date: string
  reminder_message: string | null
  reminder_sent: boolean
  diagnosis: string
  treatment: string
  pets: PetInfo | PetInfo[] | null   // handle both shapes Supabase may return
}

/** Safely get the pet object regardless of whether Supabase returned object or array */
function getPet(r: ReminderRow): PetInfo | undefined {
  if (!r.pets) return undefined
  return Array.isArray(r.pets) ? r.pets[0] : r.pets
}

function makeWaUrl(r: ReminderRow): string {
  const pet = getPet(r)
  const mobile = pet?.mobile?.replace(/\D/g, '') ?? ''   // strip any spaces/dashes
  const msg = r.reminder_message ||
    `🐾 Dear ${pet?.owner_name ?? 'Pet Owner'}, ${pet?.pet_name ?? 'your pet'} is due for a visit. Please call 094838 52691 to book a slot. - Paws Care & Heal`
  return `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`
}

export default function AdminRemindersPage() {
  const [today, setToday]       = useState<ReminderRow[]>([])
  const [tomorrow, setTomorrow] = useState<ReminderRow[]>([])
  const [soon, setSoon]         = useState<ReminderRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [sent, setSent]         = useState<Set<string>>(new Set())

  useEffect(() => { load() }, [])

  const load = async () => {
    const todayStr    = new Date().toISOString().split('T')[0]
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    const in3Str      = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

    const { data, error } = await supabase.from('visits')
      .select('id, next_reminder_date, reminder_message, reminder_sent, diagnosis, treatment, pets(owner_name, mobile, pet_name, pet_type)')
      .eq('reminder_sent', false)
      .gte('next_reminder_date', todayStr)
      .lte('next_reminder_date', in3Str)
      .order('next_reminder_date')

    if (error) { console.error('Reminders load error:', error); setLoading(false); return }

    const rows = (data || []) as ReminderRow[]
    setToday(rows.filter(r => r.next_reminder_date === todayStr))
    setTomorrow(rows.filter(r => r.next_reminder_date === tomorrowStr))
    setSoon(rows.filter(r => r.next_reminder_date > tomorrowStr && r.next_reminder_date <= in3Str))
    setLoading(false)
  }

  const markSent = (id: string) => {
    // Fire-and-forget: mark as sent in DB, update local state
    supabase.from('visits').update({ reminder_sent: true }).eq('id', id).then(() => {
      setSent(p => new Set([...p, id]))
    })
  }

  const Card = ({ r, accent }: { r: ReminderRow; accent: string }) => {
    const isSent = sent.has(r.id)
    const pet    = getPet(r)
    const waUrl  = makeWaUrl(r)

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4"
        style={{ borderLeft: `4px solid ${accent}` }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${accent}20` }}>
            {pet?.pet_type === 'Cat' ? '🐈' : '🐕'}
          </div>
          <div>
            <div className="font-extrabold text-base">{pet?.pet_name ?? '—'}</div>
            <div className="text-sm text-gray-500">{pet?.owner_name ?? '—'} · 📱 {pet?.mobile ?? '—'}</div>
            <div className="text-xs text-gray-400 mt-1 max-w-md leading-snug">
              <span className="font-semibold text-gray-600">Last diagnosis: </span>{r.diagnosis}
            </div>
            {r.reminder_message && (
              <div className="text-xs text-gray-500 mt-1 max-w-md leading-snug italic">&ldquo;{r.reminder_message}&rdquo;</div>
            )}
            {/* Debug: show the URL being used — remove after confirming it works */}
            <div className="text-[10px] text-gray-300 mt-1 break-all hidden">{waUrl}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: accent }}>
            📅 {r.next_reminder_date}
          </div>
          {isSent ? (
            <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">✅ Sent!</div>
          ) : (
            /* <a> tag opens WhatsApp directly — no popup blocking on mobile */
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => markSent(r.id)}
              className="flex items-center gap-1.5 text-white font-extrabold text-sm px-4 py-2 rounded-full transition-all hover:opacity-90 cursor-pointer"
              style={{ background: '#25D366' }}
            >
              📱 Send WhatsApp
            </a>
          )}
        </div>
      </div>
    )
  }

  const Section = ({ title, items, accent }:
    { title: string; items: ReminderRow[]; accent: string }) => (
    items.length > 0 ? (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            {title}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: accent }}>
              {items.length}
            </span>
          </h2>
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
          <Section title="🔴 Due Today"       items={today}    accent="#EF4444"/>
          <Section title="🟡 Due Tomorrow"    items={tomorrow} accent="#F59E0B"/>
          <Section title="🟢 Due in 2-3 Days" items={soon}     accent="#10B981"/>
        </>
      )}
    </div>
  )
}
