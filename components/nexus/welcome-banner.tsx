'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

interface WelcomeBannerProps {
  onDismiss: () => void
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl transition-transform duration-700 ${
            isHovered ? 'scale-150' : 'scale-100'
          }`}
        />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/20 text-accent animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Welcome to NEXUS Command Center
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/20 text-accent">
                v2.0
              </span>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              Your unified coworking operations platform. Manage visitors, bookings, members,
              finances, and team communication all from one powerful interface.
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Stats preview */}
      <div className="relative grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        {[
          { label: 'Active Members', value: '247' },
          { label: 'Occupancy Rate', value: '87%' },
          { label: 'Monthly Revenue', value: '$142K' },
          { label: 'Support Rating', value: '4.9/5' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="text-center animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
