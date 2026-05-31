"use client"

import { useEffect, useState, ReactNode } from "react"
import { X } from "lucide-react"

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`absolute right-0 top-0 h-full w-[420px] bg-[#111118] border-l border-[rgba(0,212,255,0.15)] shadow-2xl transition-transform duration-300 ease-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(0,212,255,0.15)]">
          <h2 className="text-lg font-semibold text-white font-[var(--font-syne)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#8888A0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content - flex container to handle scroll + sticky footer */}
        <div className="flex flex-col h-[calc(100%-72px)]">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Form Input Components
interface FormInputProps {
  label: string
  required?: boolean
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  readOnly?: boolean
  prefix?: string
}

export function FormInput({ label, required, type = "text", value, onChange, placeholder, error, readOnly, prefix }: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#00D4FF] ml-1">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888A0] text-sm">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full bg-[#1a1a24] border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] transition-colors ${prefix ? "pl-7" : ""} ${error ? "border-[#FF3D57] animate-shake" : "border-[rgba(255,255,255,0.1)]"} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  )
}

interface FormSelectProps {
  label: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; color?: string }[]
  error?: boolean
  placeholder?: string
}

export function FormSelect({ label, required, value, onChange, options, error, placeholder }: FormSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#00D4FF] ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#1a1a24] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4FF] transition-colors appearance-none cursor-pointer ${error ? "border-[#FF3D57] animate-shake" : "border-[rgba(255,255,255,0.1)]"}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238888A0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25em 1.25em" }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface FormTextareaProps {
  label: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  rows?: number
}

export function FormTextarea({ label, required, value, onChange, placeholder, error, rows = 4 }: FormTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#8888A0] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#00D4FF] ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-[#1a1a24] border rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#555566] focus:outline-none focus:border-[#00D4FF] transition-colors resize-none ${error ? "border-[#FF3D57] animate-shake" : "border-[rgba(255,255,255,0.1)]"}`}
      />
    </div>
  )
}

interface FormToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function FormToggle({ label, checked, onChange, description }: FormToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-white">{label}</label>
        {description && <p className="text-xs text-[#8888A0]">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#00D4FF]" : "bg-[#1a1a24] border border-[rgba(255,255,255,0.1)]"}`}
      >
        <span 
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  )
}

export function FormButtons({ onSubmit, onCancel, submitLabel = "Save", loading = false }: { onSubmit: () => void; onCancel: () => void; submitLabel?: string; loading?: boolean }) {
  return (
    <div className="flex gap-3 p-6 border-t border-[rgba(0,212,255,0.1)] bg-[#0D0D14]">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-lg bg-transparent border border-[rgba(255,255,255,0.1)] text-[#8888A0] font-medium text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 py-2.5 rounded-lg bg-[#00D4FF] text-[#0A0A0F] font-semibold text-sm hover:bg-[#00B8E6] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  )
}
