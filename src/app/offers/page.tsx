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

const OFFERS = [
  {
    tag:'🌧️ Monsoon Special', title:'Monsoon Vaccination Package', price:'₹999', orig:'₹1,500', bg:'#F59E0B',
    features:['Full vaccination dose (any)','Anti-tick & flea treatment','Deworming tablet','Complete physical exam','Health certificate'],
    waMsg:'Hi! I want the Monsoon Vaccination Package ₹999 at Paws Care & Heal Belagavi.',
  },
  {
    tag:'⭐ Most Popular', title:'Complete Wellness Check', price:'₹1,200', orig:'₹1,900', bg:'#5BC8D4',
    features:['Comprehensive physical exam','CBC blood test','Urine analysis','Dental health check','Nutrition consultation','Written health report'],
    waMsg:'Hi! I want the Complete Wellness Package ₹1,200 at Paws Care & Heal Belagavi.',
  },
  {
    tag:'👴 Senior Care', title:'Senior Pet Care Package', price:'₹1,500', orig:'₹2,400', bg:'#111827',
    features:['Geriatric health exam','Senior blood panel','Joint & mobility assessment','Eye and ear check','Senior nutrition plan','Pain management advice'],
    waMsg:'Hi! I want the Senior Pet Care Package ₹1,500 at Paws Care & Heal Belagavi.',
  },
  {
    tag:'🐣 New Pet', title:'New Pet Welcome Package', price:'₹799', orig:'₹1,200', bg:'#9333EA',
    features:['First health examination','First vaccination','Deworming treatment','Diet & nutrition guide','Free 1-month follow-up call'],
    waMsg:'Hi! I want the New Pet Welcome Package ₹799 at Paws Care & Heal Belagavi.',
  },
  {
    tag:'✨ Grooming Deal', title:'Groom + Health Combo', price:'₹899', orig:'₹1,350', bg:'#EC4899',
    features:['Full grooming session','Nail trimming & filing','Ear cleaning','Basic health check','Flea & tick spray'],
    waMsg:'Hi! I want the Groom + Health Combo ₹899 at Paws Care & Heal Belagavi.',
  },
  {
    tag:'💊 Annual Plan', title:'Annual Health Plan', price:'₹3,999', orig:'₹6,000', bg:'#0891B2',
    features:['4 quarterly checkups','All annual vaccinations','Bi-annual deworming','One blood test / year','10% discount on all services','Priority queue booking'],
    waMsg:'Hi! I want to enroll in the Annual Health Plan ₹3,999 at Paws Care & Heal Belagavi.',
  },
]

export default function OffersPage() {
  useReveal()
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-8" style={{ background:'linear-gradient(135deg,#FEF3C7,#fff)' }}>
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-4" style={{ background:'#F59E0B',color:'#fff' }}>🎉 Limited Time Deals</div>
        <h1 className="font-black text-4xl text-gray-900 mb-3">Special Offers</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-[15px] leading-[1.7]">Grab these exclusive packages before they expire! Book via WhatsApp for instant confirmation.</p>
        <div className="mt-4 inline-block bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full">⏰ Limited Slots — Book Now to Lock Your Price!</div>
      </div>

      {/* Offers */}
      <div className="px-10 py-14 max-sm:px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OFFERS.map(o => (
            <div key={o.title} className="rounded-[20px] p-6 flex flex-col justify-between transition-transform hover:-translate-y-1 reveal"
              style={{ background: o.bg }}>
              <div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 text-white" style={{ background:'rgba(255,255,255,.25)' }}>{o.tag}</span>
                <h3 className="text-white font-black text-xl mb-2 leading-[1.3]">{o.title}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white font-black text-3xl">{o.price}</span>
                  <span className="text-white/70 text-sm line-through">{o.orig}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(255,255,255,.2)', color:'#fff' }}>
                    Save {parseInt(o.orig.replace(/[₹,]/g,'')) - parseInt(o.price.replace(/[₹,]/g,'')) > 0 
                      ? `₹${(parseInt(o.orig.replace(/[₹,]/g,'')) - parseInt(o.price.replace(/[₹,]/g,''))).toLocaleString('en-IN')}`
                      : ''}
                  </span>
                </div>
                <ul className="space-y-1.5 mb-5">
                  {o.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-white/90">
                      <span className="text-white font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`https://wa.me/919483852691?text=${encodeURIComponent(o.waMsg)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-white font-extrabold text-sm py-3 rounded-full transition-all hover:opacity-90"
                  style={{ background:'#25D366' }}>
                  📱 Book on WhatsApp
                </a>
                <Link href="/book"
                  className="flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-full transition-all"
                  style={{ background:'rgba(255,255,255,.2)' }}>
                  📅 Book Online
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-10 pb-14 max-sm:px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-3xl mb-6 reveal">Common Questions</h2>
          <div className="space-y-3">
            {[
              ['Can these packages be used for any pet?','Yes! All packages apply to dogs, cats, and small animals unless specifically mentioned.'],
              ['How do I pay?','We accept cash, UPI (GPay, PhonePe, Paytm), and card at the clinic. Full payment at time of visit.'],
              ['Can I reschedule?','Yes! Inform us at least 24 hours in advance via WhatsApp or call to reschedule at no charge.'],
            ].map(([q,a]) => (
              <div key={q as string} className="bg-white rounded-2xl p-5 border border-gray-100 reveal" style={{ boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
                <div className="font-extrabold text-[15px] mb-2">❓ {q}</div>
                <div className="text-gray-500 text-[13.5px]">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
