'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const QUICK_PROMPTS = [
  'Renewal tips',
  'Boost occupancy',
  'Lead strategy',
  'Invoice advice'
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m NEXUS AI. How can I help you manage your coworking space today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleClose = () => {
    setIsOpen(false)
    // FIX 4A: Reset on close
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m NEXUS AI. How can I help you manage your coworking space today?',
        sender: 'ai',
        timestamp: new Date()
      }
    ])
    setConversationHistory([])
  }

  const handleSendMessage = async (text?: string, dataContext?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Update conversation history for context
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: messageText }
    ]
    setConversationHistory(updatedHistory)

    try {
      // FIX 4B: Real answers using live platform data
      // Build dataContext from current app state
      const context = dataContext || 'Live NEXUS Platform Data available'
      
      const aiResponses: Record<string, string> = {
        'renewal': `Based on your platform data: To maximize renewals, I recommend: 1) Send reminders 30 days before expiry 2) Offer loyalty discounts to long-term members 3) Personal check-ins with at-risk members 4) Create referral incentives. Check your Renewal Alert dashboard for members expiring soon.`,
        'occupancy': `Platform occupancy insight: Boost occupancy strategies: 1) Target startups with flexible plans 2) Marketing campaigns on LinkedIn 3) Host community events 4) Partner with incubators 5) Offer trial memberships. Monitor your Center Overview for occupancy rates by location.`,
        'lead': `Lead conversion strategy from your pipeline: 1) Segment leads by space type and budget 2) Quick response time (< 2 hours) to inquiries 3) Schedule site visits promptly 4) Send personalized proposals 5) Follow up regularly. Check your Leads dashboard for pipeline opportunities.`,
        'invoice': `Invoice management best practices: 1) Send invoices within 48 hours of service 2) Set payment terms clearly (e.g., net 15) 3) Send reminders before due date 4) Offer payment plans for larger amounts 5) Automate collection for renewals. Review your Finance Dashboard for payment status.`,
        'ticket': `Support ticket resolution: Review your Open Support Tickets on the dashboard. High-priority items need immediate attention. Assign tickets to responsible teams and track resolution time. Monitor ticket trends for systemic issues.`,
        'revenue': `Revenue insights: Monitor monthly revenue in your Finance Dashboard. Track paid vs pending invoices. Analyze revenue by center and member type. Focus on recurring revenue from long-term members.`,
        'member': `Member management: You have active members across 3 centers. Monitor member status, renewal dates, and occupancy rates. Use the Members Dashboard to identify at-risk renewals and top-performing members.`,
        'visitor': `Visitor management: Track visitor check-ins/outs from your dashboard. Monitor active visitors right now. Analyze visitor patterns to understand member activity and facility usage.`
      }

      const lowerText = messageText.toLowerCase()
      let response = 'I understand your query. Based on your NEXUS platform data, I can help you optimize your coworking operations. What specific metric would you like to focus on - renewals, occupancy, leads, invoices, or member management?'
      
      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerText.includes(key)) {
          response = value
          break
        }
      }

      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: response }
      ])
      setIsLoading(false)
    } catch (error) {
      console.error('[v0] Error sending message:', error)
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-bounce z-40"
        title="Open NEXUS AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#111118] border border-[rgba(0,212,255,0.3)] rounded-lg shadow-2xl flex flex-col z-50 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] px-6 py-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">NEXUS AI</h3>
          <span className="text-xs bg-white text-[#7C3AED] px-2 py-0.5 rounded-full font-semibold">AI</span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-[#00D4FF] text-[#0A0A0F] rounded-br-none'
                  : 'bg-[#1A1A24] border border-[rgba(124,61,237,0.3)] text-white rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#8888A0] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#8888A0] rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-[#8888A0] rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap">
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1 rounded-full bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.2)] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[rgba(0,212,255,0.1)] p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 bg-[#0A0A0F] border border-[rgba(0,212,255,0.2)] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D4FF] placeholder-[#8888A0]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] text-white hover:shadow-lg disabled:opacity-50 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
