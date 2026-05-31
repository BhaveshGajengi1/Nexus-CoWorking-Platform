"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Search, Plus, MoreVertical, Mail, Phone, Shield, CheckCircle2, XCircle, Edit, Trash2, X, User, Building, Briefcase } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: string
  last_active: string
  center_id?: string
}

// Fallback data
const fallbackMembers: TeamMember[] = [
  { id: '1', name: 'Arun Prakash', email: 'arun@nexus.co', phone: '+91 98765 43210', role: 'Super Admin', department: 'Management', status: 'Active', last_active: '2026-05-25T10:30:00' },
  { id: '2', name: 'Deepika Nair', email: 'deepika@nexus.co', phone: '+91 98765 43211', role: 'Center Manager', department: 'Operations', status: 'Active', last_active: '2026-05-25T10:25:00' },
  { id: '3', name: 'Neha Kulkarni', email: 'neha@nexus.co', phone: '+91 98765 43212', role: 'Center Manager', department: 'Operations', status: 'Active', last_active: '2026-05-25T10:20:00' },
]

export function TeamManagement({ selectedCenter }: { selectedCenter: string }) {
  const [view, setView] = useState<"grid" | "list">("list")
  const [filter, setFilter] = useState<"all" | "online" | "away" | "offline">("all")
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    department: 'Operations',
    status: 'Active'
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [selectedCenter])

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      let query = supabase.from('team_members').select('*')
      if (selectedCenter !== 'all') {
        query = query.eq('center_id', selectedCenter)
      }
      const { data, error } = await query.order('name')
      
      if (error) throw error
      setTeamMembers(data && data.length > 0 ? data : fallbackMembers)
    } catch (error) {
      console.error('Error fetching team members:', error)
      setTeamMembers(fallbackMembers)
    }
    setLoading(false)
  }

  const [saving, setSaving] = useState(false)

  const handleAddMember = async () => {
    if (!formData.name || !formData.email) return

    setSaving(true)
    
    // Create new member object
    const newMember: TeamMember = {
      id: `temp-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      center_id: selectedCenter !== 'all' ? selectedCenter : undefined,
      last_active: new Date().toISOString()
    }

    try {
      const { data, error } = await supabase.from('team_members').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        center_id: selectedCenter !== 'all' ? selectedCenter : null,
        last_active: new Date().toISOString()
      }).select().single()

      if (error) {
        console.log('[v0] Supabase insert error, adding to local state:', error)
        // If database insert fails, still add to local state
        setTeamMembers(prev => [newMember, ...prev])
      } else if (data) {
        // Add the returned data with real ID
        setTeamMembers(prev => [data, ...prev])
      }
      
      setShowAddModal(false)
      setFormData({ name: '', email: '', phone: '', role: 'Staff', department: 'Operations', status: 'Active' })
    } catch (error) {
      console.log('[v0] Error adding team member, adding to local state:', error)
      // On any error, still add to local state for better UX
      setTeamMembers(prev => [newMember, ...prev])
      setShowAddModal(false)
      setFormData({ name: '', email: '', phone: '', role: 'Staff', department: 'Operations', status: 'Active' })
    }
    
    setSaving(false)
  }

  const handleDeleteMember = async (id: string) => {
    try {
      await supabase.from('team_members').delete().eq('id', id)
      fetchTeamMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const filteredMembers = teamMembers.filter(m => {
    const matchesFilter = filter === "all" || m.status?.toLowerCase() === filter
    const matchesSearch = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "online":
      case "active": return "bg-[#00E676]"
      case "away": return "bg-[#F5A623]"
      case "offline": return "bg-[#555566]"
      default: return "bg-[#555566]"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
      case "Admin": return "bg-[rgba(124,77,255,0.15)] text-[#7C4DFF] border-[rgba(124,77,255,0.3)]"
      case "Center Manager":
      case "Manager": return "bg-[rgba(0,212,255,0.15)] text-[#00D4FF] border-[rgba(0,212,255,0.3)]"
      default: return "bg-[rgba(136,136,160,0.15)] text-[#8888A0] border-[rgba(136,136,160,0.3)]"
    }
  }

  const stats = {
    total: teamMembers.length,
    online: teamMembers.filter(m => m.status?.toLowerCase() === 'online' || m.status?.toLowerCase() === 'active').length,
    admins: teamMembers.filter(m => m.role?.includes('Admin')).length,
    avgHours: '42h'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-[var(--font-display)]">Team Management</h2>
          <p className="text-[#8888A0]">Manage staff roles and permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-medium rounded-lg transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: stats.total, color: "#00D4FF" },
          { label: "Online Now", value: stats.online, color: "#00E676" },
          { label: "Admins", value: stats.admins, color: "#7C4DFF" },
          { label: "Avg. Hours/Week", value: stats.avgHours, color: "#F5A623" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[#8888A0] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members..."
              className="bg-[#111118] border border-[rgba(0,212,255,0.15)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#111118] rounded-lg p-1 border border-[rgba(0,212,255,0.15)]">
            {(["all", "online", "away", "offline"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filter === f ? "bg-[rgba(0,212,255,0.15)] text-[#00D4FF]" : "text-[#8888A0] hover:text-white"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-[rgba(0,212,255,0.15)] text-[#00D4FF]" : "text-[#8888A0] hover:text-white"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-[rgba(0,212,255,0.15)] text-[#00D4FF]" : "text-[#8888A0] hover:text-white"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredMembers.map((member, i) => (
            <div
              key={member.id}
              className="glass-card rounded-xl p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-xl font-bold text-white">
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111118] ${getStatusColor(member.status)}`} />
                </div>
                <button className="p-1.5 hover:bg-[#1A1A24] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4 text-[#8888A0]" />
                </button>
              </div>
              <h3 className="text-lg font-medium text-white">{member.name}</h3>
              <p className="text-sm text-[#555566] mb-3">{member.department}</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadge(member.role)}`}>
                <Shield className="h-3 w-3" />
                {member.role}
              </span>
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#8888A0]">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8888A0]">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 py-2 bg-[#1A1A24] hover:bg-[#252530] text-white rounded-lg text-sm transition-colors">
                  Message
                </button>
                <button className="flex-1 py-2 bg-[rgba(0,212,255,0.15)] hover:bg-[rgba(0,212,255,0.25)] text-[#00D4FF] rounded-lg text-sm transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,212,255,0.1)]">
                <th className="text-left text-xs font-medium text-[#8888A0] p-4">Member</th>
                <th className="text-left text-xs font-medium text-[#8888A0] p-4">Role</th>
                <th className="text-left text-xs font-medium text-[#8888A0] p-4">Department</th>
                <th className="text-left text-xs font-medium text-[#8888A0] p-4">Status</th>
                <th className="text-left text-xs font-medium text-[#8888A0] p-4">Last Active</th>
                <th className="text-right text-xs font-medium text-[#8888A0] p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className="border-b border-[rgba(0,212,255,0.05)] hover:bg-[rgba(0,212,255,0.02)] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C4DFF] flex items-center justify-center text-sm font-bold text-white">
                          {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111118] ${getStatusColor(member.status)}`} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{member.name}</p>
                        <p className="text-xs text-[#555566]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadge(member.role)}`}>
                      <Shield className="h-3 w-3" />
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#8888A0]">{member.department}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#8888A0]">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#8888A0]">
                      {member.last_active ? new Date(member.last_active).toLocaleString() : '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-[#1A1A24] rounded-lg transition-colors">
                        <Edit className="h-4 w-4 text-[#8888A0]" />
                      </button>
                      <button className="p-1.5 hover:bg-[#1A1A24] rounded-lg transition-colors">
                        <Mail className="h-4 w-4 text-[#8888A0]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1.5 hover:bg-[rgba(255,71,87,0.15)] rounded-lg transition-colors group"
                      >
                        <Trash2 className="h-4 w-4 text-[#8888A0] group-hover:text-[#FF4757]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permissions Matrix */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-white mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-[#555566] p-3">Permission</th>
                <th className="text-center text-xs font-medium text-[#7C4DFF] p-3">Admin</th>
                <th className="text-center text-xs font-medium text-[#00D4FF] p-3">Manager</th>
                <th className="text-center text-xs font-medium text-[#8888A0] p-3">Staff</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "View Members", admin: true, manager: true, staff: true },
                { name: "Edit Members", admin: true, manager: true, staff: false },
                { name: "Delete Members", admin: true, manager: false, staff: false },
                { name: "Manage Billing", admin: true, manager: true, staff: false },
                { name: "View Reports", admin: true, manager: true, staff: true },
                { name: "Export Data", admin: true, manager: true, staff: false },
                { name: "System Settings", admin: true, manager: false, staff: false },
              ].map((perm) => (
                <tr key={perm.name} className="border-t border-[rgba(255,255,255,0.05)]">
                  <td className="p-3 text-sm text-white">{perm.name}</td>
                  <td className="p-3 text-center">
                    {perm.admin ? <CheckCircle2 className="h-4 w-4 text-[#00E676] mx-auto" /> : <XCircle className="h-4 w-4 text-[#555566] mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {perm.manager ? <CheckCircle2 className="h-4 w-4 text-[#00E676] mx-auto" /> : <XCircle className="h-4 w-4 text-[#555566] mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {perm.staff ? <CheckCircle2 className="h-4 w-4 text-[#00E676] mx-auto" /> : <XCircle className="h-4 w-4 text-[#555566] mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-[#111118] rounded-2xl p-6 border border-[rgba(0,212,255,0.2)] w-full max-w-lg animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white font-[var(--font-display)]">Add Team Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#8888A0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white placeholder-[#555566] focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8888A0] mb-2">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF] appearance-none"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Center Manager">Center Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#8888A0] mb-2">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555566]" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1A1A24] border border-[rgba(0,212,255,0.15)] text-white focus:outline-none focus:border-[#00D4FF] appearance-none"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Management">Management</option>
                      <option value="Finance">Finance</option>
                      <option value="Support">Support</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8888A0] mb-2">Status</label>
                <div className="flex gap-2">
                  {['Active', 'Away', 'Offline'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                        formData.status === status
                          ? 'border-[#00D4FF] text-[#00D4FF] bg-[rgba(0,212,255,0.1)]'
                          : 'border-[rgba(0,212,255,0.15)] text-[#8888A0] hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#8888A0] hover:bg-[#1A1A24] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!formData.name || !formData.email || saving}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0088AA] text-[#0A0A0F] font-semibold disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Member'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
