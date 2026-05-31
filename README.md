# NEXUS — Coworking CRM + ERP Platform

![NEXUS Banner](https://img.shields.io/badge/NEXUS-Coworking%20Command%20Center-00D4FF?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Supabase-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

> **A unified, real-time, multi-center Coworking CRM + ERP platform built for the modern coworking operator.**
> Manage visitors, bookings, members, finances, renewals, support tickets, and team operations — all from one powerful obsidian command center.

---

## 🚀 Live Demo

🔗 **https://nexus-coworking.vercel.app/**

> **Login Credentials**
> - Email: `admin@nexus.com`
> - Password: `Nexus@2024`

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Modules](#-modules)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Evaluation Criteria Mapping](#-evaluation-criteria-mapping)
- [Team](#-team)

---

## 🎯 Problem Statement

Coworking spaces managing multiple branches struggle with **fragmented operations** across:

- Visitor handling & check-ins
- Conference room bookings
- Client onboarding & renewals
- Financial tracking & invoicing
- Internal team communication
- Support ticket management

Most operators rely on **spreadsheets, WhatsApp, separate booking tools, and manual tracking** — leading to:

| Pain Point | Impact |
|---|---|
| Manual visitor logs | Security risks + missed data |
| No renewal tracking | Revenue leakage |
| Fragmented bookings | Double bookings + conflicts |
| Separate finance tools | Inaccurate MRR tracking |
| No unified dashboard | Poor occupancy visibility |
| WhatsApp-based comms | Lost context + no accountability |

---

## 💡 Solution

**NEXUS** is a centralized, multi-center Coworking CRM + ERP platform that brings every operational function under one roof with:

- ⚡ **Real-time data** across all modules via Supabase Realtime
- 🏢 **Multi-center management** from a single dashboard
- 🔐 **Role-based access control** for operators, managers, and staff
- 📊 **Live analytics** for occupancy, revenue, and renewals
- 🤖 **AI-powered assistant** for operational queries
- 🔔 **Smart notifications** for critical events
- 📱 **Mobile-first responsive** design

---

## ✨ Features

### Core Modules
| Module | Description |
|---|---|
| 🗺️ Command Dashboard | Multi-center KPI overview, live activity feed, charts |
| 👥 Visitor Management | Walk-in logging, check-in/check-out tracking |
| 📅 Room Booking Engine | Visual timeline grid, conflict detection, quick booking |
| 🪑 Floor & Seat Map | Visual floor plan with real-time occupancy status |
| 🚀 Onboarding Pipeline | Kanban-style lead-to-member conversion workflow |
| 💰 Finance & Billing | Invoice generation, GST calculation, revenue tracking |
| 🔔 Renewals Radar | Expiry visualization, churn prediction, renewal tracking |
| 🎫 Support Tickets | SLA tracking, priority management, resolution workflow |
| 💬 Team Chat | Internal channels, direct messaging |
| 👤 Team Management | Role permissions matrix, invite system |
| 📊 Analytics | Productivity, attendance, revenue, occupancy insights |
| 📺 BI Dashboard | Full-screen live presentation mode for operators |

### AI & Smart Features
- ✅ **NEXUS AI Chatbot** — powered by Claude (Anthropic API)
- ✅ **Smart Lead Scoring** — algorithmic scoring 0-100 per lead
- ✅ **Churn Prediction** — automated renewal risk assessment
- ✅ **Smart Alerts Engine** — proactive operational alerts
- ✅ **Revenue Leakage Detector** — identifies missed billing

### Platform Features
- ✅ Supabase Authentication (email/password)
- ✅ Real-time data sync across all modules
- ✅ Global search (Cmd+K)
- ✅ Smart notification system with unread badge
- ✅ Quick-add drawer for all entity types
- ✅ Sidebar alert badges for critical counts
- ✅ Mobile bottom navigation bar
- ✅ Responsive layout for all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualizations |
| **Lucide React** | Icon system |
| **shadcn/ui** | UI component library |

### Backend & Database
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database + Auth + Realtime |
| **Supabase Auth** | Email/password authentication |
| **Supabase Realtime** | Live data subscriptions |
| **Row Level Security** | Table-level access control |

### AI
| Technology | Purpose |
|---|---|
| **Anthropic Claude API** | AI chatbot assistant |

### Deployment
| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting + CI/CD |
| **Supabase Cloud** | Managed PostgreSQL |

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────┐
│                     NEXUS Frontend                      │
│                  (Next.js + Tailwind)                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐   │
│  │Dashboard │  │ Visitors │  │Bookings  │  │Finance │   │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐   │
│  │Pipeline  │  │Renewals  │  │ Tickets  │  │   AI   │   │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘   │
└────────────────────────┬────────────────────────────────┘
│
┌──────────▼──────────┐
│   Supabase Backend   │
│  PostgreSQL + Auth   │
│  + Realtime + RLS    │
└─────────────────────┘

---

## 🗄️ Database Schema

```sql
centers        — id, name, city, total_seats
members        — id, name, company, email, phone, plan, center_id,
                 seat_number, start_date, expiry_date, status
visitors       — id, name, company, phone, host_member, purpose,
                 center_id, check_in, check_out, status
bookings       — id, room_name, member_name, center_id, booking_date,
                 start_time, end_time, booking_type, notes
invoices       — id, invoice_number, member_name, center_id,
                 amount, gst, total, due_date, status
tickets        — id, title, description, raised_by, center_id,
                 category, priority, status, assigned_to, resolved_at
leads          — id, company, contact_name, email, phone, space_type,
                 estimated_value, stage, assigned_to, center_id, notes
notifications  — id, title, message, type, is_read, user_id
```

---

## 📦 Modules

### 1. 🗺️ Multi-Center Command Dashboard
Real-time bird's-eye view of all operations across all centers.
- Live KPI cards: members, occupancy, revenue, tickets
- Center grid with per-branch live stats
- Live activity feed with Supabase Realtime
- 7-day occupancy trend + revenue charts

### 2. 👥 Smart Visitor Management
- Log walk-ins with host member association
- One-click check-out with timestamp
- Filter by center, status, date

### 3. 📅 Conference Room Booking Engine
- Visual timeline grid (rooms × time slots)
- Conflict detection before confirming
- Color-coded by booking type

### 4. 🪑 Floor & Seat Availability Map
- 3-floor visual layout with real-time seat status
- Reserve desks and meeting rooms directly
- Color coding: Green (available), Red (occupied), Amber (reserved)

### 5. 🚀 Client Onboarding Pipeline
- 6-stage Kanban: Lead → Site Visit → Proposal → Negotiation → Agreement → Active
- Smart lead scoring 0-100 with Hot/Warm/Cold labels
- Deal value tracking in ₹

### 6. 💰 Finance & Billing
- Invoice generation with 18% GST auto-calculation
- Mark as paid, send reminders
- Revenue charts by center

### 7. 🔔 Renewals & Expiry Radar
- Circular radar showing members by days to expiry
- Churn risk prediction per member
- One-click renewal with new expiry date

### 8. 🎫 Support Ticket Tracker
- SLA countdown: P1(4h) P2(8h) P3(24h) P4(72h)
- Status workflow: Open → In Progress → Resolved

### 9. 📊 Analytics Module
- Productivity scores per team member
- Attendance heatmaps from real visitor data
- Revenue trends + occupancy deep-dive

### 10. 📺 BI Dashboard
- Full-screen presentation mode
- Live occupancy gauge, visitor count, room status
- Auto-refreshing every 60 seconds

### 11. 🤖 NEXUS AI Assistant
- Powered by Anthropic Claude API
- Answers questions using live platform data
- Context-aware multi-turn conversations
- Auto-clears history on minimize/close

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Supabase account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/BhaveshGajengi1/Nexus-CoWorking-Platform.git
cd Nexus-CoWorking-Platform
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your Supabase credentials to `.env.local`

### 4. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

Login: `admin@nexus.com` / `Nexus@2024`

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📤 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add environment variables
4. Click **Deploy**

Auto-deploys on every push to `main` ✅

---

## 🏆 Evaluation Criteria Mapping

| Criteria | How NEXUS Addresses It |
|---|---|
| **Problem Understanding 20%** | Directly solves 6 core pain points — visitor chaos, booking conflicts, renewal leakage, fragmented finance, poor visibility, no comms tool |
| **Technical Execution 25%** | Next.js + Supabase (Auth + Realtime + RLS) + Anthropic AI + 8 live DB tables + real-time subscriptions |
| **Product Thinking 20%** | Smart alerts, churn prediction, lead scoring, SLA timers, onboarding checklists — all built for real operator workflows |
| **Innovation 15%** | Expiry Radar visualization, AI chatbot with live data context, BI Dashboard presentation mode, Revenue Leakage Detector |
| **Presentation 20%** | BI Dashboard full-screen mode built specifically for judge presentations + clean obsidian design language |

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] WhatsApp / SMS renewal reminders
- [ ] Payment gateway (Razorpay)
- [ ] Member self-service portal
- [ ] Advanced ML occupancy forecasting
- [ ] Multi-language support (Hindi, Telugu, Tamil)

---

## 👨‍💻 Team

Built with ❤️ 

| Name | Role |
|---|---|
| **Bhavesh Gajengi** | Full Stack Developer |

---

## 📄 License

MIT License

---

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) — open-source backend
- [Vercel](https://vercel.com) — seamless deployment
- [Anthropic](https://anthropic.com) — Claude AI API
- [Recharts](https://recharts.org) — data visualizations
- [Lucide](https://lucide.dev) — icon system
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling

---

<div align="center">
  <strong>NEXUS — Where Coworking Operations Come Together</strong><br/>
  Built & Developed
</div>
