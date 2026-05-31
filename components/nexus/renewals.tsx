"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase, type Member, type Center } from "@/lib/supabase"
import { useToast } from "./toast-provider"
import { Search, Calendar, RefreshCw, AlertTriangle, CheckCircle2, Clock, TrendingUp, Bell, ChevronRight, MoreVertical, X } from "lucide-react"

interface RenewalsProps {
  selectedCenter: string
}

export function Renewals({ selectedCenter }: RenewalsProps) {
  const { showToast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "urgent" | "this-week" | "this-month">("all")
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [renewModal, setRenewModal] = useState<{ member: Member; newDate: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [reminderSent, setReminderSent] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [membersRes, centersRes] = await Promise.all([
        supabase.from("members").select("*").eq("status", "active").order("expiry_date"),
        supabase.from("centers").select("*").order("name"),
      ])
      if (membersRes.data) setMembers(membersRes.data)
      if (centersRes.data) setCenters(centersRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    const channel = supabase
      .channel("renewals-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, fetchData)
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  const today = new Date()
  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return Infinity
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getCenter = (centerId: string) => centers.find(c => c.id === centerId)

  // Filter members based on center and expiry
  const filteredByCenter = selectedCenter === "all" 
    ? members 
    : members.filter(m => m.center_id === selectedCenter)

  const membersWithExpiry = filteredByCenter
    .filter(m => m.expiry_date)
    .map(m => ({ ...m, daysUntilExpiry: getDaysUntilExpiry(m.expiry_date) }))
    .filter(m => m.daysUntilExpiry <= 90 && m.daysUntilExpiry > -30) // Show expiring within 90 days or expired within 30 days
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  const filteredMembers = membersWithExpiry.filter(m => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!(m.name || "").toLowerCase().includes(query) && 
          !(m.company || "").toLowerCase().includes(query) &&
          !(m.email || "").toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Status filter
    if (filter === "urgent") return m.daysUntilExpiry <= 7
    if (filter === "this-week") return m.daysUntilExpiry <= 7 && m.daysUntilExpiry > 0
    if (filter === "this-month") return m.daysUntilExpiry <= 30 && m.daysUntilExpiry > 0
    return true
  })

  // Stats
  const urgentCount = membersWithExpiry.filter(m => m.daysUntilExpiry <= 7 && m.daysUntilExpiry > 0).length
  const thisWeekCount = membersWithExpiry.filter(m => m.daysUntilExpiry <= 7 && m.daysUntilExpiry > 0).length
  const thisMonthCount = membersWithExpiry.filter(m => m.daysUntilExpiry <= 30 && m.daysUntilExpiry > 0).length
  const totalValue = membersWithExpiry.reduce((sum, m) => {
    const planValue = m.plan === "Private Cabin" ? 50000 : m.plan === "Dedicated Desk" ? 25000 : 15000
    return sum + planValue
  }, 0)

  const getRiskColor = (days: number) => {
    if (days <= 0) return "text-[#FF3D57]"
    if (days <= 7) return "text-[#FF4757]"
    if (days <= 15) return "text-[#F5A623]"
    return "text-[#00E676]"
  }

  const getRiskBadge = (days: number) => {
    if (days <= 0) return { text: "Expired", bg: "bg-[#FF3D57]/20 text-[#FF3D57] border-[#FF3D57]/30" }
    if (days <= 7) return { text: "Urgent", bg: "bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/30" }
    if (days <= 15) return { text: "Soon", bg: "bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30" }
    return { text: "On Track", bg: "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30" }
  }

  const sendReminder = async (member: Member & { daysUntilExpiry: number }) => {
    try {
      await supabase.from("notifications").insert({
        title: "Renewal Reminder Sent",
        message: `${member.name || "Member"}'s plan expires in ${member.daysUntilExpiry} days`,
        type: "warning",
        is_read: false
      })
      
      setReminderSent(prev => new Set(prev).add(member.id))
      showToast("success", `Reminder sent for ${member.name || "member"}`)
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setReminderSent(prev => {
          const next = new Set(prev)
          next.delete(member.id)
          return next
        })
      }, 3000)
    } catch (error) {
      showToast("error", "Failed to send reminder")
    }
  }

  const initiateRenewal = (member: Member & { daysUntilExpiry: number }) => {
    const currentExpiry = new Date(member.expiry_date)
    const newDate = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)
    setRenewModal({ member, newDate: newDate.toISOString().split("T")[0] })
  }

  const confirmRenewal = async () => {
    if (!renewModal) return
    
    try {
      const { error } = await supabase
        .from("members")
        .update({ expiry_date: renewModal.newDate })
        .eq("id", renewModal.member.id)
      
      if (error) throw error
      
      showToast("success", `${renewModal.member.name || "Member"} renewed until ${new Date(renewModal.newDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`)
      setRenewModal(null)
      fetchData()
    } catch (error) {
      showToast("error", "Failed to renew membership")
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
    return `₹${value}`
  }

  // Expiry Radar data
  const radarData = membersWithExpiry.filter(m => m.daysUntilExpiry > 0 && m.daysUntilExpiry <= 90)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Contract Renewals</h2>
          <p className="text-[#8888A0] text-sm">Track and manage membership renewals</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A24] hover:bg-[#1F1F2C] text-white rounded-lg transition-all border border-[rgba(0,212,255,0.15)]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Expiring (7 days)", value: urgentCount, icon: AlertTriangle, color: "red" },
          { label: "This Month", value: thisMonthCount, icon: Calendar, color: "amber" },
          { label: "Total at Risk", value: membersWithExpiry.length, icon: Clock, color: "cyan" },
          { label: "Pipeline Value", value: formatCurrency(totalValue), icon: TrendingUp, color: "emerald" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 hover:border-[rgba(0,212,255,0.3)] transition-all"
          >
            <div className={`p-2 rounded-lg w-fit ${stat.color === "red" ? "bg-[#FF4757]/10 text-[#FF4757]" : stat.color === "amber" ? "bg-[#F5A623]/10 text-[#F5A623]" : stat.color === "cyan" ? "bg-[#00D4FF]/10 text-[#00D4FF]" : "bg-[#00E676]/10 text-[#00E676]"}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className={`text-2xl font-bold mt-3 ${stat.color === "red" ? "text-[#FF4757]" : stat.color === "amber" ? "text-[#F5A623]" : stat.color === "cyan" ? "text-[#00D4FF]" : "text-[#00E676]"}`}>
              {stat.value}
            </p>
            <p className="text-[#8888A0] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Expiry Radar */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-white mb-4">Expiry Radar (Next 90 Days)</h3>
        <div className="relative h-48 flex items-center justify-center">
          {/* Radar circles */}
          <div className="absolute w-48 h-48 rounded-full border border-[rgba(255,255,255,0.05)]" />
          <div className="absolute w-36 h-36 rounded-full border border-[rgba(255,255,255,0.08)]" />
          <div className="absolute w-24 h-24 rounded-full border border-[rgba(255,255,255,0.1)]" />
          <div className="absolute w-12 h-12 rounded-full border border-[rgba(255,255,255,0.15)]" />
          
          {radarData.length === 0 ? (
            <p className="text-sm text-[#8888A0] relative z-10">No expiring members</p>
          ) : (
            radarData.slice(0, 15).map((member, i) => {
              // Position based on days until expiry (closer = more urgent)
              const angle = (i / Math.min(radarData.length, 15)) * 2 * Math.PI - Math.PI / 2
              const distance = Math.min(90, Math.max(20, 100 - member.daysUntilExpiry)) // More urgent = closer to center
              const x = Math.cos(angle) * distance
              const y = Math.sin(angle) * distance
              const color = member.daysUntilExpiry <= 7 ? "#FF4757" : member.daysUntilExpiry <= 30 ? "#F5A623" : "#00E676"
              
              return (
                <div
                  key={member.id}
                  className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform group"
                  style={{ 
                    left: `calc(50% + ${x}px - 6px)`, 
                    top: `calc(50% + ${y}px - 6px)`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`
                  }}
                  title={`${member.name}: ${member.daysUntilExpiry} days`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0F] border border-[rgba(0,212,255,0.2)] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {member.name || "Unknown"}: {member.daysUntilExpiry} days
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Renewals List */}
        <div className="col-span-2 glass-card rounded-xl">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">All Renewals</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888A0]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] w-48"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[#1A1A24] rounded-lg p-1">
                  {(["all", "urgent", "this-week", "this-month"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${filter === f ? "bg-[#00D4FF]/20 text-[#00D4FF]" : "text-[#8888A0] hover:text-white"}`}
                    >
                      {f === "this-week" ? "Week" : f === "this-month" ? "Month" : f === "urgent" ? "Urgent" : "All"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-[rgba(255,255,255,0.05)] max-h-[500px] overflow-y-auto">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A24]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#1A1A24] rounded w-1/3" />
                      <div className="h-3 bg-[#1A1A24] rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredMembers.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#00E676] mx-auto mb-3" />
                <p className="text-white font-medium">All caught up!</p>
                <p className="text-[#8888A0] text-sm">No renewals match your filters</p>
              </div>
            ) : (
              filteredMembers.map((member) => {
                const center = getCenter(member.center_id)
                const risk = getRiskBadge(member.daysUntilExpiry)
                const isSelected = selectedMember === member.id
                const isReminderSent = reminderSent.has(member.id)
                
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(isSelected ? null : member.id)}
                    className={`p-4 cursor-pointer transition-all hover:bg-[rgba(0,212,255,0.05)] ${isSelected ? "bg-[rgba(0,212,255,0.05)]" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-sm font-bold text-white">
                          {(member.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{member.name || "Unknown"}</p>
                          <p className="text-xs text-[#8888A0]">{member.company || "—"} - {member.plan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getRiskColor(member.daysUntilExpiry)}`}>
                            {member.daysUntilExpiry <= 0 ? "Expired" : `${member.daysUntilExpiry} days`}
                          </p>
                          <p className="text-xs text-[#8888A0]">
                            {new Date(member.expiry_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${risk.bg}`}>
                          {risk.text}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-[#8888A0] transition-transform ${isSelected ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] animate-in slide-in-from-top duration-200">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-[#8888A0]">Center</p>
                            <p className="text-sm text-white">{center?.name || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#8888A0]">Email</p>
                            <p className="text-sm text-white truncate">{member.email || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#8888A0]">Phone</p>
                            <p className="text-sm text-white">{member.phone || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#8888A0]">Seat</p>
                            <p className="text-sm text-white">{member.seat_number || "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); sendReminder(member) }}
                            disabled={isReminderSent}
                            className={`flex-1 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${isReminderSent ? "bg-[#00E676]/20 text-[#00E676]" : "bg-[#1A1A24] hover:bg-[#1F1F2C] text-white"}`}
                          >
                            {isReminderSent ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Sent
                              </>
                            ) : (
                              <>
                                <Bell className="w-4 h-4" />
                                Send Reminder
                              </>
                            )}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); initiateRenewal(member) }}
                            className="flex-1 py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-medium rounded-lg text-sm transition-colors"
                          >
                            {member.daysUntilExpiry <= 0 ? "Renew Now" : "Initiate Renewal"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Retention Metrics */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-medium text-white mb-4">Retention Metrics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#1A1A24" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#00D4FF"
                      strokeWidth="8"
                      strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">87%</span>
                  </div>
                </div>
                <p className="text-sm text-[#8888A0] mt-2">Retention Rate</p>
              </div>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Avg. Contract Length</span>
                  <span className="text-white font-medium">8.2 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Upsell Rate</span>
                  <span className="text-[#00E676] font-medium">23%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Churn Rate</span>
                  <span className="text-[#FF4757] font-medium">4.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-[#00D4FF]/5 to-[#7C4DFF]/5 border-[rgba(0,212,255,0.2)]">
            <h3 className="text-sm font-medium text-white mb-2">Tip</h3>
            <p className="text-xs text-[#8888A0]">Members with urgent renewals have higher churn risk. Prioritize personal outreach for best results.</p>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      {renewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRenewModal(null)} />
          <div className="relative bg-[#111118] rounded-xl border border-[rgba(0,212,255,0.2)] p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={() => setRenewModal(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-[rgba(255,255,255,0.05)] text-[#8888A0] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold text-white mb-1">Renew Membership</h3>
            <p className="text-sm text-[#8888A0] mb-6">{renewModal.member.name || "Unknown Member"}</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider block mb-1.5">Current Expiry</label>
                <p className="text-white bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5">
                  {new Date(renewModal.member.expiry_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider block mb-1.5">
                  New Expiry Date <span className="text-[#00D4FF]">*</span>
                </label>
                <input
                  type="date"
                  value={renewModal.newDate}
                  onChange={(e) => setRenewModal({ ...renewModal, newDate: e.target.value })}
                  className="w-full bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider block mb-1.5">Current Plan</label>
                <p className="text-white bg-[#1a1a24] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5">
                  {renewModal.member.plan}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRenewModal(null)}
                className="flex-1 py-2.5 rounded-lg bg-transparent border border-[rgba(255,255,255,0.1)] text-[#8888A0] font-medium text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRenewal}
                className="flex-1 py-2.5 rounded-lg bg-[#00D4FF] text-[#0A0A0F] font-semibold text-sm hover:bg-[#00B8E6] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
