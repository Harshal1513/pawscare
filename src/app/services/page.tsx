'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/supabase'

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const CATEGORY_ICONS: Record<string, string> = {
  general: '🩺',
  surgery: '🔪',
  diagnostics: '🔬',
  prevention: '💉',
  grooming: '✂️',
  dental: '🦷',
  therapy: '💊',
  cardiology: '❤️',
}

export default function ServicesPage() {
  useReveal()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      setServices(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Group services by category
  const categories = Array.from(new Set(services.map(s => s.category || 'general')))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-8" style={{ background:'#FEF3C7' }}>
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-4" style={{ background:'#F59E0B', color:'#fff' }}>🩺 Expert Veterinary Care</div>
        <h1 className="font-black text-4xl text-gray-900 mb-3">Services &amp; Prices</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-[1.7]">Comprehensive veterinary care at transparent, affordable prices for your beloved pets in Belagavi.</p>
      </div>

      {/* Services & Price Table */}
      <div className="px-10 py-14 max-sm:px-5">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="text-center py-16 text-amber-500 font-bold text-lg">Loading services…</div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🩺</div>
              <div className="font-bold text-gray-500 text-lg mb-2">Services coming soon</div>
              <div className="text-sm">Please call us at <a href="tel:09483852691" className="text-amber-500 font-bold">094838 52691</a> for pricing.</div>
            </div>
          ) : (
            <>
              {/* Services grid */}
              <h2 className="font-black text-3xl mb-8 reveal">Our Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {services.map(s => (
                  <div key={s.id} className="rounded-[20px] p-6 relative overflow-hidden cursor-default transition-transform hover:-translate-y-1 reveal"
                    style={{ background:'#5BC8D4' }}>
                    <div className="text-white font-black text-lg mb-2">
                      {CATEGORY_ICONS[s.category || 'general'] || '🩺'} {s.name}
                    </div>
                    {s.description && (
                      <div className="text-white/88 text-sm leading-[1.65] mb-3">{s.description}</div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {s.duration_mins && (
                        <span className="text-white/60 text-xs font-semibold">{s.duration_mins} min</span>
                      )}
                      {s.price_display && (
                        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{s.price_display}</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <Link href="/book" className="inline-flex items-center gap-1.5 bg-white/95 text-gray-900 font-bold text-sm px-4 py-2.5 rounded-full transition-all hover:bg-white">
                        Book now →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Table */}
              <div className="reveal">
                <h2 className="font-black text-3xl mb-6">Complete Price List</h2>
                <div className="rounded-[20px] overflow-hidden border border-gray-100" style={{ boxShadow:'0 2px 20px rgba(0,0,0,.08)' }}>
                  <div className="px-6 py-4" style={{ background:'#111827' }}>
                    <h3 className="text-white font-extrabold text-lg">Price List 2026</h3>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Service</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Duration</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={s.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                          <td className="px-5 py-3.5 text-sm">
                            {CATEGORY_ICONS[s.category || 'general'] || '🩺'} {s.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-500">
                            {s.duration_mins ? `${s.duration_mins} min` : '—'}
                          </td>
                          <td className="px-5 py-3.5 font-bold" style={{ color:'#D97706' }}>
                            {s.price_display || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
                    ✅ No hidden charges &nbsp;·&nbsp; ✅ GST included &nbsp;·&nbsp; ✅ Medicines billed at actual cost
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 px-8" style={{ background:'#F59E0B' }}>
        <h2 className="font-black text-2xl text-gray-900 mb-3">Ready to Book?</h2>
        <p className="text-gray-900/70 mb-6">Online booking is free and instant. Or reach us on WhatsApp!</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/book" className="bg-gray-900 text-white font-extrabold px-8 py-3.5 rounded-full transition-all hover:bg-gray-700">📅 Book Now</Link>
          <a href="https://wa.me/919483852691" target="_blank" rel="noreferrer"
            className="font-extrabold px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90" style={{ background:'#25D366' }}>📱 WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
