"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fadeOut, setFadeOut] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.session) {
        setFadeOut(true)
        setTimeout(() => {
          onLogin()
        }, 500)
      }
    } catch {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 bg-[#0A0A0F] flex items-center justify-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      {/* Animated dot-grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4FF] rounded-full blur-[150px] opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C4DFF] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card rounded-2xl p-8 border border-[rgba(0,212,255,0.2)] backdrop-blur-xl shadow-[0_0_60px_rgba(0,212,255,0.15)]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 relative mb-4">
              {/* Geometric N mark */}
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <defs>
                  <linearGradient id="nGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#00A3CC" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path 
                  d="M12 52V12L32 32V12L52 52H42L32 32V52H22L12 32V52Z" 
                  fill="url(#nGradient)"
                  filter="url(#glow)"
                />
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#00D4FF] rounded-full blur-xl opacity-30 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white font-[var(--font-display)] tracking-tight">NEXUS</h1>
            <p className="text-sm text-[#8888A0] mt-2 text-center">Command Center for Coworking Operators</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-[#8888A0] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-[#8888A0] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-[rgba(255,61,87,0.1)] border border-[rgba(255,61,87,0.3)] rounded-lg text-[#FF3D57] text-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login to NEXUS"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)] text-center">
            <p className="text-xs text-[#555566] flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secured
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
