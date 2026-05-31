'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, DollarSign, MoreHorizontal, X } from 'lucide-react'
import type { Module } from '@/app/page'

interface MobileNavProps {
  activeModule: Module
  setActiveModule: (module: Module) => void
}

const MAIN_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitors', label: 'Visitors', icon: Users },
  { id: 'rooms', label: 'Bookings', icon: Calendar },
  { id: 'finance', label: 'Finance', icon: DollarSign },
]

const ALL_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitors', label: 'Visitors', icon: Users },
  { id: 'rooms', label: 'Room Booking', icon: Calendar },
  { id: 'floor-map', label: 'Floor Map', icon: LayoutDashboard },
  { id: 'onboarding', label: 'Onboarding', icon: Users },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
  { id: 'renewals', label: 'Renewals', icon: Users },
  { id: 'support', label: 'Support', icon: LayoutDashboard },
  { id: 'chat', label: 'Team Chat', icon: Users },
  { id: 'team', label: 'Team', icon: LayoutDashboard },
  { id: 'bi-dashboard', label: 'BI Dashboard', icon: LayoutDashboard },
]

export function MobileNav({ activeModule, setActiveModule }: MobileNavProps) {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111118] border-t border-[rgba(0,212,255,0.1)] h-16 flex items-center justify-around z-40 md:hidden">
        {MAIN_ITEMS.map(item => {
          const Icon = item.icon as any
          const isActive = activeModule === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as Module)}
              className={`flex-1 flex flex-col items-center justify-center min-h-16 transition-all ${
                isActive ? 'text-[#00D4FF]' : 'text-[#8888A0]'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
        
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex-1 flex flex-col items-center justify-center min-h-16 text-[#8888A0] hover:text-white transition-all"
        >
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-xs mt-1">More</span>
        </button>
      </nav>

      {/* More Sheet */}
      {showMore && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#111118] border-t border-[rgba(0,212,255,0.1)] rounded-t-2xl max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">All Modules</h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-1 hover:bg-[rgba(0,212,255,0.1)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#8888A0]" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ALL_ITEMS.map(item => {
                  const Icon = item.icon as any
                  const isActive = activeModule === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id as Module)
                        setShowMore(false)
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-[rgba(0,212,255,0.15)] border-[rgba(0,212,255,0.3)] text-[#00D4FF]'
                          : 'bg-[rgba(255,255,255,0.05)] border-[rgba(0,212,255,0.1)] text-[#8888A0] hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs text-center">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
