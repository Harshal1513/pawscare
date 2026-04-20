'use client'
import { useState } from 'react'
import Link from 'next/link'

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
]

export default function BookPage() {
  const [form, setForm] = useState({
    owner_name:'', mobile:'', email:'', pet_name:'', pet_type:'Dog', pet_age:'', problem:'', preferred_date:'', preferred_time:'',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.owner_name.trim()) e.owner_name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.pet_name.trim()) e.pet_name = 'Pet name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {}
    setLoading(false)
    setSuccess(true)
  }

  const waMsg = `Hi! I'd like to book an appointment for ${form.pet_name || 'my pet'} at Paws Care & Heal. My name is ${form.owner_name}, phone: ${form.mobile}. Preferred date: ${form.preferred_date || 'earliest available'} at ${form.preferred_time || 'any time'}. Problem: ${form.problem || 'General checkup'}. Please confirm!`

  const inp = `w-full border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-colors`
  const inpStyle = (k: string) => ({
    borderColor: errors[k] ? '#EF4444' : '#E5E7EB',
    background: errors[k] ? '#FFF5F5' : '#fff',
  })

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-amber-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="font-black text-2xl mb-2">Appointment Requested!</h2>
        <p className="text-gray-500 text-sm leading-[1.7] mb-6">
          <strong>{form.pet_name}&apos;s</strong> appointment has been requested for{' '}
          <strong>{form.preferred_date || 'earliest slot'}</strong> at{' '}
          <strong>{form.preferred_time || 'to be confirmed'}</strong>.<br/>
          We&apos;ll contact you at <strong>+91 {form.mobile}</strong> to confirm.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
          <div className="font-bold text-green-800 text-sm mb-1">📱 Confirm on WhatsApp</div>
          <p className="text-green-700 text-xs">Click below to send us a WhatsApp message for faster confirmation.</p>
        </div>
        <div className="space-y-3">
          <a href={`https://wa.me/919483852691?text=${encodeURIComponent(waMsg)}`}
            target="_blank" rel="noreferrer"
            className="block w-full py-3.5 rounded-full text-white font-extrabold text-sm transition-all hover:opacity-90"
            style={{ background:'#25D366' }}>📱 Confirm on WhatsApp</a>
          <button onClick={() => { setSuccess(false); setForm({ owner_name:'',mobile:'',email:'',pet_name:'',pet_type:'Dog',pet_age:'',problem:'',preferred_date:'',preferred_time:'' }); setErrors({}) }}
            className="block w-full py-3.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
  )

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1)
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate()+30)

  return (
    <div className="min-h-screen bg-amber-50 py-14 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📅</div>
          <h1 className="font-black text-3xl text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-500 text-[15px]">Fill in the details — we&apos;ll confirm your slot within 2 hours!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 max-sm:p-5">
          {/* Owner */}
          <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">👤 Owner Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name *</label>
              <input value={form.owner_name} onChange={e=>set('owner_name',e.target.value)}
                placeholder="Your full name" className={inp} style={inpStyle('owner_name')}
                onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor=errors.owner_name?'#EF4444':'#E5E7EB')}/>
              {errors.owner_name && <p className="text-red-500 text-xs mt-1">{errors.owner_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile Number *</label>
              <input value={form.mobile} onChange={e=>set('mobile',e.target.value)}
                placeholder="10-digit mobile" maxLength={10} className={inp} style={inpStyle('mobile')}
                onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor=errors.mobile?'#EF4444':'#E5E7EB')}/>
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Email (optional)</label>
            <input value={form.email} onChange={e=>set('email',e.target.value)}
              placeholder="your@email.com" type="email" className={inp} style={{ borderColor:'#E5E7EB' }}
              onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor='#E5E7EB')}/>
          </div>

          {/* Pet */}
          <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">🐾 Pet Information</h3>
          <div className="grid grid-cols-3 gap-4 mb-4 max-sm:grid-cols-1">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Name *</label>
              <input value={form.pet_name} onChange={e=>set('pet_name',e.target.value)}
                placeholder="e.g. Tommy" className={inp} style={inpStyle('pet_name')}
                onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor=errors.pet_name?'#EF4444':'#E5E7EB')}/>
              {errors.pet_name && <p className="text-red-500 text-xs mt-1">{errors.pet_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Type</label>
              <select value={form.pet_type} onChange={e=>set('pet_type',e.target.value)}
                className={inp} style={{ borderColor:'#E5E7EB' }}>
                <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Age</label>
              <input value={form.pet_age} onChange={e=>set('pet_age',e.target.value)}
                placeholder="e.g. 3 years" className={inp} style={{ borderColor:'#E5E7EB' }}
                onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor='#E5E7EB')}/>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Problem / Reason for Visit</label>
            <textarea value={form.problem} onChange={e=>set('problem',e.target.value)}
              placeholder="Briefly describe your pet's issue..." rows={2}
              className={inp} style={{ borderColor:'#E5E7EB', resize:'vertical' }}
              onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor='#E5E7EB')}/>
          </div>

          {/* Schedule */}
          <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">📅 Schedule</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Preferred Date</label>
              <input type="date" value={form.preferred_date} onChange={e=>set('preferred_date',e.target.value)}
                min={tomorrow.toISOString().split('T')[0]} max={maxDate.toISOString().split('T')[0]}
                className={inp} style={{ borderColor:'#E5E7EB' }}
                onFocus={e=>(e.target.style.borderColor='#F59E0B')} onBlur={e=>(e.target.style.borderColor='#E5E7EB')}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Preferred Time</label>
              <select value={form.preferred_time} onChange={e=>set('preferred_time',e.target.value)}
                className={inp} style={{ borderColor:'#E5E7EB' }}>
                <option value="">— Select time —</option>
                {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Quick time grid */}
          {form.preferred_date && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 mb-2">Quick Select Time:</p>
              <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-3">
                {TIME_SLOTS.map(slot => (
                  <button key={slot} onClick={() => set('preferred_time', slot)}
                    className="py-2 text-xs font-semibold rounded-lg border transition-all"
                    style={{
                      borderColor: form.preferred_time===slot ? '#F59E0B' : '#E5E7EB',
                      background: form.preferred_time===slot ? '#F59E0B' : '#fff',
                      color: form.preferred_time===slot ? '#fff' : '#374151',
                    }}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-4 mb-5 text-sm text-amber-800">
            📱 After booking, you&apos;ll receive a WhatsApp confirmation on your mobile number.
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 text-white font-black text-base rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: loading ? '#9CA3AF' : '#111827', fontFamily:'Nunito,sans-serif' }}>
            {loading ? '⏳ Booking…' : '✅ Confirm Appointment'}
          </button>

          <div className="text-center mt-4">
            <a href="https://wa.me/919483852691" target="_blank" rel="noreferrer"
              className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
              Prefer to book via WhatsApp? →
            </a>
          </div>
        </div>

        {/* Location card */}
        <div className="mt-6 rounded-2xl p-6 text-white" style={{ background:'#111827' }}>
          <h3 className="font-extrabold text-base mb-3">📍 Clinic Location</h3>
          <p className="text-white/70 text-sm leading-[1.8]">
            Ganapati Temple, double road, near Hindalga,<br/>
            beside Shambavi Clinic, Hanuman Nagar,<br/>
            Belagavi, Karnataka 590019
          </p>
          <a href="https://maps.google.com/?q=Paws+Care+Heal+Belagavi+Hindalga" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all"
            style={{ background:'#F59E0B' }}>
            📍 View on Google Maps
          </a>
        </div>
      </div>
    </div>
  )
}
