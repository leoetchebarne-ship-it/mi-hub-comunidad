"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Target, X, Check, Flag, AlertTriangle } from "lucide-react"
import type { Note, Stage, ActionBlockType } from "@/lib/types"

interface ActiveObjectivePanelProps {
  note: Note | null
  onClear: () => void
  isTimerRunning: boolean
}

const STAGES: Record<Stage, { label: string; color: string; bgColor: string }> = {
  planificacion: { label: "Planificación", color: "text-blue-400", bgColor: "bg-blue-500" },
  diseno: { label: "Diseño", color: "text-purple-400", bgColor: "bg-purple-500" },
  ejecucion: { label: "Ejecución", color: "text-green-400", bgColor: "bg-green-500" },
  monitoreo: { label: "Monitoreo", color: "text-yellow-400", bgColor: "bg-yellow-500" },
  ajuste: { label: "Ajuste", color: "text-orange-400", bgColor: "bg-orange-500" },
  cierre: { label: "Cierre", color: "text-red-400", bgColor: "bg-red-500" },
}

const ACTION_ICONS: Record<ActionBlockType, typeof Check> = {
  task: Check,
  milestone: Flag,
  issue: AlertTriangle,
}

export function ActiveObjectivePanel({ note, onClear, isTimerRunning }: ActiveObjectivePanelProps) {
  const pendingTasks = useMemo(() => {
    if (!note) return []

    // CORRECCIÓN: Añadido || [] para evitar error de undefined
    const tasks = (note.actionBlocks || [])
      .filter((b) => b.type === "task" && !b.completed)
      .slice(0, 2)

    if (tasks.length < 2 && note.checklist) {
      const legacyPending = note.checklist
        .filter((t) => !t.completed)
        .slice(0, 2 - tasks.length)
        .map((t, i) => ({
          id: `legacy-${i}`,
          type: "task" as ActionBlockType,
          content: t.text,
          completed: false,
        }))
      return [...tasks, ...legacyPending]
    }

    return tasks
  }, [note])

  if (!note) {
    return (
      <div className="w-full px-4 mt-2">
        <div className="max-w-xs mx-auto">
          <div className="flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 rounded-lg">
            <Target size={14} className="text-white/30" />
            <span className="text-[10px] tracking-wider text-white/30">
              DOBLE CLIC EN UNA NOTA PARA FIJARLA
            </span>
          </div>
        </div>
      </div>
    )
  }

  const stageInfo = STAGES[note.stage]

  return (
    <div className="w-full px-4 mt-2">
      <div className="max-w-sm mx-auto">
        <div
          className={cn(
            "relative p-4 rounded-lg border transition-all",
            isTimerRunning
              ? "border-electric-blue/50 bg-electric-blue/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              : "border-electric-blue/30 bg-electric-blue/5",
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isTimerRunning ? "bg-electric-blue/30" : "bg-electric-blue/20",
                )}
              >
                <Target size={16} className="text-electric-blue" />
              </div>
              <div>
                <span className="text-[9px] tracking-[0.15em] text-electric-blue/70 block">OBJETIVO ACTIVO</span>
                <span className={cn("text-[10px]", stageInfo.color)}>{stageInfo.label}</span>
              </div>
            </div>
            {!isTimerRunning && (
              <button
                onClick={onClear}
                className="p-1 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <h4 className="text-sm text-white font-medium mb-3 line-clamp-2">{note.title}</h4>

          <div className="flex items-center gap-2 mb-3">
            <div className={cn("w-1.5 h-1.5 rounded-full", stageInfo.bgColor)} />
            <span className="text-[10px] text-white/50">
              {note.week ? `Semana ${note.week}` : "Sin asignar"} • {stageInfo.label}
            </span>
          </div>

          {pendingTasks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] tracking-[0.1em] text-white/40 block">PRÓXIMOS PASOS</span>
              {pendingTasks.map((task) => {
                const Icon = ACTION_ICONS[task.type]
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-black/30 border border-white/5"
                  >
                    <div className="w-4 h-4 rounded border border-electric-blue/50 flex items-center justify-center">
                      <Icon size={10} className="text-electric-blue/70" />
                    </div>
                    <span className="text-xs text-white/70 flex-1 truncate">{task.content}</span>
                  </div>
                )
              })}
            </div>
          )}

          {isTimerRunning && (
            <div className="mt-3 pt-3 border-t border-electric-blue/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
                <span className="text-[10px] text-electric-blue">Sesión de enfoque en progreso...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
