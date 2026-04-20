'use client'
import { useEffect } from 'react'
import Link from 'next/link'

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

const SERVICES = [
  { name:'🔪 Surgery',         count:78,  price:'from ₹2,500', desc:'Planned, urgent and emergency operations for animals of any complexity. Expert care under full anaesthesia monitoring and post-op care.' },
  { name:'💊 Therapy',         count:124, price:'₹500–₹1,500', desc:'Systematic treatment and prevention of diseases. Complete diagnostics, pathology identification and prescription.' },
  { name:'❤️ Cardiology',      count:22,  price:'from ₹800',   desc:'ECG, echocardiography, prevention and treatment of heart conditions for dogs and cats.' },
  { name:'🔬 Diagnostics',     count:96,  price:'from ₹400',   desc:'Blood tests, urine analysis, X-ray and ultrasound — the basis of successful treatment.' },
  { name:'💉 Vaccination',     count:15,  price:'₹300–₹1,200', desc:'Full vaccination schedule including Rabies, DHPP, FVRCP. Annual boosters available.' },
  { name:'✂️ Grooming',        count:12,  price:'₹400–₹900',  desc:'Professional grooming — bath, trim, nail cutting, ear cleaning. Basic and full packages.' },
  { name:'🦷 Dentistry',       count:8,   price:'from ₹1,800', desc:'Professional dental scaling and cleaning. Early detection of dental disease prevents systemic issues.' },
  { name:'🧬 Microchipping',   count:1,   price:'₹1,000',      desc:'ISO standard microchip for permanent pet identification. Recommended for all pets.' },
]

const PRICES = [
  ['🩺 General Checkup',       '20 min', '₹500'],
  ['💉 Vaccination (per dose)', '15 min', '₹300–₹1,200'],
  ['🪱 Deworming',             '10 min', '₹250'],
  ['🔬 Blood Test (CBC)',       '30 min', '₹700'],
  ['📷 X-Ray',                 '30 min', '₹900'],
  ['🔊 Ultrasound Scan',       '30 min', '₹1,200'],
  ['✂️ Grooming (Basic)',       '45 min', '₹400'],
  ['✂️ Grooming (Full)',        '90 min', '₹900'],
  ['🦷 Dental Cleaning',        '1 hr',   '₹1,800'],
  ['🏥 Minor Surgery',          'Varies', '₹2,500+'],
  ['🐣 New Pet Exam',           '30 min', '₹799'],
  ['🧬 Microchipping',          '10 min', '₹1,000'],
]

export default function ServicesPage() {
  useReveal()
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-8" style={{ background:'#FEF3C7' }}>
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-4" style={{ background:'#F59E0B', color:'#fff' }}>🩺 Expert Veterinary Care</div>
        <h1 className="font-black text-4xl text-gray-900 mb-3">Services &amp; Prices</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-[1.7]">Comprehensive veterinary care at transparent, affordable prices for your beloved pets in Belagavi.</p>
      </div>

      {/* Services grid */}
      <div className="px-10 py-14 max-sm:px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black text-3xl mb-8 reveal">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {SERVICES.map(s => (
              <div key={s.name} className="rounded-[20px] p-6 relative overflow-hidden cursor-default transition-transform hover:-translate-y-1 reveal"
                style={{ background:'#5BC8D4' }}>
                <div className="text-white font-black text-lg mb-2">{s.name}</div>
                <div className="text-white/88 text-sm leading-[1.65] mb-3">{s.desc}</div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-semibold">{s.count} services</span>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{s.price}</span>
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
                  {PRICES.map(([name,dur,price],i) => (
                    <tr key={name} className={i%2===0?'bg-white':'bg-gray-50'}>
                      <td className="px-5 py-3.5 text-sm">{name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{dur}</td>
                      <td className="px-5 py-3.5 font-bold" style={{ color:'#D97706' }}>{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
                ✅ No hidden charges &nbsp;·&nbsp; ✅ GST included &nbsp;·&nbsp; ✅ Medicines billed at actual cost
              </div>
            </div>
          </div>
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
