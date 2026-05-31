"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev.slice(-2), { id, type, title, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
      case "error":
        return <XCircle className="w-5 h-5 text-[#FF3D57]" />
      case "info":
        return <Info className="w-5 h-5 text-[#00D4FF]" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-[#F5A623]" />
    }
  }

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-l-[#00E676]"
      case "error":
        return "border-l-[#FF3D57]"
      case "info":
        return "border-l-[#00D4FF]"
      case "warning":
        return "border-l-[#F5A623]"
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative w-80 bg-[#1A1A24] border border-[rgba(255,255,255,0.1)] border-l-4 ${getBorderColor(toast.type)} rounded-lg shadow-lg animate-slide-in-right overflow-hidden`}
          >
            <div className="p-4 flex items-start gap-3">
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-[#8888A0] mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#555566] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.05)]">
              <div 
                className={`h-full ${toast.type === 'success' ? 'bg-[#00E676]' : toast.type === 'error' ? 'bg-[#FF3D57]' : toast.type === 'warning' ? 'bg-[#F5A623]' : 'bg-[#00D4FF]'} animate-progress`}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
