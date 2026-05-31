'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, ChevronDown, User, Plus, LogOut, Shield, UserPlus, Calendar, FileText, Ticket, Building2 } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getUnreadNotificationCount, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, type Notification, type Center } from '@/lib/supabase'
import { DrawerForms } from './drawer-forms'

interface HeaderProps {
  selectedCenter: string
  setSelectedCenter: (center: string) => void
  onSearchOpen: () => void
  user?: SupabaseUser | null
  onLogout?: () => void
  onDataRefresh?: () => void
}

export function Header({ selectedCenter, setSelectedCenter, onSearchOpen, user, onLogout, onDataRefresh }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch centers from Supabase
  useEffect(() => {
    async function fetchCenters() {
      const { data } = await supabase.from('centers').select('*').order('name')
      if (data) setCenters(data)
    }
    fetchCenters()
  }, [])

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const [notifs, count] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount()
        ])
        setNotifications(notifs)
        setUnreadCount(count)
      } catch {
        // Silently handle errors
      }
    }
    fetchNotifications()

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-[#00E676]'
      case 'error': return 'border-l-[#FF3D57]'
      case 'warning': return 'border-l-[#F5A623]'
      default: return 'border-l-[#00D4FF]'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="w-2 h-2 rounded-full bg-[#00E676]" />
      case 'error': return <div className="w-2 h-2 rounded-full bg-[#FF3D57]" />
      case 'warning': return <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
      default: return <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
    }
  }

  const userEmail = user?.email || 'user@nexus.com'
  const userInitials = userEmail.split('@')[0].slice(0, 2).toUpperCase()

  const addMenuItems = [
    { icon: UserPlus, label: 'New Member', drawer: 'member' },
    { icon: User, label: 'Log Visitor', drawer: 'visitor' },
    { icon: Calendar, label: 'Book a Room', drawer: 'booking' },
    { icon: FileText, label: 'Create Invoice', drawer: 'invoice' },
    { icon: Ticket, label: 'New Support Ticket', drawer: 'ticket' },
    { icon: Building2, label: 'Add Lead', drawer: 'lead' },
  ]

  return (
    <>
      <header className="h-16 bg-[#0D0D14] border-b border-[rgba(0,212,255,0.1)] flex items-center justify-between px-6 relative z-50">
        {/* Search */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-[#8888A0] hover:border-[rgba(0,212,255,0.3)] hover:text-white transition-all group w-72"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search members, tickets, bookings...</span>
          <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-[#1A1A24] text-[#555566] group-hover:text-[#8888A0]">
            ⌘K
          </kbd>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Center Switcher */}
          <div className="relative">
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="appearance-none bg-[#111118] border border-[rgba(0,212,255,0.15)] rounded-lg px-4 py-2 pr-10 text-sm text-white cursor-pointer hover:border-[rgba(0,212,255,0.3)] transition-all focus:outline-none focus:border-[#00D4FF]"
            >
              <option value="all">All Centers</option>
              {centers.map(center => (
                <option key={center.id} value={center.id}>{center.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0] pointer-events-none" />
          </div>

          {/* Add Button */}
          <div className="relative">
            <button 
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00D4FF] text-[#0A0A0F] font-medium text-sm hover:bg-[#00B8E6] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            
            {addMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAddMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg shadow-lg z-50 overflow-hidden animate-slide-in-up">
                  {addMenuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setOpenDrawer(item.drawer)
                        setAddMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#E8E8ED] hover:bg-[rgba(0,212,255,0.1)] transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-[#00D4FF]" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] text-[#8888A0] hover:text-white hover:border-[rgba(0,212,255,0.3)] transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3D57] text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[420px] bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg shadow-lg z-50 overflow-hidden animate-slide-in-up">
                  <div className="flex items-center justify-between p-4 border-b border-[rgba(0,212,255,0.1)]">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-[#00D4FF] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-[#8888A0]">All caught up!</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-l-2 ${getNotificationColor(notif.type)} ${!notif.is_read ? 'bg-[rgba(0,212,255,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}
                        >
                          <div className="mt-1.5">{getNotificationIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            <p className="text-xs text-[#8888A0] truncate">{notif.message}</p>
                            <p className="text-xs text-[#555566] mt-1">{getRelativeTime(notif.created_at)}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-[rgba(0,212,255,0.1)] text-center">
                    <button className="text-xs text-[#00D4FF] hover:underline">View All</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#111118] border border-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.3)] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-white text-xs font-bold">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white">{userEmail.split('@')[0]}</p>
                <p className="text-xs text-[#8888A0]">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#8888A0]" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#111118] border border-[rgba(0,212,255,0.2)] rounded-lg shadow-lg z-50 overflow-hidden animate-slide-in-up">
                  <div className="p-4 border-b border-[rgba(0,212,255,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-white font-bold">
                        {userInitials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{userEmail}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-[#00D4FF] mt-1 px-2 py-0.5 rounded-full bg-[rgba(0,212,255,0.1)]">
                          <Shield className="w-3 h-3" />
                          Super Admin
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      onLogout?.()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FF3D57] hover:bg-[rgba(255,61,87,0.1)] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Forms */}
      <DrawerForms 
        openDrawer={openDrawer} 
        onClose={() => setOpenDrawer(null)} 
        centers={centers}
        onRefresh={onDataRefresh}
      />
    </>
  )
}
