"use client"

import { useState } from "react"
import { invoices, financialMetrics, members } from "@/lib/nexus-data"
import { Search, Filter, Download, Plus, TrendingUp, TrendingDown, DollarSign, Receipt, CreditCard, ArrowUpRight, ArrowDownRight, MoreVertical, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Helper to get member details from memberId
const getMemberDetails = (memberId: string) => {
  const member = members.find(m => m.id === memberId)
  return member ? { name: member.name, company: member.company } : { name: 'Unknown', company: 'Unknown' }
}

export function Finance() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month")
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "Paid" | "Pending" | "Overdue">("all")

  const filteredInvoices = invoices.filter(inv => {
    if (invoiceFilter === "all") return true
    return inv.status === invoiceFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-emerald-500/20 text-emerald-400"
      case "Pending": return "bg-amber-500/20 text-amber-400"
      case "Overdue": return "bg-red-500/20 text-red-400"
      default: return "bg-zinc-500/20 text-zinc-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return <CheckCircle2 className="h-3 w-3" />
      case "Pending": return <Clock className="h-3 w-3" />
      case "Overdue": return <AlertCircle className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Finance & Invoicing</h2>
          <p className="text-zinc-400 text-sm">Revenue tracking and invoice management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {(["week", "month", "quarter", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${period === p ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:text-white"}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-all hover:scale-105">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: financialMetrics.monthlyRevenue, change: "+12.5%", trend: "up", icon: DollarSign, color: "emerald" },
          { label: "Outstanding", value: financialMetrics.outstanding, change: "-8.2%", trend: "down", icon: Receipt, color: "amber" },
          { label: "Collected MTD", value: financialMetrics.collectedMTD, change: "+23.1%", trend: "up", icon: CreditCard, color: "cyan" },
          { label: "Avg. Days to Pay", value: financialMetrics.avgDaysToPay, change: "-2 days", trend: "down", icon: Clock, color: "purple" },
        ].map((metric, i) => (
          <div
            key={metric.label}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 transition-all group"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${metric.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" : metric.color === "amber" ? "bg-amber-500/10 text-amber-400" : metric.color === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${metric.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{metric.value}</p>
            <p className="text-zinc-400 text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-white">Revenue Overview</h3>
              <p className="text-xs text-zinc-500 mt-1">Monthly revenue breakdown</p>
            </div>
            <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Download className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialMetrics.revenueHistory}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                  itemStyle={{ color: "#06b6d4" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">Revenue by Plan</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialMetrics.revenueByPlan} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis type="category" dataKey="plan" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
            {financialMetrics.revenueByPlan.map((plan) => (
              <div key={plan.plan} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{plan.plan}</span>
                <span className="text-white font-medium">{plan.members} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Recent Invoices</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 w-64"
                />
              </div>
              <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
                {(["all", "Paid", "Pending", "Overdue"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setInvoiceFilter(f)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${invoiceFilter === f ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:text-white"}`}
                  >
                    {f === "all" ? "All" : f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50">
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Invoice</th>
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Member</th>
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Amount</th>
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Date</th>
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Due Date</th>
                <th className="text-left text-xs font-medium text-zinc-500 p-4">Status</th>
                <th className="text-right text-xs font-medium text-zinc-500 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, i) => {
                const memberDetails = getMemberDetails(invoice.memberId)
                return (
                <tr 
                  key={invoice.id} 
                  className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="p-4">
                    <span className="text-sm text-cyan-400 font-mono">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {memberDetails.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm text-white">{memberDetails.name}</p>
                        <p className="text-xs text-zinc-500">{memberDetails.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-white font-medium">₹{invoice.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-400">{invoice.paidDate || '-'}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-400">{invoice.dueDate}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === "Pending" && (
                        <button className="p-1.5 hover:bg-cyan-500/20 rounded-lg transition-colors group">
                          <Send className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-zinc-700/50 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-700/50 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Showing {filteredInvoices.length} of {invoices.length} invoices</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-zinc-800/50 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">Previous</button>
            <button className="px-3 py-1.5 bg-zinc-800/50 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
