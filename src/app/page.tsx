'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star, Phone, Calendar, ChevronRight } from 'lucide-react'

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const SIGNS = [
  { icon: '🤢', label: 'Convulsions' },
  { icon: '🩺', label: 'Itching' },
  { icon: '💧', label: 'Thirst', highlight: true },
  { icon: '😮‍💨', label: 'Swelling' },
  { icon: '🧱', label: 'Swallowed foreign object' },
  { icon: '💦', label: 'Copious urination' },
  { icon: '🌡️', label: 'High fever' },
  { icon: '⚖️', label: 'Lost weight' },
  { icon: '🦷', label: 'Bad breath' },
  { icon: '😴', label: 'Lethargy' },
  { icon: '🦵', label: 'Limping' },
  { icon: '👁️', label: 'Eye discharge' },
  { icon: '🍽️', label: 'Not eating' },
  { icon: '🪱', label: 'Worms in stool' },
  { icon: '😰', label: 'Excessive panting' },
]

export default function HomePage() {
  useReveal()

  return (
    <div>
      {/* ── HERO ── */}
      <section className="grid md:grid-cols-2 min-h-[480px] md:min-h-[560px] overflow-hidden bg-white">
        <div className="flex flex-col justify-center px-6 md:px-12 py-10 md:py-16 max-sm:px-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full mb-4 md:mb-5 w-fit"
            style={{ background: '#FEF3C7', color: '#D97706' }}>
            🏆 Belagavi&apos;s #1 Pet Clinic · 4.9★ Google
          </div>
          <h1 className="font-black leading-[1.06] text-gray-900 mb-3 md:mb-4"
            style={{ fontSize: 'clamp(32px,5vw,62px)' }}>
            Veterinary
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-[68px] md:h-[68px] rounded-full text-2xl md:text-4xl align-middle ml-1 md:ml-2"
              style={{ background: '#5BC8D4', boxShadow: '0 6px 20px rgba(91,200,212,.4)' }}>
              🐶
            </span>
            <br />Clinic in<br />Belagavi
          </h1>
          {/* UPDATED WITH REAL GOOGLE DATA */}
          <p className="text-gray-500 text-sm md:text-base leading-[1.75] mb-2 md:mb-3 max-w-[400px]">
            Paws Care and Heal Pet Clinic works for Animals mainly Dogs and Cats - Health and welfare through proper treatment and advice to pet parents.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6 w-fit">
            <div className="flex gap-0.5 text-amber-400 text-sm">{'★★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
            <span className="font-bold text-sm">4.9</span>
            <span className="text-gray-400 text-xs">· 223 Reviews</span>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <Link href="/book"
              className="inline-flex items-center gap-2 text-white font-extrabold text-sm md:text-[15px] px-5 md:px-7 py-3 md:py-3.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: '#F59E0B', boxShadow: '0 6px 22px rgba(245,158,11,.35)' }}>
              <Calendar size={16} /> Book Now
            </Link>
            <a href="tel:09483852691"
              className="inline-flex items-center gap-2 font-extrabold text-sm md:text-[15px] px-5 md:px-7 py-3 md:py-3.5 rounded-full border-2 border-gray-200 text-gray-800 transition-all hover:border-amber-400 hover:text-amber-500">
              <Phone size={16} /> Call Now
            </a>
          </div>
          {/* Review card */}
          <div className="mt-6 md:mt-8 inline-flex items-center gap-3 md:gap-4 rounded-2xl p-4 md:p-5 max-w-[260px] md:max-w-[300px]"
            style={{ background: '#5BC8D4', boxShadow: '0 8px 30px rgba(91,200,212,.35)' }}>
            <div className="flex">
              {['🐕','🐈','🐩','🐇'].map((e,i) => (
                <div key={i} className="w-9 h-9 md:w-11 md:h-11 rounded-full border-[3px] border-white flex items-center justify-center text-lg md:text-xl"
                  style={{ marginLeft: i===0?0:-10, background: ['#F59E0B','#EC4899','#9333EA','#0891B2'][i] }}>
                  {e}
                </div>
              ))}
            </div>
            <div className="text-white font-semibold text-sm leading-snug">
              <div className="text-2xl md:text-3xl font-black leading-none">&gt;223</div>
              Happy Clients
            </div>
          </div>
        </div>
        {/* Cat image */}
        <div className="relative overflow-hidden bg-amber-50 max-sm:h-64 md:h-auto max-sm:rounded-t-3xl md:rounded-none flex items-center justify-center">
          <img
            src="/images/hero-cat.png"
            alt="Happy pet at Paws Care and Heal"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="px-10 py-14 bg-white max-sm:px-5 max-sm:py-10 reveal">
        <div className="max-w-6xl mx-auto rounded-[28px] p-8 md:p-12 grid md:grid-cols-2 gap-6 md:gap-8" style={{ background: '#111827' }}>
          {/* Left */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden h-44 md:h-56 mb-4 md:mb-5">
              <img src="/images/clinic_photo.webp"
                alt="Paws Care and Heal Pet Clinic" className="w-full h-full object-cover" />
              {/* UPDATED WITH REAL GOOGLE DATA */}
              <a href="https://www.google.com/maps/place/Paws+Care+and+Heal+Pet+Clinic/@15.8703859,74.4894242,17z" target="_blank" rel="noreferrer"
                className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-1.5 font-bold text-xs md:text-sm text-white px-3 py-2 md:px-5 md:py-2.5 rounded-full transition-all"
                style={{ background: '#F59E0B', boxShadow: '0 4px 14px rgba(245,158,11,.4)' }}>
                📍 Show on map
              </a>
            </div>
            <div style={{ position:'absolute',bottom:0,right:0,width:70,height:70,background:'#F59E0B',borderRadius:'50% 0 0 0' }} className="hidden md:block" />
            {/* UPDATED WITH REAL GOOGLE DATA */}
            <p className="text-white/70 text-sm leading-[1.8] max-sm:text-xs max-sm:leading-[1.6]">
              Paws Care and Heal Pet Clinic works for Animals mainly Dogs and Cats — Health and welfare through proper treatment and advice to pet parents. Located near Ganapati Temple, Double Road, Hindalga, Belagavi.
            </p>
          </div>
          {/* Right */}
          <div>
            <h2 className="text-white font-black text-2xl md:text-3xl mb-4 md:mb-6">About us</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'🫶', title:'Care',           desc:'Providing necessary treatment and care to help your pet recover and thrive.' },
                { icon:'💼', title:'Professionalism', desc:'Expert care with modern technology and proven medicines for best outcomes.' },
                { icon:'🧑‍⚕️', title:'Responsibility', desc:'Accurate and timely diagnoses, administering medications and treatments.' },
                { icon:'🙌', title:'Openness',       desc:'We are glad to answer any questions about your pet\'s health and welfare.' },
              ].map(c => (
                <div key={c.title} className="bg-white rounded-2xl p-4 md:p-5">
                  <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">{c.icon}</div>
                  <div className="font-extrabold text-xs md:text-sm mb-1 md:mb-1.5">{c.title}</div>
                  <div className="text-xs text-gray-500 leading-[1.65] max-sm:text-[11px]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="px-10 pb-14 bg-white max-sm:px-5 max-sm:pb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black text-2xl md:text-4xl mb-6 md:mb-8 reveal">Our services</h2>
          {/* Top 2 */}
          <div className="grid md:grid-cols-2 gap-3 mb-3 reveal">
            {[
              { name:'Surgery', count:'78', desc:'Planned, urgent and emergency operations for animals of any complexity. Expert surgical care under full anaesthesia monitoring.', emoji:'🔪' },
              { name:'Therapy', count:'124', desc:'Systematic actions for the treatment and prevention of diseases. Complete diagnostics, pathology identification and treatment prescription.', emoji:'💊' },
            ].map(s => (
              <div key={s.name} className="rounded-[20px] p-5 md:p-7 relative overflow-hidden cursor-default transition-transform hover:-translate-y-1"
                style={{ background: '#5BC8D4' }}>
                <div className="text-white font-black text-lg md:text-xl mb-2">{s.name}</div>
                <div className="text-white/88 text-sm leading-[1.65] mb-2 max-sm:text-xs">{s.desc}</div>
                <div className="text-white/60 text-xs font-semibold mb-3 md:mb-4">{s.count} services</div>
                <Link href="/services"
                  className="inline-flex items-center gap-1.5 bg-white/95 text-gray-900 font-bold text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-all hover:bg-white">
                  Read more →
                </Link>
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-4xl md:text-5xl">{s.emoji}</div>
              </div>
            ))}
          </div>
          {/* Bottom 3 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 reveal">
            {[
              { name:'Cardiology', count:'22', desc:'Taking care of your pet\'s cardiovascular system. Prevention and treatment of heart conditions.', emoji:'❤️' },
              { name:'Diagnostics', count:'96', desc:'Diagnosis of pets is the basis of successful treatment. Blood tests, X-ray, ultrasound available.', emoji:'🔬' },
            ].map(s => (
              <div key={s.name} className="rounded-[20px] p-5 md:p-7 relative overflow-hidden cursor-default transition-transform hover:-translate-y-1"
                style={{ background: '#5BC8D4' }}>
                <div className="text-white font-black text-lg md:text-xl mb-2">{s.name}</div>
                <div className="text-white/88 text-sm leading-[1.65] mb-2 max-sm:text-xs">{s.desc}</div>
                <div className="text-white/60 text-xs font-semibold mb-3 md:mb-4">{s.count} services</div>
                <Link href="/services"
                  className="inline-flex items-center gap-1.5 bg-white/95 text-gray-900 font-bold text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-all hover:bg-white">
                  Read more →
                </Link>
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-4xl md:text-5xl">{s.emoji}</div>
              </div>
            ))}
            {/* Appt card */}
            <div className="rounded-[20px] p-5 md:p-7 flex flex-col justify-between" style={{ background: '#F59E0B' }}>
              <div>
                <div className="text-3xl md:text-4xl mb-2 md:mb-3">📅</div>
                <div className="font-black text-lg md:text-xl text-gray-900 mb-2">Make an appointment</div>
                <div className="text-gray-900/70 text-sm leading-[1.6] max-sm:text-xs">A wide range of veterinary services and specialists around the clock.</div>
              </div>
              <Link href="/book"
                className="mt-3 md:mt-4 inline-flex items-center gap-1.5 bg-gray-900 text-white font-extrabold text-xs md:text-sm px-4 md:px-5 py-2 md:py-3 rounded-full w-fit transition-all hover:bg-gray-700">
                Book now →
              </Link>
            </div>
          </div>
          <div className="text-center mt-5 md:mt-6 reveal">
            <Link href="/services" className="inline-flex items-center gap-1 font-bold text-gray-500 hover:text-amber-500 transition-colors text-sm">
              View all services & prices <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="px-10 pb-10 md:pb-14 max-sm:px-5 reveal">
        <div className="max-w-6xl mx-auto relative rounded-[20px] md:rounded-[28px] overflow-hidden h-[200px] md:h-[280px]">
          <img src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=1400&q=80"
            alt="Happy dog" className="absolute inset-0 w-full h-full object-cover brightness-50" />
          <div className="relative z-10 flex items-center justify-between h-full px-6 md:px-12">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/95 rounded-full flex items-center justify-center font-black text-lg md:text-xl text-gray-900">&ldquo;</div>
            <div className="text-white font-black text-center px-2 md:px-6" style={{ fontSize: 'clamp(20px,4vw,48px)' }}>
              Giving hearts to animals
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/95 rounded-full flex items-center justify-center font-black text-lg md:text-xl text-gray-900">&rdquo;</div>
          </div>
        </div>
      </section>

      {/* ── OUR CLIENTS ── */}
      <section className="px-10 pb-14 max-sm:px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-7 flex-wrap gap-4">
            <div>
              <h2 className="font-black text-4xl mb-2 reveal">Our clients</h2>
              <p className="text-gray-500 text-[15px] max-w-[500px] leading-[1.7] reveal">
                Here you can read stories of the pets we have treated — their initial problems and how we made their lives happy again.
              </p>
            </div>
            <div className="flex gap-2">
              {['🐾','🐾'].map((p,i)=>(
                <button key={i} className="w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-lg hover:bg-amber-400 hover:border-amber-400 transition-all">{p}</button>
              ))}
            </div>
          </div>
          {/* Grid matching Dribbble layout — Real Clients */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 reveal">
            {[
              { bg:'#F5A623', name:'Rajeshwari Nesargi', img:'/images/rajeshwari.webp', objPos:'center top' },
              { bg:'#E8779A', name:'Ranjeet Mane',       img:'/images/ranjeet.webp',    objPos:'center 30%' },
              { bg:'#5BC8D4', name:'Gagan Lamani',       img:'/images/gagan.webp',      objPos:'center 25%' },
              { bg:'#9B6BC4', name:'Jake Light',         img:'/images/jake.webp',       objPos:'center 30%' },
              { bg:'#0891B2', name:'Meghana C',          img:'/images/meghana.webp',    objPos:'center 20%' },
              { bg:'#F59E0B', name:'Aysha',              img:'/images/aysha.webp',      objPos:'center 30%' },
              { bg:'#8B9EB5', name:'Nazneen Soudagar',   img:'/images/nazneen.webp',    objPos:'center 25%' },
            ].map(c => (
              <div key={c.name} className="rounded-2xl overflow-hidden relative cursor-pointer transition-transform hover:-translate-y-1 aspect-square md:aspect-[4/5] lg:aspect-auto"
                style={{ background:c.bg }}>
                <img src={c.img} alt={c.name + "'s pet"} className="w-full h-full object-cover" style={{ objectPosition: c.objPos }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <div className="text-white font-bold text-xs md:text-sm" style={{ textShadow:'0 1px 6px rgba(0,0,0,.5)' }}>{c.name}</div>
                  <div className="flex gap-0.5 text-amber-400 text-xs mt-1">{'★★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 reveal">
            <Link href="/success-stories" className="inline-flex items-center gap-1 font-bold text-gray-500 hover:text-amber-500 text-sm transition-colors">
              View all success stories <ChevronRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 15 SIGNS ── */}
      <section className="px-5 py-10 md:py-14 max-sm:px-4" style={{ background:'#F5F5F5' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start mb-6 md:mb-8 relative reveal">
            <div className="font-black text-gray-900 leading-[.82] select-none hidden max-sm:block" style={{ fontSize:'min(30vw,140px)' }}>15</div>
            <div className="font-black text-gray-900 leading-[.82] select-none max-sm:hidden" style={{ fontSize:'min(24vw,230px)' }}>15</div>
            <div className="pt-4 md:pt-6 flex-1">
              <div className="font-black text-gray-900 leading-[1.2]" style={{ fontSize: 'clamp(18px,3vw,36px)' }}>
                — signs that it is<br/>worth contacting<br/>a veterinarian!
              </div>
              <div className="mt-1 md:mt-2 text-xl md:text-2xl opacity-50 tracking-[8px]">🐾 🐾</div>
            </div>
            <div className="absolute right-0 top-0 hidden lg:block" style={{ width:'min(250px,20vw)' }}>
              <img src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&q=80"
                alt="Cat" className="w-full rounded-2xl" style={{ maxHeight:290, objectFit:'contain' }}/>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 relative z-10 reveal">
            {SIGNS.map(s => (
              s.highlight ? (
                <div key={s.label} className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center text-center" style={{ boxShadow:'0 2px 16px rgba(0,0,0,.08)' }}>
                  <span className="text-3xl md:text-4xl mb-1 md:mb-2">{s.icon}</span>
                  <div className="font-extrabold text-xs md:text-sm mb-1 md:mb-2">{s.label}</div>
                  <div className="text-xs text-gray-500 leading-[1.5] mb-2 md:mb-3 text-left max-sm:text-[10px]">
                    If the animal cannot quench its thirst and constantly asks to drink, make an appointment with an endocrinologist.
                  </div>
                  <Link href="/book" className="inline-flex items-center gap-1 text-white text-xs font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-full"
                    style={{ background:'#F59E0B' }}>Book now</Link>
                </div>
              ) : (
                <div key={s.label} className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center text-center min-h-[100px] md:min-h-[140px] justify-center cursor-default transition-transform hover:-translate-y-1"
                  style={{ background:'#F59E0B' }}>
                  <span className="text-3xl md:text-4xl mb-1 md:mb-2">{s.icon}</span>
                  <div className="text-white font-extrabold text-[10px] md:text-[13px] leading-[1.3]">{s.label}</div>
                </div>
              )
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8 reveal">
            <Link href="/book" className="inline-flex items-center gap-2 text-white font-extrabold text-sm px-6 md:px-8 py-3 md:py-3.5 rounded-full transition-all hover:bg-gray-700"
              style={{ background:'#111827' }}>
              Book an appointment now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DO NOT ── */}
      <section className="px-5 py-10 md:py-14 bg-white max-sm:px-4 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 md:mb-6">
            <div className="font-black text-gray-900 leading-[.95]" style={{ fontSize: 'clamp(36px,9vw,105px)' }}>Do not</div>
            <div className="font-bold text-gray-900 mt-1 md:mt-2 leading-[1.3]" style={{ fontSize:'clamp(14px,2.5vw,26px)' }}>
              forget to take your pet to check — this is important!
            </div>
          </div>
          {/* Pet photo strip */}
          <div className="flex gap-2 md:gap-3 h-28 md:h-44 mb-4 md:mb-6">
            {['https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80',
              'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
              'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
              'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&q=80',
            ].map((src,i) => (
              <div key={i} className="flex-1 rounded-xl md:rounded-2xl overflow-hidden bg-amber-50">
                <img src={src} alt="Pet" className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {[
              { white:false, title:'Swallowed a foreign object', text:'Come immediately for X-ray and emergency treatment if your pet swallowed something unusual.', emoji:'🐕' },
              { white:true,  title:'High temperature',           text:'Temperature above 39°C in dogs, a reason to consult a therapist. Come in today.', emoji:'🌡️' },
              { white:false, title:'Copious urination',          text:'Excessive urination can indicate kidney disease, diabetes or hormonal disorders.', emoji:'🐕‍🦺' },
              { white:false, title:'Lost weight',                text:'Sudden unexplained weight loss requires immediate veterinary attention and full diagnostics.', emoji:'⚖️' },
            ].map((c,i) => (
              <div key={i} className={`rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[160px] md:min-h-[200px] transition-transform hover:-translate-y-1 ${c.white ? '' : ''}`}
                style={{ background: c.white ? '#fff' : '#5BC8D4', boxShadow: c.white ? '0 2px 16px rgba(0,0,0,.08)' : 'none' }}>
                <div>
                  <div className={`font-extrabold text-xs md:text-[15px] mb-1.5 md:mb-2 ${c.white ? 'text-gray-900' : 'text-white'}`}>{c.title}</div>
                  <div className={`text-[10px] md:text-[12.5px] leading-[1.65] ${c.white ? 'text-gray-500' : 'text-white/90'}`}>{c.text}</div>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl text-center my-1.5 md:my-2">{c.emoji}</div>
                  <Link href="/book"
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all ${c.white ? 'text-white' : 'text-gray-900 bg-white/95 hover:bg-white'}`}
                    style={c.white ? { background:'#5BC8D4' } : {}}>
                    Book now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT FORM ── */}
      <section className="px-5 pb-10 md:pb-16 max-sm:px-4 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[20px] md:rounded-[28px] px-6 md:px-12 py-8 md:py-16 relative overflow-hidden text-center"
            style={{ background: '#F59E0B' }}>
            {/* Paw decorations - hide on mobile */}
            {['top-3 left-4','top-8 left-14 rotate-12','top-2 left-28 -rotate-12',
              'bottom-4 right-6 rotate-12','bottom-10 right-20 -rotate-12',
              'bottom-3 right-36','bottom-10 left-8 rotate-6'].map((cls,i) => (
              <span key={i} className={`absolute text-white/20 text-[18px] pointer-events-none hidden md:inline ${cls}`}>🐾</span>
            ))}
            {/* Cat bubble - hide on mobile */}
            <div className="absolute top-4 md:top-5 right-8 md:right-12 w-14 md:w-20 h-14 md:h-20 rounded-full bg-white/92 flex items-center justify-center text-3xl md:text-5xl hidden md:flex"
              style={{ boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>🐱</div>
            <h2 className="font-black text-gray-900 mb-2 md:mb-3 relative z-10" style={{ fontSize:'clamp(22px,4vw,46px)' }}>
              Make an appointment
            </h2>
            <p className="text-gray-900/70 text-[13px] md:text-[15px] leading-[1.7] mb-6 md:mb-8 max-w-[480px] mx-auto relative z-10">
              The administrator will contact you shortly to confirm the time and day of consultation.
            </p>
            <AppointmentForm />
          </div>
        </div>
      </section>
    </div>
  )
}

function AppointmentForm() {
  return (
    <div className="max-w-[480px] mx-auto text-left relative z-10 px-2 md:px-0">
      <form onSubmit={e => {
        e.preventDefault()
        const fd = new FormData(e.target as HTMLFormElement)
        const name = (fd.get('name') as string)?.trim()
        const phone = (fd.get('phone') as string)?.trim()
        const agree = fd.get('agree')
        if (!name || !phone) { alert('Please fill in your name and phone number.'); return }
        if (!agree) { alert('Please accept the terms to continue.'); return }
        const msg = `Hi! I'd like to book an appointment at Paws Care & Heal. My name is ${name}, phone: ${phone}. Please confirm availability.`
        window.open(`https://wa.me/919483852691?text=${encodeURIComponent(msg)}`, '_blank')
      }}>
        <div className="flex flex-col gap-2 md:gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-900/75 mb-1">Name</label>
            <input name="name" type="text" placeholder="Your full name" required
              className="w-full px-3 md:px-4 py-3 text-sm font-medium rounded-xl border-2 border-black/[.08] outline-none transition-all"
              style={{ background:'rgba(255,255,255,.75)', fontFamily:'Nunito,sans-serif' }}
              onFocus={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.4)',background:'rgba(255,255,255,.98)'})}
              onBlur={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.08)',background:'rgba(255,255,255,.75)'})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-900/75 mb-1">Email</label>
            <input name="email" type="email" placeholder="your@email.com"
              className="w-full px-3 md:px-4 py-3 text-sm font-medium rounded-xl border-2 border-black/[.08] outline-none transition-all"
              style={{ background:'rgba(255,255,255,.75)', fontFamily:'Nunito,sans-serif' }}
              onFocus={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.4)',background:'rgba(255,255,255,.98)'})}
              onBlur={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.08)',background:'rgba(255,255,255,.75)'})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-900/75 mb-1">Ph. number</label>
            <input name="phone" type="tel" placeholder="094838 52691" required
              className="w-full px-3 md:px-4 py-3 text-sm font-medium rounded-xl border-2 border-black/[.08] outline-none transition-all"
              style={{ background:'rgba(255,255,255,.75)', fontFamily:'Nunito,sans-serif' }}
              onFocus={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.4)',background:'rgba(255,255,255,.98)'})}
              onBlur={e=>Object.assign(e.target.style,{borderColor:'rgba(0,0,0,.08)',background:'rgba(255,255,255,.75)'})}
            />
          </div>
          <label className="flex items-start gap-2 md:gap-3 text-[10px] md:text-xs text-gray-900/65 cursor-pointer">
            <input name="agree" type="checkbox" required style={{ marginTop:2, width:14, height:14, accentColor:'#111827', flexShrink:0 }}/>
            <span>By clicking the &ldquo;Book now&rdquo; button, you accept the terms of personal data processing</span>
          </label>
          <button type="submit"
            className="w-full py-3 md:py-4 text-white font-black text-sm md:text-base rounded-full transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-1"
            style={{ background:'#111827', fontFamily:'Nunito,sans-serif' }}>
            Book now
          </button>
        </div>
      </form>
    </div>
  )
}
