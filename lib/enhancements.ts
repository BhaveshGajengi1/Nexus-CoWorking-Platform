// Renewal churn prediction utility

export interface Member {
  id: string
  name: string
  company: string
  email: string
  phone: string
  plan: string
  center_id: string
  seat_number: string
  start_date: string
  expiry_date: string
  status: string
}

export interface ChurnRisk {
  member: Member
  risk: number
  badge: { label: string; color: string; bgColor: string }
}

export function calculateChurnRisk(member: Member): number {
  let risk = 0

  // Expiry proximity
  const daysToExpiry = Math.floor((new Date(member.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (daysToExpiry <= 15) risk += 25

  // Plan type
  if (member.plan === 'Hotdesk') risk += 15

  // Tenure
  const daysSinceMembership = Math.floor((Date.now() - new Date(member.start_date).getTime()) / (1000 * 60 * 60 * 24))
  if (daysSinceMembership < 90) risk += 10

  return Math.min(100, risk)
}

export function getChurnBadge(risk: number): { label: string; icon: string; color: string; bgColor: string; pulse?: boolean } {
  if (risk >= 61) return { label: 'High Risk', icon: '🚨', color: 'text-[#FF6B6B]', bgColor: 'bg-[rgba(255,107,107,0.1)]', pulse: true }
  if (risk >= 31) return { label: 'At Risk', icon: '⚠️', color: 'text-[#FFA500]', bgColor: 'bg-[rgba(255,165,0,0.1)]', pulse: false }
  return { label: 'Will Renew', icon: '✅', color: 'text-[#00E676]', bgColor: 'bg-[rgba(0,230,118,0.1)]', pulse: false }
}

// Alert badge utility for sidebar

export interface AlertBadges {
  finance: number
  support: number
  renewals: number
}

export function calculateAlertBadges(
  invoices: any[],
  tickets: any[],
  members: any[]
): AlertBadges {
  const today = new Date()
  
  // Finance: overdue invoices
  const overdueInvoices = invoices.filter(inv => 
    inv.status === 'overdue'
  ).length

  // Support: open tickets
  const openTickets = tickets.filter(t => t.status === 'open').length

  // Renewals: members expiring in ≤7 days
  const expiringMembers = members.filter(m => {
    const daysToExpiry = Math.floor((new Date(m.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysToExpiry <= 7 && daysToExpiry >= 0
  }).length

  return {
    finance: overdueInvoices,
    support: openTickets,
    renewals: expiringMembers
  }
}
