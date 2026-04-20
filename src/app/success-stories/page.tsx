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

const STORIES = [
  {
    name: 'Rajeshwari Nesargi',
    img: '/images/rajeshwari.webp',
    objPos: 'center top',
    bg: '#F5A623',
    rating: 5,
    review: 'Dr. Praveen is an excellent and compassionate veterinarian. He handled my dog Charlie\'s neutering with great care and patience, took time to address all our concerns, and was extremely gentle throughout. Highly recommend him for his skill and kindness.',
  },
  {
    name: 'Ranjeet Mane',
    img: '/images/ranjeet.webp',
    objPos: 'center 30%',
    bg: '#5BC8D4',
    rating: 5,
    review: 'Absolutely love this vet clinic. Dr. Praveen is so friendly and knowledgeable.. and I would highly highly recommend him being his caring approach towards all pets. He really knows what he is doing, I express my heartfelt gratitude for his loyal service. So glad for the soonest recovery of my kitten!',
  },
  {
    name: 'Meghana C',
    img: '/images/meghana.webp',
    objPos: 'center 20%',
    bg: '#9B6BC4',
    rating: 5,
    review: 'I have visited this clinic with my shiztzu for so many times now. Dr. Praveen is very compassionate and caring about animals and has a very practical approach towards treating them. He doesn\'t prescribe unnecessary treatments and medication as seen in other clinics. I am really grateful for the way he treated my pet. He\'s very kind and gentle, now he\'s favourite Dr. of my pet. Highly recommend this clinic.',
  },
  {
    name: 'Gagan Lamani',
    img: '/images/gagan.webp',
    objPos: 'center 25%',
    bg: '#F59E0B',
    rating: 5,
    review: 'I recently had the pleasure of visiting Paws Care and Heal Pet Clinic, and I must say that my experience was exceptional. As a pet owner, finding a trustworthy and compassionate clinic for my furry companion is of utmost importance, and Paws Care and Heal surpassed my expectations in every way.',
  },
  {
    name: 'Jake Light',
    img: '/images/jake.webp',
    objPos: 'center 30%',
    bg: '#0891B2',
    rating: 5,
    review: 'Extremely happy and relieved to find a good doctor for my pet. I was already taking my cat to another vet and was not happy. Dr. Praveen told it was nothing but just urinary tract infection and gave medicines which in 2 days worked. The cat simply had suffered for a month with the previous useless treatment. We also got the cat neutered and the surgery lasted for 30 mins and all went well.',
  },
  {
    name: 'Aysha',
    img: '/images/aysha.webp',
    objPos: 'center 30%',
    bg: '#EC4899',
    rating: 5,
    review: 'We previously lost our beloved cat due to poor treatment from another doctor, and at the same time our Shih Tzu was also unwell. After switching to Dr. Praveen at Paws Care Clinic, we experienced a significant difference in care and treatment. He treated our pet effectively with minimal medication and ensured a smooth recovery. We truly appreciate his professionalism and dedication to pet care.',
  },
  {
    name: 'Nazneen Soudagar',
    img: '/images/nazneen.webp',
    objPos: 'center 25%',
    bg: '#8B9EB5',
    rating: 5,
    review: 'I must say… I have never come across such caring and polite doctor till now. Excellent service and well maintained hygienic clinic for pets. I had taken my male cat for neutering… very finely he was being operated. My pet recovered in just couple of days. I would surely recommend Paws Care and Heal Pet Clinic to all those animal lovers.',
  },
]

export default function SuccessStoriesPage() {
  useReveal()
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-16 px-8 bg-white">
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-4" style={{ background:'#FEF3C7', color:'#D97706' }}>🌟 Real Reviews from Google</div>
        <h1 className="font-black text-4xl text-gray-900 mb-3">Success Stories</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-[15px] leading-[1.7]">
          Read what our happy pet parents have to say about their experience at Paws Care and Heal Pet Clinic, Belagavi.
        </p>
      </div>

      {/* Client mosaic grid — Real clients */}
      <div className="px-10 pb-10 max-sm:px-5">
        <div className="max-w-6xl mx-auto reveal grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
      </div>

      {/* Detailed review cards */}
      <div className="px-10 pb-16 max-sm:px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black text-3xl mb-8 reveal">What Pet Parents Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STORIES.map(s => (
              <div key={s.name} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 reveal"
                style={{ boxShadow:'0 2px 16px rgba(0,0,0,.08)', transition:'transform .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
                <div className="h-52 relative overflow-hidden" style={{ background: s.bg }}>
                  <img src={s.img} alt={s.name + "'s pet"} className="w-full h-full object-cover" style={{ objectPosition: s.objPos }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-[17px]">{s.name}</h3>
                    <div className="flex gap-0.5 text-amber-400 text-sm">{'★★★★★'.split('').map((star,i)=><span key={i}>{star}</span>)}</div>
                  </div>
                  <p className="text-sm text-gray-500 leading-[1.7]">&ldquo;{s.review}&rdquo;</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
                    <span>📍</span> Reviewed on Google
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 px-8" style={{ background:'#F59E0B' }}>
        <h2 className="font-black text-2xl text-gray-900 mb-2">Your pet could be our next success story!</h2>
        <p className="text-gray-900/70 mb-6 text-[15px]">Book an appointment today and give your pet the care they deserve.</p>
        <Link href="/book" className="inline-flex items-center gap-2 bg-gray-900 text-white font-extrabold px-8 py-4 rounded-full transition-all hover:bg-gray-700">
          📅 Book an Appointment
        </Link>
      </div>
    </div>
  )
}
