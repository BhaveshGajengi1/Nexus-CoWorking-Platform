import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uadpnmbhxajdywrqmbtf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZHBubWJoeGFqZHl3cnFtYnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjY0MzgsImV4cCI6MjA5NTMwMjQzOH0.YKBZsNRsDwdPcAgJSXIMj_1yqQcoaCgsBWAzbua2Vk4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Center {
  id: string
  name: string
  city: string
  total_seats: number
  created_at: string
}

export interface Member {
  id: string
  name: string
  company: string
  email: string
  phone: string
  plan: 'Hotdesk' | 'Dedicated Desk' | 'Private Cabin'
  center_id: string
  seat_number: string | null
  start_date: string
  expiry_date: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface Visitor {
  id: string
  name: string
  company: string | null
  phone: string
  host_member: string
  purpose: string
  center_id: string
  check_in: string
  check_out: string | null
  status: 'checked_in' | 'checked_out'
}

export interface Booking {
  id: string
  room_name: string
  member_name: string
  center_id: string
  booking_date: string
  start_time: string
  end_time: string
  booking_type: 'Internal' | 'Client Meeting' | 'Event'
  notes: string | null
  created_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  member_name: string
  member_id: string | null
  center_id: string
  amount: number
  gst: number
  total: number
  due_date: string
  status: 'paid' | 'pending' | 'overdue'
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  raised_by: string
  center_id: string
  category: 'Maintenance' | 'IT' | 'Admin' | 'Complaint'
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  status: 'open' | 'in_progress' | 'resolved'
  assigned_to: string | null
  created_at: string
  resolved_at: string | null
}

export interface Lead {
  id: string
  company: string
  contact_name: string
  email: string
  phone: string
  space_type: 'Hotdesk' | 'Dedicated Desk' | 'Private Cabin' | 'Virtual Office'
  estimated_value: number | null
  stage: 'Lead' | 'Site Visit Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Agreement Signed' | 'Active Member'
  assigned_to: string | null
  center_id: string
  notes: string | null
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  is_read: boolean
  user_id: string | null
  created_at: string
}

// Helper functions
export async function getCenters() {
  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Center[]
}

export async function getMembers(centerId?: string) {
  let query = supabase.from('members').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  const { data, error } = await query.order('name')
  if (error) throw error
  return data as Member[]
}

export async function getVisitors(centerId?: string, status?: string) {
  let query = supabase.from('visitors').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  if (status) query = query.eq('status', status)
  const { data, error } = await query.order('check_in', { ascending: false })
  if (error) throw error
  return data as Visitor[]
}

export async function getBookings(centerId?: string, date?: string) {
  let query = supabase.from('bookings').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  if (date) query = query.eq('booking_date', date)
  const { data, error } = await query.order('start_time')
  if (error) throw error
  return data as Booking[]
}

export async function getInvoices(centerId?: string) {
  let query = supabase.from('invoices').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Invoice[]
}

export async function getTickets(centerId?: string, status?: string) {
  let query = supabase.from('tickets').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  if (status) query = query.eq('status', status)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Ticket[]
}

export async function getLeads(centerId?: string) {
  let query = supabase.from('leads').select('*')
  if (centerId) query = query.eq('center_id', centerId)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Lead[]
}

export async function getNotifications(unreadOnly = false) {
  let query = supabase.from('notifications').select('*')
  if (unreadOnly) query = query.eq('is_read', false)
  const { data, error } = await query.order('created_at', { ascending: false }).limit(50)
  if (error) throw error
  return data as Notification[]
}

export async function getUnreadNotificationCount() {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  if (error) throw error
  return count || 0
}

export async function markNotificationAsRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsAsRead() {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)
  if (error) throw error
}

export async function insertNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
  const { error } = await supabase
    .from('notifications')
    .insert({ ...notification, is_read: false })
  if (error) throw error
}
