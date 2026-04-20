import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  const { data, error } = await supabase.from('pets')
    .select('*')
    .or(`pet_name.ilike.%${q}%,mobile.ilike.%${q}%,owner_name.ilike.%${q}%`)
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { owner_name, mobile, pet_name, pet_type, pet_age } = body
  if (!owner_name || !mobile || !pet_name) {
    return NextResponse.json({ error: 'Owner name, mobile and pet name are required' }, { status: 400 })
  }
  const { data, error } = await supabase.from('pets').insert([{ owner_name, mobile, pet_name, pet_type: pet_type || 'Dog', pet_age }]).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, pet: data?.[0] })
}
