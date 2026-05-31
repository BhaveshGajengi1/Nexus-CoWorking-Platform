'use client'

import { useEffect, useState, useCallback } from 'react'
import { 
  Users, TrendingUp, DollarSign, Ticket, Building2, 
  Activity, Clock, AlertTriangle, RefreshCw
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell 
} from 'recharts'
import { supabase, type Center, type Member, type Invoice, type Ticket as TicketType, type Visitor, type Booking } from '@/lib/supabase'

interface CommandDashboardProps {
  selectedCenter: string
}

// Helpers
function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  
  useEffect(() => {
    if (isNaN(target) || target === 0) {
      setCount(0)
      setIsAnimating(false)
      return
    }
    
    setIsAnimating(true)
    const steps = 80
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
        setTimeout(() => setIsAnimating(false), 500)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [target, duration])
  
  return (
    <span className={`transition-all duration-300 ${isAnimating ? 'animate-number-glow' : ''}`}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

function KPICard({ 
  title, value, icon: Icon, trend, trendUp, color = 'cyan', prefix = '', suffix = '', loading = false
}: { 
  title: string
  value: number | string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  color?: 'cyan' | 'amber' | 'success'
  prefix?: string
  suffix?: string
  loading?: boolean
}) {
  const colorClasses = {
    cyan: {
      gradient: 'from-[#00D4FF] to-[#0088AA]',
      text: 'text-[#00D4FF]',
      border: 'border-[rgba(0,212,255,0.3)]',
      glow: 'hover:shadow-[0_0_40px_rgba(0,212,255,0.4),0_0_80px_rgba(0,212,255,0.2)]',
      iconGlow: 'shadow-[0_0_20px_rgba(0,212,255,0.5),0_0_40px_rgba(0,212,255,0.3)]',
      textGlow: 'text-glow-cyan-intense',
    },
    amber: {
      gradient: 'from-[#F5A623] to-[#CC8400]',
      text: 'text-[#F5A623]',
      border: 'border-[rgba(245,166,35,0.3)]',
      glow: 'hover:shadow-[0_0_40px_rgba(245,166,35,0.4),0_0_80px_rgba(245,166,35,0.2)]',
      iconGlow: 'shadow-[0_0_20px_rgba(245,166,35,0.5),0_0_40px_rgba(245,166,35,0.3)]',
      textGlow: 'text-glow-amber',
    },
    success: {
      gradient: 'from-[#00E676] to-[#00B85C]',
      text: 'text-[#00E676]',
      border: 'border-[rgba(0,230,118,0.3)]',
      glow: 'hover:shadow-[0_0_40px_rgba(0,230,118,0.4),0_0_80px_rgba(0,230,118,0.2)]',
      iconGlow: 'shadow-[0_0_20px_rgba(0,230,118,0.5),0_0_40px_rgba(0,230,118,0.3)]',
      textGlow: 'text-glow-success',
    }
  }

  const styles = colorClasses[color]
  const displayValue = typeof value === 'number' ? value : 0
  const isNumeric = typeof value === 'number'

  return (
    <div className={`relative overflow-hidden glass-card rounded-xl p-5 hover-lift border transition-all duration-500 ${styles.border} ${styles.glow} group`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-5`} />
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${styles.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center ${styles.iconGlow} transition-all duration-300 group-hover:scale-110`}>
            <Icon className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full font-medium ${trendUp ? 'bg-[rgba(0,230,118,0.15)] text-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.3)]' : 'bg-[rgba(255,71,87,0.15)] text-[#FF4757] shadow-[0_0_10px_rgba(255,71,87,0.3)]'}`}>
              <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
              {trend}
            </div>
          )}
        </div>
        <p className="text-[#8888A0] text-sm mb-2 tracking-wide uppercase">{title}</p>
        {loading ? (
          <div className="h-10 w-24 bg-[#1A1A24] rounded animate-pulse" />
        ) : (
          <p className={`text-4xl font-bold ${styles.text} ${styles.textGlow} font-[var(--font-display)] tracking-tight`}>
            {isNumeric ? (
              <AnimatedCounter target={displayValue} prefix={prefix} suffix={suffix} duration={2500} />
            ) : (
              <span>{value}</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

function CenterCard({ center, members, visitors, bookings }: { center: Center; members: Member[]; visitors: Visitor[]; bookings: Booking[] }) {
  const centerMembers = members.filter(m => m.center_id === center.id && m.status === 'active')
  const totalSeats = center.total_seats || 1
  const occupancyPercent = Math.min(100, Math.round((centerMembers.length / totalSeats) * 100)) || 0
  
  const centerVisitors = visitors.filter(v => v.center_id === center.id && v.status === 'checked_in')
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.center_id === center.id && b.booking_date === today)
  
  let status: 'Thriving' | 'Moderate' | 'Low' | 'No Data' = 'No Data'
  if (centerMembers.length > 0) {
    if (occupancyPercent >= 70) status = 'Thriving'
    else if (occupancyPercent >= 40) status = 'Moderate'
    else status = 'Low'
  }
  
  const statusColors = {
    'Thriving': 'bg-[#00E676] text-[#0A0A0F] shadow-[0_0_15px_rgba(0,230,118,0.5)]',
    'Moderate': 'bg-[#F5A623] text-[#0A0A0F] shadow-[0_0_15px_rgba(245,166,35,0.5)]',
    'Low': 'bg-[#FF4757] text-white shadow-[0_0_15px_rgba(255,71,87,0.5)]',
    'No Data': 'bg-[#555566] text-white'
  }

  return (
    <div className="relative overflow-hidden glass-card rounded-xl p-5 hover-lift group transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[1px] rounded-xl bg-[#111118]" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#00E676] to-[#00D4FF] opacity-30 animate-border-glow" style={{ padding: '1px' }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A1A24] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-shadow duration-300">
              <Building2 className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{center.name}</h3>
              <p className="text-xs text-[#8888A0]">{center.city}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#8888A0]">Occupancy ({centerMembers.length}/{totalSeats})</span>
            <span className="text-white font-medium">{occupancyPercent}%</span>
          </div>
          <div className="h-2 bg-[#1A1A24] rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00E676] rounded-full transition-all duration-1000 relative"
              style={{ width: `${occupancyPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {occupancyPercent > 0 && (
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#00E676] blur-md opacity-60"
                style={{ left: `calc(${occupancyPercent}% - 8px)` }}
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1A1A24] rounded-lg p-3 group-hover:bg-[#1F1F2C] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#8888A0] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse-dot shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
              Active Visitors
            </div>
            <p className="text-xl font-bold text-white">{centerVisitors.length}</p>
          </div>
          <div className="bg-[#1A1A24] rounded-lg p-3 group-hover:bg-[#1F1F2C] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#8888A0] mb-1">
              <Clock className="w-3 h-3" />
              Today&apos;s Bookings
            </div>
            <p className="text-xl font-bold text-white">{todayBookings.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActivityEvent {
  id: string
  type: 'check-in' | 'booking' | 'payment' | 'invoice-created'
  message: string
  timestamp: string
  centerId?: string
}

function LiveActivityFeed({ events, loading }: { events: ActivityEvent[]; loading: boolean }) {
  const typeColors = {
    'check-in': 'bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.8)]',
    'booking': 'bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.8)]',
    'payment': 'bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.8)]',
    'invoice-created': 'bg-[#F5A623] shadow-[0_0_8px_rgba(245,166,35,0.8)]',
  }

  // Sample data for empty state
  const sampleEvents: ActivityEvent[] = [
    { id: 's1', type: 'check-in', message: 'Sample: Visitor checked in', timestamp: new Date().toISOString() },
    { id: 's2', type: 'booking', message: 'Sample: Boardroom booked', timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: 's3', type: 'invoice-created', message: 'Sample: Invoice created', timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: 's4', type: 'payment', message: 'Sample: Payment received', timestamp: new Date(Date.now() - 900000).toISOString() },
    { id: 's5', type: 'check-in', message: 'Sample: New visitor arrived', timestamp: new Date(Date.now() - 1200000).toISOString() },
  ]

  const displayEvents = events.length > 0 ? events : sampleEvents
  const isShowingSample = events.length === 0

  return (
    <div className="glass-card rounded-xl p-5 h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#00D4FF] rounded-full blur-[80px]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00D4FF]" />
            Live Activity
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-[#00E676] px-2 py-1 rounded-full bg-[rgba(0,230,118,0.1)]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse-dot shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
            Live
          </span>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] mt-1.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#1A1A24] rounded w-3/4" />
                  <div className="h-3 bg-[#1A1A24] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {isShowingSample && (
              <div className="mb-3 px-2 py-1 rounded bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)]">
                <p className="text-xs text-[#F5A623]">Sample Data</p>
              </div>
            )}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {displayEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="flex items-start gap-3 animate-slide-in-up p-2 rounded-lg hover:bg-[rgba(0,212,255,0.05)] transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${typeColors[event.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{event.message}</p>
                    <p className="text-xs text-[#555566]">{getRelativeTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ExpiringMembershipsAlert({ members, onRenew }: { members: Member[]; onRenew: (member: Member) => void }) {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const expiringMembers = members
    .filter(m => m.status === 'active' && m.expiry_date)
    .map(m => {
      const expiryDate = new Date(m.expiry_date)
      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...m, daysLeft }
    })
    .filter(m => m.daysLeft > 0 && m.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  if (expiringMembers.length === 0) {
    return (
      <div className="glass-card rounded-xl p-4 border border-[rgba(0,230,118,0.3)]">
        <div className="flex items-center gap-3 text-[#00E676]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,230,118,0.2)] flex items-center justify-center">
            <span className="text-lg">🎉</span>
          </div>
          <p className="text-sm">No renewals due in the next 30 days</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden glass-card rounded-xl p-4 border border-[rgba(245,166,35,0.3)]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#F5A623]/20 via-transparent to-[#FF4757]/20 animate-shimmer" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F5A623] to-[#FF4757] animate-pulse-glow" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(245,166,35,0.2)] flex items-center justify-center shadow-[0_0_15px_rgba(245,166,35,0.4)]">
            <AlertTriangle className="w-4 h-4 text-[#F5A623]" />
          </div>
          <h3 className="text-sm font-medium text-[#F5A623]">Expiring Soon ({expiringMembers.length})</h3>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {expiringMembers.slice(0, 5).map(member => {
            const daysColor = member.daysLeft <= 7 ? 'text-[#FF4757]' : member.daysLeft <= 15 ? 'text-[#F5A623]' : 'text-[#00E676]'
            return (
              <div key={member.id} className="flex items-center gap-3 bg-[#1A1A24] rounded-lg px-3 py-2 flex-shrink-0 hover:bg-[#1F1F2C] transition-colors border border-transparent hover:border-[rgba(245,166,35,0.3)]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF4757] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(245,166,35,0.5)]">
                  {member.name?.split(' ').map(n => n[0]).join('') || '?'}
                </div>
                <div>
                  <p className="text-sm text-white whitespace-nowrap">{member.name || 'Unknown'}</p>
                  <p className={`text-xs font-medium ${daysColor}`}>{member.daysLeft} days left</p>
                </div>
                <button 
                  onClick={() => onRenew(member)}
                  className="ml-2 px-2 py-1 text-xs rounded bg-[#00D4FF] text-[#0A0A0F] font-medium hover:bg-[#00B8E6] transition-colors"
                >
                  Renew
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function CommandDashboard({ selectedCenter }: CommandDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [centers, setCenters] = useState<Center[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([])
  const [renewModalMember, setRenewModalMember] = useState<Member | null>(null)
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [centersRes, membersRes, invoicesRes, ticketsRes, visitorsRes, bookingsRes] = await Promise.all([
        supabase.from('centers').select('*').order('name'),
        supabase.from('members').select('*').order('name'),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('visitors').select('*').order('check_in', { ascending: false }).limit(20),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
      ])
      
      if (centersRes.data) setCenters(centersRes.data)
      if (membersRes.data) setMembers(membersRes.data)
      if (invoicesRes.data) setInvoices(invoicesRes.data)
      if (ticketsRes.data) setTickets(ticketsRes.data)
      if (visitorsRes.data) setVisitors(visitorsRes.data)
      if (bookingsRes.data) setBookings(bookingsRes.data)

      // Build activity events from real data
      const events: ActivityEvent[] = []
      
      visitorsRes.data?.forEach(v => {
        events.push({
          id: `v-${v.id}`,
          type: 'check-in',
          message: `👤 ${v.name || 'Visitor'} checked in${v.host_member ? ` to meet ${v.host_member}` : ''}`,
          timestamp: v.check_in,
          centerId: v.center_id
        })
      })
      
      bookingsRes.data?.forEach(b => {
        events.push({
          id: `b-${b.id}`,
          type: 'booking',
          message: `📅 ${b.room_name} booked by ${b.member_name || 'Unknown'}`,
          timestamp: b.created_at,
          centerId: b.center_id
        })
      })
      
      invoicesRes.data?.slice(0, 10).forEach(inv => {
        if (inv.status === 'paid') {
          events.push({
            id: `ip-${inv.id}`,
            type: 'payment',
            message: `✅ Invoice paid by ${inv.member_name || 'Unknown'}`,
            timestamp: inv.created_at,
            centerId: inv.center_id
          })
        } else {
          events.push({
            id: `ic-${inv.id}`,
            type: 'invoice-created',
            message: `🧾 Invoice ${inv.invoice_number} created for ${inv.member_name || 'Unknown'}`,
            timestamp: inv.created_at,
            centerId: inv.center_id
          })
        }
      })
      
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivityEvents(events.slice(0, 20))
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    // FIX 3: Subscribe to realtime changes on all relevant tables
    // This ensures counts update instantly when data changes
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => fetchData())
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  // Filtered data based on selected center
  const filteredCenters = selectedCenter === 'all' 
    ? centers 
    : centers.filter(c => c.id === selectedCenter)

  const filteredMembers = selectedCenter === 'all'
    ? members
    : members.filter(m => m.center_id === selectedCenter)

  const filteredInvoices = selectedCenter === 'all'
    ? invoices
    : invoices.filter(inv => inv.center_id === selectedCenter)

  const filteredTickets = selectedCenter === 'all'
    ? tickets
    : tickets.filter(t => t.center_id === selectedCenter)

  const filteredEvents = selectedCenter === 'all'
    ? activityEvents
    : activityEvents.filter(e => !e.centerId || e.centerId === selectedCenter)

  // KPI Calculations with null guards
  const activeMembers = filteredMembers.filter(m => m.status === 'active')
  const totalActiveMembers = activeMembers.length

  const totalSeats = filteredCenters.reduce((sum, c) => sum + (c.total_seats || 0), 0)
  const occupancyRate = totalSeats > 0 ? Math.round((totalActiveMembers / totalSeats) * 100) : 0

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const revenueThisMonth = filteredInvoices
    .filter(inv => inv.status === 'paid' && new Date(inv.created_at) >= startOfMonth)
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)

  const openTicketsCount = filteredTickets.filter(t => t.status === 'open').length

  // Generate mock chart data
  const occupancyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    occupancy: Math.max(30, Math.min(95, occupancyRate + Math.floor(Math.random() * 20 - 10)))
  }))

  const revenueByCenter = filteredCenters.map(c => ({
    name: c.name,
    revenue: Math.floor(Math.random() * 500000) + 200000
  }))

  const handleRenew = async () => {
    if (!renewModalMember || !newExpiryDate) return
    
    try {
      await supabase
        .from('members')
        .update({ expiry_date: newExpiryDate })
        .eq('id', renewModalMember.id)
      
      setRenewModalMember(null)
      setNewExpiryDate('')
      fetchData()
    } catch (error) {
      console.error('Error renewing member:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-[#8888A0] hover:text-white hover:border-[rgba(0,212,255,0.3)] transition-all text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Active Members" 
          value={totalActiveMembers} 
          icon={Users} 
          trend="+12%" 
          trendUp 
          color="cyan"
          loading={loading}
        />
        <KPICard 
          title="Occupancy Rate" 
          value={occupancyRate} 
          icon={TrendingUp} 
          trend="+5%" 
          trendUp 
          color="success"
          suffix="%"
          loading={loading}
        />
        <KPICard 
          title="Revenue This Month" 
          value={revenueThisMonth > 0 ? formatCurrency(revenueThisMonth) : '₹0'} 
          icon={DollarSign} 
          trend="+8%" 
          trendUp 
          color="amber"
          loading={loading}
        />
        <KPICard 
          title="Open Tickets" 
          value={openTicketsCount} 
          icon={Ticket} 
          color="cyan"
          loading={loading}
        />
      </div>

      {/* Center Grid + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Centers Grid */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 font-[var(--font-syne)]">Center Overview</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="glass-card rounded-xl p-5 h-48 animate-pulse">
                    <div className="h-full bg-[#1A1A24] rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredCenters.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Building2 className="w-12 h-12 text-[#555566] mx-auto mb-3" />
                <p className="text-[#8888A0]">No centers found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredCenters.map(center => (
                  <CenterCard 
                    key={center.id} 
                    center={center} 
                    members={members}
                    visitors={visitors}
                    bookings={bookings}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Occupancy Trend */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">7-Day Occupancy Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={occupancyTrend}>
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8888A0', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8888A0', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111118', 
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="occupancy" 
                    stroke="#00D4FF" 
                    strokeWidth={2}
                    fill="url(#occupancyGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Center */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Revenue by Center</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByCenter}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8888A0', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8888A0', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111118', 
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#00D4FF" radius={[4, 4, 0, 0]}>
                    {revenueByCenter.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 3 === 0 ? '#00D4FF' : index % 3 === 1 ? '#F5A623' : '#00E676'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expiring Memberships */}
          <ExpiringMembershipsAlert 
            members={filteredMembers} 
            onRenew={(member) => {
              const defaultExpiry = new Date()
              defaultExpiry.setDate(defaultExpiry.getDate() + 30)
              setNewExpiryDate(defaultExpiry.toISOString().split('T')[0])
              setRenewModalMember(member)
            }}
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <LiveActivityFeed events={filteredEvents} loading={loading} />
        </div>
      </div>

      {/* Renew Modal */}
      {renewModalMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRenewModalMember(null)} />
          <div className="relative bg-[#111118] rounded-xl border border-[rgba(0,212,255,0.2)] p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Renew Membership</h3>
            <p className="text-sm text-[#8888A0] mb-4">{renewModalMember.name}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider block mb-1.5">Current Expiry</label>
                <p className="text-white">{new Date(renewModalMember.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider block mb-1.5">New Expiry Date <span className="text-[#00D4FF]">*</span></label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRenewModalMember(null)}
                className="flex-1 py-2.5 rounded-lg bg-transparent border border-[rgba(255,255,255,0.1)] text-[#8888A0] font-medium text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRenew}
                className="flex-1 py-2.5 rounded-lg bg-[#00D4FF] text-[#0A0A0F] font-semibold text-sm hover:bg-[#00B8E6] transition-all"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
