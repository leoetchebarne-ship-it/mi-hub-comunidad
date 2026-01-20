"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface TimelineProps {
  selectedWeek: number
  onWeekChange: (week: number) => void
  isSheet?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function Timeline({ selectedWeek, onWeekChange, isSheet = false, isOpen = false, onClose }: TimelineProps) {
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1)

  if (isSheet) {
    return (
      <>
        {/* Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />}

        {/* Sheet */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 rounded-t-2xl z-50 md:hidden transform transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <h3 className="text-xs tracking-[0.2em] text-white/70">SELECCIONAR SEMANA</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Week grid */}
          <div className="px-4 pb-8 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {weeks.map((week) => (
                <button
                  key={week}
                  onClick={() => onWeekChange(week)}
                  className={cn(
                    "h-12 text-sm tracking-wider border rounded-lg transition-all duration-200",
                    selectedWeek === week
                      ? "bg-electric-blue/20 border-electric-blue/50 text-electric-blue"
                      : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70",
                  )}
                >
                  S{week}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar mode
  return (
    <div className="w-56 px-4 py-6">
      <h3 className="text-xs tracking-[0.2em] text-white/50 mb-6">TIMELINE</h3>

      <div className="grid grid-cols-2 gap-2">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => onWeekChange(week)}
            className={cn(
              "h-9 text-xs tracking-wider border rounded transition-all duration-200",
              selectedWeek === week
                ? "bg-white/10 border-white/30 text-white"
                : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60",
            )}
          >
            S{week}
          </button>
        ))}
      </div>
    </div>
  )
}
