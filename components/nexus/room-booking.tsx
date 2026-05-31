'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, Users, Monitor, Mic, X, ChevronLeft, ChevronRight,
  Edit3, Trash2, Loader2
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'
import { createBooking } from '@/app/actions/booking-actions'

interface Room {
  id: string
  name: string
  capacity: number
  type: string
  center_id: string
}

interface Booking {
  id: string
  room_name: string
  member_name: string
  center_id: string
  booking_date: string
  start_time: string
  end_time: string
  booking_type: string
  notes?: string
  created_at?: string
}

interface Center {
  id: string
  name: string
  short_name: string
}

// Fallback data
const fallbackRooms: Room[] = [
  { id: '1', name: 'Boardroom Alpha', capacity: 12, type: 'Boardroom', center_id: '1' },
  { id: '2', name: 'Focus Pod A', capacity: 4, type: 'Focus Pod', center_id: '1' },
  { id: '3', name: 'Training Hall 1', capacity: 30, type: 'Training Hall', center_id: '1' },
  { id: '4', name: 'Podcast Studio', capacity: 4, type: 'Podcast Studio', center_id: '1' },
]

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 8
  return `${hour.toString().padStart(2, '0')}:00`
})

const roomTypeIcons: Record<string, React.ElementType> = {
  'Boardroom': Users,
  'Focus Pod': Monitor,
  'Training Hall': Users,
  'Podcast Studio': Mic,
}

const formatTime = (time: string) => {
  const hour = parseInt(time.split(':')[0])
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}${ampm}`
}

export function RoomBooking({ selectedCenter }: { selectedCenter: string }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; time: string } | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [members, setMembers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingForm, setBookingForm] = useState({
    memberName: '',
    duration: '1',
    type: 'Internal',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [selectedCenter, selectedDate])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch rooms
      let roomsQuery = supabase.from('rooms').select('*')
      if (selectedCenter !== 'all') {
        roomsQuery = roomsQuery.eq('center_id', selectedCenter)
      }
      const { data: roomsData } = await roomsQuery

      // Fetch bookings for selected date using correct field names
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', selectedDate)

      // Fetch centers
      const { data: centersData } = await supabase.from('centers').select('*')

      // Fetch members
      const { data: membersData } = await supabase.from('members').select('id, name')

      setRooms(roomsData && roomsData.length > 0 ? roomsData : fallbackRooms)
      setBookings(bookingsData || [])
      setCenters(centersData || [])
      setMembers(membersData || [])
    } catch (error) {
      console.error('[v0] Error fetching data:', error)
      setRooms(fallbackRooms)
    }
    setLoading(false)
  }

  const filteredRooms = rooms.filter(r => 
    selectedCenter === 'all' || r.center_id === selectedCenter
  )

  const filteredBookings = bookings.filter(b => 
    b.booking_date === selectedDate && 
    (selectedCenter === 'all' || b.center_id === selectedCenter)
  )

  const getBookingForSlot = (roomName: string, time: string) => {
    return filteredBookings.find(b => {
      const startHour = parseInt(b.start_time.split(':')[0])
      const endHour = parseInt(b.end_time.split(':')[0])
      const slotHour = parseInt(time.split(':')[0])
      return b.room_name === roomName && slotHour >= startHour && slotHour < endHour
    })
  }

  const isSlotStart = (roomName: string, time: string) => {
    return filteredBookings.find(b => b.room_name === roomName && b.start_time === time)
  }

  const getSlotDuration = (booking: Booking) => {
    const startHour = parseInt(booking.start_time.split(':')[0])
    const endHour = parseInt(booking.end_time.split(':')[0])
    return endHour - startHour
  }

  const handleSlotClick = (roomName: string, time: string) => {
    const booking = getBookingForSlot(roomName, time)
    if (!booking) {
      setSelectedSlot({ roomId: roomName, time })
      setShowBookingModal(true)
    }
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return
    
    setBookingError('')
    
    // Validate required fields
    if (!bookingForm.memberName.trim()) {
      setBookingError('Please enter a member name')
      return
    }

    // Find room by name
    const selectedRoom = rooms.find(r => r.name === selectedSlot.roomId)
    
    if (!selectedRoom) {
      setBookingError('Room not found')
      return
    }

    const startHour = parseInt(selectedSlot.time.split(':')[0])
    const endHour = startHour + parseInt(bookingForm.duration)
    const endTime = `${endHour.toString().padStart(2, '0')}:00`

    setBookingLoading(true)
    try {
      // Use server action to create booking
      const result = await createBooking({
        room_name: selectedRoom.name,
        member_name: bookingForm.memberName.trim(),
        center_id: selectedRoom.center_id,
        booking_date: selectedDate,
        start_time: selectedSlot.time,
        end_time: endTime,
        booking_type: bookingForm.type,
        notes: bookingForm.notes || null
      })

      if (!result.success) {
        setBookingError(result.error || 'Failed to create booking')
        setBookingLoading(false)
        return
      }

      // Success: close modal + refresh bookings list
      setShowBookingModal(false)
      setSelectedSlot(null)
      setBookingForm({ memberName: '', duration: '1', type: 'Internal', notes: '' })
      setBookingError('')
      
      // Refresh bookings immediately
      fetchData()
    } catch (error) {
      console.error('[v0] Error creating booking:', error)
      setBookingError(error instanceof Error ? error.message : 'Failed to book room. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const getCenterById = (id: string) => centers.find(c => c.id === id)

  // Room occupancy data for pie chart
  const roomOccupancy = filteredRooms.map(room => {
    const roomBookings = filteredBookings.filter(b => b.room_name === room.name)
    const bookedHours = roomBookings.reduce((acc, b) => {
      const start = parseInt(b.start_time.split(':')[0])
      const end = parseInt(b.end_time.split(':')[0])
      return acc + (end - start)
    }, 0)
    const totalHours = 14
    return {
      name: room.name,
      value: Math.round((bookedHours / totalHours) * 100),
      color: room.type === 'Boardroom' ? '#00D4FF' : 
             room.type === 'Focus Pod' ? '#F5A623' :
             room.type === 'Training Hall' ? '#00E676' : '#7C4DFF'
    }
  })

  const todayBookings = filteredBookings.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-[var(--font-display)]">Conference Room Booking</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#111118] rounded-lg border border-[rgba(0,212,255,0.15)] p-1">
            <button 
              onClick={() => {
                const d = new Date(selectedDate)
                d.setDate(d.getDate() - 1)
                setSelectedDate(d.toISOString().split('T')[0])
              }}
              className="p-2 text-[#8888A0] hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-4 h-4 text-[#00D4FF]" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none"
              />
            </div>
            <button 
              onClick={() => {
                const d = new Date(selectedDate)
                d.setDate(d.getDate() + 1)
                setSelectedDate(d.toISOString().split('T')[0])
              }}
              className="p-2 text-[#8888A0] hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Timeline Grid */}
          <div className="lg:col-span-3 glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[rgba(0,212,255,0.1)]">
                    <th className="text-left px-4 py-3 text-sm font-medium text-[#8888A0] w-48 sticky left-0 bg-[#111118]">Room</th>
                    {timeSlots.map(time => (
                      <th key={time} className="px-1 py-3 text-xs font-medium text-[#555566] text-center w-16">
                        {formatTime(time)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map(room => {
                    const Icon = roomTypeIcons[room.type] || Users
                    const center = getCenterById(room.center_id)
                    
                    return (
                      <tr key={room.id} className="border-b border-[rgba(0,212,255,0.05)]">
                        <td className="px-4 py-3 sticky left-0 bg-[#111118]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#1A1A24] flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#00D4FF]" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{room.name}</p>
                              <p className="text-xs text-[#555566]">{room.capacity} pax{center ? ` • ${center.short_name}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        {timeSlots.map(time => {
                          const booking = getBookingForSlot(room.name, time)
                          const isStart = isSlotStart(room.name, time)
                          
                          if (booking && !isStart) {
                            return null
                          }
                          
                          if (booking && isStart) {
                            const duration = getSlotDuration(booking)
                            const typeColors: Record<string, string> = {
                              'Internal': 'from-[#00D4FF] to-[#0088AA]',
                              'Client': 'from-[#F5A623] to-[#CC8400]',
                              'Event': 'from-[#7C4DFF] to-[#5C3DBF]'
                            }
                            
                            return (
                              <td 
                                key={time} 
                                colSpan={duration}
                                className="px-1 py-2"
                              >
                                <div 
                                  className={`h-12 rounded-lg bg-gradient-to-r ${typeColors[booking.booking_type] || typeColors['Internal']} px-2 py-1 cursor-pointer hover:opacity-90 transition-all`}
                                  title={`${booking.member_name} - ${booking.booking_type}`}
                                >
                                  <p className="text-[#0A0A0F] text-xs font-medium truncate">{booking.member_name || 'Booked'}</p>
                                  <p className="text-[#0A0A0F]/70 text-xs truncate">{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                                </div>
                              </td>
                            )
                          }
                          
                          return (
                            <td key={time} className="px-1 py-2">
                              <button
                                onClick={() => handleSlotClick(room.name, time)}
                                className="w-full h-12 rounded-lg border border-dashed border-[rgba(0,212,255,0.1)] hover:border-[#00D4FF] hover:bg-[rgba(0,212,255,0.05)] transition-all"
                              />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Occupancy Chart */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Room Occupancy Today</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomOccupancy}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roomOccupancy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {roomOccupancy.slice(0, 4).map((room, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: room.color }} />
                      <span className="text-[#8888A0] truncate max-w-[120px]">{room.name}</span>
                    </div>
                    <span className="text-white font-medium">{room.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Upcoming Today</h3>
              <div className="space-y-3">
                {todayBookings.length === 0 ? (
                  <p className="text-sm text-[#8888A0] text-center py-4">No bookings for today</p>
                ) : (
                  todayBookings.map(booking => {
                    const room = rooms.find(r => r.id === booking.room_id)
                    
                    return (
                      <div key={booking.id} className="bg-[#1A1A24] rounded-lg p-3 group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{room?.name}</p>
                            <p className="text-xs text-[#8888A0]">{booking.member?.name || 'Unknown'}</p>
                            <p className="text-xs text-[#00D4FF] mt-1">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded hover:bg-[#2A2A3A] text-[#8888A0] hover:text-white">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-[#2A2A3A] text-[#8888A0] hover:text-[#FF4757]">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Book Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBookingModal(false)} />
          <div className="relative bg-[#111118] rounded-2xl border border-[rgba(0,212,255,0.2)] w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="sticky top-0 bg-[#111118] flex items-center justify-between p-6 border-b border-[rgba(0,212,255,0.1)] z-10">
              <h2 className="text-xl font-semibold text-white font-[var(--font-display)]">Quick Book</h2>
              <button onClick={() => setShowBookingModal(false)} className="text-[#8888A0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-[#1A1A24] rounded-lg p-4">
                <p className="text-[#8888A0] text-sm">Room</p>
                <p className="text-white font-medium text-lg">{selectedSlot.roomId}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8888A0] mb-2">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8888A0] mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={selectedSlot.time}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Duration</label>
                <select 
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF]"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Member Name</label>
                <input 
                  type="text"
                  value={bookingForm.memberName}
                  onChange={(e) => setBookingForm({ ...bookingForm, memberName: e.target.value })}
                  placeholder="Enter member name"
                  className="w-full px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Booking Type</label>
                <div className="flex gap-2">
                  {['Internal', 'Client', 'Event'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setBookingForm({ ...bookingForm, type })}
                      className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                        bookingForm.type === type 
                          ? 'border-[#00D4FF] text-[#00D4FF] bg-[rgba(0,212,255,0.1)]' 
                          : 'border-[rgba(0,212,255,0.15)] text-[#8888A0] hover:border-[#00D4FF] hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Notes (Optional)</label>
                <textarea 
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF] resize-none"
                  rows={2}
                  placeholder="Add any notes..."
                />
              </div>
              
              {bookingError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-400">{bookingError}</p>
                </div>
              )}
              
              <button 
                onClick={handleConfirmBooking}
                disabled={bookingLoading || !bookingForm.memberName.trim()}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
