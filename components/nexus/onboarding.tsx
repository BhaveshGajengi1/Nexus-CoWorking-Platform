"use client"

import { useState, useEffect } from "react"
import { supabase, type Lead, type Center } from "@/lib/supabase"
import { useToast } from "./toast-provider"
import { Search, Plus, ChevronLeft, ChevronRight, Building2, User, DollarSign, Clock, UserPlus } from "lucide-react"
import { DrawerForms } from "./drawer-forms"

const STAGES = [
  { id: "Lead", label: "Lead", color: "#8888A0" },
  { id: "Site Visit Scheduled", label: "Site Visit", color: "#00D4FF" },
  { id: "Proposal Sent", label: "Proposal", color: "#F5A623" },
  { id: "Negotiation", label: "Negotiation", color: "#7C4DFF" },
  { id: "Agreement Signed", label: "Signed", color: "#00E676" },
]

const SPACE_TYPE_COLORS: Record<string, string> = {
  "Hotdesk": "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30",
  "Dedicated Desk": "bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30",
  "Private Cabin": "bg-[#7C4DFF]/20 text-[#7C4DFF] border-[#7C4DFF]/30",
  "Virtual Office": "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30",
}

export function Onboarding() {
  const { showToast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [leadsRes, centersRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("centers").select("*").order("name"),
      ])
      if (leadsRes.data) setLeads(leadsRes.data)
      if (centersRes.data) setCenters(centersRes.data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    const channel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchData)
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getCenter = (centerId: string) => centers.find(c => c.id === centerId)

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (lead.company || "").toLowerCase().includes(query) ||
      (lead.contact_name || "").toLowerCase().includes(query) ||
      (lead.email || "").toLowerCase().includes(query)
    )
  })

  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter(lead => lead.stage === stage.id)
    return acc
  }, {} as Record<string, Lead[]>)

  const moveLeadToStage = async (lead: Lead, newStage: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ stage: newStage })
        .eq("id", lead.id)
      
      if (error) throw error
      
      // Insert notification for Agreement Signed
      if (newStage === "Agreement Signed") {
        await supabase.from("notifications").insert({
          title: "Deal Closed!",
          message: `${lead.company || "Unknown Company"} signed agreement`,
          type: "success",
          is_read: false
        })
      }
      
      showToast("success", `Lead moved to ${newStage}`)
      fetchData()
    } catch (error) {
      showToast("error", "Failed to move lead")
    }
  }

  const getStageIndex = (stage: string) => STAGES.findIndex(s => s.id === stage)
  const getPrevStage = (currentStage: string) => {
    const idx = getStageIndex(currentStage)
    return idx > 0 ? STAGES[idx - 1].id : null
  }
  const getNextStage = (currentStage: string) => {
    const idx = getStageIndex(currentStage)
    return idx < STAGES.length - 1 ? STAGES[idx + 1].id : null
  }

  const getDaysInStage = (createdAt: string) => {
    const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined || isNaN(value)) return "₹0"
    return `₹${value.toLocaleString("en-IN")}`
  }

  const getInitials = (name: string | null) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }

  // Stats
  const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0)
  const avgDaysInPipeline = leads.length > 0 
    ? Math.round(leads.reduce((sum, l) => sum + getDaysInStage(l.created_at), 0) / leads.length) 
    : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sales Pipeline</h2>
          <p className="text-[#8888A0] text-sm">Track and manage leads through the sales funnel</p>
        </div>
        <button 
          onClick={() => setOpenDrawer("lead")}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-medium rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          <UserPlus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: leads.length, color: "cyan" },
          { label: "Pipeline Value", value: formatCurrency(totalValue), color: "amber" },
          { label: "Avg. Days in Pipeline", value: `${avgDaysInPipeline} days`, color: "purple" },
          { label: "Conversion Rate", value: leads.length > 0 ? `${Math.round((leadsByStage["Agreement Signed"]?.length || 0) / leads.length * 100)}%` : "0%", color: "emerald" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 hover:border-[rgba(0,212,255,0.3)] transition-all"
          >
            <p className="text-[#8888A0] text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color === "cyan" ? "text-[#00D4FF]" : stat.color === "amber" ? "text-[#F5A623]" : stat.color === "emerald" ? "text-[#00E676]" : "text-[#7C4DFF]"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888A0]" />
        <input
          type="text"
          placeholder="Search leads by company, contact, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111118] border border-[rgba(0,212,255,0.15)] rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] transition-colors"
        />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage.id} className="min-w-[280px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <h3 className="text-sm font-medium text-white">{stage.label}</h3>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#1A1A24] text-[#8888A0]">
                  {leadsByStage[stage.id]?.length || 0}
                </span>
              </div>
              <button 
                onClick={() => setOpenDrawer("lead")}
                className="p-1 hover:bg-[rgba(0,212,255,0.1)] rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-[#8888A0] hover:text-[#00D4FF]" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[400px]">
              {loading ? (
                // Loading skeletons
                [1, 2].map((i) => (
                  <div key={i} className="bg-[#111118] rounded-lg p-4 border border-[rgba(255,255,255,0.05)] animate-pulse">
                    <div className="h-5 bg-[#1A1A24] rounded w-3/4 mb-2" />
                    <div className="h-4 bg-[#1A1A24] rounded w-1/2 mb-3" />
                    <div className="h-6 bg-[#1A1A24] rounded w-1/3" />
                  </div>
                ))
              ) : leadsByStage[stage.id]?.length === 0 ? (
                // Empty state
                <button
                  onClick={() => setOpenDrawer("lead")}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,212,255,0.3)] transition-colors text-center"
                >
                  <Plus className="w-5 h-5 text-[#555566] mx-auto mb-1" />
                  <p className="text-xs text-[#555566]">Add Lead</p>
                </button>
              ) : (
                leadsByStage[stage.id]?.map((lead) => {
                  const center = getCenter(lead.center_id)
                  const prevStage = getPrevStage(lead.stage)
                  const nextStage = getNextStage(lead.stage)
                  const daysInStage = getDaysInStage(lead.created_at)
                  
                  return (
                    <div
                      key={lead.id}
                      className="bg-[#111118] rounded-lg p-4 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-all group"
                    >
                      {/* Company Name */}
                      <h4 className="text-sm font-semibold text-white mb-1 truncate">
                        {lead.company || "Unknown Company"}
                      </h4>
                      
                      {/* Contact Person */}
                      <p className="text-xs text-[#8888A0] mb-2 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {lead.contact_name || "—"}
                      </p>
                      
                      {/* Space Type Badge */}
                      <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mb-3 ${SPACE_TYPE_COLORS[lead.space_type] || "bg-[#1A1A24] text-[#8888A0]"}`}>
                        {lead.space_type || "Unknown"}
                      </div>
                      
                      {/* Value & Days */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-[#F5A623] font-medium flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(lead.estimated_value)}/mo
                        </span>
                        <span className="text-[#8888A0] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {daysInStage} days
                        </span>
                      </div>
                      
                      {/* Assigned Manager */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${lead.assigned_to ? "bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF]" : "bg-[#555566]"}`}>
                          {getInitials(lead.assigned_to)}
                        </div>
                        <span className="text-xs text-[#8888A0] truncate">
                          {lead.assigned_to || "Unassigned"}
                        </span>
                      </div>
                      
                      {/* Center Badge */}
                      {center && (
                        <div className="flex items-center gap-1 text-xs text-[#8888A0] mb-3">
                          <Building2 className="w-3 h-3" />
                          {center.name}
                        </div>
                      )}
                      
                      {/* Stage Move Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {prevStage && (
                          <button
                            onClick={() => moveLeadToStage(lead, prevStage)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-[#1A1A24] text-[#8888A0] hover:text-white text-xs transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            Back
                          </button>
                        )}
                        {nextStage && (
                          <button
                            onClick={() => moveLeadToStage(lead, nextStage)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-[#00D4FF] text-[#0A0A0F] text-xs font-medium hover:bg-[#00B8E6] transition-colors"
                          >
                            Next
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        ))}
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
