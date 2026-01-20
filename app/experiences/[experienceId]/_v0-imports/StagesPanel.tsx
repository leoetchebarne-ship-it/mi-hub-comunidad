"use client"

import { cn } from "@/lib/utils"
import { X, Check } from "lucide-react"
import type { Stage } from "@/lib/types"

interface StagesPanelProps {
  currentStage: Stage
  onStageChange: (stage: Stage) => void
  isSheet?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const stages: { id: Stage; label: string }[] = [
  { id: "planificacion", label: "PLANIFICACIÓN" },
  { id: "diseno", label: "DISEÑO" },
  { id: "ejecucion", label: "EJECUCIÓN" },
  { id: "monitoreo", label: "MONITOREO" },
  { id: "ajuste", label: "AJUSTE" },
  { id: "cierre", label: "CIERRE" },
]

export function StagesPanel({
  currentStage,
  onStageChange,
  isSheet = false,
  isOpen = false,
  onClose,
}: StagesPanelProps) {
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
            <h3 className="text-xs tracking-[0.2em] text-white/70">SELECCIONAR ETAPA</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Stages list */}
          <div className="px-4 pb-8 pt-2 space-y-2">
            {stages.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onStageChange(id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                  currentStage === id
                    ? "bg-electric-blue/10 border-electric-blue/30 text-electric-blue"
                    : "border-white/10 text-white/50 hover:border-white/20",
                )}
              >
                <span className="text-sm tracking-wide">{label}</span>
                {currentStage === id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar mode
  return (
    <div className="w-56 px-4 py-6 flex flex-col items-end">
      <h3 className="text-xs tracking-[0.2em] text-white/50 mb-6">ETAPA ACTUAL</h3>

      <div className="flex flex-col gap-2 w-full">
        {stages.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onStageChange(id)}
            className={cn("flex items-center justify-end gap-3 py-2 px-3 text-right transition-all duration-200 group")}
          >
            <span
              className={cn(
                "text-xs tracking-[0.1em] transition-colors",
                currentStage === id ? "text-white" : "text-white/30 group-hover:text-white/50",
              )}
            >
              {label}
            </span>
            <div
              className={cn(
                "h-[1px] transition-all duration-300",
                currentStage === id
                  ? "w-24 bg-gradient-to-l from-electric-blue to-transparent"
                  : "w-16 bg-white/10 group-hover:w-20 group-hover:bg-white/20",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
