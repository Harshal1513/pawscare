'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'

type Msg = { id: number; text: string; isBot: boolean }

const RULES = [
  { k: ['hello','hi','hey','help','start'], r: `👋 Welcome to Paws Care & Heal!\n\nI can help with:\n• Symptoms & first aid\n• Vaccine schedules\n• Prices & packages\n• Clinic hours & location\n\nJust type your question! 🐾` },
  { k: ['not eating','no appetite','refuse','wont eat'], r: `🍽️ Loss of Appetite\n\nPossible causes:\n• Stress or dental pain\n• Upset stomach or fever\n\n✅ Offer warm soft food. Keep water fresh.\n\n⚠️ See vet if not eating 48+ hrs.` },
  { k: ['vomit','throwing up','puke','nausea'], r: `🤢 Vomiting\n\n• Once = can be normal\n• Repeated = vet needed\n• Blood = EMERGENCY!\n\n✅ Withhold food 4-6 hrs, small water sips.` },
  { k: ['itch','scratch','skin','flea','tick','rash'], r: `🐛 Itching / Skin Issues\n\nCauses:\n• Fleas or ticks\n• Allergies (food/seasonal)\n• Fungal infection\n\n✅ Check for flea dirt in fur.\n\n💊 Medicated shampoo or antiparasitic needed.` },
  { k: ['vaccine','vaccination','shot','rabies','parvo'], r: `💉 Vaccination Schedule\n\n🐕 Dogs:\n• 6-8 wks: Parvo + Distemper\n• 10-12 wks: DHPP\n• 16 wks: Rabies · Annual boosters\n\n🐈 Cats:\n• 8 wks: FVRCP\n• 16 wks: Rabies · Annual boosters\n\n🎁 Monsoon Package ₹999!` },
  { k: ['diarrhea','loose stool','watery'], r: `💧 Diarrhea\n\n✅ Boiled rice + plain chicken. Stay hydrated.\n\n⚠️ Vet needed if 48+ hrs or blood in stool.` },
  { k: ['worm','deworm','parasite'], r: `🪱 Deworming\n\n• Puppies/Kittens: every 2 wks till 3 months\n• Adults: every 3–6 months\n\n💊 Oral tablets at clinic — ₹250` },
  { k: ['limp','leg','bone','fracture'], r: `🦴 Limping\n\n⚠️ NEVER give Paracetamol/Aspirin — TOXIC to pets!\n\n🚨 Needs vet exam urgently. Book now.` },
  { k: ['fever','temperature','hot'], r: `🌡️ Fever\n\nNormal: 38.3–39.2°C\n\n❌ NO human painkillers!\n\n🚨 Above 40°C = emergency. Come in today.` },
  { k: ['price','cost','fee','how much'], r: `💰 Price List\n\n• Checkup: ₹500\n• Vaccination: ₹300–₹1,200\n• Deworming: ₹250\n• Blood Test: ₹700\n• X-Ray: ₹900\n• Grooming: ₹400–₹900\n\n🎁 Monsoon Package ₹999` },
  { k: ['hour','timing','open','when'], r: `⏰ Clinic Hours\n\nMon–Sat: 9:00 AM – 6:00 PM\nSunday: Emergency only\n\n📍 Near Hindalga, Hanuman Nagar, Belagavi\n📞 094838 52691` },
  { k: ['address','location','where'], r: `📍 Location\n\nGanapati Temple, double road,\nnear Hindalga, beside Shambavi Clinic,\nHanuman Nagar, Belagavi 590019\n\n📞 094838 52691` },
  { k: ['puppy','kitten','new pet'], r: `🐣 New Pet Package — ₹799\n\n✅ First health exam\n✅ First vaccination\n✅ Deworming treatment\n✅ Diet & nutrition guide\n✅ Free 1-month follow-up call` },
]
const DEFAULT = `🤔 Not sure about that.\n\nTry asking about:\n• Symptoms & first aid\n• Vaccinations\n• Prices & packages\n• Clinic hours\n\nOr call: 📞 094838 52691`

function getReply(msg: string): string {
  const l = msg.toLowerCase()
  for (const r of RULES) if (r.k.some(k => l.includes(k))) return r.r
  return DEFAULT
}

const SUGS = ['💉 Vaccines', '🍽️ Not eating', '💰 Prices', '⏰ Hours', '🤢 Vomiting']

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ id: 1, isBot: true, text: "👋 Hi! I'm PawBot!\n\nDescribe your pet's problem and I'll help, or ask about our services, prices, or clinic hours. 🐾" }])
    }
  }, [open])

  const sendMsg = (text: string) => {
    if (!text.trim()) return
    setInput('')
    setMsgs(p => [...p, { id: Date.now(), text, isBot: false }])
    setTyping(true)
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now() + 1, text: getReply(text), isBot: true }])
      setTyping(false)
    }, 700)
  }

  const fmt = (t: string) => t.replace(/\n/g, '<br />')

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white"
          style={{ width: 'min(360px, calc(100vw - 40px))', height: 490 }}>

          {/* Header */}
          <div className="flex items-center gap-3 p-4" style={{ background: '#F59E0B' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg bg-white/20">🐾</div>
            <div>
              <div className="font-extrabold text-white text-sm">PawBot</div>
              <div className="text-xs text-white/80">Paws Care &amp; Heal · Always here</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50">
            {msgs.map(m => (
              <div key={m.id} className={`flex items-start gap-2 ${m.isBot ? '' : 'justify-end'}`}>
                {m.isBot && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                    style={{ background: '#F59E0B' }}>🐾</div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                  ${m.isBot
                    ? 'bg-white text-gray-900 border border-gray-100 shadow-sm rounded-tl-none'
                    : 'text-white rounded-tr-none'}`}
                  style={m.isBot ? {} : { background: '#F59E0B' }}>
                  <span dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                  {m.isBot && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <a href="/book"
                        className="inline-block text-white text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: '#111827' }}>
                        📅 Book Appointment
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: '#F59E0B' }}>🐾</div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-3 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="typing-dot" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar bg-white border-t border-gray-100">
            {SUGS.map(s => (
              <button key={s} onClick={() => sendMsg(s)}
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap"
                style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 bg-white border-t border-gray-100">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
              placeholder="Ask about your pet…"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button onClick={() => sendMsg(input)}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{ background: '#F59E0B' }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 animate-pulse-amber"
        style={{ background: '#F59E0B' }}>
        {open ? <X size={22} /> : <span className="text-2xl">🐾</span>}
      </button>
    </>
  )
}
