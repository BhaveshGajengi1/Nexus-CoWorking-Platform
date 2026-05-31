'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Users, UserPlus, QrCode, Clock, Building2, Phone, 
  Briefcase, Search, X, CheckCircle2, Camera, AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// Dynamically import QR Scanner to avoid SSR issues
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { ssr: false }
)

interface VisitorManagementProps {
  selectedCenter: string
}

type Tab = 'walk-ins' | 'pre-registered' | 'checked-in' | 'history'

interface Visitor {
  id: string
  name: string
  phone: string
  company: string | null
  host_member: string
  purpose: string
  center_id: string
  check_in: string
  check_out: string | null
  status: string
  visitor_type: string
}

interface Booking {
  id: string
  room_name: string
  center_id: string
  booking_date: string
  start_time: string
  end_time: string
  member_name: string
  booking_type: string
  notes: string | null
}

interface Center {
  id: string
  name: string
  short_name: string
}

export function VisitorManagement({ selectedCenter }: VisitorManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('walk-ins')
  const [showRegisterPanel, setShowRegisterPanel] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)
  const [scannedVisitor, setScannedVisitor] = useState<{name: string, company: string, host: string} | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch visitors
      const { data: visitorsData } = await supabase
        .from('visitors')
        .select('*')
        .order('check_in', { ascending: false })
      
      // Fetch bookings (for pre-registered visitors)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })
      
      // Fetch centers
      const { data: centersData } = await supabase
        .from('centers')
        .select('*')
      
      setVisitors(visitorsData || [])
      setBookings(bookingsData || [])
      setCenters(centersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter visitors based on center and tab
  const filteredVisitors = visitors.filter(v => {
    const matchesCenter = selectedCenter === 'all' || v.center_id === selectedCenter
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.company?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    
    let matchesTab = false
    switch (activeTab) {
      case 'walk-ins':
        matchesTab = v.visitor_type === 'walk-in' && v.status === 'checked_in'
        break
      case 'pre-registered':
        matchesTab = v.visitor_type === 'pre-registered' && v.status !== 'checked_out'
        break
      case 'checked-in':
        matchesTab = v.status === 'checked_in'
        break
      case 'history':
        matchesTab = v.status === 'checked_out'
        break
    }
    
    return matchesCenter && matchesTab && matchesSearch
  })

  // For pre-registered tab, also include bookings converted to visitor-like format
  const preRegisteredFromBookings = bookings
    .filter(b => {
      const matchesCenter = selectedCenter === 'all' || b.center_id === selectedCenter
      const today = new Date().toISOString().split('T')[0]
      const isToday = b.booking_date === today
      const matchesSearch = b.member_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCenter && isToday && matchesSearch
    })
    .map(b => ({
      id: `booking-${b.id}`,
      name: b.member_name,
      phone: '-',
      company: b.booking_type,
      host_member: b.room_name,
      purpose: 'Room Booking',
      center_id: b.center_id,
      check_in: `${b.start_time}`,
      check_out: b.end_time,
      status: 'pre-registered',
      visitor_type: 'pre-registered',
      notes: b.notes
    }))

  // Combine filtered visitors with pre-registered bookings when on pre-registered tab
  const displayData = activeTab === 'pre-registered' 
    ? [...filteredVisitors, ...preRegisteredFromBookings]
    : filteredVisitors

  // Calculate counts
  const walkInCount = visitors.filter(v => 
    v.visitor_type === 'walk-in' && 
    v.status === 'checked_in' &&
    (selectedCenter === 'all' || v.center_id === selectedCenter)
  ).length

  const preRegisteredCount = visitors.filter(v => 
    v.visitor_type === 'pre-registered' && 
    v.status !== 'checked_out' &&
    (selectedCenter === 'all' || v.center_id === selectedCenter)
  ).length + bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0]
    return b.booking_date === today && (selectedCenter === 'all' || b.center_id === selectedCenter)
  }).length

  const checkedInCount = visitors.filter(v => 
    v.status === 'checked_in' &&
    (selectedCenter === 'all' || v.center_id === selectedCenter)
  ).length

  const historyCount = visitors.filter(v => 
    v.status === 'checked_out' &&
    (selectedCenter === 'all' || v.center_id === selectedCenter)
  ).length

  const todayVisitors = visitors.filter(v => {
    const today = new Date().toISOString().split('T')[0]
    const visitorDate = v.check_in?.split('T')[0]
    return visitorDate === today && (selectedCenter === 'all' || v.center_id === selectedCenter)
  }).length

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'walk-ins', label: 'Walk-ins', count: walkInCount },
    { id: 'pre-registered', label: 'Pre-Registered', count: preRegisteredCount },
    { id: 'checked-in', label: 'Checked In', count: checkedInCount },
    { id: 'history', label: 'History', count: historyCount },
  ]

  const handleQRScan = () => {
    setQrScanned(false)
    setScannedVisitor(null)
    setCameraError(null)
    setManualCode('')
    setShowManualEntry(false)
    setShowQRModal(true)
  }

  const handleManualCodeSubmit = async () => {
    if (!manualCode.trim()) return
    await handleQRResult(manualCode.trim())
  }

  const handleQRResult = async (result: string) => {
    try {
      // Try to parse the QR code data
      // Expected format: JSON with visitor_id or pre-registration details
      let visitorData
      try {
        visitorData = JSON.parse(result)
      } catch {
        // If not JSON, treat as visitor ID
        visitorData = { visitor_id: result }
      }

      // Look up visitor in database
      if (visitorData.visitor_id) {
        const { data: visitor } = await supabase
          .from('visitors')
          .select('*')
          .eq('id', visitorData.visitor_id)
          .single()

        if (visitor) {
          // Update visitor to checked in
          await supabase
            .from('visitors')
            .update({ status: 'checked_in', check_in: new Date().toISOString() })
            .eq('id', visitor.id)

          setScannedVisitor({
            name: visitor.name,
            company: visitor.company || '-',
            host: visitor.host_member
          })
          setQrScanned(true)
          fetchData()
          return
        }
      }

      // If pre-registration data in QR code
      if (visitorData.name) {
        // Create new visitor from QR data
        const { error } = await supabase.from('visitors').insert({
          name: visitorData.name,
          phone: visitorData.phone || '-',
          company: visitorData.company || null,
          host_member: visitorData.host || '-',
          purpose: visitorData.purpose || 'Pre-Registered Check-in',
          center_id: selectedCenter !== 'all' ? selectedCenter : centers[0]?.id,
          check_in: new Date().toISOString(),
          status: 'checked_in',
          visitor_type: 'pre-registered'
        })

        if (!error) {
          setScannedVisitor({
            name: visitorData.name,
            company: visitorData.company || '-',
            host: visitorData.host || '-'
          })
          setQrScanned(true)
          fetchData()
        }
      }
    } catch (err) {
      console.error('QR scan error:', err)
      setCameraError('Invalid QR code. Please try again.')
    }
  }

  const handleCameraError = (error: unknown) => {
    console.error('Camera error:', error)
    setCameraError('Could not access camera. Please check permissions.')
  }

  const getCenterName = (centerId: string) => {
    const center = centers.find(c => c.id === centerId)
    return center?.short_name || center?.name || '-'
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-'
    try {
      if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      }
      return timeString
    } catch {
      return timeString
    }
  }

  // Register Walk-in Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    company: '',
    host_member: '',
    purpose: '',
    id_type: '',
    center_id: ''
  })
  const [registerLoading, setRegisterLoading] = useState(false)

  const handleRegisterWalkIn = async () => {
    if (!registerForm.name || !registerForm.phone || !registerForm.host_member || !registerForm.purpose || !registerForm.center_id) {
      return
    }
    
    setRegisterLoading(true)
    try {
      const { error } = await supabase.from('visitors').insert({
        name: registerForm.name,
        phone: registerForm.phone,
        company: registerForm.company || null,
        host_member: registerForm.host_member,
        purpose: registerForm.purpose,
        center_id: registerForm.center_id,
        check_in: new Date().toISOString(),
        status: 'checked_in',
        visitor_type: 'walk-in'
      })
      
      if (error) throw error
      
      // Reset form and close panel
      setRegisterForm({
        name: '',
        phone: '',
        company: '',
        host_member: '',
        purpose: '',
        id_type: '',
        center_id: ''
      })
      setShowRegisterPanel(false)
      
      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error registering visitor:', error)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-6">
        <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0088AA] flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#8888A0] text-sm">Today&apos;s Visitors</p>
            <p className="text-2xl font-bold text-white">{todayVisitors}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00E676] to-[#00B85C] flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#8888A0] text-sm">Avg. Visit Duration</p>
            <p className="text-2xl font-bold text-white">1h 45m</p>
          </div>
        </div>
        <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F5A623] to-[#CC8400] flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#8888A0] text-sm">Peak Hour</p>
            <p className="text-2xl font-bold text-white">10-11 AM</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[rgba(0,212,255,0.15)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
                  : 'text-[#8888A0] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                activeTab === tab.id ? 'bg-[#00D4FF] text-[#0A0A0F]' : 'bg-[#1A1A24]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleQRScan}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-medium hover:opacity-90 transition-all"
          >
            <QrCode className="w-4 h-4" />
            QR Check-in
          </button>
          <button
            onClick={() => setShowRegisterPanel(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.2)] text-white hover:border-[#00D4FF] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Register Walk-in
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0]" />
        <input
          type="text"
          placeholder="Search visitors by name or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF] transition-all"
        />
      </div>

      {/* Visitors Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,212,255,0.1)]">
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Visitor</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Company</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Host</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Center</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Time In/Out</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Purpose</th>
              <th className="text-left px-5 py-4 text-sm font-medium text-[#8888A0]">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && displayData.map((visitor) => {
              const statusColors: Record<string, string> = {
                'checked_in': 'bg-[rgba(0,230,118,0.15)] text-[#00E676] border border-[rgba(0,230,118,0.3)]',
                'checked_out': 'bg-[rgba(136,136,160,0.15)] text-[#8888A0] border border-[rgba(136,136,160,0.3)]',
                'pre-registered': 'bg-[rgba(0,212,255,0.15)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
              }

              const statusLabels: Record<string, string> = {
                'checked_in': 'Checked In',
                'checked_out': 'Checked Out',
                'pre-registered': 'Pre-Registered'
              }

              return (
                <tr key={visitor.id} className="border-b border-[rgba(0,212,255,0.05)] hover:bg-[rgba(0,212,255,0.03)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A24] to-[#2A2A3A] flex items-center justify-center text-white font-medium">
                        {visitor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{visitor.name}</p>
                        <p className="text-xs text-[#8888A0]">{visitor.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#8888A0]">{visitor.company || '-'}</td>
                  <td className="px-5 py-4 text-white">{visitor.host_member || '-'}</td>
                  <td className="px-5 py-4 text-[#8888A0]">{getCenterName(visitor.center_id)}</td>
                  <td className="px-5 py-4">
                    <span className="text-white">{formatTime(visitor.check_in)}</span>
                    {visitor.check_out && (
                      <span className="text-[#8888A0]"> - {formatTime(visitor.check_out)}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#8888A0]">{visitor.purpose}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[visitor.status] || statusColors['pre-registered']}`}>
                      {visitor.status === 'checked_in' && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E676] mr-1.5 animate-pulse-dot" />
                      )}
                      {statusLabels[visitor.status] || visitor.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#8888A0]">Loading visitors...</p>
          </div>
        )}
        {!loading && displayData.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-[#555566] mx-auto mb-3" />
            <p className="text-[#8888A0]">No visitors found</p>
            <p className="text-xs text-[#555566] mt-1">
              {activeTab === 'walk-ins' && 'Register a walk-in visitor to see them here'}
              {activeTab === 'pre-registered' && 'Book a room to see pre-registered visitors'}
              {activeTab === 'checked-in' && 'No visitors are currently checked in'}
              {activeTab === 'history' && 'No visitor history available'}
            </p>
          </div>
        )}
      </div>

      {/* Register Walk-in Panel */}
      {showRegisterPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRegisterPanel(false)} />
          <div className="relative w-full max-w-md bg-[#0D0D14] border-l border-[rgba(0,212,255,0.1)] animate-slide-in-right flex flex-col h-full">
            <div className="p-6 border-b border-[rgba(0,212,255,0.1)] flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-white font-[var(--font-syne)]">Register Walk-in</h2>
              <button onClick={() => setShowRegisterPanel(false)} className="text-[#8888A0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Visitor Name *</label>
                <input 
                  type="text" 
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]" 
                  placeholder="Enter full name" 
                />
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
                  <input 
                    type="tel" 
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
                  <input 
                    type="text" 
                    value={registerForm.company}
                    onChange={(e) => setRegisterForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]" 
                    placeholder="Company name" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Host Member *</label>
                <input 
                  type="text" 
                  value={registerForm.host_member}
                  onChange={(e) => setRegisterForm(p => ({ ...p, host_member: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]" 
                  placeholder="Who are they visiting?" 
                />
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Visit Purpose *</label>
                <select 
                  value={registerForm.purpose}
                  onChange={(e) => setRegisterForm(p => ({ ...p, purpose: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF]"
                >
                  <option value="">Select purpose</option>
                  <option value="Client Meeting">Client Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Tour">Tour</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">ID Type *</label>
                <select 
                  value={registerForm.id_type}
                  onChange={(e) => setRegisterForm(p => ({ ...p, id_type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF]"
                >
                  <option value="">Select ID type</option>
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN Card</option>
                  <option value="dl">Driving License</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Center *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
                  <select 
                    value={registerForm.center_id}
                    onChange={(e) => setRegisterForm(p => ({ ...p, center_id: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF]"
                  >
                    <option value="">Select center</option>
                    {centers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Sticky Footer */}
            <div className="p-6 border-t border-[rgba(0,212,255,0.1)] bg-[#0D0D14] flex-shrink-0">
              <button 
                onClick={handleRegisterWalkIn}
                disabled={registerLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {registerLoading ? 'Registering...' : 'Register & Check In'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scan Modal with Camera */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowQRModal(false)} />
          <div className="relative bg-[#111118] rounded-2xl p-6 border border-[rgba(0,212,255,0.2)] w-full max-w-md animate-slide-in-up">
            {/* Close button */}
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-[#8888A0] hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {!qrScanned ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(0,212,255,0.15)] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#00D4FF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Scan QR Code</h3>
                  <p className="text-sm text-[#8888A0]">Position the QR code within the frame</p>
                </div>

                {cameraError ? (
                  <div className="mb-4">
                    <div className="p-4 rounded-xl bg-[rgba(255,71,87,0.1)] border border-[rgba(255,71,87,0.3)] mb-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-[#FF4757] flex-shrink-0" />
                        <div>
                          <p className="text-sm text-[#FF4757]">{cameraError}</p>
                          <button 
                            onClick={() => {
                              setCameraError(null)
                              setShowManualEntry(false)
                            }}
                            className="text-xs text-[#00D4FF] mt-1 hover:underline"
                          >
                            Try camera again
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Manual Entry Fallback */}
                    <div className="text-center mb-4">
                      <p className="text-sm text-[#8888A0] mb-3">Or enter the visitor code manually:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter visitor code or ID"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.2)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]"
                          onKeyDown={(e) => e.key === 'Enter' && handleManualCodeSubmit()}
                        />
                        <button
                          onClick={handleManualCodeSubmit}
                          disabled={!manualCode.trim()}
                          className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-medium disabled:opacity-50"
                        >
                          Check In
                        </button>
                      </div>
                    </div>

                    {/* Quick Check-in for Pre-registered */}
                    <div className="border-t border-[rgba(0,212,255,0.1)] pt-4 mt-4">
                      <p className="text-xs text-[#555566] text-center mb-3">Or select a pre-registered visitor:</p>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {preRegisteredFromBookings.slice(0, 5).map(booking => (
                          <button
                            key={booking.id}
                            onClick={() => {
                              setScannedVisitor({
                                name: booking.name,
                                company: booking.company || '-',
                                host: booking.host_member
                              })
                              setQrScanned(true)
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1A1A24] hover:bg-[rgba(0,212,255,0.1)] border border-transparent hover:border-[rgba(0,212,255,0.3)] transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0088AA] flex items-center justify-center text-white text-xs font-bold">
                              {booking.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{booking.name}</p>
                              <p className="text-xs text-[#8888A0] truncate">{booking.purpose} - {booking.host_member}</p>
                            </div>
                          </button>
                        ))}
                        {preRegisteredFromBookings.length === 0 && (
                          <p className="text-xs text-[#555566] text-center py-2">No pre-registered visitors today</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#00D4FF] mb-4">
                    <Scanner
                      onScan={(result) => {
                        if (result && result[0]?.rawValue) {
                          handleQRResult(result[0].rawValue)
                        }
                      }}
                      onError={handleCameraError}
                      constraints={{
                        facingMode: 'environment'
                      }}
                      styles={{
                        container: {
                          width: '100%',
                          height: '100%',
                        },
                        video: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }
                      }}
                      components={{
                        audio: false,
                        torch: false,
                      }}
                    />
                    {/* Scan overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-8 border-2 border-[#00D4FF] rounded-lg" />
                      <div className="absolute top-8 left-8 w-6 h-6 border-t-4 border-l-4 border-[#00D4FF] rounded-tl-lg" />
                      <div className="absolute top-8 right-8 w-6 h-6 border-t-4 border-r-4 border-[#00D4FF] rounded-tr-lg" />
                      <div className="absolute bottom-8 left-8 w-6 h-6 border-b-4 border-l-4 border-[#00D4FF] rounded-bl-lg" />
                      <div className="absolute bottom-8 right-8 w-6 h-6 border-b-4 border-r-4 border-[#00D4FF] rounded-br-lg" />
                      {/* Scanning line animation */}
                      <div className="absolute left-8 right-8 h-0.5 bg-[#00D4FF] shadow-[0_0_8px_#00D4FF] animate-[scan_2s_ease-in-out_infinite]" style={{ top: '50%' }} />
                    </div>
                  </div>
                )}

                <p className="text-center text-xs text-[#555566]">
                  Make sure the QR code is well-lit and clearly visible
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(0,230,118,0.15)] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#00E676]" />
                </div>
                <p className="text-center text-white font-semibold text-lg mb-2">Check-in Successful!</p>
                {scannedVisitor && (
                  <div className="bg-[#1A1A24] rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-white font-bold">
                        {scannedVisitor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{scannedVisitor.name}</p>
                        <p className="text-sm text-[#8888A0]">{scannedVisitor.company}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[#555566]">Host</p>
                        <p className="text-white">{scannedVisitor.host}</p>
                      </div>
                      <div>
                        <p className="text-[#555566]">Time</p>
                        <p className="text-white">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                      </div>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-semibold"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 2rem; }
          50% { top: calc(100% - 2rem); }
        }
      `}</style>
    </div>
  )
}
