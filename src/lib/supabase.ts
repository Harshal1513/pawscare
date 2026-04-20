import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
export const supabase = createClient(supabaseUrl, supabaseKey)

export type Pet = {
  id?: string
  owner_name: string
  mobile: string
  pet_name: string
  pet_type: string
  pet_age?: string
  notes?: string
  created_at?: string
}

export type Visit = {
  id?: string
  pet_id: string
  visit_date: string
  diagnosis: string
  treatment: string
  medicines?: string
  next_reminder_date?: string
  reminder_message?: string
  reminder_sent?: boolean
  created_at?: string
  pets?: Pet
}

export type Appointment = {
  id?: string
  owner_name: string
  mobile: string
  email?: string
  pet_name: string
  pet_type?: string
  pet_age?: string
  problem?: string
  preferred_date?: string
  preferred_time?: string
  status?: 'pending' | 'confirmed' | 'done' | 'cancelled'
  created_at?: string
}

export type Story = {
  id?: string
  pet_name: string
  pet_type?: string
  owner_name?: string
  problem_tags?: string[]
  story: string
  rating?: number
  bg_color?: string
  is_featured?: boolean
}

export type Service = {
  id?: string
  name: string
  description?: string
  duration_mins?: number
  price_display?: string
  category?: string
  is_active?: boolean
  display_order?: number
}
