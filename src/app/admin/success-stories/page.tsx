'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Story } from '@/lib/supabase'
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react'

const COLORS = ['#F5A623','#5BC8D4','#9333EA','#EC4899','#111827','#0891B2','#10B981']

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Story | null>(null)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Story>({
    pet_name:'', pet_type:'Dog', owner_name:'', problem_tags:[], story:'', rating:5, bg_color:'#F5A623', is_featured:false, image_url:'',
  })
  const [tagsInput, setTagsInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false })
    setStories(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ pet_name:'', pet_type:'Dog', owner_name:'', problem_tags:[], story:'', rating:5, bg_color:'#F5A623', is_featured:false, image_url:'' })
    setTagsInput('')
    setImageFile(null)
    setImagePreview('')
    setShowForm(true)
  }

  const openEdit = (s: Story) => {
    setEditing(s)
    setForm(s)
    setTagsInput((s.problem_tags || []).join(', '))
    setImageFile(null)
    setImagePreview(s.image_url || '')
    setShowForm(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null
    setUploading(true)
    try {
      const ext = imageFile.name.split('.').pop()
      const fileName = `story-${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('pet-images')
        .upload(fileName, imageFile, { upsert: true })
      if (error) {
        // Storage bucket may not exist — fall back to base64 data URL stored inline
        console.warn('Storage upload failed, using data URL:', error.message)
        return imagePreview // use the base64 preview
      }
      const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName)
      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.pet_name.trim() || !form.story.trim()) { alert('Pet name and story are required'); return }
    const imageUrl = await uploadImage()
    const payload = {
      ...form,
      problem_tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      image_url: imageUrl || '',
    }
    const { error } = editing?.id
      ? await supabase.from('stories').update(payload).eq('id', editing.id)
      : await supabase.from('stories').insert([payload])
    if (!error) {
      setSaved(true); setTimeout(() => setSaved(false), 3000)
      setShowForm(false)
      load()
    } else alert('Error: ' + error.message)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this story?')) return
    await supabase.from('stories').delete().eq('id', id)
    load()
  }

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors bg-white'

  return (
    <div>
      {saved && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 font-semibold text-sm">✅ Story saved!</div>}

      <div className="flex justify-end mb-5">
        <button onClick={openAdd}
          className="flex items-center gap-2 text-white font-extrabold text-sm px-5 py-2.5 rounded-full"
          style={{ background: '#F59E0B' }}>
          <Plus size={16}/> Add Story
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 p-6 mb-6" style={{ borderColor:'#F59E0B' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-base">{editing ? 'Edit Story' : 'Add New Success Story'}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400 hover:text-gray-700"/></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Name *</label>
              <input value={form.pet_name} onChange={e=>setForm(p=>({...p,pet_name:e.target.value}))} placeholder="e.g. Rocky" className={inp}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Type</label>
              <select value={form.pet_type} onChange={e=>setForm(p=>({...p,pet_type:e.target.value}))} className={inp}>
                <option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option>
              </select></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Owner Name</label>
              <input value={form.owner_name||''} onChange={e=>setForm(p=>({...p,owner_name:e.target.value}))} placeholder="e.g. Vikram M." className={inp}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Problem Tags (comma separated)</label>
              <input value={tagsInput} onChange={e=>setTagsInput(e.target.value)} placeholder="e.g. Skin infection, Hair loss" className={inp}/></div>
          </div>
          <div className="mb-4"><label className="block text-xs font-bold text-gray-600 mb-1.5">Story Description *</label>
            <textarea value={form.story} onChange={e=>setForm(p=>({...p,story:e.target.value}))}
              placeholder="Describe the pet's journey and recovery…" rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors resize-vertical"/></div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Pet Photo</label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-amber-300">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(''); setForm(p => ({...p, image_url:''})); if(fileRef.current) fileRef.current.value='' }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 text-gray-400 text-3xl bg-gray-50">
                  🐾
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="story-image-upload"
                />
                <label htmlFor="story-image-upload"
                  className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-amber-300 rounded-xl px-4 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors w-fit">
                  <Upload size={16}/> {imagePreview ? 'Change Photo' : 'Upload Pet Photo'}
                </label>
                <p className="text-xs text-gray-400 mt-2">JPG/PNG/WebP · Max 5MB<br/>This photo will appear on the story card</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div><label className="block text-xs font-bold text-gray-600 mb-2">Card Background Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={()=>setForm(p=>({...p,bg_color:c}))}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{ background:c, borderColor: form.bg_color===c ? '#111' : 'transparent', transform: form.bg_color===c ? 'scale(1.2)' : 'scale(1)' }}/>
                ))}
              </div></div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.is_featured||false}
                  onChange={e=>setForm(p=>({...p,is_featured:e.target.checked}))}
                  style={{ width:16, height:16, accentColor:'#F59E0B' }}/>
                <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">Featured story</label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={uploading} className="text-white font-extrabold text-sm px-6 py-2.5 rounded-full disabled:opacity-60" style={{ background:'#F59E0B' }}>
              {uploading ? '⏳ Uploading…' : editing ? 'Update Story' : 'Save Story'}
            </button>
            <button onClick={()=>setShowForm(false)} className="font-bold text-sm px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-amber-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stories list */}
      {loading ? (
        <div className="text-center py-16 text-amber-500 font-bold">Loading stories…</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🌟</div>
          <div className="font-bold text-gray-500 text-lg mb-2">No success stories yet</div>
          <div className="text-sm">Click &ldquo;Add Story&rdquo; to create your first success story</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {stories.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-32 flex items-center justify-center text-6xl relative"
                style={{ background: s.bg_color || '#F5A623' }}>
                {s.image_url ? (
                  <img src={s.image_url} alt={s.pet_name} className="w-full h-full object-cover"/>
                ) : (
                  <span>{s.pet_type === 'Cat' ? '🐈' : s.pet_type === 'Dog' ? '🐕' : '🐾'}</span>
                )}
                {s.is_featured && (
                  <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ background:'rgba(0,0,0,.4)' }}>⭐ Featured</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-extrabold text-base">{s.pet_name} — {s.pet_type}</div>
                    {s.owner_name && <div className="text-xs text-gray-400">{s.owner_name}</div>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 transition-colors">
                      <Edit2 size={13} className="text-gray-600"/>
                    </button>
                    <button onClick={() => del(s.id!)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={13} className="text-red-500"/>
                    </button>
                  </div>
                </div>
                {(s.problem_tags || []).length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {(s.problem_tags || []).map(t => (
                      <span key={t} className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:'#FEF3C7', color:'#92400E' }}>{t}</span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 leading-[1.65] line-clamp-2">{s.story}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
