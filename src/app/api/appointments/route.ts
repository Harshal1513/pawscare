import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { owner_name, mobile, email, pet_name, pet_type, pet_age, problem, preferred_date, preferred_time } = body

  if (!owner_name || !mobile || !pet_name) {
    return NextResponse.json({ error: 'Name, mobile and pet name are required' }, { status: 400 })
  }

  const { data, error } = await supabase.from('appointments').insert([{
    owner_name, mobile, email, pet_name,
    pet_type: pet_type || 'Dog',
    pet_age, problem, preferred_date, preferred_time,
    status: 'pending'
  }]).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data?.[0]?.id })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase.from('appointments')
    .select('*')
    .eq('preferred_date', date)
    .order('preferred_time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
