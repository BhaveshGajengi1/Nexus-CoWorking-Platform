"use client"

import { useState, useEffect } from "react"
import { Search, Users, Wifi, Coffee, Printer, ZoomIn, ZoomOut, Layers, Monitor, Phone, DoorOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Desk {
  id: string
  name: string
  floor: number
  x: number
  y: number
  status: 'occupied' | 'available' | 'reserved'
  member_id?: string
  member?: { name: string; company: string }
}

interface Zone {
  id: string
  name: string
  type: 'open' | 'private' | 'meeting' | 'common'
  floor: number
  x: number
  y: number
  width: number
  height: number
}

interface Amenity {
  id: string
  name: string
  type: string
  floor: number
  x: number
  y: number
}

// Floor layouts with proper visual representations
const floorLayouts = {
  1: {
    name: "Ground Floor - Reception & Hot Desks",
    zones: [
      { id: 'z1-1', name: 'Reception', type: 'common', x: 5, y: 5, width: 25, height: 20 },
      { id: 'z1-2', name: 'Hot Desk Area A', type: 'open', x: 35, y: 5, width: 30, height: 40 },
      { id: 'z1-3', name: 'Hot Desk Area B', type: 'open', x: 70, y: 5, width: 25, height: 40 },
      { id: 'z1-4', name: 'Lounge', type: 'common', x: 5, y: 30, width: 25, height: 25 },
      { id: 'z1-5', name: 'Meeting Room 1', type: 'meeting', x: 5, y: 60, width: 20, height: 35 },
      { id: 'z1-6', name: 'Meeting Room 2', type: 'meeting', x: 30, y: 50, width: 20, height: 25 },
      { id: 'z1-7', name: 'Cafeteria', type: 'common', x: 55, y: 50, width: 40, height: 45 },
    ],
    desks: [
      // Hot Desk Area A
      { id: 'D1-01', x: 38, y: 12, status: 'occupied' },
      { id: 'D1-02', x: 48, y: 12, status: 'available' },
      { id: 'D1-03', x: 58, y: 12, status: 'available' },
      { id: 'D1-04', x: 38, y: 25, status: 'occupied' },
      { id: 'D1-05', x: 48, y: 25, status: 'reserved' },
      { id: 'D1-06', x: 58, y: 25, status: 'available' },
      { id: 'D1-07', x: 38, y: 38, status: 'available' },
      { id: 'D1-08', x: 48, y: 38, status: 'occupied' },
      // Hot Desk Area B
      { id: 'D1-09', x: 73, y: 12, status: 'available' },
      { id: 'D1-10', x: 83, y: 12, status: 'occupied' },
      { id: 'D1-11', x: 73, y: 25, status: 'available' },
      { id: 'D1-12', x: 83, y: 25, status: 'available' },
      { id: 'D1-13', x: 73, y: 38, status: 'reserved' },
      { id: 'D1-14', x: 83, y: 38, status: 'occupied' },
    ],
    amenities: [
      { id: 'a1-1', name: 'WiFi Router', type: 'wifi', x: 50, y: 30 },
      { id: 'a1-2', name: 'Coffee Station', type: 'coffee', x: 15, y: 40 },
      { id: 'a1-3', name: 'Printer', type: 'printer', x: 65, y: 45 },
      { id: 'a1-4', name: 'Phone Booth', type: 'phone', x: 30, y: 45 },
    ]
  },
  2: {
    name: "First Floor - Dedicated Desks",
    zones: [
      { id: 'z2-1', name: 'Team Zone Alpha', type: 'open', x: 5, y: 5, width: 45, height: 45 },
      { id: 'z2-2', name: 'Team Zone Beta', type: 'open', x: 55, y: 5, width: 40, height: 45 },
      { id: 'z2-3', name: 'Conference Room A', type: 'meeting', x: 5, y: 55, width: 30, height: 40 },
      { id: 'z2-4', name: 'Conference Room B', type: 'meeting', x: 40, y: 55, width: 25, height: 40 },
      { id: 'z2-5', name: 'Breakout Area', type: 'common', x: 70, y: 55, width: 25, height: 40 },
    ],
    desks: [
      // Team Zone Alpha - 3x4 grid
      { id: 'D2-01', x: 10, y: 12, status: 'occupied' },
      { id: 'D2-02', x: 22, y: 12, status: 'occupied' },
      { id: 'D2-03', x: 34, y: 12, status: 'available' },
      { id: 'D2-04', x: 10, y: 24, status: 'occupied' },
      { id: 'D2-05', x: 22, y: 24, status: 'occupied' },
      { id: 'D2-06', x: 34, y: 24, status: 'reserved' },
      { id: 'D2-07', x: 10, y: 36, status: 'available' },
      { id: 'D2-08', x: 22, y: 36, status: 'occupied' },
      { id: 'D2-09', x: 34, y: 36, status: 'occupied' },
      // Team Zone Beta - 3x3 grid
      { id: 'D2-10', x: 60, y: 12, status: 'occupied' },
      { id: 'D2-11', x: 72, y: 12, status: 'available' },
      { id: 'D2-12', x: 84, y: 12, status: 'occupied' },
      { id: 'D2-13', x: 60, y: 24, status: 'available' },
      { id: 'D2-14', x: 72, y: 24, status: 'occupied' },
      { id: 'D2-15', x: 84, y: 24, status: 'reserved' },
      { id: 'D2-16', x: 60, y: 36, status: 'occupied' },
      { id: 'D2-17', x: 72, y: 36, status: 'available' },
      { id: 'D2-18', x: 84, y: 36, status: 'occupied' },
    ],
    amenities: [
      { id: 'a2-1', name: 'WiFi Router', type: 'wifi', x: 50, y: 25 },
      { id: 'a2-2', name: 'Coffee Station', type: 'coffee', x: 75, y: 65 },
      { id: 'a2-3', name: 'Printer', type: 'printer', x: 45, y: 48 },
      { id: 'a2-4', name: 'Phone Booth', type: 'phone', x: 52, y: 48 },
    ]
  },
  3: {
    name: "Second Floor - Private Cabins & Executive",
    zones: [
      { id: 'z3-1', name: 'Executive Suite', type: 'private', x: 5, y: 5, width: 30, height: 35 },
      { id: 'z3-2', name: 'Private Cabin A', type: 'private', x: 40, y: 5, width: 25, height: 25 },
      { id: 'z3-3', name: 'Private Cabin B', type: 'private', x: 70, y: 5, width: 25, height: 25 },
      { id: 'z3-4', name: 'Private Cabin C', type: 'private', x: 40, y: 35, width: 25, height: 25 },
      { id: 'z3-5', name: 'Private Cabin D', type: 'private', x: 70, y: 35, width: 25, height: 25 },
      { id: 'z3-6', name: 'Boardroom', type: 'meeting', x: 5, y: 45, width: 30, height: 30 },
      { id: 'z3-7', name: 'Podcast Studio', type: 'meeting', x: 5, y: 78, width: 20, height: 18 },
      { id: 'z3-8', name: 'Server Room', type: 'common', x: 30, y: 65, width: 15, height: 30 },
      { id: 'z3-9', name: 'Executive Lounge', type: 'common', x: 50, y: 65, width: 45, height: 30 },
    ],
    desks: [
      // Executive Suite
      { id: 'D3-01', x: 12, y: 15, status: 'occupied' },
      { id: 'D3-02', x: 25, y: 15, status: 'occupied' },
      { id: 'D3-03', x: 12, y: 28, status: 'available' },
      { id: 'D3-04', x: 25, y: 28, status: 'occupied' },
      // Private Cabins
      { id: 'D3-05', x: 50, y: 15, status: 'occupied' },
      { id: 'D3-06', x: 80, y: 15, status: 'available' },
      { id: 'D3-07', x: 50, y: 45, status: 'reserved' },
      { id: 'D3-08', x: 80, y: 45, status: 'occupied' },
    ],
    amenities: [
      { id: 'a3-1', name: 'WiFi Router', type: 'wifi', x: 60, y: 75 },
      { id: 'a3-2', name: 'Coffee Station', type: 'coffee', x: 70, y: 75 },
      { id: 'a3-3', name: 'Printer', type: 'printer', x: 35, y: 75 },
    ]
  }
}

export function FloorMap({ selectedCenter }: { selectedCenter: string }) {
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null)
  const [floor, setFloor] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [dbDesks, setDbDesks] = useState<Desk[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDesks()
  }, [selectedCenter])

  const fetchDesks = async () => {
    setLoading(true)
    try {
      let query = supabase.from('desks').select('*, member:members(name, company)')
      if (selectedCenter !== 'all') {
        query = query.eq('center_id', selectedCenter)
      }
      const { data } = await query
      setDbDesks(data || [])
    } catch (error) {
      console.error('Error fetching desks:', error)
    }
    setLoading(false)
  }

  const currentFloor = floorLayouts[floor as keyof typeof floorLayouts]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied": return "bg-[#00E676]"
      case "available": return "bg-[#00D4FF]"
      case "reserved": return "bg-[#F5A623]"
      default: return "bg-[#555566]"
    }
  }

  const getZoneStyle = (type: string) => {
    switch (type) {
      case 'private': return { border: 'rgba(124, 77, 255, 0.4)', bg: 'rgba(124, 77, 255, 0.08)' }
      case 'meeting': return { border: 'rgba(0, 212, 255, 0.4)', bg: 'rgba(0, 212, 255, 0.08)' }
      case 'common': return { border: 'rgba(245, 166, 35, 0.4)', bg: 'rgba(245, 166, 35, 0.08)' }
      default: return { border: 'rgba(0, 230, 118, 0.4)', bg: 'rgba(0, 230, 118, 0.08)' }
    }
  }

  const getAmenityIcon = (type: string) => {
    switch (type) {
      case 'wifi': return <Wifi className="h-3 w-3 text-[#00D4FF]" />
      case 'coffee': return <Coffee className="h-3 w-3 text-[#F5A623]" />
      case 'printer': return <Printer className="h-3 w-3 text-[#7C4DFF]" />
      case 'phone': return <Phone className="h-3 w-3 text-[#00E676]" />
      default: return <Monitor className="h-3 w-3 text-[#8888A0]" />
    }
  }

  // Merge database desks with layout desks
  const getMergedDesks = () => {
    const layoutDesks = currentFloor.desks
    return layoutDesks.map(desk => {
      const dbDesk = dbDesks.find(d => d.id === desk.id || d.name === desk.id)
      return {
        ...desk,
        status: dbDesk?.status || desk.status,
        member: dbDesk?.member
      }
    })
  }

  const desks = getMergedDesks()
  const filteredDesks = searchQuery 
    ? desks.filter(d => 
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.member?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : desks

  const floorStats = {
    total: desks.length,
    occupied: desks.filter(d => d.status === 'occupied').length,
    available: desks.filter(d => d.status === 'available').length,
    reserved: desks.filter(d => d.status === 'reserved').length
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-[var(--font-display)]">Floor Map</h2>
          <p className="text-[#8888A0]">Interactive space visualization</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find desk or member..."
            className="bg-[#111118] border border-[rgba(0,212,255,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 glass-card rounded-xl p-6">
          {/* Floor selector and zoom */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(f => (
                <button
                  key={f}
                  onClick={() => setFloor(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    floor === f 
                      ? "bg-[rgba(0,212,255,0.15)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]" 
                      : "bg-[#1A1A24] text-[#8888A0] hover:text-white"
                  }`}
                >
                  Floor {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
                className="p-2 bg-[#1A1A24] rounded-lg text-[#8888A0] hover:text-white transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-[#8888A0] text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}
                className="p-2 bg-[#1A1A24] rounded-lg text-[#8888A0] hover:text-white transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Floor name */}
          <p className="text-sm text-[#00D4FF] mb-4">{currentFloor.name}</p>

          {/* Floor Map */}
          <div 
            className="relative bg-[#0A0A0F] rounded-xl border border-[rgba(0,212,255,0.1)] overflow-hidden"
            style={{ height: "480px" }}
          >
            <div 
              className="absolute inset-0 origin-top-left transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="floorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00D4FF" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#floorGrid)" />
                </svg>
              </div>

              {/* Zones */}
              {currentFloor.zones.map((zone) => {
                const style = getZoneStyle(zone.type)
                return (
                  <div
                    key={zone.id}
                    className="absolute rounded-lg border-2 transition-all hover:opacity-80"
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                      borderColor: style.border,
                      backgroundColor: style.bg,
                      borderStyle: 'dashed'
                    }}
                  >
                    <span className="absolute top-2 left-2 text-xs font-medium text-[#8888A0] bg-[#0A0A0F]/80 px-2 py-0.5 rounded">
                      {zone.name}
                    </span>
                  </div>
                )
              })}

              {/* Desks */}
              {filteredDesks.map((desk) => (
                <button
                  key={desk.id}
                  onClick={() => setSelectedDesk(desk.id === selectedDesk ? null : desk.id)}
                  className={`absolute w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg ${getStatusColor(desk.status)} ${
                    selectedDesk === desk.id 
                      ? "ring-2 ring-white scale-125 z-20" 
                      : "hover:scale-110 hover:z-10"
                  } ${searchQuery && !filteredDesks.find(d => d.id === desk.id) ? 'opacity-30' : ''}`}
                  style={{ left: `${desk.x}%`, top: `${desk.y}%` }}
                  title={`${desk.id}${desk.member ? ` - ${desk.member.name}` : ''}`}
                >
                  {desk.member ? (
                    <span className="text-xs font-bold text-[#0A0A0F]">
                      {desk.member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#0A0A0F]/80">{desk.id.split('-')[1]}</span>
                  )}
                </button>
              ))}

              {/* Amenities */}
              {currentFloor.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="absolute w-7 h-7 rounded-full bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:scale-110 transition-transform cursor-help"
                  style={{ left: `${amenity.x}%`, top: `${amenity.y}%` }}
                  title={amenity.name}
                >
                  {getAmenityIcon(amenity.type)}
                </div>
              ))}

              {/* Entrance indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1A1A24] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
                <DoorOpen className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-xs text-[#8888A0]">Entrance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#00D4FF]" />
              Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#00E676]"></div>
                <span className="text-xs text-[#8888A0]">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#00D4FF]"></div>
                <span className="text-xs text-[#8888A0]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F5A623]"></div>
                <span className="text-xs text-[#8888A0]">Reserved</span>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.05)] my-2 pt-2">
                <p className="text-xs text-[#555566] mb-2">Zones</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded border-2 border-dashed border-[rgba(0,230,118,0.4)]"></div>
                  <span className="text-xs text-[#8888A0]">Open Area</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded border-2 border-dashed border-[rgba(124,77,255,0.4)]"></div>
                  <span className="text-xs text-[#8888A0]">Private</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded border-2 border-dashed border-[rgba(0,212,255,0.4)]"></div>
                  <span className="text-xs text-[#8888A0]">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-dashed border-[rgba(245,166,35,0.4)]"></div>
                  <span className="text-xs text-[#8888A0]">Common</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Desk Info */}
          {selectedDesk && (
            <div className="glass-card rounded-xl p-4 animate-slide-in-up">
              <h3 className="text-sm font-medium text-white mb-3">Desk Details</h3>
              {(() => {
                const desk = desks.find(d => d.id === selectedDesk)
                return desk ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#555566]">Desk ID</p>
                      <p className="text-sm text-white font-medium">{desk.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#555566]">Status</p>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        desk.status === "occupied" ? "bg-[rgba(0,230,118,0.15)] text-[#00E676]" : 
                        desk.status === "available" ? "bg-[rgba(0,212,255,0.15)] text-[#00D4FF]" : 
                        "bg-[rgba(245,166,35,0.15)] text-[#F5A623]"
                      }`}>
                        {desk.status.charAt(0).toUpperCase() + desk.status.slice(1)}
                      </span>
                    </div>
                    {desk.member && (
                      <div>
                        <p className="text-xs text-[#555566]">Assigned To</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-xs font-bold text-white">
                            {desk.member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm text-white">{desk.member.name}</p>
                            <p className="text-xs text-[#555566]">{desk.member.company}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {desk.status === "available" && (
                      <button className="w-full py-2 bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-medium rounded-lg text-sm transition-all hover:opacity-90">
                        Reserve Desk
                      </button>
                    )}
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* Floor Stats */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#00D4FF]" />
              Floor {floor} Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8888A0]">Total Desks</span>
                <span className="text-white font-medium">{floorStats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8888A0]">Occupied</span>
                <span className="text-[#00E676] font-medium">{floorStats.occupied}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8888A0]">Available</span>
                <span className="text-[#00D4FF] font-medium">{floorStats.available}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8888A0]">Reserved</span>
                <span className="text-[#F5A623] font-medium">{floorStats.reserved}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8888A0]">Occupancy</span>
                  <span className="text-white font-medium">
                    {floorStats.total > 0 ? Math.round((floorStats.occupied / floorStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-[#1A1A24] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00E676] transition-all duration-500"
                    style={{ width: `${floorStats.total > 0 ? (floorStats.occupied / floorStats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
