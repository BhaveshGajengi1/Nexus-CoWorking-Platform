"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase, type Ticket, type Center } from "@/lib/supabase"
import { useToast } from "./toast-provider"
import { Search, Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, AlertTriangle, ChevronRight, Send, X, Loader2 } from "lucide-react"
import { DrawerForms } from "./drawer-forms"

interface SupportProps {
  selectedCenter: string
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  P1: { bg: "bg-[#FF3D57]/20", text: "text-[#FF3D57]", border: "border-[#FF3D57]/30" },
  P2: { bg: "bg-[#F5A623]/20", text: "text-[#F5A623]", border: "border-[#F5A623]/30" },
  P3: { bg: "bg-[#F5A623]/20", text: "text-[#F5A623]", border: "border-[#F5A623]/30" },
  P4: { bg: "bg-[#8888A0]/20", text: "text-[#8888A0]", border: "border-[#8888A0]/30" },
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-[#00D4FF]/20 text-[#00D4FF]",
  in_progress: "bg-[#F5A623]/20 text-[#F5A623]",
  resolved: "bg-[#00E676]/20 text-[#00E676]",
}

const SLA_HOURS: Record<string, number> = {
  P1: 4,
  P2: 8,
  P3: 24,
  P4: 72,
}

export function Support({ selectedCenter }: SupportProps) {
  const { showToast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all")
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [ticketsRes, centersRes] = await Promise.all([
        supabase.from("tickets").select("*").order("created_at", { ascending: false }),
        supabase.from("centers").select("*").order("name"),
      ])
      if (ticketsRes.data) setTickets(ticketsRes.data)
      if (centersRes.data) setCenters(centersRes.data)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    const channel = supabase
      .channel("tickets-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, fetchData)
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  const getCenter = (centerId: string) => centers.find(c => c.id === centerId)

  // Filter tickets
  const filteredByCenter = selectedCenter === "all"
    ? tickets
    : tickets.filter(t => t.center_id === selectedCenter)

  const filteredTickets = filteredByCenter.filter(ticket => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!(ticket.title || "").toLowerCase().includes(query) &&
          !(ticket.raised_by || "").toLowerCase().includes(query) &&
          !(ticket.description || "").toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Status filter
    if (filter === "all") return true
    return ticket.status === filter
  })

  const selectedTicketData = tickets.find(t => t.id === selectedTicket)
  const selectedCenter_ = selectedTicketData ? getCenter(selectedTicketData.center_id) : null

  // Stats
  const openCount = filteredByCenter.filter(t => t.status === "open").length
  const inProgressCount = filteredByCenter.filter(t => t.status === "in_progress").length
  const resolvedToday = filteredByCenter.filter(t => {
    if (t.status !== "resolved" || !t.resolved_at) return false
    const resolved = new Date(t.resolved_at)
    const today = new Date()
    return resolved.toDateString() === today.toDateString()
  }).length

  // Calculate SLA
  const getSLAStatus = (ticket: Ticket) => {
    if (ticket.status === "resolved") return { status: "resolved", text: "Resolved", color: "text-[#00E676]" }
    
    const createdAt = new Date(ticket.created_at)
    const now = new Date()
    const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    const slaHours = SLA_HOURS[ticket.priority] || 24
    const hoursRemaining = slaHours - hoursElapsed
    
    if (hoursRemaining <= 0) {
      return { status: "breached", text: "BREACHED", color: "text-[#FF3D57]" }
    } else if (hoursRemaining < 1) {
      return { status: "critical", text: `${Math.round(hoursRemaining * 60)}m left`, color: "text-[#FF3D57]" }
    } else if (hoursRemaining < 4) {
      return { status: "warning", text: `${Math.round(hoursRemaining)}h left`, color: "text-[#F5A623]" }
    } else {
      return { status: "ok", text: `${Math.round(hoursRemaining)}h left`, color: "text-[#00E676]" }
    }
  }

  const getTicketId = (index: number) => `T-${String(index + 1).padStart(3, "0")}`

  const updateTicketStatus = async (ticketId: string, newStatus: "in_progress" | "resolved") => {
    setUpdating(ticketId)
    try {
      const updateData: { status: string; resolved_at?: string } = { status: newStatus }
      if (newStatus === "resolved") {
        updateData.resolved_at = new Date().toISOString()
      }
      
      const { error } = await supabase
        .from("tickets")
        .update(updateData)
        .eq("id", ticketId)
      
      if (error) throw error
      
      showToast("success", newStatus === "resolved" ? "Ticket resolved" : "Ticket marked as in progress")
      fetchData()
    } catch (error) {
      showToast("error", "Failed to update ticket")
    } finally {
      setUpdating(null)
    }
  }

  const updateAssignedTo = async (ticketId: string, assignedTo: string) => {
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ assigned_to: assignedTo || null })
        .eq("id", ticketId)
      
      if (error) throw error
      fetchData()
    } catch (error) {
      showToast("error", "Failed to update assignment")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Support Tickets</h2>
          <p className="text-[#8888A0] text-sm">Member support and issue tracking</p>
        </div>
        <button 
          onClick={() => setOpenDrawer("ticket")}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-medium rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: openCount, icon: MessageSquare, color: "cyan" },
          { label: "In Progress", value: inProgressCount, icon: Clock, color: "amber" },
          { label: "Resolved Today", value: resolvedToday, icon: CheckCircle2, color: "emerald" },
          { label: "Avg. Response", value: "2.4h", icon: Clock, color: "purple" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 hover:border-[rgba(0,212,255,0.3)] transition-all"
          >
            <div className={`p-2 rounded-lg w-fit ${stat.color === "cyan" ? "bg-[#00D4FF]/10 text-[#00D4FF]" : stat.color === "amber" ? "bg-[#F5A623]/10 text-[#F5A623]" : stat.color === "emerald" ? "bg-[#00E676]/10 text-[#00E676]" : "bg-[#7C4DFF]/10 text-[#7C4DFF]"}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-[#8888A0] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        {/* Tickets List */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888A0]" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#1A1A24] rounded-lg p-1">
              {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${filter === f ? "bg-[#00D4FF]/20 text-[#00D4FF]" : "text-[#8888A0] hover:text-white"}`}
                >
                  {f === "in_progress" ? "Active" : f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.05)]">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-[#1A1A24] rounded w-1/4 mb-2" />
                  <div className="h-5 bg-[#1A1A24] rounded w-3/4 mb-2" />
                  <div className="h-4 bg-[#1A1A24] rounded w-1/2" />
                </div>
              ))
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-[#555566] mx-auto mb-3" />
                <p className="text-[#8888A0]">No tickets found</p>
                <button
                  onClick={() => setOpenDrawer("ticket")}
                  className="mt-3 text-sm text-[#00D4FF] hover:underline"
                >
                  Create your first ticket
                </button>
              </div>
            ) : (
              filteredTickets.map((ticket, index) => {
                const sla = getSLAStatus(ticket)
                const priority = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.P4
                const ticketIndex = tickets.findIndex(t => t.id === ticket.id)
                
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`w-full p-4 text-left transition-all hover:bg-[rgba(0,212,255,0.05)] ${selectedTicket === ticket.id ? "bg-[rgba(0,212,255,0.05)] border-l-2 border-l-[#00D4FF]" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-[#8888A0] font-mono">{getTicketId(ticketIndex)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status === "in_progress" ? "In Progress" : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium mb-1 line-clamp-1">{ticket.title || "Untitled"}</p>
                    <p className="text-xs text-[#8888A0] line-clamp-2 mb-2">{ticket.description || "No description"}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-[10px] font-bold text-white">
                          {(ticket.raised_by || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-[#8888A0]">{ticket.raised_by || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${priority.bg} ${priority.text} ${priority.border}`}>
                          {ticket.priority === "P1" && <AlertCircle className="w-3 h-3" />}
                          {ticket.priority === "P2" && <AlertTriangle className="w-3 h-3" />}
                          {ticket.priority}
                        </span>
                        <span className={`text-xs ${sla.color}`}>{sla.text}</span>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="col-span-2 glass-card rounded-xl flex flex-col">
          {selectedTicketData ? (
            <>
              <div className="p-4 border-b border-[rgba(0,212,255,0.1)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#8888A0] font-mono">{getTicketId(tickets.findIndex(t => t.id === selectedTicketData.id))}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[selectedTicketData.status]}`}>
                        {selectedTicketData.status === "in_progress" ? "In Progress" : selectedTicketData.status.charAt(0).toUpperCase() + selectedTicketData.status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${PRIORITY_COLORS[selectedTicketData.priority]?.bg} ${PRIORITY_COLORS[selectedTicketData.priority]?.text} ${PRIORITY_COLORS[selectedTicketData.priority]?.border}`}>
                        {selectedTicketData.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-white">{selectedTicketData.title || "Untitled"}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)] text-[#8888A0] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#8888A0]">
                  <span>Raised by: <span className="text-white">{selectedTicketData.raised_by || "Anonymous"}</span></span>
                  <span>Center: <span className="text-white">{selectedCenter_?.name || "—"}</span></span>
                  <span>Category: <span className="text-white">{selectedTicketData.category || "—"}</span></span>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Description */}
                  <div className="bg-[#1A1A24] rounded-lg p-4">
                    <h4 className="text-xs font-medium text-[#8888A0] uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-white whitespace-pre-wrap">{selectedTicketData.description || "No description provided"}</p>
                  </div>

                  {/* SLA Info */}
                  <div className="bg-[#1A1A24] rounded-lg p-4">
                    <h4 className="text-xs font-medium text-[#8888A0] uppercase tracking-wider mb-2">SLA Status</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">SLA: {SLA_HOURS[selectedTicketData.priority] || 24} hours</p>
                        <p className="text-xs text-[#8888A0]">Created: {new Date(selectedTicketData.created_at).toLocaleString("en-IN")}</p>
                      </div>
                      <span className={`text-lg font-bold ${getSLAStatus(selectedTicketData).color}`}>
                        {getSLAStatus(selectedTicketData).text}
                      </span>
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="bg-[#1A1A24] rounded-lg p-4">
                    <h4 className="text-xs font-medium text-[#8888A0] uppercase tracking-wider mb-2">Assigned To</h4>
                    <input
                      type="text"
                      value={selectedTicketData.assigned_to || ""}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setTickets(prev => prev.map(t => t.id === selectedTicketData.id ? { ...t, assigned_to: newValue } : t))
                      }}
                      onBlur={(e) => updateAssignedTo(selectedTicketData.id, e.target.value)}
                      placeholder="Enter staff name..."
                      className="w-full bg-[#111118] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  {/* Resolved At */}
                  {selectedTicketData.status === "resolved" && selectedTicketData.resolved_at && (
                    <div className="bg-[#00E676]/10 border border-[#00E676]/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-[#00E676]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Resolved</span>
                      </div>
                      <p className="text-xs text-[#8888A0] mt-1">
                        {new Date(selectedTicketData.resolved_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedTicketData.status !== "resolved" && (
                <div className="p-4 border-t border-[rgba(0,212,255,0.1)]">
                  <div className="flex gap-3">
                    {selectedTicketData.status === "open" && (
                      <button
                        onClick={() => updateTicketStatus(selectedTicketData.id, "in_progress")}
                        disabled={updating === selectedTicketData.id}
                        className="flex-1 py-2.5 bg-[#F5A623]/20 hover:bg-[#F5A623]/30 text-[#F5A623] font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updating === selectedTicketData.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                        Mark In Progress
                      </button>
                    )}
                    <button
                      onClick={() => updateTicketStatus(selectedTicketData.id, "resolved")}
                      disabled={updating === selectedTicketData.id}
                      className="flex-1 py-2.5 bg-[#00E676]/20 hover:bg-[#00E676]/30 text-[#00E676] font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updating === selectedTicketData.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Resolve Ticket
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-[#555566] mx-auto mb-3" />
                <p className="text-[#8888A0]">Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Forms */}
      <DrawerForms
        openDrawer={openDrawer}
        onClose={() => setOpenDrawer(null)}
        centers={centers}
        onRefresh={fetchData}
      />
    </div>
  )
}
