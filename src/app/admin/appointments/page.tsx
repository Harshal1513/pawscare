'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/lib/supabase'

export default function AdminAppointmentsPage() {
  const [appts, setAppts] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [form, setForm] = useState({
    owner_name: '', mobile: '', email: '', pet_name: '', pet_type: 'Dog',
    pet_age: '', problem: '', preferred_date: new Date().toISOString().split('T')[0], preferred_time: '', status: 'pending',
  })

  useEffect(() => { loadAppts() }, [selectedDate])

  const loadAppts = async () => {
    setLoading(true)
    const { data } = await supabase.from('appointments')
      .select('*').eq('preferred_date', selectedDate).order('preferred_time')
    setAppts(data || [])
    setLoading(false)
  }

  const saveAppt = async () => {
    if (!form.owner_name.trim() || !form.mobile.trim() || !form.pet_name.trim()) {
      alert('Owner name, mobile and pet name are required'); return
    }
    const { error } = await supabase.from('appointments').insert([form])
    if (!error) {
      setSaved(true); setTimeout(() => setSaved(false), 3000)
      setShowForm(false)
      setForm({ owner_name:'',mobile:'',email:'',pet_name:'',pet_type:'Dog',pet_age:'',problem:'',preferred_date:selectedDate,preferred_time:'',status:'pending' })
      loadAppts()
    } else alert('Error saving: ' + error.message)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    loadAppts()
  }

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors'

  return (
    <div>
      {saved && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 font-semibold text-sm">✅ Appointment saved!</div>}

      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-600">Date:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors"/>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white font-extrabold text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
          style={{ background: '#F59E0B' }}>
          {showForm ? '✕ Cancel' : '+ New Appointment'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-extrabold text-base mb-4">Add New Appointment</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Owner Name *</label>
              <input value={form.owner_name} onChange={e=>setForm(p=>({...p,owner_name:e.target.value}))} placeholder="Full name" className={inp}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile *</label>
              <input value={form.mobile} onChange={e=>setForm(p=>({...p,mobile:e.target.value}))} placeholder="10-digit" maxLength={10} className={inp}/></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Name *</label>
              <input value={form.pet_name} onChange={e=>setForm(p=>({...p,pet_name:e.target.value}))} placeholder="Pet name" className={inp}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Type</label>
              <select value={form.pet_type} onChange={e=>setForm(p=>({...p,pet_type:e.target.value}))} className={inp}>
                <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
              </select></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Time</label>
              <select value={form.preferred_time} onChange={e=>setForm(p=>({...p,preferred_time:e.target.value}))} className={inp}>
                <option value="">— Select —</option>
                {['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'].map(t=><option key={t}>{t}</option>)}
              </select></div>
          </div>
          <div className="mb-4"><label className="block text-xs font-bold text-gray-600 mb-1.5">Problem / Reason</label>
            <textarea value={form.problem} onChange={e=>setForm(p=>({...p,problem:e.target.value}))} placeholder="Brief description…" rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors resize-none"/></div>
          <div className="flex gap-3">
            <button onClick={saveAppt} className="text-white font-extrabold text-sm px-6 py-2.5 rounded-full" style={{ background:'#F59E0B' }}>Save Appointment</button>
            <button onClick={()=>setShowForm(false)} className="font-bold text-sm px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-amber-400 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-extrabold text-base">
            Appointments — {new Date(selectedDate).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
          </span>
          <span className="text-sm text-gray-400">{appts.length} total</span>
        </div>
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading…</div>
        ) : appts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-semibold">No appointments for this date</div>
            <div className="text-sm mt-1">Change the date or add a new appointment above</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Pet</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Problem</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr></thead>
              <tbody>
                {appts.map((a, i) => (
                  <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold">{a.pet_name} <span className="text-gray-400 font-normal">({a.pet_type})</span></td>
                    <td className="px-4 py-3.5 text-sm">{a.owner_name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{a.mobile}</td>
                    <td className="px-4 py-3.5 text-sm">{a.preferred_time || '—'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 max-w-[180px] truncate">{a.problem || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${a.status === 'confirmed' ? 'bg-green-100 text-green-700'
                          : a.status === 'done' ? 'bg-blue-100 text-blue-700'
                          : a.status === 'cancelled' ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-700'}`}>
                        {a.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        {a.status !== 'confirmed' && a.status !== 'done' && (
                          <button onClick={() => updateStatus(a.id!, 'confirmed')}
                            className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all hover:opacity-90"
                            style={{ background:'#10B981' }}>
                            Confirm
                          </button>
                        )}
                        {a.status !== 'done' && (
                          <button onClick={() => updateStatus(a.id!, 'done')}
                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 transition-all hover:bg-blue-200">
                            Done
                          </button>
                        )}
                        <a href={`https://wa.me/91${a.mobile}?text=${encodeURIComponent(`Hi ${a.owner_name}! Your appointment for ${a.pet_name} on ${selectedDate} at ${a.preferred_time || 'your slot'} is confirmed at Paws Care & Heal. Please arrive 5 min early. - 094838 52691`)}`}
                          target="_blank" rel="noreferrer"
                          className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all hover:opacity-90"
                          style={{ background:'#25D366' }}>
                          📱
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
