'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { SAMPLE_MEMBERS, SAMPLE_VISITORS, SAMPLE_INVOICES, SAMPLE_BOOKINGS, SAMPLE_CENTERS } from '@/lib/sample-data'
import { supabase } from '@/lib/supabase'

interface StaffPerformance {
  name: string
  role: string
  center: string
  tasksCompleted: number
  tasksTotal: number
  ticketsResolved: number
  score: number
}

const STAFF_DATA: StaffPerformance[] = [
  { name: 'Priya Sharma', role: 'Community Lead', center: 'HITEC City', tasksCompleted: 24, tasksTotal: 30, ticketsResolved: 12, score: 88 },
  { name: 'Rahul Mehta', role: 'Center Manager', center: 'Bangalore', tasksCompleted: 18, tasksTotal: 25, ticketsResolved: 8, score: 72 },
  { name: 'Anjali Patel', role: 'Finance', center: 'Mumbai', tasksCompleted: 30, tasksTotal: 30, ticketsResolved: 3, score: 95 },
  { name: 'Vikram Singh', role: 'Support', center: 'HITEC City', tasksCompleted: 15, tasksTotal: 20, ticketsResolved: 19, score: 81 },
]

const ATTENDANCE_BY_DAY = [
  { day: 'Mon', visitors: 14 },
  { day: 'Tue', visitors: 22 },
  { day: 'Wed', visitors: 31 },
  { day: 'Thu', visitors: 28 },
  { day: 'Fri', visitors: 35 },
  { day: 'Sat', visitors: 12 },
  { day: 'Sun', visitors: 5 }
]

const CHECKIN_BY_HOUR = [
  { hour: '8AM', count: 3 },
  { hour: '9AM', count: 8 },
  { hour: '10AM', count: 15 },
  { hour: '11AM', count: 22 },
  { hour: '12PM', count: 18 },
  { hour: '1PM', count: 14 },
  { hour: '2PM', count: 20 },
  { hour: '3PM', count: 25 },
  { hour: '4PM', count: 22 },
  { hour: '5PM', count: 18 },
  { hour: '6PM', count: 10 },
  { hour: '7PM', count: 6 },
  { hour: '8PM', count: 3 }
]

const DAILY_VISITORS_14_DAYS = [
  { day: '1', visitors: 18 },
  { day: '2', visitors: 22 },
  { day: '3', visitors: 25 },
  { day: '4', visitors: 19 },
  { day: '5', visitors: 30 },
  { day: '6', visitors: 28 },
  { day: '7', visitors: 12 },
  { day: '8', visitors: 24 },
  { day: '9', visitors: 26 },
  { day: '10', visitors: 31 },
  { day: '11', visitors: 28 },
  { day: '12', visitors: 35 },
  { day: '13', visitors: 22 },
  { day: '14', visitors: 29 }
]

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 185000 },
  { month: 'Feb', revenue: 210000 },
  { month: 'Mar', revenue: 245000 },
  { month: 'Apr', revenue: 228000 },
  { month: 'May', revenue: 267000 },
  { month: 'Jun', revenue: 290000 }
]

const REVENUE_BY_CENTER = [
  { center: 'HITEC City', revenue: 125000 },
  { center: 'Indiranagar', revenue: 98000 },
  { center: 'BKC', revenue: 112000 }
]

const INVOICE_STATUS = [
  { status: 'Paid', count: 18 },
  { status: 'Pending', count: 7 },
  { status: 'Overdue', count: 3 }
]

const BOOKINGS_BY_DAY = [
  { day: 'Mon', bookings: 8 },
  { day: 'Tue', bookings: 14 },
  { day: 'Wed', bookings: 18 },
  { day: 'Thu', bookings: 16 },
  { day: 'Fri', bookings: 22 },
  { day: 'Sat', bookings: 6 },
  { day: 'Sun', bookings: 2 }
]

const BOOKINGS_BY_ROOM = [
  { room: 'Boardroom', bookings: 28 },
  { room: 'Focus Pod', bookings: 45 },
  { room: 'Training Hall', bookings: 18 },
  { room: 'Podcast Studio', bookings: 12 }
]

const DAILY_BOOKINGS_14_DAYS = [
  { day: '1', bookings: 5 },
  { day: '2', bookings: 8 },
  { day: '3', bookings: 12 },
  { day: '4', bookings: 10 },
  { day: '5', bookings: 15 },
  { day: '6', bookings: 14 },
  { day: '7', bookings: 4 },
  { day: '8', bookings: 9 },
  { day: '9', bookings: 11 },
  { day: '10', bookings: 13 },
  { day: '11', bookings: 12 },
  { day: '12', bookings: 16 },
  { day: '13', bookings: 10 },
  { day: '14', bookings: 14 }
]

const COLORS = ['#00D4FF', '#7C3AED', '#00E676', '#FF6B6B', '#FFA500']

export function Analytics() {
  const [activeTab, setActiveTab] = useState('productivity')

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 bg-[#0A0A0F] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-[var(--font-syne)] mb-2">Analytics</h1>
            <p className="text-[#8888A0]">Real-time insights across all operations</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-[#111118] border border-[rgba(0,212,255,0.1)] p-1 mb-8">
              <TabsTrigger value="productivity" className="data-[state=active]:bg-[rgba(0,212,255,0.15)] data-[state=active]:text-[#00D4FF]">Productivity</TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:bg-[rgba(0,212,255,0.15)] data-[state=active]:text-[#00D4FF]">Attendance</TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-[rgba(0,212,255,0.15)] data-[state=active]:text-[#00D4FF]">Revenue</TabsTrigger>
              <TabsTrigger value="occupancy" className="data-[state=active]:bg-[rgba(0,212,255,0.15)] data-[state=active]:text-[#00D4FF]">Occupancy</TabsTrigger>
            </TabsList>

            {/* Productivity Tab */}
            <TabsContent value="productivity" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STAFF_DATA.map((staff, idx) => {
                  const rank = idx + 1
                  const medals = ['🥇', '🥈', '🥉', '']
                  
                  return (
                    <div key={staff.name} className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {medals[idx] && <span className="text-2xl">{medals[idx]}</span>}
                            <h3 className="text-lg font-semibold text-white">{staff.name}</h3>
                          </div>
                          <p className="text-xs text-[#8888A0] mt-1">{staff.role} • {staff.center}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#00D4FF]">{staff.score}</div>
                          <div className="text-xs text-[#8888A0]">Score</div>
                        </div>
                      </div>

                      {/* Radial Chart */}
                      <div className="mb-4 h-32 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            data={[{ name: 'Score', value: staff.score, fill: '#00D4FF' }]}
                            innerRadius="60%"
                            outerRadius="80%"
                          >
                            <RadialBar background dataKey="value" />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Tasks Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-[#8888A0]">Tasks Completed</span>
                          <span className="text-xs font-semibold text-white">{staff.tasksCompleted}/{staff.tasksTotal}</span>
                        </div>
                        <div className="w-full h-2 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00A8CC]"
                            style={{ width: `${(staff.tasksCompleted / staff.tasksTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Tickets */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8888A0]">Tickets Resolved:</span>
                        <span className="font-semibold text-white">{staff.ticketsResolved}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6">
              {/* Visitors by Day */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Visitors by Day of Week</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ATTENDANCE_BY_DAY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                    <XAxis dataKey="day" stroke="#8888A0" />
                    <YAxis stroke="#8888A0" />
                    <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                    <Bar dataKey="visitors" fill="#00D4FF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Check-in by Hour */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Check-in by Hour</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={CHECKIN_BY_HOUR}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                    <XAxis dataKey="hour" stroke="#8888A0" />
                    <YAxis stroke="#8888A0" />
                    <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                    <Bar dataKey="count" fill="#7C3AED" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Visitors Trend */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Visitors - Last 14 Days</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={DAILY_VISITORS_14_DAYS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                    <XAxis dataKey="day" stroke="#8888A0" />
                    <YAxis stroke="#8888A0" />
                    <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                    <Line type="monotone" dataKey="visitors" stroke="#00D4FF" strokeWidth={2} dot={{ fill: '#00D4FF', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-4">
                  <p className="text-xs text-[#8888A0] mb-1">Peak Day</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">Friday</p>
                </div>
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-4">
                  <p className="text-xs text-[#8888A0] mb-1">Peak Hour</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">3 PM</p>
                </div>
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-4">
                  <p className="text-xs text-[#8888A0] mb-1">This Month</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">368</p>
                </div>
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-4">
                  <p className="text-xs text-[#8888A0] mb-1">Avg Per Day</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">26</p>
                </div>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              {/* Monthly Revenue */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue - Last 6 Months</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MONTHLY_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                    <XAxis dataKey="month" stroke="#8888A0" />
                    <YAxis stroke="#8888A0" />
                    <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                    <Bar dataKey="revenue" fill="#00D4FF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue by Center */}
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue by Center</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={REVENUE_BY_CENTER}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ center, revenue }) => `${center}: ₹${revenue/1000}k`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {REVENUE_BY_CENTER.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Invoice Status */}
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Invoice Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={INVOICE_STATUS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                      <XAxis dataKey="status" stroke="#8888A0" />
                      <YAxis stroke="#8888A0" />
                      <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                      <Bar dataKey="count" fill="#7C3AED" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Collection Rate */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#8888A0] mb-1">Collection Rate</p>
                    <p className="text-4xl font-bold text-[#00E676]">88%</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#00E676]">↑ 5%</div>
                    <p className="text-xs text-[#8888A0]">vs last month</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Occupancy Tab */}
            <TabsContent value="occupancy" className="space-y-6">
              {/* Bookings by Day */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Bookings by Day of Week</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={BOOKINGS_BY_DAY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                    <XAxis dataKey="day" stroke="#8888A0" />
                    <YAxis stroke="#8888A0" />
                    <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                    <Bar dataKey="bookings" fill="#00D4FF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bookings by Room */}
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Bookings by Room Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={BOOKINGS_BY_ROOM}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                      <XAxis dataKey="room" stroke="#8888A0" />
                      <YAxis stroke="#8888A0" />
                      <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                      <Bar dataKey="bookings" fill="#7C3AED" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily Bookings Trend */}
                <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Daily Bookings - Last 14 Days</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={DAILY_BOOKINGS_14_DAYS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                      <XAxis dataKey="day" stroke="#8888A0" />
                      <YAxis stroke="#8888A0" />
                      <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(0,212,255,0.2)' }} />
                      <Line type="monotone" dataKey="bookings" stroke="#00D4FF" strokeWidth={2} dot={{ fill: '#00D4FF', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Occupancy by Center */}
              <div className="bg-[#111118] border border-[rgba(0,212,255,0.1)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Occupancy by Center</h3>
                <div className="space-y-4">
                  {[
                    { center: 'HITEC City', occupied: 68 },
                    { center: 'Indiranagar', occupied: 74 },
                    { center: 'BKC', occupied: 61 }
                  ].map(item => (
                    <div key={item.center}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white">{item.center}</span>
                        <span className="text-sm font-semibold text-[#00D4FF]">{item.occupied}%</span>
                      </div>
                      <div className="w-full h-3 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00A8CC]"
                          style={{ width: `${item.occupied}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
