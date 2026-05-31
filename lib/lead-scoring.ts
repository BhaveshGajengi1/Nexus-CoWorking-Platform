// Lead scoring utility for pipeline calculations

export interface Lead {
  id: string
  company: string
  contact_name: string
  email: string
  phone: string
  space_type: string
  estimated_value: number
  stage: 'Lead' | 'Proposal Sent' | 'Site Visit Scheduled' | 'Negotiation' | 'Agreement Signed'
  assigned_to: string
  center_id: string
  notes: string
  created_at: string
}

export function calculateLeadScore(lead: Lead): number {
  let score = 0

  // Value scoring
  if (lead.estimated_value > 20000) score += 25
  else if (lead.estimated_value > 10000) score += 15

  // Space type scoring
  if (lead.space_type === 'Private Cabin') score += 20
  else if (lead.space_type === 'Dedicated Desk') score += 15

  // Age in stage scoring
  const daysInStage = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
  if (daysInStage < 7) score += 15
  else if (daysInStage > 21) score -= 10

  // Contact info scoring
  if (lead.email && lead.phone) score += 10

  // Stage scoring
  if (lead.stage === 'Negotiation' || lead.stage === 'Agreement Signed') score += 15

  return Math.max(0, Math.min(100, score))
}

export function getScoreBadge(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 80) return { label: 'Hot', color: 'text-[#FF6B6B]', bgColor: 'bg-[rgba(255,107,107,0.1)]' }
  if (score >= 50) return { label: 'Warm', color: 'text-[#FFA500]', bgColor: 'bg-[rgba(255,165,0,0.1)]' }
  return { label: 'Cold', color: 'text-[#8888A0]', bgColor: 'bg-[rgba(136,136,160,0.1)]' }
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    'Lead': 'bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.3)]',
    'Proposal Sent': 'bg-[rgba(124,61,237,0.1)] border-[rgba(124,61,237,0.3)]',
    'Site Visit Scheduled': 'bg-[rgba(255,165,0,0.1)] border-[rgba(255,165,0,0.3)]',
    'Negotiation': 'bg-[rgba(255,215,0,0.1)] border-[rgba(255,215,0,0.3)]',
    'Agreement Signed': 'bg-[rgba(0,230,118,0.1)] border-[rgba(0,230,118,0.3)]'
  }
  return colors[stage] || colors['Lead']
}
