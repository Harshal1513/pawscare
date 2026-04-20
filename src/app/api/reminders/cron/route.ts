import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Called daily at 8 AM IST (2:30 AM UTC) via vercel.json cron
// vercel.json: { "crons": [{ "path": "/api/reminders/cron", "schedule": "30 2 * * *" }] }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret') || req.headers.get('authorization')?.replace('Bearer ', '')

  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

  // Fetch reminders due within the next 3 days (early alert system)
  const { data: reminders, error } = await supabase
    .from('visits')
    .select('*, pets(*)')
    .gte('next_reminder_date', today)
    .lte('next_reminder_date', in3Days)
    .eq('reminder_sent', false)
    .order('next_reminder_date', { ascending: true })

  if (error) {
    console.error('[Cron] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const count = reminders?.length || 0
  console.log(`[Cron ${today}] Found ${count} reminders due in next 3 days`)

  /*
  ================================================================
  TO ENABLE AUTOMATIC WHATSAPP SENDING (Meta Cloud API):
  ================================================================

  1. Get credentials from developers.facebook.com → Business → WhatsApp
  2. Add to Vercel env: WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN

  Then uncomment this code:

  for (const r of reminders || []) {
    const msg = r.reminder_message || 
      `🐾 Paws Care & Heal Reminder: ${r.pets.pet_name} is due for a visit on ${r.next_reminder_date}. Call 094838 52691 to book.`
    
    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: `91${r.pets.mobile}`,
            type: 'text',
            text: { body: msg }
          })
        }
      )
      
      if (res.ok) {
        await supabase.from('visits').update({ reminder_sent: true }).eq('id', r.id)
        console.log(`[Cron] Sent reminder to ${r.pets.owner_name} for ${r.pets.pet_name}`)
      }
    } catch (err) {
      console.error('[Cron] Failed to send WA message:', err)
    }
  }
  ================================================================
  */

  return NextResponse.json({
    success: true,
    date: today,
    reminders_count: count,
    reminders: reminders?.map(r => ({
      pet: r.pets?.pet_name,
      owner: r.pets?.owner_name,
      mobile: r.pets?.mobile,
      due_date: r.next_reminder_date,
      days_until: Math.ceil((new Date(r.next_reminder_date!).getTime() - Date.now()) / 86400000),
    })),
    note: 'Visit /admin/reminders to send WhatsApp reminders manually, or add WA Cloud API for automatic sending'
  })
}
