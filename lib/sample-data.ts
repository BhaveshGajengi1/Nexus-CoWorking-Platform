// Sample data constants for fallback when Supabase returns empty results

export const SAMPLE_MEMBERS = [
  { id: 's1', name: 'Arjun Mehta', company: 'TechVenture Labs', email: 'arjun@techventure.in', phone: '9876543210', plan: 'Private Cabin', center_id: 'c1', seat_number: 'C-01', start_date: '2026-01-15', expiry_date: '2026-06-15', status: 'active' },
  { id: 's2', name: 'Priya Sharma', company: 'DesignStudio Co', email: 'priya@designstudio.in', phone: '9876543211', plan: 'Dedicated Desk', center_id: 'c1', seat_number: 'D-04', start_date: '2026-02-01', expiry_date: '2026-06-10', status: 'active' },
  { id: 's3', name: 'Rohit Nair', company: 'GrowthHack Inc', email: 'rohit@growthhack.in', phone: '9876543212', plan: 'Hotdesk', center_id: 'c2', seat_number: 'H-12', start_date: '2026-03-01', expiry_date: '2026-06-05', status: 'active' },
  { id: 's4', name: 'Sneha Patel', company: 'CloudMinds Pvt Ltd', email: 'sneha@cloudminds.in', phone: '9876543213', plan: 'Private Cabin', center_id: 'c2', seat_number: 'C-03', start_date: '2026-01-10', expiry_date: '2026-07-10', status: 'active' },
  { id: 's5', name: 'Karan Singh', company: 'StartupNest', email: 'karan@startupnest.in', phone: '9876543214', plan: 'Dedicated Desk', center_id: 'c3', seat_number: 'D-07', start_date: '2026-02-15', expiry_date: '2026-06-02', status: 'active' },
  { id: 's6', name: 'Ananya Reddy', company: 'InnovateTech', email: 'ananya@innovatetech.in', phone: '9876543215', plan: 'Hotdesk', center_id: 'c1', seat_number: 'H-03', start_date: '2026-03-10', expiry_date: '2026-07-20', status: 'active' },
  { id: 's7', name: 'Vikram Joshi', company: 'DataPulse Analytics', email: 'vikram@datapulse.in', phone: '9876543216', plan: 'Private Cabin', center_id: 'c3', seat_number: 'C-05', start_date: '2026-01-20', expiry_date: '2026-08-20', status: 'active' },
  { id: 's8', name: 'Meera Iyer', company: 'BrandCraft Agency', email: 'meera@brandcraft.in', phone: '9876543217', plan: 'Dedicated Desk', center_id: 'c2', seat_number: 'D-09', start_date: '2026-04-01', expiry_date: '2026-09-01', status: 'active' },
  { id: 's9', name: 'Aditya Kumar', company: 'FinFlow Solutions', email: 'aditya@finflow.in', phone: '9876543218', plan: 'Hotdesk', center_id: 'c1', seat_number: 'H-07', start_date: '2026-02-20', expiry_date: '2026-06-20', status: 'active' },
  { id: 's10', name: 'Divya Krishnan', company: 'EduSpark Technologies', email: 'divya@eduspark.in', phone: '9876543219', plan: 'Private Cabin', center_id: 'c3', seat_number: 'C-02', start_date: '2026-03-05', expiry_date: '2026-07-05', status: 'active' },
  { id: 's11', name: 'Nikhil Desai', company: 'PixelForge Creative', email: 'nikhil@pixelforge.in', phone: '9876543220', plan: 'Dedicated Desk', center_id: 'c1', seat_number: 'D-11', start_date: '2026-01-25', expiry_date: '2026-05-31', status: 'active' },
  { id: 's12', name: 'Pooja Agarwal', company: 'LegalEdge Consultants', email: 'pooja@legaledge.in', phone: '9876543221', plan: 'Private Cabin', center_id: 'c2', seat_number: 'C-04', start_date: '2026-04-10', expiry_date: '2026-10-10', status: 'active' }
]

export const SAMPLE_VISITORS = [
  { id: 'v1', name: 'Rahul Gupta', company: 'Infosys', phone: '9800001111', host_member: 'Arjun Mehta', purpose: 'Meeting', center_id: 'c1', check_in: new Date(Date.now() - 3600000).toISOString(), check_out: null, status: 'checked_in' },
  { id: 'v2', name: 'Sanya Malhotra', company: 'Wipro', phone: '9800002222', host_member: 'Priya Sharma', purpose: 'Interview', center_id: 'c1', check_in: new Date(Date.now() - 7200000).toISOString(), check_out: new Date(Date.now() - 3000000).toISOString(), status: 'checked_out' },
  { id: 'v3', name: 'Deepak Verma', company: 'TCS', phone: '9800003333', host_member: 'Sneha Patel', purpose: 'Tour', center_id: 'c2', check_in: new Date(Date.now() - 1800000).toISOString(), check_out: null, status: 'checked_in' },
  { id: 'v4', name: 'Kritika Bose', company: 'Freelancer', phone: '9800004444', host_member: 'Vikram Joshi', purpose: 'Meeting', center_id: 'c3', check_in: new Date(Date.now() - 5400000).toISOString(), check_out: new Date(Date.now() - 1800000).toISOString(), status: 'checked_out' },
  { id: 'v5', name: 'Manish Tiwari', company: 'Accenture', phone: '9800005555', host_member: 'Karan Singh', purpose: 'Delivery', center_id: 'c3', check_in: new Date(Date.now() - 900000).toISOString(), check_out: null, status: 'checked_in' },
  { id: 'v6', name: 'Nisha Kapoor', company: 'HCL Technologies', phone: '9800006666', host_member: 'Ananya Reddy', purpose: 'Meeting', center_id: 'c1', check_in: new Date(Date.now() - 10800000).toISOString(), check_out: new Date(Date.now() - 7200000).toISOString(), status: 'checked_out' }
]

export const SAMPLE_BOOKINGS = [
  { id: 'b1', room_name: 'Boardroom', member_name: 'Arjun Mehta', center_id: 'c1', booking_date: new Date().toISOString().split('T')[0], start_time: '09:00', end_time: '11:00', booking_type: 'Client Meeting', notes: 'Investor pitch' },
  { id: 'b2', room_name: 'Focus Pod', member_name: 'Priya Sharma', center_id: 'c1', booking_date: new Date().toISOString().split('T')[0], start_time: '11:00', end_time: '12:00', booking_type: 'Internal', notes: 'Deep work session' },
  { id: 'b3', room_name: 'Training Hall', member_name: 'Sneha Patel', center_id: 'c2', booking_date: new Date().toISOString().split('T')[0], start_time: '14:00', end_time: '17:00', booking_type: 'Event', notes: 'Product launch workshop' },
  { id: 'b4', room_name: 'Podcast Studio', member_name: 'Vikram Joshi', center_id: 'c3', booking_date: new Date().toISOString().split('T')[0], start_time: '10:00', end_time: '12:00', booking_type: 'Internal', notes: 'Podcast recording' },
  { id: 'b5', room_name: 'Boardroom', member_name: 'Karan Singh', center_id: 'c3', booking_date: new Date().toISOString().split('T')[0], start_time: '15:00', end_time: '16:00', booking_type: 'Client Meeting', notes: 'Client onboarding' },
  { id: 'b6', room_name: 'Focus Pod', member_name: 'Divya Krishnan', center_id: 'c2', booking_date: new Date().toISOString().split('T')[0], start_time: '13:00', end_time: '14:00', booking_type: 'Internal', notes: '1:1 review' }
]

export const SAMPLE_INVOICES = [
  { id: 'i1', invoice_number: 'INV-1001', member_name: 'Arjun Mehta', center_id: 'c1', amount: 25000, gst: 4500, total: 29500, due_date: '2026-06-15', status: 'paid', created_at: '2026-05-01T10:00:00Z' },
  { id: 'i2', invoice_number: 'INV-1002', member_name: 'Priya Sharma', center_id: 'c1', amount: 15000, gst: 2700, total: 17700, due_date: '2026-06-10', status: 'pending', created_at: '2026-05-03T10:00:00Z' },
  { id: 'i3', invoice_number: 'INV-1003', member_name: 'Sneha Patel', center_id: 'c2', amount: 25000, gst: 4500, total: 29500, due_date: '2026-05-20', status: 'overdue', created_at: '2026-04-20T10:00:00Z' },
  { id: 'i4', invoice_number: 'INV-1004', member_name: 'Karan Singh', center_id: 'c3', amount: 15000, gst: 2700, total: 17700, due_date: '2026-06-02', status: 'pending', created_at: '2026-05-05T10:00:00Z' },
  { id: 'i5', invoice_number: 'INV-1005', member_name: 'Vikram Joshi', center_id: 'c3', amount: 25000, gst: 4500, total: 29500, due_date: '2026-06-20', status: 'paid', created_at: '2026-05-10T10:00:00Z' },
  { id: 'i6', invoice_number: 'INV-1006', member_name: 'Meera Iyer', center_id: 'c2', amount: 15000, gst: 2700, total: 17700, due_date: '2026-07-01', status: 'paid', created_at: '2026-05-12T10:00:00Z' },
  { id: 'i7', invoice_number: 'INV-1007', member_name: 'Rohit Nair', center_id: 'c2', amount: 8000, gst: 1440, total: 9440, due_date: '2026-05-25', status: 'overdue', created_at: '2026-04-25T10:00:00Z' },
  { id: 'i8', invoice_number: 'INV-1008', member_name: 'Divya Krishnan', center_id: 'c3', amount: 25000, gst: 4500, total: 29500, due_date: '2026-07-05', status: 'paid', created_at: '2026-05-15T10:00:00Z' }
]

export const SAMPLE_TICKETS = [
  { id: 't1', title: 'AC not working in Cabin C-01', description: 'The air conditioning in cabin C-01 has stopped working since morning.', raised_by: 'Arjun Mehta', center_id: 'c1', category: 'Maintenance', priority: 'P2', status: 'open', assigned_to: 'Facilities Team', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 't2', title: 'WiFi dropping in Training Hall', description: 'Internet connectivity is unstable during peak hours in the training hall.', raised_by: 'Sneha Patel', center_id: 'c2', category: 'IT', priority: 'P1', status: 'in_progress', assigned_to: 'IT Support', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 't3', title: 'Projector remote missing', description: 'The boardroom projector remote is missing since last evening.', raised_by: 'Karan Singh', center_id: 'c3', category: 'Admin', priority: 'P3', status: 'open', assigned_to: 'Community Lead', created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 't4', title: 'Invoice amount incorrect', description: 'My invoice INV-1002 shows wrong amount. Please correct.', raised_by: 'Priya Sharma', center_id: 'c1', category: 'Admin', priority: 'P2', status: 'open', assigned_to: 'Finance Team', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 't5', title: 'Coffee machine not working', description: 'The coffee machine on floor 2 is out of order.', raised_by: 'Ananya Reddy', center_id: 'c1', category: 'Maintenance', priority: 'P4', status: 'resolved', assigned_to: 'Facilities Team', created_at: new Date(Date.now() - 172800000).toISOString(), resolved_at: new Date(Date.now() - 86400000).toISOString() }
]

export const SAMPLE_LEADS = [
  { id: 'l1', company: 'NexGen Robotics', contact_name: 'Suresh Babu', email: 'suresh@nexgenrobotics.in', phone: '9900001111', space_type: 'Private Cabin', estimated_value: 35000, stage: 'Negotiation', assigned_to: 'Rahul Mehta', center_id: 'c1', notes: 'Looking for 3 cabins, team of 8', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'l2', company: 'GreenBuild Ventures', contact_name: 'Kavya Nair', email: 'kavya@greenbuild.in', phone: '9900002222', space_type: 'Dedicated Desk', estimated_value: 18000, stage: 'Proposal Sent', assigned_to: 'Priya Sharma', center_id: 'c2', notes: 'Startup team of 4, budget conscious', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'l3', company: 'HealthFirst AI', contact_name: 'Dr. Arun Pillai', email: 'arun@healthfirstai.in', phone: '9900003333', space_type: 'Private Cabin', estimated_value: 50000, stage: 'Site Visit Scheduled', assigned_to: 'Vikram Singh', center_id: 'c3', notes: 'Healthcare AI firm, needs quiet space', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'l4', company: 'MediaBlast Studio', contact_name: 'Ritu Aggarwal', email: 'ritu@mediablast.in', phone: '9900004444', space_type: 'Hotdesk', estimated_value: 12000, stage: 'Lead', assigned_to: 'Anjali Patel', center_id: 'c1', notes: 'Content team, needs flexible hours', created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'l5', company: 'TradeEdge Fintech', contact_name: 'Siddharth Rao', email: 'sid@tradeedge.in', phone: '9900005555', space_type: 'Private Cabin', estimated_value: 45000, stage: 'Agreement Signed', assigned_to: 'Rahul Mehta', center_id: 'c2', notes: 'Fintech startup, 6 person team, moving in June', created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'l6', company: 'LogiTrack Systems', contact_name: 'Farhan Sheikh', email: 'farhan@logitrack.in', phone: '9900006666', space_type: 'Dedicated Desk', estimated_value: 22000, stage: 'Negotiation', assigned_to: 'Priya Sharma', center_id: 'c3', notes: 'Logistics tech team, needs 24/7 access', created_at: new Date(Date.now() - 8 * 86400000).toISOString() }
]

export const SAMPLE_CENTERS = [
  { id: 'c1', name: 'NEXUS HITEC City', city: 'Hyderabad', total_seats: 120 },
  { id: 'c2', name: 'NEXUS Indiranagar', city: 'Bangalore', total_seats: 85 },
  { id: 'c3', name: 'NEXUS BKC', city: 'Mumbai', total_seats: 100 }
]

export const SAMPLE_NOTIFICATIONS = [
  { id: 'n1', title: 'New Visitor Checked In', message: 'Rahul Gupta checked in at NEXUS HITEC City', type: 'info', is_read: false, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 'n2', title: 'High Priority Ticket', message: 'P1: WiFi dropping in Training Hall — Bangalore', type: 'error', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', title: 'Invoice Overdue', message: 'INV-1003 overdue by 10 days — 29,500 pending from Sneha Patel', type: 'warning', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n4', title: 'Deal Closed!', message: 'TradeEdge Fintech signed agreement at NEXUS Indiranagar', type: 'success', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n5', title: 'Renewal Alert', message: 'Karan Singh\'s membership expires in 3 days', type: 'warning', is_read: false, created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 'n6', title: 'Room Booked', message: 'Training Hall booked by Sneha Patel for Product Launch Workshop', type: 'info', is_read: true, created_at: new Date(Date.now() - 10800000).toISOString() }
]
