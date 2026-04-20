import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const petId = searchParams.get('pet_id')
  if (!petId) return NextResponse.json({ error: 'pet_id required' }, { status: 400 })

  const { data, error } = await supabase.from('visits')
    .select('*')
    .eq('pet_id', petId)
    .order('visit_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { pet_id, visit_date, diagnosis, treatment, medicines, reminder_option, custom_days, reminder_message } = body

  if (!pet_id || !diagnosis || !treatment) {
    return NextResponse.json({ error: 'pet_id, diagnosis and treatment are required' }, { status: 400 })
  }

  // Calculate reminder date
  let reminderDate: string | null = null
  if (reminder_option && reminder_option !== 'none') {
    const base = new Date(visit_date || new Date())
    const days = reminder_option === 'custom' ? (parseInt(custom_days) || 30)
      : reminder_option === '180' ? 180
      : reminder_option === '365' ? 365
      : parseInt(reminder_option)
    base.setDate(base.getDate() + days)
    reminderDate = base.toISOString().split('T')[0]
  }

  const { data, error } = await supabase.from('visits').insert([{
    pet_id,
    visit_date: visit_date || new Date().toISOString().split('T')[0],
    diagnosis,
    treatment,
    medicines,
    next_reminder_date: reminderDate,
    reminder_message,
    reminder_sent: false,
  }]).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, visit: data?.[0] })
}

export async function PATCH(req: NextRequest) {
  const { id, reminder_sent } = await req.json()
  const { error } = await supabase.from('visits').update({ reminder_sent }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
