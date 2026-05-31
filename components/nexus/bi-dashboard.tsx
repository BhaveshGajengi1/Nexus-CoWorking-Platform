'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SAMPLE_MEMBERS, SAMPLE_VISITORS, SAMPLE_INVOICES, SAMPLE_BOOKINGS, SAMPLE_TICKETS, SAMPLE_CENTERS } from '@/lib/sample-data'

const ROOM_STATUSES = [
  { room: 'Boardroom', status: 'Booked', member: 'Arjun Mehta' },
  { room: 'Focus Pod', status: 'Available', member: '' },
  { room: 'Training Hall', status: 'Booked', member: 'Sneha Patel' },
  { room: 'Podcast Studio', status: 'Available', member: '' }
]

const ACTIVITY_EVENTS = [
  { type: 'visitor', text: 'Rahul Gupta checked in at NEXUS HITEC City', time: '5 min ago' },
  { type: 'booking', text: 'Boardroom booked by Arjun Mehta', time: '12 min ago' },
  { type: 'invoice', text: 'INV-1005 paid by Vikram Joshi', time: '25 min ago' },
  { type: 'ticket', text: 'P1 ticket: WiFi issue - In Progress', time: '45 min ago' },
  { type: 'visitor', text: 'Deepak Verma checked in at NEXUS Indiranagar', time: '1h ago' },
  { type: 'booking', text: 'Training Hall reserved by Sneha Patel', time: '2h ago' },
  { type: 'invoice', text: 'INV-1003 overdue reminder sent', time: '3h ago' },
  { type: 'renewal', text: 'Karan Singh renewal due in 3 days', time: '4h ago' },
  { type: 'visitor', text: 'Manish Tiwari checked in at NEXUS BKC', time: '5h ago' },
  { type: 'ticket', text: 'AC maintenance resolved', time: '6h ago' }
]

interface BIDashboardProps {
  onClose: () => void
}

export function BIDashboard({ onClose }: BIDashboardProps) {
  const [liveOccupancy, setLiveOccupancy] = useState(69)
  const [todaysVisitors, setTodaysVisitors] = useState(3)
  const [monthRevenue, setMonthRevenue] = useState(2335000)
  const [openTickets, setOpenTickets] = useState(3)
  const [healthScore, setHealthScore] = useState(82)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Auto-scroll activity ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % (ACTIVITY_EVENTS.length * 100))
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#0A0A0F] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-[rgba(0,212,255,0.1)] p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-[var(--font-syne)]">BI Dashboard</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[rgba(0,212,255,0.1)] rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-[#8888A0]" />
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-6 auto-rows-max">
            {/* Panel 1: Live Occupancy */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-white">Live Occupancy</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  <span className="text-xs text-[#00E676] font-semibold">LIVE</span>
                </div>
              </div>
              <div className="h-40 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Occupied', value: liveOccupancy },
                        { name: 'Available', value: 100 - liveOccupancy }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      <Cell fill="#00D4FF" />
                      <Cell fill="rgba(0,212,255,0.1)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-[#00D4FF]">{liveOccupancy}%</div>
              </div>
            </div>

            {/* Panel 2: Today's Visitors */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4">Today's Visitors</h3>
              <div className="text-4xl font-bold text-[#00D4FF] mb-4">{todaysVisitors}</div>
              <div className="space-y-2">
                <p className="text-sm text-[#8888A0]">Checked In:</p>
                <div className="space-y-1">
                  {['Rahul Gupta', 'Deepak Verma', 'Manish Tiwari'].map(name => (
                    <div key={name} className="text-xs text-white bg-[rgba(0,212,255,0.1)] px-2 py-1 rounded">
                      • {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 3: Revenue This Month */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4">Revenue This Month</h3>
              <div className="text-3xl font-bold text-[#00D4FF] mb-4">₹{(monthRevenue / 100000).toFixed(1)}L</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#8888A0]">vs last month</span>
                  <span className="text-[#00E676]">↑ 8%</span>
                </div>
                <div className="w-full h-2 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00A8CC]" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Panel 4: Room Status Grid */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4">Room Status</h3>
              <div className="space-y-2">
                {ROOM_STATUSES.map(room => (
                  <div key={room.room} className="flex items-center justify-between p-2 bg-[rgba(0,212,255,0.05)] rounded">
                    <span className="text-xs font-medium text-white">{room.room}</span>
                    <div className="flex items-center gap-2">
                      {room.status === 'Available' ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-[#00E676]" />
                          <span className="text-xs text-[#00E676]">Available</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                          <span className="text-xs text-[#FF6B6B]">Booked</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 5: NEXUS Health Score */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4">Platform Health</h3>
              <div className="flex flex-col items-center justify-center h-40">
                <div className={`text-5xl font-bold ${healthScore > 75 ? 'text-[#00E676]' : healthScore > 50 ? 'text-[#FFA500]' : 'text-[#FF6B6B]'}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-[#8888A0] mt-2">Health Score</div>
              </div>
              <div className="text-xs text-center text-[#8888A0]">
                {healthScore > 75 ? 'Excellent' : healthScore > 50 ? 'Good' : 'Needs Attention'}
              </div>
            </div>

            {/* Panel 6: Open Tickets */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4">Open Tickets</h3>
              <div className="text-4xl font-bold text-[#FF6B6B] mb-4">{openTickets}</div>
              <div className="space-y-2">
                <div className="bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)] rounded p-2">
                  <p className="text-xs text-white font-medium">P1: WiFi Dropping</p>
                  <p className="text-xs text-[#FF6B6B]">Training Hall • Bangalore</p>
                </div>
                <div className="bg-[rgba(255,165,0,0.1)] border border-[rgba(255,165,0,0.3)] rounded p-2">
                  <p className="text-xs text-white font-medium">P2: AC Issue</p>
                  <p className="text-xs text-[#FFA500]">Cabin C-01 • HITEC City</p>
                </div>
              </div>
            </div>

            {/* Panel 7: Activity Ticker (full width) */}
            <div className="bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg p-6 col-span-3">
              <h3 className="text-sm font-semibold text-white mb-4">Live Activity</h3>
              <div className="overflow-hidden bg-[rgba(0,212,255,0.05)] rounded p-4 h-16 relative">
                <div 
                  className="flex gap-8 whitespace-nowrap transition-transform ease-linear"
                  style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                  {[...ACTIVITY_EVENTS, ...ACTIVITY_EVENTS].map((event, idx) => (
                    <div key={idx} className="flex-shrink-0 text-xs text-[#8888A0]">
                      {event.type === 'visitor' && '👤'} 
                      {event.type === 'booking' && '📅'}
                      {event.type === 'invoice' && '💰'}
                      {event.type === 'ticket' && '🎫'}
                      {event.type === 'renewal' && '🔄'}
                      {' '}{event.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="border-t border-[rgba(0,212,255,0.1)] px-6 py-3 text-xs text-[#8888A0]">
        Auto-refreshing every 60 seconds
      </div>
    </div>
  )
}
