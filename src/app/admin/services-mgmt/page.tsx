'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/lib/supabase'
import { Save, Plus, X } from 'lucide-react'

export default function AdminServicesMgmtPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [edits, setEdits]     = useState<Record<string, Partial<Service>>>({})
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [newSvc, setNewSvc]   = useState({ name:'', description:'', duration_mins:'', price_display:'', category:'general' })

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order')
    setServices(data || [])
    setLoading(false)
  }

  const updateEdit = (id: string, key: string, val: string) => {
    setEdits(p => ({ ...p, [id]: { ...p[id], [key]: val } }))
  }

  const saveOne = async (id: string) => {
    const patch = edits[id]
    if (!patch || Object.keys(patch).length === 0) return
    const { error } = await supabase.from('services').update(patch).eq('id', id)
    if (!error) {
      setSavedIds(p => new Set([...p, id]))
      setTimeout(() => setSavedIds(p => { const n = new Set(p); n.delete(id); return n }), 2000)
      setEdits(p => { const n = {...p}; delete n[id]; return n })
      load()
    } else alert('Error: ' + error.message)
  }

  const addService = async () => {
    if (!newSvc.name.trim()) { alert('Service name is required'); return }
    const { error } = await supabase.from('services').insert([{
      name: newSvc.name, description: newSvc.description,
      duration_mins: newSvc.duration_mins ? parseInt(newSvc.duration_mins) : null,
      price_display: newSvc.price_display, category: newSvc.category,
      display_order: services.length + 1, is_active: true,
    }])
    if (!error) { setShowAdd(false); setNewSvc({ name:'',description:'',duration_mins:'',price_display:'',category:'general' }); load() }
    else alert('Error: ' + error.message)
  }

  const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors bg-white'

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-white font-extrabold text-sm px-5 py-2.5 rounded-full"
          style={{ background: '#F59E0B' }}>
          {showAdd ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Service</>}
        </button>
      </div>

      {/* Add service form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border-2 p-6 mb-5" style={{ borderColor:'#F59E0B' }}>
          <h3 className="font-extrabold text-base mb-4">Add New Service</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Service Name *</label>
              <input value={newSvc.name} onChange={e=>setNewSvc(p=>({...p,name:e.target.value}))} placeholder="e.g. 🩺 General Checkup" className={`${inp} w-full`}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Price Display</label>
              <input value={newSvc.price_display} onChange={e=>setNewSvc(p=>({...p,price_display:e.target.value}))} placeholder="e.g. ₹500" className={`${inp} w-full`}/></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Duration (mins)</label>
              <input type="number" value={newSvc.duration_mins} onChange={e=>setNewSvc(p=>({...p,duration_mins:e.target.value}))} placeholder="e.g. 20" className={`${inp} w-full`}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Category</label>
              <select value={newSvc.category} onChange={e=>setNewSvc(p=>({...p,category:e.target.value}))} className={`${inp} w-full`}>
                <option value="general">General</option><option value="surgery">Surgery</option>
                <option value="diagnostics">Diagnostics</option><option value="prevention">Prevention</option>
                <option value="grooming">Grooming</option><option value="dental">Dental</option>
              </select></div>
          </div>
          <div className="mb-4"><label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
            <textarea value={newSvc.description} onChange={e=>setNewSvc(p=>({...p,description:e.target.value}))}
              placeholder="Brief description…" rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors resize-none"/></div>
          <div className="flex gap-3">
            <button onClick={addService} className="text-white font-extrabold text-sm px-6 py-2.5 rounded-full" style={{ background:'#F59E0B' }}>Save Service</button>
            <button onClick={()=>setShowAdd(false)} className="font-bold text-sm px-6 py-2.5 rounded-full border border-gray-200 text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Services table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-extrabold text-base">All Services &amp; Prices</span>
          <span className="text-xs text-gray-400">Edit any price and click Save</span>
        </div>
        {loading ? (
          <div className="p-10 text-center text-amber-500 font-bold">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Active</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr></thead>
              <tbody>
                {services.map((s, i) => {
                  const e = edits[s.id!] || {}
                  return (
                    <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3.5">
                        <input value={e.name !== undefined ? e.name : (s.name||'')}
                          onChange={ev => updateEdit(s.id!, 'name', ev.target.value)}
                          className={`${inp} w-full min-w-[200px]`}/>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                          {s.category || 'general'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <input type="number" value={e.duration_mins !== undefined ? e.duration_mins : (s.duration_mins||'')}
                          onChange={ev => updateEdit(s.id!, 'duration_mins', ev.target.value)}
                          placeholder="mins" className={`${inp} w-20`}/>
                      </td>
                      <td className="px-4 py-3.5">
                        <input value={e.price_display !== undefined ? e.price_display : (s.price_display||'')}
                          onChange={ev => updateEdit(s.id!, 'price_display', ev.target.value)}
                          placeholder="₹0" className={`${inp} w-32 font-bold`}
                          style={{ color:'#D97706' }}/>
                      </td>
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={s.is_active !== false}
                          onChange={async ev => {
                            await supabase.from('services').update({ is_active: ev.target.checked }).eq('id', s.id!)
                            load()
                          }}
                          style={{ width:16, height:16, accentColor:'#F59E0B', cursor:'pointer' }}/>
                      </td>
                      <td className="px-4 py-3.5">
                        {savedIds.has(s.id!) ? (
                          <span className="text-green-600 text-xs font-bold">✅ Saved!</span>
                        ) : (
                          <button onClick={() => saveOne(s.id!)}
                            disabled={!edits[s.id!]}
                            className={`flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-full text-white transition-all
                              ${edits[s.id!] ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'}`}
                            style={{ background: edits[s.id!] ? '#F59E0B' : '#9CA3AF' }}>
                            <Save size={12}/> Save
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
