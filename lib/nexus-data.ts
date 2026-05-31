// NEXUS Data - Realistic fictional data for coworking CRM/ERP

export interface Center {
  id: string
  name: string
  shortName: string
  city: string
  address: string
  totalSeats: number
  occupiedSeats: number
  activeVisitors: number
  todayBookings: number
  status: 'Thriving' | 'Moderate' | 'Low'
  monthlyRevenue: number
}

export interface Member {
  id: string
  name: string
  email: string
  company: string
  centerId: string
  plan: 'Hot Desk' | 'Dedicated Desk' | 'Private Cabin' | 'Enterprise'
  startDate: string
  expiryDate: string
  monthlyFee: number
  avatar?: string
  phone: string
  seatNumber?: string
}

export interface Visitor {
  id: string
  name: string
  company: string
  hostMemberId: string
  centerId: string
  purpose: string
  timeIn: string
  timeOut?: string
  status: 'Checked In' | 'Checked Out' | 'Pre-Registered'
  idType: 'Aadhaar' | 'PAN' | 'Driving License' | 'Passport'
  phone: string
}

export interface Room {
  id: string
  name: string
  centerId: string
  capacity: number
  type: 'Boardroom' | 'Focus Pod' | 'Training Hall' | 'Podcast Studio'
  amenities: string[]
  hourlyRate: number
}

export interface Booking {
  id: string
  roomId: string
  memberId: string
  date: string
  startTime: string
  endTime: string
  type: 'Internal' | 'Client' | 'Event'
  notes?: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

export interface Seat {
  id: string
  centerId: string
  floor: number
  zone: 'Hot Desk' | 'Dedicated' | 'Private Cabin'
  seatNumber: string
  status: 'Available' | 'Occupied' | 'Reserved'
  memberId?: string
  leaseEndDate?: string
}

export interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  spaceType: string
  estimatedValue: number
  stage: 'Lead' | 'Site Visit Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Agreement Signed' | 'Active Member'
  assignedManagerId: string
  daysInStage: number
  notes: string[]
  documents: { name: string; uploaded: boolean }[]
  touchpoints: { date: string; type: string; notes: string }[]
}

export interface Invoice {
  id: string
  invoiceNumber: string
  memberId: string
  centerId: string
  amount: number
  gst: number
  totalAmount: number
  dueDate: string
  status: 'Paid' | 'Pending' | 'Overdue'
  lineItems: { description: string; amount: number }[]
  paidDate?: string
}

export interface Ticket {
  id: string
  ticketId: string
  title: string
  description: string
  raisedById: string
  centerId: string
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  category: 'Maintenance' | 'IT' | 'Admin' | 'Complaint'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  assignedToId?: string
  createdAt: string
  slaDeadline: string
  activityLog: { date: string; action: string; by: string }[]
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Center Manager' | 'Community Lead' | 'Finance' | 'Support'
  assignedCenters: string[]
  status: 'Active' | 'Inactive'
  lastActive: string
  avatar?: string
}

export interface ChatMessage {
  id: string
  channelId: string
  senderId: string
  content: string
  timestamp: string
  isPinned?: boolean
}

export interface ActivityEvent {
  id: string
  type: 'check-in' | 'booking' | 'payment' | 'ticket' | 'renewal' | 'visitor'
  message: string
  timestamp: string
  centerId: string
}

// Centers Data
export const centers: Center[] = [
  {
    id: 'center-1',
    name: 'NEXUS HITEC City',
    shortName: 'HITEC City',
    city: 'Hyderabad',
    address: 'Level 5, Cyber Towers, HITEC City, Hyderabad 500081',
    totalSeats: 150,
    occupiedSeats: 127,
    activeVisitors: 12,
    todayBookings: 24,
    status: 'Thriving',
    monthlyRevenue: 2450000
  },
  {
    id: 'center-2',
    name: 'NEXUS Indiranagar',
    shortName: 'Indiranagar',
    city: 'Bangalore',
    address: '12th Main, HAL 2nd Stage, Indiranagar, Bangalore 560038',
    totalSeats: 120,
    occupiedSeats: 89,
    activeVisitors: 8,
    todayBookings: 18,
    status: 'Moderate',
    monthlyRevenue: 1890000
  },
  {
    id: 'center-3',
    name: 'NEXUS BKC',
    shortName: 'BKC',
    city: 'Mumbai',
    address: 'One BKC, G Block, Bandra Kurla Complex, Mumbai 400051',
    totalSeats: 200,
    occupiedSeats: 178,
    activeVisitors: 15,
    todayBookings: 31,
    status: 'Thriving',
    monthlyRevenue: 3200000
  }
]

// Members Data
export const members: Member[] = [
  { id: 'm1', name: 'Riya Sharma', email: 'riya@techforge.io', company: 'TechForge Solutions', centerId: 'center-1', plan: 'Private Cabin', startDate: '2024-01-15', expiryDate: '2026-07-15', monthlyFee: 45000, phone: '+91 98765 43210', seatNumber: 'PC-01' },
  { id: 'm2', name: 'Arjun Mehta', email: 'arjun@cloudnine.in', company: 'CloudNine Analytics', centerId: 'center-1', plan: 'Dedicated Desk', startDate: '2024-03-01', expiryDate: '2026-06-01', monthlyFee: 18000, phone: '+91 98765 43211', seatNumber: 'DD-05' },
  { id: 'm3', name: 'Priya Patel', email: 'priya@designstudio.co', company: 'Pixel Perfect Studio', centerId: 'center-1', plan: 'Hot Desk', startDate: '2024-06-01', expiryDate: '2026-06-15', monthlyFee: 8000, phone: '+91 98765 43212' },
  { id: 'm4', name: 'Vikram Singh', email: 'vikram@finwise.in', company: 'FinWise Advisors', centerId: 'center-2', plan: 'Private Cabin', startDate: '2024-02-01', expiryDate: '2026-08-01', monthlyFee: 42000, phone: '+91 98765 43213', seatNumber: 'PC-02' },
  { id: 'm5', name: 'Ananya Krishnan', email: 'ananya@greenleaf.io', company: 'GreenLeaf Ventures', centerId: 'center-2', plan: 'Dedicated Desk', startDate: '2024-04-15', expiryDate: '2026-06-20', monthlyFee: 16000, phone: '+91 98765 43214', seatNumber: 'DD-12' },
  { id: 'm6', name: 'Rahul Gupta', email: 'rahul@startupx.in', company: 'StartupX Labs', centerId: 'center-2', plan: 'Enterprise', startDate: '2024-01-01', expiryDate: '2027-01-01', monthlyFee: 125000, phone: '+91 98765 43215', seatNumber: 'ENT-01' },
  { id: 'm7', name: 'Sneha Reddy', email: 'sneha@mediapro.co', company: 'MediaPro Creative', centerId: 'center-3', plan: 'Private Cabin', startDate: '2024-05-01', expiryDate: '2026-06-25', monthlyFee: 55000, phone: '+91 98765 43216', seatNumber: 'PC-08' },
  { id: 'm8', name: 'Karthik Nair', email: 'karthik@datadrive.io', company: 'DataDrive AI', centerId: 'center-3', plan: 'Enterprise', startDate: '2024-02-15', expiryDate: '2027-02-15', monthlyFee: 180000, phone: '+91 98765 43217', seatNumber: 'ENT-03' },
  { id: 'm9', name: 'Meera Joshi', email: 'meera@legaledge.in', company: 'LegalEdge Partners', centerId: 'center-3', plan: 'Dedicated Desk', startDate: '2024-07-01', expiryDate: '2026-07-01', monthlyFee: 22000, phone: '+91 98765 43218', seatNumber: 'DD-22' },
  { id: 'm10', name: 'Aditya Kapoor', email: 'aditya@webcraft.io', company: 'WebCraft Digital', centerId: 'center-1', plan: 'Hot Desk', startDate: '2024-08-01', expiryDate: '2026-06-10', monthlyFee: 8000, phone: '+91 98765 43219' },
  { id: 'm11', name: 'Pooja Desai', email: 'pooja@healthtech.in', company: 'HealthTech Solutions', centerId: 'center-1', plan: 'Private Cabin', startDate: '2024-03-15', expiryDate: '2026-06-30', monthlyFee: 45000, phone: '+91 98765 43220', seatNumber: 'PC-03' },
  { id: 'm12', name: 'Sanjay Verma', email: 'sanjay@logicbox.co', company: 'LogicBox Systems', centerId: 'center-2', plan: 'Hot Desk', startDate: '2024-09-01', expiryDate: '2026-07-05', monthlyFee: 7500, phone: '+91 98765 43221' },
  { id: 'm13', name: 'Ishita Malhotra', email: 'ishita@brandwave.in', company: 'BrandWave Marketing', centerId: 'center-3', plan: 'Dedicated Desk', startDate: '2024-04-01', expiryDate: '2026-07-10', monthlyFee: 20000, phone: '+91 98765 43222', seatNumber: 'DD-18' },
  { id: 'm14', name: 'Rohan Shah', email: 'rohan@cryptoedge.io', company: 'CryptoEdge Finance', centerId: 'center-3', plan: 'Private Cabin', startDate: '2024-06-15', expiryDate: '2026-06-08', monthlyFee: 52000, phone: '+91 98765 43223', seatNumber: 'PC-10' },
  { id: 'm15', name: 'Nisha Agarwal', email: 'nisha@ecotech.in', company: 'EcoTech Innovations', centerId: 'center-1', plan: 'Dedicated Desk', startDate: '2024-05-15', expiryDate: '2026-07-20', monthlyFee: 17000, phone: '+91 98765 43224', seatNumber: 'DD-08' },
  { id: 'm16', name: 'Amit Saxena', email: 'amit@devhub.io', company: 'DevHub Technologies', centerId: 'center-2', plan: 'Enterprise', startDate: '2024-01-15', expiryDate: '2027-01-15', monthlyFee: 95000, phone: '+91 98765 43225', seatNumber: 'ENT-02' },
]

// Visitors Data
export const visitors: Visitor[] = [
  { id: 'v1', name: 'Rajesh Kumar', company: 'Infosys', hostMemberId: 'm1', centerId: 'center-1', purpose: 'Client Meeting', timeIn: '09:30', status: 'Checked In', idType: 'Aadhaar', phone: '+91 87654 32100' },
  { id: 'v2', name: 'Sunita Devi', company: 'TCS', hostMemberId: 'm2', centerId: 'center-1', purpose: 'Interview', timeIn: '10:00', timeOut: '11:30', status: 'Checked Out', idType: 'PAN', phone: '+91 87654 32101' },
  { id: 'v3', name: 'Mohan Rao', company: 'Wipro', hostMemberId: 'm4', centerId: 'center-2', purpose: 'Partnership Discussion', timeIn: '11:00', status: 'Checked In', idType: 'Driving License', phone: '+91 87654 32102' },
  { id: 'v4', name: 'Kavitha Subramanian', company: 'Accenture', hostMemberId: 'm7', centerId: 'center-3', purpose: 'Product Demo', timeIn: '14:00', status: 'Pre-Registered', idType: 'Passport', phone: '+91 87654 32103' },
  { id: 'v5', name: 'Deepak Sharma', company: 'HCL', hostMemberId: 'm8', centerId: 'center-3', purpose: 'Training Session', timeIn: '09:00', status: 'Checked In', idType: 'Aadhaar', phone: '+91 87654 32104' },
]

// Rooms Data
export const rooms: Room[] = [
  // HITEC City
  { id: 'r1', name: 'Boardroom Alpha', centerId: 'center-1', capacity: 12, type: 'Boardroom', amenities: ['Video Conferencing', 'Whiteboard', 'TV Display'], hourlyRate: 1500 },
  { id: 'r2', name: 'Focus Pod A', centerId: 'center-1', capacity: 4, type: 'Focus Pod', amenities: ['Whiteboard', 'Monitor'], hourlyRate: 600 },
  { id: 'r3', name: 'Training Hall 1', centerId: 'center-1', capacity: 30, type: 'Training Hall', amenities: ['Projector', 'PA System', 'Whiteboard'], hourlyRate: 3000 },
  { id: 'r4', name: 'Podcast Studio', centerId: 'center-1', capacity: 4, type: 'Podcast Studio', amenities: ['Soundproofing', 'Microphones', 'Mixer'], hourlyRate: 1200 },
  // Indiranagar
  { id: 'r5', name: 'Boardroom Beta', centerId: 'center-2', capacity: 12, type: 'Boardroom', amenities: ['Video Conferencing', 'Whiteboard', 'TV Display'], hourlyRate: 1400 },
  { id: 'r6', name: 'Focus Pod B', centerId: 'center-2', capacity: 4, type: 'Focus Pod', amenities: ['Whiteboard', 'Monitor'], hourlyRate: 550 },
  { id: 'r7', name: 'Training Hall 2', centerId: 'center-2', capacity: 30, type: 'Training Hall', amenities: ['Projector', 'PA System', 'Whiteboard'], hourlyRate: 2800 },
  { id: 'r8', name: 'Media Room', centerId: 'center-2', capacity: 4, type: 'Podcast Studio', amenities: ['Soundproofing', 'Microphones', 'Camera'], hourlyRate: 1100 },
  // BKC
  { id: 'r9', name: 'Boardroom Gamma', centerId: 'center-3', capacity: 12, type: 'Boardroom', amenities: ['Video Conferencing', 'Whiteboard', 'TV Display', 'Catering'], hourlyRate: 2000 },
  { id: 'r10', name: 'Focus Pod C', centerId: 'center-3', capacity: 4, type: 'Focus Pod', amenities: ['Whiteboard', 'Monitor'], hourlyRate: 700 },
  { id: 'r11', name: 'Conference Hall', centerId: 'center-3', capacity: 30, type: 'Training Hall', amenities: ['Projector', 'PA System', 'Stage'], hourlyRate: 4000 },
  { id: 'r12', name: 'Recording Studio', centerId: 'center-3', capacity: 4, type: 'Podcast Studio', amenities: ['Soundproofing', 'Pro Audio', 'Green Screen'], hourlyRate: 1800 },
]

// Bookings Data
export const bookings: Booking[] = [
  { id: 'b1', roomId: 'r1', memberId: 'm1', date: '2026-05-25', startTime: '09:00', endTime: '11:00', type: 'Client', notes: 'Product roadmap review', status: 'Confirmed' },
  { id: 'b2', roomId: 'r1', memberId: 'm2', date: '2026-05-25', startTime: '14:00', endTime: '16:00', type: 'Internal', notes: 'Team standup', status: 'Confirmed' },
  { id: 'b3', roomId: 'r2', memberId: 'm3', date: '2026-05-25', startTime: '10:00', endTime: '12:00', type: 'Internal', status: 'Confirmed' },
  { id: 'b4', roomId: 'r3', memberId: 'm11', date: '2026-05-25', startTime: '13:00', endTime: '17:00', type: 'Event', notes: 'Workshop on AI', status: 'Confirmed' },
  { id: 'b5', roomId: 'r4', memberId: 'm10', date: '2026-05-25', startTime: '15:00', endTime: '17:00', type: 'Internal', notes: 'Podcast recording', status: 'Confirmed' },
  { id: 'b6', roomId: 'r5', memberId: 'm4', date: '2026-05-25', startTime: '09:00', endTime: '10:00', type: 'Client', status: 'Confirmed' },
  { id: 'b7', roomId: 'r5', memberId: 'm5', date: '2026-05-25', startTime: '11:00', endTime: '13:00', type: 'Internal', status: 'Confirmed' },
  { id: 'b8', roomId: 'r9', memberId: 'm7', date: '2026-05-25', startTime: '10:00', endTime: '12:00', type: 'Client', notes: 'Investor pitch', status: 'Confirmed' },
  { id: 'b9', roomId: 'r9', memberId: 'm8', date: '2026-05-25', startTime: '14:00', endTime: '18:00', type: 'Event', notes: 'Product launch', status: 'Confirmed' },
  { id: 'b10', roomId: 'r11', memberId: 'm8', date: '2026-05-25', startTime: '09:00', endTime: '13:00', type: 'Event', notes: 'AI Summit', status: 'Confirmed' },
]

// Seats Data - Generate programmatically
export const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  let seatId = 1
  
  centers.forEach(center => {
    // Hot desks (20 per center)
    for (let i = 1; i <= 20; i++) {
      const isOccupied = Math.random() > 0.35
      seats.push({
        id: `seat-${seatId++}`,
        centerId: center.id,
        floor: 1,
        zone: 'Hot Desk',
        seatNumber: `HD-${i.toString().padStart(2, '0')}`,
        status: isOccupied ? 'Occupied' : Math.random() > 0.8 ? 'Reserved' : 'Available',
        memberId: isOccupied ? members.find(m => m.centerId === center.id && m.plan === 'Hot Desk')?.id : undefined
      })
    }
    // Dedicated desks (10 per center)
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: `seat-${seatId++}`,
        centerId: center.id,
        floor: 1,
        zone: 'Dedicated',
        seatNumber: `DD-${i.toString().padStart(2, '0')}`,
        status: i <= 7 ? 'Occupied' : 'Available',
        memberId: i <= 7 ? members.find(m => m.centerId === center.id && m.plan === 'Dedicated Desk')?.id : undefined,
        leaseEndDate: i <= 7 ? '2026-12-31' : undefined
      })
    }
    // Private cabins (5 per center)
    for (let i = 1; i <= 5; i++) {
      seats.push({
        id: `seat-${seatId++}`,
        centerId: center.id,
        floor: 2,
        zone: 'Private Cabin',
        seatNumber: `PC-${i.toString().padStart(2, '0')}`,
        status: i <= 4 ? 'Occupied' : 'Available',
        memberId: i <= 4 ? members.find(m => m.centerId === center.id && m.plan === 'Private Cabin')?.id : undefined,
        leaseEndDate: i <= 4 ? '2027-06-30' : undefined
      })
    }
  })
  
  return seats
}

export const seats = generateSeats()

// Leads Data
export const leads: Lead[] = [
  {
    id: 'l1',
    companyName: 'NexGen AI Labs',
    contactPerson: 'Vivek Agrawal',
    email: 'vivek@nexgenai.io',
    phone: '+91 99887 76655',
    spaceType: 'Private Cabin (10 seats)',
    estimatedValue: 450000,
    stage: 'Negotiation',
    assignedManagerId: 't2',
    daysInStage: 5,
    notes: ['Interested in long-term contract', 'Requires 24/7 access'],
    documents: [{ name: 'KYC Documents', uploaded: true }, { name: 'Agreement Draft', uploaded: true }, { name: 'Photo ID', uploaded: false }],
    touchpoints: [
      { date: '2026-05-10', type: 'Email', notes: 'Initial inquiry received' },
      { date: '2026-05-12', type: 'Call', notes: 'Discussed requirements' },
      { date: '2026-05-15', type: 'Site Visit', notes: 'Toured HITEC City facility' },
      { date: '2026-05-20', type: 'Proposal', notes: 'Sent pricing proposal' },
    ]
  },
  {
    id: 'l2',
    companyName: 'FinServ Technologies',
    contactPerson: 'Priyanka Menon',
    email: 'priyanka@finserv.in',
    phone: '+91 99887 76656',
    spaceType: 'Enterprise (25 seats)',
    estimatedValue: 950000,
    stage: 'Proposal Sent',
    assignedManagerId: 't3',
    daysInStage: 3,
    notes: ['Looking for BKC location specifically'],
    documents: [{ name: 'KYC Documents', uploaded: true }, { name: 'Agreement Draft', uploaded: false }, { name: 'Photo ID', uploaded: true }],
    touchpoints: [
      { date: '2026-05-18', type: 'Website', notes: 'Form submission' },
      { date: '2026-05-19', type: 'Call', notes: 'Qualification call' },
      { date: '2026-05-22', type: 'Site Visit', notes: 'BKC tour completed' },
    ]
  },
  {
    id: 'l3',
    companyName: 'CreativeMinds Agency',
    contactPerson: 'Ankit Jain',
    email: 'ankit@creativeminds.co',
    phone: '+91 99887 76657',
    spaceType: 'Dedicated Desk (5 seats)',
    estimatedValue: 80000,
    stage: 'Site Visit Scheduled',
    assignedManagerId: 't2',
    daysInStage: 2,
    notes: ['Referral from existing member'],
    documents: [{ name: 'KYC Documents', uploaded: false }, { name: 'Agreement Draft', uploaded: false }, { name: 'Photo ID', uploaded: false }],
    touchpoints: [
      { date: '2026-05-23', type: 'Referral', notes: 'Referred by Riya Sharma' },
      { date: '2026-05-24', type: 'Call', notes: 'Scheduled visit for May 26' },
    ]
  },
  {
    id: 'l4',
    companyName: 'HealthPlus Diagnostics',
    contactPerson: 'Dr. Suresh Rao',
    email: 'suresh@healthplus.in',
    phone: '+91 99887 76658',
    spaceType: 'Private Cabin (3 seats)',
    estimatedValue: 150000,
    stage: 'Lead',
    assignedManagerId: 't4',
    daysInStage: 1,
    notes: ['Inbound from Google Ads'],
    documents: [{ name: 'KYC Documents', uploaded: false }, { name: 'Agreement Draft', uploaded: false }, { name: 'Photo ID', uploaded: false }],
    touchpoints: [
      { date: '2026-05-24', type: 'Website', notes: 'Contact form submission' },
    ]
  },
  {
    id: 'l5',
    companyName: 'EduTech Innovations',
    contactPerson: 'Rekha Pillai',
    email: 'rekha@edutech.io',
    phone: '+91 99887 76659',
    spaceType: 'Enterprise (50 seats)',
    estimatedValue: 1800000,
    stage: 'Agreement Signed',
    assignedManagerId: 't2',
    daysInStage: 1,
    notes: ['Fast-track onboarding requested'],
    documents: [{ name: 'KYC Documents', uploaded: true }, { name: 'Agreement Draft', uploaded: true }, { name: 'Photo ID', uploaded: true }],
    touchpoints: [
      { date: '2026-05-01', type: 'Email', notes: 'Initial contact' },
      { date: '2026-05-05', type: 'Site Visit', notes: 'Multiple location tours' },
      { date: '2026-05-10', type: 'Proposal', notes: 'Custom enterprise proposal' },
      { date: '2026-05-15', type: 'Negotiation', notes: 'Pricing negotiation' },
      { date: '2026-05-24', type: 'Agreement', notes: 'Agreement signed!' },
    ]
  },
]

// Invoices Data
export const invoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-1042', memberId: 'm1', centerId: 'center-1', amount: 45000, gst: 8100, totalAmount: 53100, dueDate: '2026-05-31', status: 'Paid', lineItems: [{ description: 'Private Cabin - June 2026', amount: 45000 }], paidDate: '2026-05-20' },
  { id: 'inv2', invoiceNumber: 'INV-2026-1043', memberId: 'm2', centerId: 'center-1', amount: 18000, gst: 3240, totalAmount: 21240, dueDate: '2026-05-31', status: 'Pending', lineItems: [{ description: 'Dedicated Desk - June 2026', amount: 18000 }] },
  { id: 'inv3', invoiceNumber: 'INV-2026-1044', memberId: 'm4', centerId: 'center-2', amount: 42000, gst: 7560, totalAmount: 49560, dueDate: '2026-05-25', status: 'Overdue', lineItems: [{ description: 'Private Cabin - June 2026', amount: 42000 }] },
  { id: 'inv4', invoiceNumber: 'INV-2026-1045', memberId: 'm7', centerId: 'center-3', amount: 55000, gst: 9900, totalAmount: 64900, dueDate: '2026-05-31', status: 'Paid', lineItems: [{ description: 'Private Cabin - June 2026', amount: 55000 }], paidDate: '2026-05-22' },
  { id: 'inv5', invoiceNumber: 'INV-2026-1046', memberId: 'm8', centerId: 'center-3', amount: 180000, gst: 32400, totalAmount: 212400, dueDate: '2026-05-31', status: 'Paid', lineItems: [{ description: 'Enterprise - June 2026', amount: 180000 }], paidDate: '2026-05-18' },
  { id: 'inv6', invoiceNumber: 'INV-2026-1047', memberId: 'm6', centerId: 'center-2', amount: 125000, gst: 22500, totalAmount: 147500, dueDate: '2026-05-28', status: 'Pending', lineItems: [{ description: 'Enterprise - June 2026', amount: 125000 }] },
  { id: 'inv7', invoiceNumber: 'INV-2026-1048', memberId: 'm14', centerId: 'center-3', amount: 52000, gst: 9360, totalAmount: 61360, dueDate: '2026-05-20', status: 'Overdue', lineItems: [{ description: 'Private Cabin - June 2026', amount: 52000 }] },
  { id: 'inv8', invoiceNumber: 'INV-2026-1049', memberId: 'm9', centerId: 'center-3', amount: 22000, gst: 3960, totalAmount: 25960, dueDate: '2026-05-31', status: 'Pending', lineItems: [{ description: 'Dedicated Desk - June 2026', amount: 22000 }] },
]

// Tickets Data
export const tickets: Ticket[] = [
  {
    id: 'tkt1',
    ticketId: 'TKT-2026-0089',
    title: 'AC not working in Focus Pod A',
    description: 'The air conditioning unit in Focus Pod A has stopped functioning. Room temperature is very high.',
    raisedById: 'm3',
    centerId: 'center-1',
    priority: 'P1',
    category: 'Maintenance',
    status: 'In Progress',
    assignedToId: 't5',
    createdAt: '2026-05-25T08:30:00',
    slaDeadline: '2026-05-25T12:30:00',
    activityLog: [
      { date: '2026-05-25T08:30:00', action: 'Ticket created', by: 'Priya Patel' },
      { date: '2026-05-25T08:45:00', action: 'Assigned to maintenance team', by: 'System' },
      { date: '2026-05-25T09:00:00', action: 'Technician dispatched', by: 'Support Team' },
    ]
  },
  {
    id: 'tkt2',
    ticketId: 'TKT-2026-0090',
    title: 'WiFi connectivity issues on Floor 2',
    description: 'Multiple members reporting slow internet and frequent disconnections on Floor 2.',
    raisedById: 'm1',
    centerId: 'center-1',
    priority: 'P2',
    category: 'IT',
    status: 'Open',
    createdAt: '2026-05-25T09:15:00',
    slaDeadline: '2026-05-25T17:15:00',
    activityLog: [
      { date: '2026-05-25T09:15:00', action: 'Ticket created', by: 'Riya Sharma' },
    ]
  },
  {
    id: 'tkt3',
    ticketId: 'TKT-2026-0091',
    title: 'Request for additional parking pass',
    description: 'Need one more parking pass for our new team member joining next week.',
    raisedById: 'm6',
    centerId: 'center-2',
    priority: 'P4',
    category: 'Admin',
    status: 'Open',
    createdAt: '2026-05-24T14:00:00',
    slaDeadline: '2026-05-27T14:00:00',
    activityLog: [
      { date: '2026-05-24T14:00:00', action: 'Ticket created', by: 'Rahul Gupta' },
    ]
  },
  {
    id: 'tkt4',
    ticketId: 'TKT-2026-0088',
    title: 'Coffee machine not dispensing hot water',
    description: 'The coffee machine in the pantry area is not dispensing hot water for tea.',
    raisedById: 'm7',
    centerId: 'center-3',
    priority: 'P3',
    category: 'Maintenance',
    status: 'Resolved',
    assignedToId: 't5',
    createdAt: '2026-05-24T11:00:00',
    slaDeadline: '2026-05-25T11:00:00',
    activityLog: [
      { date: '2026-05-24T11:00:00', action: 'Ticket created', by: 'Sneha Reddy' },
      { date: '2026-05-24T11:30:00', action: 'Assigned to facilities', by: 'System' },
      { date: '2026-05-24T15:00:00', action: 'Technician fixed the issue', by: 'Support Team' },
      { date: '2026-05-24T15:30:00', action: 'Marked as resolved', by: 'Support Team' },
    ]
  },
  {
    id: 'tkt5',
    ticketId: 'TKT-2026-0092',
    title: 'Noise complaint from adjacent cabin',
    description: 'Excessive noise from the cabin next to PC-08 during calls. Affecting work.',
    raisedById: 'm7',
    centerId: 'center-3',
    priority: 'P2',
    category: 'Complaint',
    status: 'In Progress',
    assignedToId: 't3',
    createdAt: '2026-05-25T10:00:00',
    slaDeadline: '2026-05-25T18:00:00',
    activityLog: [
      { date: '2026-05-25T10:00:00', action: 'Ticket created', by: 'Sneha Reddy' },
      { date: '2026-05-25T10:15:00', action: 'Assigned to community manager', by: 'System' },
      { date: '2026-05-25T10:30:00', action: 'Speaking with concerned parties', by: 'Neha Kulkarni' },
    ]
  },
]

// Team Members Data
export const teamMembers: TeamMember[] = [
  { id: 't1', name: 'Arun Prakash', email: 'arun@nexus.co', role: 'Super Admin', assignedCenters: ['center-1', 'center-2', 'center-3'], status: 'Active', lastActive: '2026-05-25T10:30:00' },
  { id: 't2', name: 'Deepika Nair', email: 'deepika@nexus.co', role: 'Center Manager', assignedCenters: ['center-1'], status: 'Active', lastActive: '2026-05-25T10:25:00' },
  { id: 't3', name: 'Neha Kulkarni', email: 'neha@nexus.co', role: 'Center Manager', assignedCenters: ['center-3'], status: 'Active', lastActive: '2026-05-25T10:20:00' },
  { id: 't4', name: 'Varun Reddy', email: 'varun@nexus.co', role: 'Center Manager', assignedCenters: ['center-2'], status: 'Active', lastActive: '2026-05-25T09:45:00' },
  { id: 't5', name: 'Smita Joshi', email: 'smita@nexus.co', role: 'Support', assignedCenters: ['center-1', 'center-2', 'center-3'], status: 'Active', lastActive: '2026-05-25T10:28:00' },
  { id: 't6', name: 'Ramesh Iyer', email: 'ramesh@nexus.co', role: 'Finance', assignedCenters: ['center-1', 'center-2', 'center-3'], status: 'Active', lastActive: '2026-05-25T10:15:00' },
  { id: 't7', name: 'Kavita Singh', email: 'kavita@nexus.co', role: 'Community Lead', assignedCenters: ['center-1'], status: 'Active', lastActive: '2026-05-25T10:10:00' },
  { id: 't8', name: 'Ajay Menon', email: 'ajay@nexus.co', role: 'Community Lead', assignedCenters: ['center-2', 'center-3'], status: 'Inactive', lastActive: '2026-05-20T16:00:00' },
]

// Chat Messages Data
export const chatMessages: ChatMessage[] = [
  { id: 'msg1', channelId: 'general', senderId: 't1', content: 'Good morning team! Quick reminder: All center reports due by EOD today.', timestamp: '2026-05-25T09:00:00', isPinned: true },
  { id: 'msg2', channelId: 'general', senderId: 't2', content: 'Noted! HITEC City report almost ready.', timestamp: '2026-05-25T09:05:00' },
  { id: 'msg3', channelId: 'general', senderId: 't3', content: 'BKC report submitted. We hit 89% occupancy this month!', timestamp: '2026-05-25T09:10:00' },
  { id: 'msg4', channelId: 'general', senderId: 't6', content: 'Great news! I will update the monthly financials accordingly.', timestamp: '2026-05-25T09:15:00' },
  { id: 'msg5', channelId: 'hitec-city', senderId: 't2', content: 'AC issue in Focus Pod A reported. Maintenance team dispatched.', timestamp: '2026-05-25T08:45:00' },
  { id: 'msg6', channelId: 'hitec-city', senderId: 't7', content: 'Thanks Deepika. I will inform the affected members.', timestamp: '2026-05-25T08:50:00' },
  { id: 'msg7', channelId: 'hitec-city', senderId: 't2', content: 'New enterprise lead from NexGen AI Labs. Site visit went well!', timestamp: '2026-05-25T10:00:00' },
  { id: 'msg8', channelId: 'bangalore', senderId: 't4', content: 'Reminder: We have the community happy hour today at 5 PM', timestamp: '2026-05-25T09:30:00' },
  { id: 'msg9', channelId: 'bangalore', senderId: 't4', content: 'Also, new parking passes arriving tomorrow for those who requested.', timestamp: '2026-05-25T09:35:00' },
  { id: 'msg10', channelId: 'mumbai', senderId: 't3', content: 'DataDrive AI is hosting their product launch in Conference Hall today. Extra catering arranged.', timestamp: '2026-05-25T08:00:00', isPinned: true },
  { id: 'msg11', channelId: 'mumbai', senderId: 't3', content: 'Noise complaint from PC-08 being handled. Spoke with both parties.', timestamp: '2026-05-25T10:35:00' },
  { id: 'msg12', channelId: 'finance-alerts', senderId: 't6', content: 'ALERT: 2 invoices overdue - FinWise Advisors and CryptoEdge Finance. Sending reminders.', timestamp: '2026-05-25T09:00:00', isPinned: true },
  { id: 'msg13', channelId: 'finance-alerts', senderId: 't6', content: 'May collections at 87%. Need to follow up on pending invoices.', timestamp: '2026-05-25T10:00:00' },
  { id: 'msg14', channelId: 'maintenance', senderId: 't5', content: 'AC repair in Focus Pod A - ETA 2 hours. Parts being sourced.', timestamp: '2026-05-25T10:00:00' },
  { id: 'msg15', channelId: 'maintenance', senderId: 't5', content: 'WiFi issue on Floor 2 HITEC City being investigated. Might need router replacement.', timestamp: '2026-05-25T10:20:00' },
]

// Activity Events Data
export const activityEvents: ActivityEvent[] = [
  { id: 'ae1', type: 'check-in', message: 'Riya S. checked in @ HITEC City', timestamp: '2026-05-25T09:02:00', centerId: 'center-1' },
  { id: 'ae2', type: 'booking', message: 'Conference Room B booked by Arjun M.', timestamp: '2026-05-25T09:05:00', centerId: 'center-1' },
  { id: 'ae3', type: 'payment', message: 'Invoice #1042 paid - ₹53,100', timestamp: '2026-05-25T09:10:00', centerId: 'center-1' },
  { id: 'ae4', type: 'visitor', message: 'Visitor Rajesh Kumar arrived for Riya S.', timestamp: '2026-05-25T09:30:00', centerId: 'center-1' },
  { id: 'ae5', type: 'check-in', message: 'Vikram S. checked in @ Indiranagar', timestamp: '2026-05-25T09:15:00', centerId: 'center-2' },
  { id: 'ae6', type: 'ticket', message: 'New P1 ticket: AC not working', timestamp: '2026-05-25T08:30:00', centerId: 'center-1' },
  { id: 'ae7', type: 'booking', message: 'Training Hall booked for AI Workshop', timestamp: '2026-05-25T08:45:00', centerId: 'center-1' },
  { id: 'ae8', type: 'check-in', message: 'Sneha R. checked in @ BKC', timestamp: '2026-05-25T09:00:00', centerId: 'center-3' },
  { id: 'ae9', type: 'payment', message: 'Invoice #1045 paid - ₹64,900', timestamp: '2026-05-25T09:20:00', centerId: 'center-3' },
  { id: 'ae10', type: 'renewal', message: 'Membership renewal: Meera J. (BKC)', timestamp: '2026-05-25T09:25:00', centerId: 'center-3' },
  { id: 'ae11', type: 'visitor', message: 'Visitor Deepak Sharma arrived for Karthik N.', timestamp: '2026-05-25T09:00:00', centerId: 'center-3' },
  { id: 'ae12', type: 'check-in', message: 'Ananya K. checked in @ Indiranagar', timestamp: '2026-05-25T09:30:00', centerId: 'center-2' },
]

// Chart Data
export const revenueByCenter = [
  { month: 'Dec', 'HITEC City': 2200000, 'Indiranagar': 1650000, 'BKC': 2900000 },
  { month: 'Jan', 'HITEC City': 2300000, 'Indiranagar': 1750000, 'BKC': 3000000 },
  { month: 'Feb', 'HITEC City': 2350000, 'Indiranagar': 1800000, 'BKC': 3050000 },
  { month: 'Mar', 'HITEC City': 2400000, 'Indiranagar': 1820000, 'BKC': 3100000 },
  { month: 'Apr', 'HITEC City': 2420000, 'Indiranagar': 1870000, 'BKC': 3150000 },
  { month: 'May', 'HITEC City': 2450000, 'Indiranagar': 1890000, 'BKC': 3200000 },
]

export const occupancyTrend = [
  { day: 'Mon', occupancy: 82 },
  { day: 'Tue', occupancy: 85 },
  { day: 'Wed', occupancy: 88 },
  { day: 'Thu', occupancy: 84 },
  { day: 'Fri', occupancy: 79 },
  { day: 'Sat', occupancy: 45 },
  { day: 'Sun', occupancy: 32 },
]

export const expensesByCategory = [
  { name: 'Utilities', value: 320000, color: '#00D4FF' },
  { name: 'Staff', value: 580000, color: '#F5A623' },
  { name: 'Maintenance', value: 150000, color: '#00E676' },
  { name: 'Marketing', value: 80000, color: '#7C4DFF' },
  { name: 'Other', value: 70000, color: '#FF4757' },
]

// Helper functions
export const getMemberById = (id: string) => members.find(m => m.id === id)
export const getCenterById = (id: string) => centers.find(c => c.id === id)
export const getTeamMemberById = (id: string) => teamMembers.find(t => t.id === id)
export const getRoomById = (id: string) => rooms.find(r => r.id === id)

export const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export const getInitials = (name: string) => 
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const getDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date('2026-05-25')
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Permission Matrix
export const permissionMatrix = {
  'Super Admin': {
    'Command Dashboard': 'admin',
    'Visitor Management': 'admin',
    'Room Booking': 'admin',
    'Floor Map': 'admin',
    'Onboarding': 'admin',
    'Finance': 'admin',
    'Renewals': 'admin',
    'Support': 'admin',
    'Team Chat': 'admin',
    'Team Management': 'admin',
  },
  'Center Manager': {
    'Command Dashboard': 'write',
    'Visitor Management': 'write',
    'Room Booking': 'write',
    'Floor Map': 'write',
    'Onboarding': 'write',
    'Finance': 'read',
    'Renewals': 'write',
    'Support': 'write',
    'Team Chat': 'write',
    'Team Management': 'read',
  },
  'Community Lead': {
    'Command Dashboard': 'read',
    'Visitor Management': 'write',
    'Room Booking': 'write',
    'Floor Map': 'read',
    'Onboarding': 'read',
    'Finance': 'none',
    'Renewals': 'read',
    'Support': 'write',
    'Team Chat': 'write',
    'Team Management': 'none',
  },
  'Finance': {
    'Command Dashboard': 'read',
    'Visitor Management': 'none',
    'Room Booking': 'none',
    'Floor Map': 'none',
    'Onboarding': 'read',
    'Finance': 'admin',
    'Renewals': 'write',
    'Support': 'read',
    'Team Chat': 'write',
    'Team Management': 'none',
  },
  'Support': {
    'Command Dashboard': 'read',
    'Visitor Management': 'write',
    'Room Booking': 'read',
    'Floor Map': 'read',
    'Onboarding': 'none',
    'Finance': 'none',
    'Renewals': 'none',
    'Support': 'write',
    'Team Chat': 'write',
    'Team Management': 'none',
  },
}

// Floor Map Data
export const floorMapData = {
  floors: [
    { id: 'floor-1', name: 'Floor 1 - Open Space', level: 1 },
    { id: 'floor-2', name: 'Floor 2 - Private Offices', level: 2 },
  ],
  zones: [
    { id: 'zone-hd', name: 'Hot Desk Zone', floor: 1, color: '#22d3ee', x: 50, y: 80, width: 200, height: 150 },
    { id: 'zone-dd', name: 'Dedicated Desk Zone', floor: 1, color: '#a78bfa', x: 280, y: 80, width: 180, height: 150 },
    { id: 'zone-meeting', name: 'Meeting Rooms', floor: 1, color: '#f472b6', x: 490, y: 80, width: 140, height: 150 },
    { id: 'zone-pc', name: 'Private Cabins', floor: 2, color: '#fbbf24', x: 50, y: 80, width: 250, height: 150 },
    { id: 'zone-ent', name: 'Enterprise Suites', floor: 2, color: '#34d399', x: 330, y: 80, width: 200, height: 150 },
    { id: 'zone-event', name: 'Event Space', floor: 2, color: '#fb923c', x: 560, y: 80, width: 120, height: 150 },
  ],
  amenities: [
    { id: 'am-1', name: 'Cafeteria', type: 'coffee', x: 650, y: 280, floor: 1 },
    { id: 'am-2', name: 'Reception', type: 'users', x: 50, y: 280, floor: 1 },
    { id: 'am-3', name: 'Print Station', type: 'printer', x: 350, y: 280, floor: 1 },
    { id: 'am-4', name: 'WiFi Hub', type: 'wifi', x: 500, y: 280, floor: 1 },
    { id: 'am-5', name: 'Lounge', type: 'coffee', x: 650, y: 280, floor: 2 },
  ],
  desks: Array.from({ length: 35 }, (_, i) => ({
    id: `desk-${i + 1}`,
    number: i + 1,
    floor: i < 20 ? 1 : 2,
    zone: i < 12 ? 'zone-hd' : i < 20 ? 'zone-dd' : i < 28 ? 'zone-pc' : 'zone-ent',
    status: Math.random() > 0.3 ? 'occupied' : Math.random() > 0.5 ? 'reserved' : 'available',
    x: 60 + (i % 6) * 35,
    y: 100 + Math.floor((i % 12) / 6) * 50,
    memberId: Math.random() > 0.3 ? members[Math.floor(Math.random() * members.length)]?.id : undefined,
  })),
}

// Financial Metrics
export const financialMetrics = {
  totalRevenue: 7540000,
  previousMonthRevenue: 7120000,
  revenueGrowth: 5.9,
  collectedAmount: 6890000,
  outstandingAmount: 650000,
  overdueAmount: 185000,
  collectionRate: 91.4,
  averageInvoiceValue: 42500,
  monthlyRevenue: '₹75.4L',
  outstanding: '₹6.5L',
  collectedMTD: '₹68.9L',
  avgDaysToPay: '12 days',
  revenueHistory: [
    { month: 'Jan', revenue: 6800000 },
    { month: 'Feb', revenue: 6950000 },
    { month: 'Mar', revenue: 7100000 },
    { month: 'Apr', revenue: 7250000 },
    { month: 'May', revenue: 7540000 },
  ],
  monthlyData: [
    { month: 'Jan', revenue: 6800000, collected: 6200000, outstanding: 600000 },
    { month: 'Feb', revenue: 6950000, collected: 6400000, outstanding: 550000 },
    { month: 'Mar', revenue: 7100000, collected: 6700000, outstanding: 400000 },
    { month: 'Apr', revenue: 7250000, collected: 6850000, outstanding: 400000 },
    { month: 'May', revenue: 7540000, collected: 6890000, outstanding: 650000 },
  ],
  centerBreakdown: [
    { centerId: 'center-1', centerName: 'HITEC City', revenue: 2450000, collected: 2280000, outstanding: 170000 },
    { centerId: 'center-2', centerName: 'Indiranagar', revenue: 1890000, collected: 1710000, outstanding: 180000 },
    { centerId: 'center-3', centerName: 'BKC', revenue: 3200000, collected: 2900000, outstanding: 300000 },
  ],
  revenueByPlan: [
    { plan: 'Hot Desk', revenue: 480000, members: 45 },
    { plan: 'Dedicated Desk', revenue: 1520000, members: 82 },
    { plan: 'Private Cabin', revenue: 2340000, members: 68 },
    { plan: 'Enterprise', revenue: 3200000, members: 52 },
  ],
  planBreakdown: [
    { plan: 'Hot Desk', revenue: 480000, percentage: 6.4 },
    { plan: 'Dedicated Desk', revenue: 1520000, percentage: 20.2 },
    { plan: 'Private Cabin', revenue: 2340000, percentage: 31.0 },
    { plan: 'Enterprise', revenue: 3200000, percentage: 42.4 },
  ],
}

// Chat channels
export const chatChannels = [
  { id: 'general', name: 'general', type: 'channel' },
  { id: 'hitec-city', name: 'hitec-city', type: 'channel' },
  { id: 'bangalore', name: 'bangalore', type: 'channel' },
  { id: 'mumbai', name: 'mumbai', type: 'channel' },
  { id: 'finance-alerts', name: 'finance-alerts', type: 'channel' },
  { id: 'maintenance', name: 'maintenance', type: 'channel' },
]

// Onboarding Tasks Data
export const onboardingTasks = [
  {
    id: 'onb-1',
    memberId: 'm1',
    memberName: 'Riya Sharma',
    company: 'TechForge Solutions',
    centerId: 'center-1',
    startDate: '2024-01-15',
    status: 'completed' as const,
    progress: 100,
    tasks: [
      { id: 't1', name: 'KYC Verification', status: 'completed' as const, dueDate: '2024-01-16' },
      { id: 't2', name: 'Agreement Signed', status: 'completed' as const, dueDate: '2024-01-17' },
      { id: 't3', name: 'Access Card Issued', status: 'completed' as const, dueDate: '2024-01-18' },
      { id: 't4', name: 'Workspace Setup', status: 'completed' as const, dueDate: '2024-01-19' },
      { id: 't5', name: 'Welcome Tour', status: 'completed' as const, dueDate: '2024-01-20' },
    ],
  },
  {
    id: 'onb-2',
    memberId: 'm16',
    memberName: 'EduTech Innovations',
    company: 'EduTech Innovations',
    centerId: 'center-1',
    startDate: '2026-05-25',
    status: 'in-progress' as const,
    progress: 60,
    tasks: [
      { id: 't1', name: 'KYC Verification', status: 'completed' as const, dueDate: '2026-05-26' },
      { id: 't2', name: 'Agreement Signed', status: 'completed' as const, dueDate: '2026-05-27' },
      { id: 't3', name: 'Access Cards Issued', status: 'completed' as const, dueDate: '2026-05-28' },
      { id: 't4', name: 'Workspace Setup', status: 'in-progress' as const, dueDate: '2026-05-29' },
      { id: 't5', name: 'Welcome Tour', status: 'pending' as const, dueDate: '2026-05-30' },
    ],
  },
  {
    id: 'onb-3',
    memberId: 'new-1',
    memberName: 'NexGen AI Labs',
    company: 'NexGen AI Labs',
    centerId: 'center-1',
    startDate: '2026-05-26',
    status: 'pending' as const,
    progress: 20,
    tasks: [
      { id: 't1', name: 'KYC Verification', status: 'completed' as const, dueDate: '2026-05-27' },
      { id: 't2', name: 'Agreement Signing', status: 'in-progress' as const, dueDate: '2026-05-28' },
      { id: 't3', name: 'Access Cards Issued', status: 'pending' as const, dueDate: '2026-05-29' },
      { id: 't4', name: 'Workspace Setup', status: 'pending' as const, dueDate: '2026-05-30' },
      { id: 't5', name: 'Welcome Tour', status: 'pending' as const, dueDate: '2026-05-31' },
    ],
  },
  {
    id: 'onb-4',
    memberId: 'new-2',
    memberName: 'FinServ Technologies',
    company: 'FinServ Technologies',
    centerId: 'center-3',
    startDate: '2026-05-28',
    status: 'pending' as const,
    progress: 0,
    tasks: [
      { id: 't1', name: 'KYC Verification', status: 'pending' as const, dueDate: '2026-05-29' },
      { id: 't2', name: 'Agreement Signing', status: 'pending' as const, dueDate: '2026-05-30' },
      { id: 't3', name: 'Access Cards Issued', status: 'pending' as const, dueDate: '2026-06-01' },
      { id: 't4', name: 'Workspace Setup', status: 'pending' as const, dueDate: '2026-06-02' },
      { id: 't5', name: 'Welcome Tour', status: 'pending' as const, dueDate: '2026-06-03' },
    ],
  },
  {
    id: 'onb-5',
    memberId: 'new-3',
    memberName: 'CreativeMinds Agency',
    company: 'CreativeMinds Agency',
    centerId: 'center-2',
    startDate: '2026-05-27',
    status: 'in-progress' as const,
    progress: 40,
    tasks: [
      { id: 't1', name: 'KYC Verification', status: 'completed' as const, dueDate: '2026-05-28' },
      { id: 't2', name: 'Agreement Signing', status: 'completed' as const, dueDate: '2026-05-29' },
      { id: 't3', name: 'Access Cards Issued', status: 'in-progress' as const, dueDate: '2026-05-30' },
      { id: 't4', name: 'Workspace Setup', status: 'pending' as const, dueDate: '2026-05-31' },
      { id: 't5', name: 'Welcome Tour', status: 'pending' as const, dueDate: '2026-06-01' },
    ],
  },
]

// Renewals Data
export const renewals = [
  {
    id: 'ren-1',
    memberId: 'm3',
    memberName: 'Priya Patel',
    company: 'Pixel Perfect Studio',
    centerId: 'center-1',
    plan: 'Hot Desk' as const,
    currentMonthlyFee: 8000,
    proposedFee: 8500,
    expiryDate: '2026-06-15',
    daysUntilExpiry: 21,
    status: 'pending' as const,
    riskLevel: 'low' as const,
    lastContactDate: '2026-05-20',
    notes: 'Happy with current setup, likely to renew',
  },
  {
    id: 'ren-2',
    memberId: 'm5',
    memberName: 'Ananya Krishnan',
    company: 'GreenLeaf Ventures',
    centerId: 'center-2',
    plan: 'Dedicated Desk' as const,
    currentMonthlyFee: 16000,
    proposedFee: 17000,
    expiryDate: '2026-06-20',
    daysUntilExpiry: 26,
    status: 'in-discussion' as const,
    riskLevel: 'medium' as const,
    lastContactDate: '2026-05-22',
    notes: 'Considering upgrade to Private Cabin',
  },
  {
    id: 'ren-3',
    memberId: 'm14',
    memberName: 'Rohan Shah',
    company: 'CryptoEdge Finance',
    centerId: 'center-3',
    plan: 'Private Cabin' as const,
    currentMonthlyFee: 52000,
    proposedFee: 55000,
    expiryDate: '2026-06-08',
    daysUntilExpiry: 14,
    status: 'at-risk' as const,
    riskLevel: 'high' as const,
    lastContactDate: '2026-05-18',
    notes: 'Mentioned budget constraints, exploring options',
  },
  {
    id: 'ren-4',
    memberId: 'm10',
    memberName: 'Aditya Kapoor',
    company: 'WebCraft Digital',
    centerId: 'center-1',
    plan: 'Hot Desk' as const,
    currentMonthlyFee: 8000,
    proposedFee: 8000,
    expiryDate: '2026-06-10',
    daysUntilExpiry: 16,
    status: 'renewed' as const,
    riskLevel: 'low' as const,
    lastContactDate: '2026-05-24',
    notes: 'Renewed for 12 months with loyalty discount',
  },
  {
    id: 'ren-5',
    memberId: 'm7',
    memberName: 'Sneha Reddy',
    company: 'MediaPro Creative',
    centerId: 'center-3',
    plan: 'Private Cabin' as const,
    currentMonthlyFee: 55000,
    proposedFee: 58000,
    expiryDate: '2026-06-25',
    daysUntilExpiry: 31,
    status: 'pending' as const,
    riskLevel: 'low' as const,
    lastContactDate: '2026-05-15',
    notes: 'Very satisfied, auto-renewal expected',
  },
  {
    id: 'ren-6',
    memberId: 'm11',
    memberName: 'Pooja Desai',
    company: 'HealthTech Solutions',
    centerId: 'center-1',
    plan: 'Private Cabin' as const,
    currentMonthlyFee: 45000,
    proposedFee: 47000,
    expiryDate: '2026-06-30',
    daysUntilExpiry: 36,
    status: 'in-discussion' as const,
    riskLevel: 'medium' as const,
    lastContactDate: '2026-05-23',
    notes: 'Negotiating for additional meeting room credits',
  },
]

// Support Tickets Data
export const supportTickets = [
  {
    id: 'ticket-1',
    subject: 'AC not working in Zone B',
    description: 'The air conditioning unit in Zone B has stopped working since yesterday morning. Temperature is uncomfortably high.',
    memberId: 'm1',
    memberName: 'Riya Sharma',
    company: 'TechForge Solutions',
    centerId: 'center-1',
    category: 'Facilities' as const,
    priority: 'high' as const,
    status: 'in-progress' as const,
    createdAt: '2026-05-24T09:30:00',
    updatedAt: '2026-05-25T10:15:00',
    assignedTo: 'Maintenance Team',
    messages: [
      { id: 'msg-1', sender: 'Riya Sharma', content: 'AC not working since yesterday, please fix urgently', timestamp: '2026-05-24T09:30:00', isStaff: false },
      { id: 'msg-2', sender: 'Support Team', content: 'We have escalated this to our maintenance team. They will visit today.', timestamp: '2026-05-24T10:00:00', isStaff: true },
      { id: 'msg-3', sender: 'Support Team', content: 'Technician is on site, should be resolved within 2 hours.', timestamp: '2026-05-25T10:15:00', isStaff: true },
    ],
  },
  {
    id: 'ticket-2',
    subject: 'WiFi connectivity issues',
    description: 'Experiencing frequent WiFi drops in Meeting Room 3. Affecting our client calls.',
    memberId: 'm4',
    memberName: 'Arjun Mehta',
    company: 'CloudNine Tech',
    centerId: 'center-2',
    category: 'IT Support' as const,
    priority: 'critical' as const,
    status: 'open' as const,
    createdAt: '2026-05-25T08:00:00',
    updatedAt: '2026-05-25T08:00:00',
    assignedTo: 'IT Team',
    messages: [
      { id: 'msg-1', sender: 'Arjun Mehta', content: 'WiFi keeps dropping every 10-15 minutes in Meeting Room 3', timestamp: '2026-05-25T08:00:00', isStaff: false },
    ],
  },
  {
    id: 'ticket-3',
    subject: 'Request for additional parking pass',
    description: 'We have a new team member joining next week and need an additional parking pass.',
    memberId: 'm6',
    memberName: 'Karthik Iyer',
    company: 'DataStream Analytics',
    centerId: 'center-1',
    category: 'Access' as const,
    priority: 'low' as const,
    status: 'resolved' as const,
    createdAt: '2026-05-22T14:00:00',
    updatedAt: '2026-05-23T11:30:00',
    assignedTo: 'Admin Team',
    messages: [
      { id: 'msg-1', sender: 'Karthik Iyer', content: 'Need additional parking pass for new team member', timestamp: '2026-05-22T14:00:00', isStaff: false },
      { id: 'msg-2', sender: 'Admin Team', content: 'Approved! Please collect the pass from reception.', timestamp: '2026-05-23T11:30:00', isStaff: true },
    ],
  },
  {
    id: 'ticket-4',
    subject: 'Printer not working',
    description: 'The printer on Floor 2 shows paper jam error but there is no paper stuck.',
    memberId: 'm8',
    memberName: 'Vikram Singh',
    company: 'LegalEase Solutions',
    centerId: 'center-3',
    category: 'IT Support' as const,
    priority: 'medium' as const,
    status: 'in-progress' as const,
    createdAt: '2026-05-25T07:45:00',
    updatedAt: '2026-05-25T09:00:00',
    assignedTo: 'IT Team',
    messages: [
      { id: 'msg-1', sender: 'Vikram Singh', content: 'Floor 2 printer showing paper jam but nothing stuck', timestamp: '2026-05-25T07:45:00', isStaff: false },
      { id: 'msg-2', sender: 'IT Team', content: 'We are sending someone to check. ETA 30 minutes.', timestamp: '2026-05-25T09:00:00', isStaff: true },
    ],
  },
  {
    id: 'ticket-5',
    subject: 'Meeting room booking issue',
    description: 'Unable to book Conference Room A for tomorrow. System shows error.',
    memberId: 'm12',
    memberName: 'Neha Gupta',
    company: 'FinanceFirst Advisory',
    centerId: 'center-3',
    category: 'Booking' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    createdAt: '2026-05-25T11:00:00',
    updatedAt: '2026-05-25T11:00:00',
    assignedTo: 'Support Team',
    messages: [
      { id: 'msg-1', sender: 'Neha Gupta', content: 'Cannot book Conference Room A, getting booking system error', timestamp: '2026-05-25T11:00:00', isStaff: false },
    ],
  },
]

// Team Messages Data
export const teamMessages = [
  {
    id: 'tm-1',
    channelId: 'general',
    senderId: 'staff-1',
    senderName: 'Amit Kumar',
    senderRole: 'Community Manager',
    senderAvatar: null,
    content: 'Good morning everyone! Quick reminder: we have a fire drill scheduled for 3 PM today. Please ensure all members are informed.',
    timestamp: '2026-05-25T09:00:00',
    reactions: [{ emoji: '👍', count: 5 }, { emoji: '✅', count: 3 }],
  },
  {
    id: 'tm-2',
    channelId: 'general',
    senderId: 'staff-2',
    senderName: 'Priya Nair',
    senderRole: 'Operations Lead',
    senderAvatar: null,
    content: 'Thanks Amit! I will make announcements on each floor.',
    timestamp: '2026-05-25T09:05:00',
    reactions: [],
  },
  {
    id: 'tm-3',
    channelId: 'hitec-city',
    senderId: 'staff-3',
    senderName: 'Rahul Verma',
    senderRole: 'Center Manager',
    senderAvatar: null,
    content: 'The new coffee machine has arrived! It is being installed in the cafeteria. Should be ready by noon.',
    timestamp: '2026-05-25T08:30:00',
    reactions: [{ emoji: '☕', count: 8 }, { emoji: '🎉', count: 4 }],
  },
  {
    id: 'tm-4',
    channelId: 'hitec-city',
    senderId: 'staff-4',
    senderName: 'Meera Reddy',
    senderRole: 'Front Desk',
    senderAvatar: null,
    content: 'Fantastic! Members have been asking about this for weeks.',
    timestamp: '2026-05-25T08:35:00',
    reactions: [],
  },
  {
    id: 'tm-5',
    channelId: 'finance-alerts',
    senderId: 'staff-5',
    senderName: 'Suresh Patel',
    senderRole: 'Finance Manager',
    senderAvatar: null,
    content: '@channel Invoice batch #2026-05-B has been processed. 45 invoices sent out totaling ₹32,50,000.',
    timestamp: '2026-05-25T10:00:00',
    reactions: [{ emoji: '✅', count: 2 }],
  },
  {
    id: 'tm-6',
    channelId: 'maintenance',
    senderId: 'staff-6',
    senderName: 'Vijay Kumar',
    senderRole: 'Maintenance Lead',
    senderAvatar: null,
    content: 'AC issue in Zone B has been resolved. Compressor was faulty - replaced with new unit.',
    timestamp: '2026-05-25T11:30:00',
    reactions: [{ emoji: '👏', count: 3 }],
  },
  {
    id: 'tm-7',
    channelId: 'general',
    senderId: 'staff-1',
    senderName: 'Amit Kumar',
    senderRole: 'Community Manager',
    senderAvatar: null,
    content: 'Reminder: Monthly town hall meeting tomorrow at 4 PM in the event space. All staff please attend.',
    timestamp: '2026-05-25T11:00:00',
    reactions: [{ emoji: '📅', count: 6 }],
  },
  {
    id: 'tm-8',
    channelId: 'bangalore',
    senderId: 'staff-7',
    senderName: 'Anita Sharma',
    senderRole: 'Center Manager',
    senderAvatar: null,
    content: 'We have 3 new members joining tomorrow. Please ensure their workstations are ready and access cards are prepared.',
    timestamp: '2026-05-25T09:45:00',
    reactions: [{ emoji: '👍', count: 2 }],
  },
]
