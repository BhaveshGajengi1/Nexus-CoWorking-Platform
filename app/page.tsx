'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Sidebar } from '@/components/nexus/sidebar'
import { Header } from '@/components/nexus/header'
import { CommandDashboard } from '@/components/nexus/command-dashboard'
import { VisitorManagement } from '@/components/nexus/visitor-management'
import { RoomBooking } from '@/components/nexus/room-booking'
import { FloorMap } from '@/components/nexus/floor-map'
import { Onboarding } from '@/components/nexus/onboarding'
import { Finance } from '@/components/nexus/finance'
import { Analytics } from '@/components/nexus/analytics'
import { Renewals } from '@/components/nexus/renewals'
import { Support } from '@/components/nexus/support'
import { TeamChat } from '@/components/nexus/team-chat'
import { TeamManagement } from '@/components/nexus/team-management'
import { BIDashboard } from '@/components/nexus/bi-dashboard'
import { AIChatbot } from '@/components/nexus/ai-chatbot-new'
import { MobileNav } from '@/components/nexus/mobile-nav'
import { SearchOverlay } from '@/components/nexus/search-overlay'
import { WelcomeBanner } from '@/components/nexus/welcome-banner'
import { LoginPage } from '@/components/nexus/login-page'
import { ToastProvider } from '@/components/nexus/toast-provider'
import { Loader2 } from 'lucide-react'

export type Module = 
  | 'dashboard' 
  | 'visitors' 
  | 'rooms' 
  | 'floor-map' 
  | 'onboarding' 
  | 'finance' 
  | 'analytics'
  | 'renewals' 
  | 'support' 
  | 'chat' 
  | 'team'
  | 'bi-dashboard'

export default function NexusApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<Module>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<string>('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)

  // FIX 2: Seed database on app mount
  const seedDatabase = async () => {
    try {
      // Check if already seeded
      const { data: existingMembers } = await supabase.from('members').select('id').limit(1)
      if (existingMembers && existingMembers.length > 0) {
        console.log('[v0] Database already seeded, skipping...')
        return
      }

      console.log('[v0] Seeding database with sample data...')

      // Get center IDs first
      const { data: centers } = await supabase.from('centers').select('id, name')
      if (!centers || centers.length === 0) {
        console.log('[v0] No centers found, skipping seed')
        return
      }

      const c1 = centers.find(c => c.name.includes('HITEC'))?.id
      const c2 = centers.find(c => c.name.includes('Indiranagar'))?.id
      const c3 = centers.find(c => c.name.includes('BKC'))?.id

      if (!c1 || !c2 || !c3) {
        console.log('[v0] Missing center IDs, skipping seed')
        return
      }

      // Insert members
      await supabase.from('members').insert([
        { name: 'Arjun Mehta', company: 'TechVenture Labs', email: 'arjun@techventure.in', phone: '9876543210', plan: 'Private Cabin', center_id: c1, seat_number: 'C-01', start_date: '2026-01-15', expiry_date: '2026-07-15', status: 'active' },
        { name: 'Priya Sharma', company: 'DesignStudio Co', email: 'priya@designstudio.in', phone: '9876543211', plan: 'Dedicated Desk', center_id: c1, seat_number: 'D-04', start_date: '2026-02-01', expiry_date: '2026-06-10', status: 'active' },
        { name: 'Rohit Nair', company: 'GrowthHack Inc', email: 'rohit@growthhack.in', phone: '9876543212', plan: 'Hotdesk', center_id: c2, seat_number: 'H-12', start_date: '2026-03-01', expiry_date: '2026-06-05', status: 'active' },
        { name: 'Sneha Patel', company: 'CloudMinds Pvt Ltd', email: 'sneha@cloudminds.in', phone: '9876543213', plan: 'Private Cabin', center_id: c2, seat_number: 'C-03', start_date: '2026-01-10', expiry_date: '2026-07-10', status: 'active' },
        { name: 'Karan Singh', company: 'StartupNest', email: 'karan@startupnest.in', phone: '9876543214', plan: 'Dedicated Desk', center_id: c3, seat_number: 'D-07', start_date: '2026-02-15', expiry_date: '2026-06-02', status: 'active' },
        { name: 'Ananya Reddy', company: 'InnovateTech', email: 'ananya@innovatetech.in', phone: '9876543215', plan: 'Hotdesk', center_id: c1, seat_number: 'H-03', start_date: '2026-03-10', expiry_date: '2026-07-20', status: 'active' },
        { name: 'Vikram Joshi', company: 'DataPulse Analytics', email: 'vikram@datapulse.in', phone: '9876543216', plan: 'Private Cabin', center_id: c3, seat_number: 'C-05', start_date: '2026-01-20', expiry_date: '2026-08-20', status: 'active' },
        { name: 'Meera Iyer', company: 'BrandCraft Agency', email: 'meera@brandcraft.in', phone: '9876543217', plan: 'Dedicated Desk', center_id: c2, seat_number: 'D-09', start_date: '2026-04-01', expiry_date: '2026-09-01', status: 'active' },
        { name: 'Aditya Kumar', company: 'FinFlow Solutions', email: 'aditya@finflow.in', phone: '9876543218', plan: 'Hotdesk', center_id: c1, seat_number: 'H-07', start_date: '2026-02-20', expiry_date: '2026-06-20', status: 'active' },
        { name: 'Divya Krishnan', company: 'EduSpark Technologies', email: 'divya@eduspark.in', phone: '9876543219', plan: 'Private Cabin', center_id: c3, seat_number: 'C-02', start_date: '2026-03-05', expiry_date: '2026-07-05', status: 'active' },
        { name: 'Nikhil Desai', company: 'PixelForge Creative', email: 'nikhil@pixelforge.in', phone: '9876543220', plan: 'Dedicated Desk', center_id: c1, seat_number: 'D-11', start_date: '2026-01-25', expiry_date: '2026-05-31', status: 'active' },
        { name: 'Pooja Agarwal', company: 'LegalEdge Consultants', email: 'pooja@legaledge.in', phone: '9876543221', plan: 'Private Cabin', center_id: c2, seat_number: 'C-04', start_date: '2026-04-10', expiry_date: '2026-10-10', status: 'active' },
        { name: 'Rahul Verma', company: 'CodeCraft Solutions', email: 'rahul@codecraft.in', phone: '9876543222', plan: 'Hotdesk', center_id: c3, seat_number: 'H-05', start_date: '2026-03-15', expiry_date: '2026-07-15', status: 'active' },
        { name: 'Swati Menon', company: 'GreenTech Ventures', email: 'swati@greentech.in', phone: '9876543223', plan: 'Dedicated Desk', center_id: c2, seat_number: 'D-02', start_date: '2026-02-10', expiry_date: '2026-08-10', status: 'active' },
        { name: 'Farhan Sheikh', company: 'LogiTrack Systems', email: 'farhan@logitrack.in', phone: '9876543224', plan: 'Private Cabin', center_id: c1, seat_number: 'C-06', start_date: '2026-01-05', expiry_date: '2026-09-05', status: 'active' }
      ])

      // Insert visitors
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('visitors').insert([
        { name: 'Rahul Gupta', company: 'Infosys', phone: '9800001111', host_member: 'Arjun Mehta', purpose: 'Meeting', center_id: c1, check_in: new Date(Date.now() - 3600000).toISOString(), visitor_type: 'business', status: 'checked_in' },
        { name: 'Sanya Malhotra', company: 'Wipro', phone: '9800002222', host_member: 'Priya Sharma', purpose: 'Interview', center_id: c1, check_in: new Date(Date.now() - 7200000).toISOString(), check_out: new Date(Date.now() - 3000000).toISOString(), visitor_type: 'business', status: 'checked_out' },
        { name: 'Deepak Verma', company: 'TCS', phone: '9800003333', host_member: 'Sneha Patel', purpose: 'Tour', center_id: c2, check_in: new Date(Date.now() - 1800000).toISOString(), visitor_type: 'business', status: 'checked_in' },
        { name: 'Kritika Bose', company: 'Freelancer', phone: '9800004444', host_member: 'Vikram Joshi', purpose: 'Meeting', center_id: c3, check_in: new Date(Date.now() - 5400000).toISOString(), check_out: new Date(Date.now() - 1800000).toISOString(), visitor_type: 'contractor', status: 'checked_out' },
        { name: 'Manish Tiwari', company: 'Accenture', phone: '9800005555', host_member: 'Karan Singh', purpose: 'Delivery', center_id: c3, check_in: new Date(Date.now() - 900000).toISOString(), visitor_type: 'business', status: 'checked_in' }
      ])

      // Insert bookings
      await supabase.from('bookings').insert([
        { room_name: 'Boardroom', member_name: 'Arjun Mehta', center_id: c1, booking_date: today, start_time: '09:00', end_time: '11:00', booking_type: 'Client Meeting', notes: 'Investor pitch' },
        { room_name: 'Focus Pod', member_name: 'Priya Sharma', center_id: c1, booking_date: today, start_time: '11:00', end_time: '12:00', booking_type: 'Internal', notes: 'Deep work session' },
        { room_name: 'Training Hall', member_name: 'Sneha Patel', center_id: c2, booking_date: today, start_time: '14:00', end_time: '17:00', booking_type: 'Event', notes: 'Product launch workshop' },
        { room_name: 'Podcast Studio', member_name: 'Vikram Joshi', center_id: c3, booking_date: today, start_time: '10:00', end_time: '12:00', booking_type: 'Internal', notes: 'Podcast recording' },
        { room_name: 'Boardroom', member_name: 'Karan Singh', center_id: c3, booking_date: today, start_time: '15:00', end_time: '16:00', booking_type: 'Client Meeting', notes: 'Client onboarding' }
      ])

      // Insert invoices
      await supabase.from('invoices').insert([
        { invoice_number: 'INV-1001', member_name: 'Arjun Mehta', center_id: c1, amount: 25000, gst: 4500, total: 29500, due_date: '2026-06-15', status: 'paid', created_at: '2026-05-01T10:00:00Z' },
        { invoice_number: 'INV-1002', member_name: 'Priya Sharma', center_id: c1, amount: 15000, gst: 2700, total: 17700, due_date: '2026-06-10', status: 'pending', created_at: '2026-05-03T10:00:00Z' },
        { invoice_number: 'INV-1003', member_name: 'Sneha Patel', center_id: c2, amount: 25000, gst: 4500, total: 29500, due_date: '2026-05-20', status: 'overdue', created_at: '2026-04-20T10:00:00Z' },
        { invoice_number: 'INV-1004', member_name: 'Karan Singh', center_id: c3, amount: 15000, gst: 2700, total: 17700, due_date: '2026-06-02', status: 'pending', created_at: '2026-05-05T10:00:00Z' },
        { invoice_number: 'INV-1005', member_name: 'Vikram Joshi', center_id: c3, amount: 25000, gst: 4500, total: 29500, due_date: '2026-06-20', status: 'paid', created_at: '2026-05-10T10:00:00Z' },
        { invoice_number: 'INV-1006', member_name: 'Meera Iyer', center_id: c2, amount: 15000, gst: 2700, total: 17700, due_date: '2026-07-01', status: 'paid', created_at: '2026-05-12T10:00:00Z' },
        { invoice_number: 'INV-1007', member_name: 'Rohit Nair', center_id: c2, amount: 8000, gst: 1440, total: 9440, due_date: '2026-05-25', status: 'overdue', created_at: '2026-04-25T10:00:00Z' },
        { invoice_number: 'INV-1008', member_name: 'Divya Krishnan', center_id: c3, amount: 25000, gst: 4500, total: 29500, due_date: '2026-07-05', status: 'paid', created_at: '2026-05-15T10:00:00Z' },
        { invoice_number: 'INV-1009', member_name: 'Ananya Reddy', center_id: c1, amount: 8000, gst: 1440, total: 9440, due_date: '2026-06-20', status: 'paid', created_at: '2026-05-18T10:00:00Z' },
        { invoice_number: 'INV-1010', member_name: 'Farhan Sheikh', center_id: c1, amount: 25000, gst: 4500, total: 29500, due_date: '2026-06-05', status: 'pending', created_at: '2026-05-20T10:00:00Z' }
      ])

      // Insert tickets
      await supabase.from('tickets').insert([
        { title: 'AC not working in Cabin C-01', description: 'Air conditioning in cabin C-01 stopped working since morning.', raised_by: 'Arjun Mehta', center_id: c1, category: 'Maintenance', priority: 'P2', status: 'open', assigned_to: 'Facilities Team' },
        { title: 'WiFi dropping in Training Hall', description: 'Internet connectivity unstable during peak hours.', raised_by: 'Sneha Patel', center_id: c2, category: 'IT', priority: 'P1', status: 'in_progress', assigned_to: 'IT Support' },
        { title: 'Projector remote missing', description: 'Boardroom projector remote missing since last evening.', raised_by: 'Karan Singh', center_id: c3, category: 'Admin', priority: 'P3', status: 'open', assigned_to: 'Community Lead' },
        { title: 'Invoice amount incorrect', description: 'Invoice INV-1002 shows wrong amount.', raised_by: 'Priya Sharma', center_id: c1, category: 'Admin', priority: 'P2', status: 'open', assigned_to: 'Finance Team' },
        { title: 'Coffee machine not working', description: 'Coffee machine on floor 2 is out of order.', raised_by: 'Ananya Reddy', center_id: c1, category: 'Maintenance', priority: 'P4', status: 'resolved', assigned_to: 'Facilities Team' }
      ])

      // Insert leads
      await supabase.from('leads').insert([
        { company: 'NexGen Robotics', contact_name: 'Suresh Babu', email: 'suresh@nexgenrobotics.in', phone: '9900001111', space_type: 'Private Cabin', estimated_value: 35000, stage: 'Negotiation', assigned_to: 'Rahul Mehta', center_id: c1, notes: 'Looking for 3 cabins' },
        { company: 'GreenBuild Ventures', contact_name: 'Kavya Nair', email: 'kavya@greenbuild.in', phone: '9900002222', space_type: 'Dedicated Desk', estimated_value: 18000, stage: 'Proposal Sent', assigned_to: 'Priya Sharma', center_id: c2, notes: 'Startup team of 4' },
        { company: 'HealthFirst AI', contact_name: 'Dr. Arun Pillai', email: 'arun@healthfirstai.in', phone: '9900003333', space_type: 'Private Cabin', estimated_value: 50000, stage: 'Site Visit Scheduled', assigned_to: 'Vikram Singh', center_id: c3, notes: 'Healthcare AI firm' },
        { company: 'MediaBlast Studio', contact_name: 'Ritu Aggarwal', email: 'ritu@mediablast.in', phone: '9900004444', space_type: 'Hotdesk', estimated_value: 12000, stage: 'Lead', assigned_to: 'Anjali Patel', center_id: c1, notes: 'Content team' },
        { company: 'TradeEdge Fintech', contact_name: 'Siddharth Rao', email: 'sid@tradeedge.in', phone: '9900005555', space_type: 'Private Cabin', estimated_value: 45000, stage: 'Agreement Signed', assigned_to: 'Rahul Mehta', center_id: c2, notes: 'Fintech startup, 6 person team' },
        { company: 'LogiTrack Systems', contact_name: 'Farhan Sheikh', email: 'farhan@logitrack.in', phone: '9900006666', space_type: 'Dedicated Desk', estimated_value: 22000, stage: 'Negotiation', assigned_to: 'Priya Sharma', center_id: c3, notes: 'Needs 24/7 access' }
      ])

      // Insert notifications
      await supabase.from('notifications').insert([
        { title: 'New Visitor Checked In', message: 'Rahul Gupta checked in at NEXUS HITEC City', type: 'info', is_read: false },
        { title: 'High Priority Ticket', message: 'P1: WiFi dropping in Training Hall — Bangalore', type: 'error', is_read: false },
        { title: 'Invoice Overdue', message: 'INV-1003 overdue — ₹29,500 from Sneha Patel', type: 'warning', is_read: false },
        { title: 'Deal Closed', message: 'TradeEdge Fintech signed at NEXUS Indiranagar', type: 'success', is_read: true },
        { title: 'Renewal Alert', message: 'Karan Singh membership expires in 3 days', type: 'warning', is_read: false }
      ])

      console.log('[v0] Database seeding completed successfully')
    } catch (error) {
      console.error('[v0] Error seeding database:', error)
    }
  }

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        setTimeout(() => setFadeIn(true), 100)
        // Seed database after confirming user is authenticated
        seedDatabase()
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setTimeout(() => setFadeIn(true), 100)
        seedDatabase()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    setFadeIn(false)
    setTimeout(async () => {
      await supabase.auth.signOut()
      setShowWelcome(true)
    }, 300)
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <CommandDashboard selectedCenter={selectedCenter} />
      case 'visitors':
        return <VisitorManagement selectedCenter={selectedCenter} />
      case 'rooms':
        return <RoomBooking selectedCenter={selectedCenter} />
      case 'floor-map':
        return <FloorMap selectedCenter={selectedCenter} />
      case 'onboarding':
        return <Onboarding />
      case 'finance':
        return <Finance selectedCenter={selectedCenter} />
      case 'analytics':
        return <Analytics />
      case 'renewals':
        return <Renewals selectedCenter={selectedCenter} />
      case 'support':
        return <Support selectedCenter={selectedCenter} />
      case 'chat':
        return <TeamChat />
      case 'team':
        return <TeamManagement selectedCenter={selectedCenter} />
      case 'bi-dashboard':
        return <BIDashboard onClose={() => setActiveModule('dashboard')} />
      default:
        return <CommandDashboard selectedCenter={selectedCenter} />
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 64 64" className="w-full h-full animate-pulse">
              <defs>
                <linearGradient id="nGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#00A3CC" />
                </linearGradient>
              </defs>
              <path 
                d="M12 52V12L32 32V12L52 52H42L32 32V52H22L12 32V52Z" 
                fill="url(#nGradient)"
              />
            </svg>
          </div>
          <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={() => {
          setFadeIn(true)
        }} />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <div className={`flex h-screen bg-[#0A0A0F] bg-grid-pattern overflow-hidden transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            selectedCenter={selectedCenter}
            setSelectedCenter={setSelectedCenter}
            onSearchOpen={() => setSearchOpen(true)}
            user={user}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
            {showWelcome && (
              <WelcomeBanner onDismiss={() => setShowWelcome(false)} />
            )}
            {renderModule()}
          </main>
        </div>

        <SearchOverlay 
          open={searchOpen} 
          onClose={() => setSearchOpen(false)}
          onNavigate={(module) => {
            setActiveModule(module)
            setSearchOpen(false)
          }}
        />

        <MobileNav activeModule={activeModule} setActiveModule={setActiveModule} />
        <AIChatbot />
      </div>
    </ToastProvider>
  )
}
