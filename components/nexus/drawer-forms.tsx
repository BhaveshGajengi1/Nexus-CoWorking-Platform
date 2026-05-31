"use client"

import { useState, useEffect } from "react"
import { Drawer, FormInput, FormSelect, FormTextarea, FormToggle, FormButtons } from "./drawer"
import { supabase, type Center } from "@/lib/supabase"
import { useToast } from "./toast-provider"

interface DrawerFormsProps {
  openDrawer: string | null
  onClose: () => void
  centers: Center[]
  onRefresh?: () => void
}

export function DrawerForms({ openDrawer, onClose, centers, onRefresh }: DrawerFormsProps) {
  const { showToast } = useToast()
  
  const centerOptions = centers.map(c => ({ value: c.id, label: c.name }))

  const handleSuccess = (message: string) => {
    showToast("success", message)
    onClose()
    onRefresh?.()
  }

  return (
    <>
      <NewMemberDrawer 
        open={openDrawer === "member"} 
        onClose={onClose} 
        centers={centerOptions}
        onSuccess={() => handleSuccess("Member added successfully")}
      />
      <LogVisitorDrawer 
        open={openDrawer === "visitor"} 
        onClose={onClose}
        centers={centerOptions}
        onSuccess={() => handleSuccess("Visitor logged successfully")}
      />
      <BookRoomDrawer 
        open={openDrawer === "booking"} 
        onClose={onClose}
        centers={centerOptions}
        onSuccess={() => handleSuccess("Room booked successfully")}
      />
      <CreateInvoiceDrawer 
        open={openDrawer === "invoice"} 
        onClose={onClose}
        centers={centerOptions}
        onSuccess={() => handleSuccess("Invoice created successfully")}
      />
      <NewTicketDrawer 
        open={openDrawer === "ticket"} 
        onClose={onClose}
        centers={centerOptions}
        onSuccess={() => handleSuccess("Ticket created successfully")}
      />
      <AddLeadDrawer 
        open={openDrawer === "lead"} 
        onClose={onClose}
        centers={centerOptions}
        onSuccess={() => handleSuccess("Lead added successfully")}
      />
    </>
  )
}

// DRAWER 1: New Member
function NewMemberDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    plan: "",
    center_id: "",
    seat_number: "",
    start_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    status: "active"
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        plan: "",
        center_id: "",
        seat_number: "",
        start_date: new Date().toISOString().split("T")[0],
        expiry_date: "",
        status: "active"
      })
      setErrors({})
    }
  }, [open])

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.name) newErrors.name = true
    if (!form.company) newErrors.company = true
    if (!form.email) newErrors.email = true
    if (!form.phone) newErrors.phone = true
    if (!form.plan) newErrors.plan = true
    if (!form.center_id) newErrors.center_id = true
    if (!form.start_date) newErrors.start_date = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("members").insert({
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        center_id: form.center_id,
        seat_number: form.seat_number || null,
        start_date: form.start_date,
        expiry_date: form.expiry_date || null,
        status: form.status
      })
      if (error) throw error
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add New Member">
      <div className="p-6 space-y-4">
        <FormInput label="Full Name" required value={form.name} onChange={(v) => setForm(p => ({ ...p, name: v }))} error={errors.name} placeholder="John Doe" />
        <FormInput label="Company" required value={form.company} onChange={(v) => setForm(p => ({ ...p, company: v }))} error={errors.company} placeholder="Acme Inc." />
        <FormInput label="Email" required type="email" value={form.email} onChange={(v) => setForm(p => ({ ...p, email: v }))} error={errors.email} placeholder="john@acme.com" />
        <FormInput label="Phone" required type="tel" value={form.phone} onChange={(v) => setForm(p => ({ ...p, phone: v }))} error={errors.phone} placeholder="+91 98765 43210" />
        <FormSelect label="Plan" required value={form.plan} onChange={(v) => setForm(p => ({ ...p, plan: v }))} error={errors.plan} placeholder="Select plan" options={[
          { value: "Hotdesk", label: "Hotdesk" },
          { value: "Dedicated Desk", label: "Dedicated Desk" },
          { value: "Private Cabin", label: "Private Cabin" },
        ]} />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormInput label="Seat Number" value={form.seat_number} onChange={(v) => setForm(p => ({ ...p, seat_number: v }))} placeholder="A-101" />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Start Date" required type="date" value={form.start_date} onChange={(v) => setForm(p => ({ ...p, start_date: v }))} error={errors.start_date} />
          <FormInput label="Expiry Date" type="date" value={form.expiry_date} onChange={(v) => setForm(p => ({ ...p, expiry_date: v }))} />
        </div>
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm(p => ({ ...p, status: v }))} options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]} />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Add Member" loading={loading} />
    </Drawer>
  )
}

// DRAWER 2: Log Visitor
function LogVisitorDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    host_member: "",
    purpose: "",
    center_id: "",
    check_in: new Date().toISOString().slice(0, 16)
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        company: "",
        phone: "",
        host_member: "",
        purpose: "",
        center_id: "",
        check_in: new Date().toISOString().slice(0, 16)
      })
      setErrors({})
    }
  }, [open])

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.name) newErrors.name = true
    if (!form.phone) newErrors.phone = true
    if (!form.host_member) newErrors.host_member = true
    if (!form.purpose) newErrors.purpose = true
    if (!form.center_id) newErrors.center_id = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("visitors").insert({
        name: form.name,
        company: form.company || null,
        phone: form.phone,
        host_member: form.host_member,
        purpose: form.purpose,
        center_id: form.center_id,
        check_in: form.check_in,
        status: "checked_in"
      })
      if (error) throw error
      
      // Also insert notification
      await supabase.from("notifications").insert({
        title: "New Visitor",
        message: `${form.name} checked in to meet ${form.host_member}`,
        type: "info",
        is_read: false
      })
      
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Log New Visitor">
      <div className="p-6 space-y-4">
        <FormInput label="Visitor Name" required value={form.name} onChange={(v) => setForm(p => ({ ...p, name: v }))} error={errors.name} placeholder="Jane Smith" />
        <FormInput label="Company" value={form.company} onChange={(v) => setForm(p => ({ ...p, company: v }))} placeholder="Optional" />
        <FormInput label="Phone" required type="tel" value={form.phone} onChange={(v) => setForm(p => ({ ...p, phone: v }))} error={errors.phone} placeholder="+91 98765 43210" />
        <FormInput label="Host Member Name" required value={form.host_member} onChange={(v) => setForm(p => ({ ...p, host_member: v }))} error={errors.host_member} placeholder="Who are they visiting?" />
        <FormSelect label="Visit Purpose" required value={form.purpose} onChange={(v) => setForm(p => ({ ...p, purpose: v }))} error={errors.purpose} placeholder="Select purpose" options={[
          { value: "Meeting", label: "Meeting" },
          { value: "Interview", label: "Interview" },
          { value: "Tour", label: "Tour" },
          { value: "Delivery", label: "Delivery" },
          { value: "Other", label: "Other" },
        ]} />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormInput label="Check-in Time" type="datetime-local" value={form.check_in} onChange={(v) => setForm(p => ({ ...p, check_in: v }))} />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Log Visitor" loading={loading} />
    </Drawer>
  )
}

// DRAWER 3: Book a Room
function BookRoomDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    room_name: "",
    center_id: "",
    booking_date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "10:00",
    member_name: "",
    booking_type: "",
    notes: ""
  })

  useEffect(() => {
    if (open) {
      setForm({
        room_name: "",
        center_id: "",
        booking_date: new Date().toISOString().split("T")[0],
        start_time: "09:00",
        end_time: "10:00",
        member_name: "",
        booking_type: "",
        notes: ""
      })
      setErrors({})
    }
  }, [open])

  const timeOptions = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8
    const time = `${hour.toString().padStart(2, "0")}:00`
    return { value: time, label: time }
  })

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.room_name) newErrors.room_name = true
    if (!form.center_id) newErrors.center_id = true
    if (!form.booking_date) newErrors.booking_date = true
    if (!form.start_time) newErrors.start_time = true
    if (!form.end_time) newErrors.end_time = true
    if (!form.member_name) newErrors.member_name = true
    if (!form.booking_type) newErrors.booking_type = true
    if (form.end_time <= form.start_time) newErrors.end_time = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("bookings").insert({
        room_name: form.room_name,
        center_id: form.center_id,
        booking_date: form.booking_date,
        start_time: form.start_time,
        end_time: form.end_time,
        member_name: form.member_name,
        booking_type: form.booking_type,
        notes: form.notes || null
      })
      if (error) throw error
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Book a Room">
      <div className="p-6 space-y-4">
        <FormSelect label="Room" required value={form.room_name} onChange={(v) => setForm(p => ({ ...p, room_name: v }))} error={errors.room_name} placeholder="Select room" options={[
          { value: "Boardroom 12pax", label: "Boardroom 12pax" },
          { value: "Focus Pod 4pax", label: "Focus Pod 4pax" },
          { value: "Training Hall 30pax", label: "Training Hall 30pax" },
          { value: "Podcast Studio 4pax", label: "Podcast Studio 4pax" },
        ]} />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormInput label="Date" required type="date" value={form.booking_date} onChange={(v) => setForm(p => ({ ...p, booking_date: v }))} error={errors.booking_date} />
        <div className="grid grid-cols-2 gap-4">
          <FormSelect label="Start Time" required value={form.start_time} onChange={(v) => setForm(p => ({ ...p, start_time: v }))} error={errors.start_time} options={timeOptions} />
          <FormSelect label="End Time" required value={form.end_time} onChange={(v) => setForm(p => ({ ...p, end_time: v }))} error={errors.end_time} options={timeOptions} />
        </div>
        <FormInput label="Member / Client Name" required value={form.member_name} onChange={(v) => setForm(p => ({ ...p, member_name: v }))} error={errors.member_name} placeholder="Who is booking?" />
        <FormSelect label="Booking Type" required value={form.booking_type} onChange={(v) => setForm(p => ({ ...p, booking_type: v }))} error={errors.booking_type} placeholder="Select type" options={[
          { value: "Internal", label: "Internal" },
          { value: "Client Meeting", label: "Client Meeting" },
          { value: "Event", label: "Event" },
        ]} />
        <FormTextarea label="Notes" value={form.notes} onChange={(v) => setForm(p => ({ ...p, notes: v }))} placeholder="Any special requirements..." rows={3} />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Book Room" loading={loading} />
    </Drawer>
  )
}

// DRAWER 4: Create Invoice
function CreateInvoiceDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [includeGst, setIncludeGst] = useState(true)
  const [form, setForm] = useState({
    member_name: "",
    center_id: "",
    invoice_number: `INV-${Date.now()}`,
    amount: "",
    due_date: "",
    status: "pending"
  })

  useEffect(() => {
    if (open) {
      setForm({
        member_name: "",
        center_id: "",
        invoice_number: `INV-${Date.now()}`,
        amount: "",
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending"
      })
      setIncludeGst(true)
      setErrors({})
    }
  }, [open])

  const amount = parseFloat(form.amount) || 0
  const gstAmount = includeGst ? amount * 0.18 : 0
  const total = amount + gstAmount

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.member_name) newErrors.member_name = true
    if (!form.center_id) newErrors.center_id = true
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = true
    if (!form.due_date) newErrors.due_date = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("invoices").insert({
        invoice_number: form.invoice_number,
        member_name: form.member_name,
        center_id: form.center_id,
        amount: amount,
        gst: gstAmount,
        total: total,
        due_date: form.due_date,
        status: form.status
      })
      if (error) throw error
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Create Invoice">
      <div className="p-6 space-y-4">
        <FormInput label="Member Name" required value={form.member_name} onChange={(v) => setForm(p => ({ ...p, member_name: v }))} error={errors.member_name} placeholder="John Doe" />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormInput label="Invoice Number" value={form.invoice_number} onChange={() => {}} readOnly />
        <FormInput label="Amount" required type="number" value={form.amount} onChange={(v) => setForm(p => ({ ...p, amount: v }))} error={errors.amount} prefix="₹" placeholder="0" />
        <FormToggle label="Include GST (18%)" checked={includeGst} onChange={setIncludeGst} description={includeGst ? `GST: ₹${gstAmount.toLocaleString("en-IN")}` : "No GST"} />
        
        {/* Total Display */}
        <div className="p-4 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)]">
          <p className="text-xs text-[#8888A0] uppercase tracking-wider mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-[#00D4FF]">₹{total.toLocaleString("en-IN")}</p>
        </div>
        
        <FormInput label="Due Date" required type="date" value={form.due_date} onChange={(v) => setForm(p => ({ ...p, due_date: v }))} error={errors.due_date} />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm(p => ({ ...p, status: v }))} options={[
          { value: "pending", label: "Pending" },
          { value: "paid", label: "Paid" },
        ]} />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Create Invoice" loading={loading} />
    </Drawer>
  )
}

// DRAWER 5: New Support Ticket
function NewTicketDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    title: "",
    description: "",
    raised_by: "",
    center_id: "",
    category: "",
    priority: "",
    assigned_to: ""
  })

  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        description: "",
        raised_by: "",
        center_id: "",
        category: "",
        priority: "",
        assigned_to: ""
      })
      setErrors({})
    }
  }, [open])

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.title) newErrors.title = true
    if (!form.description) newErrors.description = true
    if (!form.raised_by) newErrors.raised_by = true
    if (!form.center_id) newErrors.center_id = true
    if (!form.category) newErrors.category = true
    if (!form.priority) newErrors.priority = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("tickets").insert({
        title: form.title,
        description: form.description,
        raised_by: form.raised_by,
        center_id: form.center_id,
        category: form.category,
        priority: form.priority,
        assigned_to: form.assigned_to || null,
        status: "open"
      })
      if (error) throw error
      
      // Insert notification for P1/P2 tickets
      if (form.priority === "P1" || form.priority === "P2") {
        await supabase.from("notifications").insert({
          title: `${form.priority} Ticket Created`,
          message: form.title,
          type: form.priority === "P1" ? "error" : "warning",
          is_read: false
        })
      }
      
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="New Support Ticket">
      <div className="p-6 space-y-4">
        <FormInput label="Title" required value={form.title} onChange={(v) => setForm(p => ({ ...p, title: v }))} error={errors.title} placeholder="Brief description of issue" />
        <FormTextarea label="Description" required value={form.description} onChange={(v) => setForm(p => ({ ...p, description: v }))} error={errors.description} placeholder="Detailed description..." rows={4} />
        <FormInput label="Raised By" required value={form.raised_by} onChange={(v) => setForm(p => ({ ...p, raised_by: v }))} error={errors.raised_by} placeholder="Member name" />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormSelect label="Category" required value={form.category} onChange={(v) => setForm(p => ({ ...p, category: v }))} error={errors.category} placeholder="Select category" options={[
          { value: "Maintenance", label: "Maintenance" },
          { value: "IT", label: "IT" },
          { value: "Admin", label: "Admin" },
          { value: "Complaint", label: "Complaint" },
          { value: "Other", label: "Other" },
        ]} />
        <FormSelect label="Priority" required value={form.priority} onChange={(v) => setForm(p => ({ ...p, priority: v }))} error={errors.priority} placeholder="Select priority" options={[
          { value: "P1", label: "P1 - Critical" },
          { value: "P2", label: "P2 - High" },
          { value: "P3", label: "P3 - Medium" },
          { value: "P4", label: "P4 - Low" },
        ]} />
        <FormInput label="Assigned To" value={form.assigned_to} onChange={(v) => setForm(p => ({ ...p, assigned_to: v }))} placeholder="Staff member (optional)" />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Create Ticket" loading={loading} />
    </Drawer>
  )
}

// DRAWER 6: Add Lead
function AddLeadDrawer({ open, onClose, centers, onSuccess }: { open: boolean; onClose: () => void; centers: { value: string; label: string }[]; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    space_type: "",
    estimated_value: "",
    stage: "Lead",
    assigned_to: "",
    center_id: "",
    notes: ""
  })

  useEffect(() => {
    if (open) {
      setForm({
        company: "",
        contact_name: "",
        email: "",
        phone: "",
        space_type: "",
        estimated_value: "",
        stage: "Lead",
        assigned_to: "",
        center_id: "",
        notes: ""
      })
      setErrors({})
    }
  }, [open])

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.company) newErrors.company = true
    if (!form.contact_name) newErrors.contact_name = true
    if (!form.email) newErrors.email = true
    if (!form.phone) newErrors.phone = true
    if (!form.space_type) newErrors.space_type = true
    if (!form.stage) newErrors.stage = true
    if (!form.assigned_to) newErrors.assigned_to = true
    if (!form.center_id) newErrors.center_id = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from("leads").insert({
        company: form.company,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        space_type: form.space_type,
        estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
        stage: form.stage,
        assigned_to: form.assigned_to,
        center_id: form.center_id,
        notes: form.notes || null
      })
      if (error) throw error
      onSuccess()
    } catch {
      setErrors({ submit: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add New Lead">
      <div className="p-6 space-y-4">
        <FormInput label="Company Name" required value={form.company} onChange={(v) => setForm(p => ({ ...p, company: v }))} error={errors.company} placeholder="Acme Inc." />
        <FormInput label="Contact Person" required value={form.contact_name} onChange={(v) => setForm(p => ({ ...p, contact_name: v }))} error={errors.contact_name} placeholder="John Doe" />
        <FormInput label="Email" required type="email" value={form.email} onChange={(v) => setForm(p => ({ ...p, email: v }))} error={errors.email} placeholder="john@acme.com" />
        <FormInput label="Phone" required type="tel" value={form.phone} onChange={(v) => setForm(p => ({ ...p, phone: v }))} error={errors.phone} placeholder="+91 98765 43210" />
        <FormSelect label="Interested In" required value={form.space_type} onChange={(v) => setForm(p => ({ ...p, space_type: v }))} error={errors.space_type} placeholder="Select space type" options={[
          { value: "Hotdesk", label: "Hotdesk" },
          { value: "Dedicated Desk", label: "Dedicated Desk" },
          { value: "Private Cabin", label: "Private Cabin" },
          { value: "Virtual Office", label: "Virtual Office" },
        ]} />
        <FormInput label="Estimated Monthly Value" type="number" value={form.estimated_value} onChange={(v) => setForm(p => ({ ...p, estimated_value: v }))} prefix="₹" placeholder="25000" />
        <FormSelect label="Stage" required value={form.stage} onChange={(v) => setForm(p => ({ ...p, stage: v }))} error={errors.stage} options={[
          { value: "Lead", label: "Lead" },
          { value: "Site Visit Scheduled", label: "Site Visit Scheduled" },
          { value: "Proposal Sent", label: "Proposal Sent" },
          { value: "Negotiation", label: "Negotiation" },
          { value: "Agreement Signed", label: "Agreement Signed" },
        ]} />
        <FormInput label="Assigned Manager" required value={form.assigned_to} onChange={(v) => setForm(p => ({ ...p, assigned_to: v }))} error={errors.assigned_to} placeholder="Sales manager name" />
        <FormSelect label="Center" required value={form.center_id} onChange={(v) => setForm(p => ({ ...p, center_id: v }))} error={errors.center_id} placeholder="Select center" options={centers} />
        <FormTextarea label="Notes" value={form.notes} onChange={(v) => setForm(p => ({ ...p, notes: v }))} placeholder="Any additional notes..." rows={3} />
      </div>
      <FormButtons onSubmit={handleSubmit} onCancel={onClose} submitLabel="Add Lead" loading={loading} />
    </Drawer>
  )
}
