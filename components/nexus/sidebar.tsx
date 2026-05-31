'use client'

import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Map, 
  UserPlus, 
  DollarSign, 
  RefreshCw, 
  Headphones, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Monitor
} from 'lucide-react'
import type { Module } from '@/app/page'

interface SidebarProps {
  activeModule: Module
  setActiveModule: (module: Module) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const menuItems: { id: Module; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'visitors', label: 'Visitors', icon: Users },
  { id: 'rooms', label: 'Room Booking', icon: Calendar },
  { id: 'floor-map', label: 'Floor Map', icon: Map },
  { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'renewals', label: 'Renewals', icon: RefreshCw },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'chat', label: 'Team Chat', icon: MessageSquare },
  { id: 'team', label: 'Team', icon: Settings },
  { id: 'bi-dashboard', label: 'BI Dashboard', icon: Monitor },
]

export function Sidebar({ activeModule, setActiveModule, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside 
      className={`${collapsed ? 'w-20' : 'w-64'} bg-[#0D0D14] border-r border-[rgba(0,212,255,0.1)] flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-[rgba(0,212,255,0.1)]`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0088AA] flex items-center justify-center glow-cyan">
            <span className="text-[#0A0A0F] font-bold text-xl font-[var(--font-syne)]">N</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-white font-[var(--font-syne)] tracking-wide">NEXUS</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-[rgba(0,212,255,0.15)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]' 
                  : 'text-[#8888A0] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon 
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 
                  ${isActive ? 'text-[#00D4FF]' : 'group-hover:translate-x-0.5'}
                `} 
              />
              {!collapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-glow-cyan' : ''}`}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse-dot" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1A1A24] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[#8888A0] hover:text-[#00D4FF] hover:border-[#00D4FF] transition-all"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Footer */}
      <div className={`p-4 border-t border-[rgba(0,212,255,0.1)] ${collapsed ? 'text-center' : ''}`}>
        <div className={`text-xs text-[#555566] ${collapsed ? '' : 'flex items-center justify-between'}`}>
          {!collapsed && <span>NEXUS v2.0</span>}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse-dot" />
            {!collapsed && 'Live'}
          </span>
        </div>
      </div>
    </aside>
  )
}
