'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  X,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  MapPin,
  CreditCard,
  ArrowRight,
} from 'lucide-react'
import { members, rooms, tickets } from '@/lib/nexus-data'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (module: string) => void
}

type SearchResult = {
  type: 'member' | 'room' | 'ticket' | 'action'
  title: string
  subtitle: string
  module: string
  icon: React.ReactNode
}

export function SearchOverlay({ isOpen, onClose, onNavigate }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults(getQuickActions())
      return
    }

    const searchResults: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    // Search members
    members.forEach((member) => {
      if (
        member.name.toLowerCase().includes(lowerQuery) ||
        member.company.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'member',
          title: member.name,
          subtitle: `${member.company} - ${member.plan}`,
          module: 'onboarding',
          icon: <Users className="h-4 w-4" />,
        })
      }
    })

    // Search rooms
    rooms.forEach((room) => {
      if (
        room.name.toLowerCase().includes(lowerQuery) ||
        room.type.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'room',
          title: room.name,
          subtitle: `${room.type} - Capacity: ${room.capacity}`,
          module: 'room-booking',
          icon: <MapPin className="h-4 w-4" />,
        })
      }
    })

    // Search tickets
    tickets.forEach((ticket) => {
      if (
        ticket.subject.toLowerCase().includes(lowerQuery) ||
        ticket.member.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: 'ticket',
          title: ticket.subject,
          subtitle: `${ticket.member} - ${ticket.status}`,
          module: 'support',
          icon: <MessageSquare className="h-4 w-4" />,
        })
      }
    })

    setResults(searchResults.slice(0, 8))
    setSelectedIndex(0)
  }, [query])

  const getQuickActions = (): SearchResult[] => [
    {
      type: 'action',
      title: 'View Dashboard',
      subtitle: 'Open command center',
      module: 'dashboard',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      type: 'action',
      title: 'Check Visitors',
      subtitle: 'View visitor log',
      module: 'visitors',
      icon: <Users className="h-4 w-4" />,
    },
    {
      type: 'action',
      title: 'Book a Room',
      subtitle: 'Reserve meeting space',
      module: 'room-booking',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      type: 'action',
      title: 'View Finance',
      subtitle: 'Check invoices and payments',
      module: 'finance',
      icon: <CreditCard className="h-4 w-4" />,
    },
  ]

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.module)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="glass-card overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members, rooms, tickets, or type a command..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-white/5 px-2 text-xs text-muted-foreground">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="sm:hidden p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.length === 0 && query.trim() ? (
              <div className="py-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="space-y-1">
                {!query.trim() && (
                  <p className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </p>
                )}
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.title}-${index}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                      index === selectedIndex
                        ? 'bg-accent/20 text-accent'
                        : 'hover:bg-white/5 text-foreground'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        index === selectedIndex ? 'bg-accent/20' : 'bg-white/5'
                      }`}
                    >
                      {result.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        index === selectedIndex
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-2 opacity-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-white/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd> select
              </span>
            </div>
            <span>Powered by NEXUS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
