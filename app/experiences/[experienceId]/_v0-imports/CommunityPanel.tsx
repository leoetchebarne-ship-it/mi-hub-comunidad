"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import type { Stage, Note, Session } from "@/lib/types"

interface CommunityPanelProps {
  notes: Note[]
  sessions: Session[]
  globalNoteStats: Record<Stage, number>
  onStageClick: (stage: Stage) => void
}

interface UserStats {
  id: string
  name: string
  avatar: string
  isActive: boolean
  currentStage: string
  timeByStage: Record<Stage, number>
  notesByStage: Record<Stage, number>
}

const STAGES: { key: Stage; label: string; color: string; textColor: string }[] = [
  { key: "planificacion", label: "Planificación", color: "bg-blue-500", textColor: "text-blue-400" },
  { key: "diseno", label: "Diseño", color: "bg-purple-500", textColor: "text-purple-400" },
  { key: "ejecucion", label: "Ejecución", color: "bg-green-500", textColor: "text-green-400" },
  { key: "monitoreo", label: "Monitoreo", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { key: "ajuste", label: "Ajuste", color: "bg-orange-500", textColor: "text-orange-400" },
  { key: "cierre", label: "Cierre", color: "bg-red-500", textColor: "text-red-400" },
]

// Mock data - será reemplazado por Supabase
const mockUsers: UserStats[] = [
  {
    id: "1",
    name: "María García",
    avatar: "MG",
    isActive: true,
    currentStage: "Ejecución",
    timeByStage: {
      planificacion: 7200,
      diseno: 5400,
      ejecucion: 10800,
      monitoreo: 1800,
      ajuste: 900,
      cierre: 0,
    },
    notesByStage: {
      planificacion: 4,
      diseno: 3,
      ejecucion: 6,
      monitoreo: 2,
      ajuste: 1,
      cierre: 0,
    },
  },
  {
    id: "2",
    name: "Carlos López",
    avatar: "CL",
    isActive: true,
    currentStage: "Planificación",
    timeByStage: {
      planificacion: 3600,
      diseno: 1800,
      ejecucion: 0,
      monitoreo: 0,
      ajuste: 0,
      cierre: 0,
    },
    notesByStage: {
      planificacion: 5,
      diseno: 2,
      ejecucion: 0,
      monitoreo: 0,
      ajuste: 0,
      cierre: 0,
    },
  },
  {
    id: "3",
    name: "Ana Martínez",
    avatar: "AM",
    isActive: false,
    currentStage: "Diseño",
    timeByStage: {
      planificacion: 5400,
      diseno: 7200,
      ejecucion: 3600,
      monitoreo: 2700,
      ajuste: 1800,
      cierre: 900,
    },
    notesByStage: {
      planificacion: 3,
      diseno: 5,
      ejecucion: 4,
      monitoreo: 2,
      ajuste: 2,
      cierre: 1,
    },
  },
  {
    id: "4",
    name: "Pedro Sánchez",
    avatar: "PS",
    isActive: true,
    currentStage: "Monitoreo",
    timeByStage: {
      planificacion: 4500,
      diseno: 3600,
      ejecucion: 9000,
      monitoreo: 5400,
      ajuste: 0,
      cierre: 0,
    },
    notesByStage: {
      planificacion: 2,
      diseno: 4,
      ejecucion: 7,
      monitoreo: 3,
      ajuste: 0,
      cierre: 0,
    },
  },
  {
    id: "5",
    name: "Laura Fernández",
    avatar: "LF",
    isActive: false,
    currentStage: "Cierre",
    timeByStage: {
      planificacion: 6300,
      diseno: 4500,
      ejecucion: 12600,
      monitoreo: 3600,
      ajuste: 2700,
      cierre: 1800,
    },
    notesByStage: {
      planificacion: 6,
      diseno: 4,
      ejecucion: 8,
      monitoreo: 3,
      ajuste: 2,
      cierre: 2,
    },
  },
]

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatTimeShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  if (hours > 0) {
    return `${hours}h`
  }
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m`
}

export function CommunityPanel({ notes, sessions, globalNoteStats, onStageClick }: CommunityPanelProps) {
  const [users, setUsers] = useState<UserStats[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          isActive: Math.random() > 0.3,
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Estadísticas globales de tiempo (mock + real data when connected)
  const globalTimeByStage = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        totalTime: users.reduce((acc, user) => acc + user.timeByStage[stage.key], 0),
      })),
    [users],
  )

  // Estadísticas reales de notas desde el estado global
  const realNotesByStage = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        totalNotes: globalNoteStats[stage.key],
      })),
    [globalNoteStats],
  )

  const totalGlobalTime = globalTimeByStage.reduce((acc, s) => acc + s.totalTime, 0)
  const totalGlobalNotes = Object.values(globalNoteStats).reduce((a, b) => a + b, 0)
  const activeUsers = users.filter((u) => u.isActive).length

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl tracking-[0.2em] text-white mb-2">COMUNIDAD</h2>
          <p className="text-[10px] md:text-xs text-white/40">{activeUsers} usuarios activos ahora</p>
        </div>

        {/* Heatmap de Actividad */}
        <div className="mb-6">
          <ActivityHeatmap sessions={sessions} userSessions={sessions} />
        </div>

        {/* Estadísticas Globales de Tiempo */}
        <div className="mb-6 p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs tracking-[0.15em] text-white/70">TIEMPO GLOBAL POR ETAPA</h3>
            <span className="text-[10px] text-electric-blue">{formatTime(totalGlobalTime)} total</span>
          </div>

          {/* Barra de progreso global */}
          <div className="h-3 rounded-full bg-white/10 overflow-hidden flex mb-3">
            {globalTimeByStage.map((stage) => {
              const percentage = totalGlobalTime > 0 ? (stage.totalTime / totalGlobalTime) * 100 : 0
              if (percentage === 0) return null
              return (
                <div
                  key={stage.key}
                  className={cn(stage.color, "h-full transition-all")}
                  style={{ width: `${percentage}%` }}
                  title={`${stage.label}: ${formatTime(stage.totalTime)}`}
                />
              )
            })}
          </div>

          {/* Grid de etapas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {globalTimeByStage.map((stage) => (
              <div key={stage.key} className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                <span className="text-[10px] text-white/50">{stage.label}</span>
                <span className="text-[10px] text-white/70 ml-auto">{formatTimeShort(stage.totalTime)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban Global de Notas - CLICKABLE */}
        <div className="mb-6 p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs tracking-[0.15em] text-white/70">KANBAN GLOBAL DE NOTAS</h3>
            <span className="text-[10px] text-electric-blue">{totalGlobalNotes} notas total</span>
          </div>
          <p className="text-[10px] text-white/30 mb-3">Haz clic en una etapa para ver sus notas</p>

          {/* Grid de notas por etapa - CLICKABLE */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {realNotesByStage.map((stage) => (
              <button
                key={stage.key}
                onClick={() => onStageClick(stage.key)}
                className={cn(
                  "group p-3 rounded-lg bg-white/5 border border-white/10 text-center transition-all",
                  "hover:border-electric-blue/50 hover:bg-electric-blue/5",
                  "active:scale-95",
                )}
              >
                <div className={cn("w-full h-1 rounded-full mb-2 transition-all", stage.color)} />
                <p className={cn("text-xl md:text-2xl font-medium text-white transition-colors", "group-hover:text-electric-blue")}>
                  {stage.totalNotes}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-[10px] text-white/50 group-hover:text-white/70 transition-colors">{stage.label}</p>
                  <ExternalLink size={8} className="opacity-0 group-hover:opacity-100 text-electric-blue transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Resumen rápido de notas recientes */}
        {notes.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border border-electric-blue/20 bg-electric-blue/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs tracking-[0.15em] text-electric-blue/70">NOTAS RECIENTES</h3>
              <span className="text-[10px] text-white/40">Últimas {Math.min(notes.length, 3)}</span>
            </div>
            <div className="space-y-2">
              {notes.slice(-3).reverse().map((note) => {
                const stageInfo = STAGES.find((s) => s.key === note.stage)
                return (
                  <button
                    key={note.id}
                    onClick={() => onStageClick(note.stage)}
                    className="w-full flex items-center gap-3 p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", stageInfo?.color)} />
                    <span className="text-xs text-white truncate flex-1">{note.title}</span>
                    {note.week && <span className="text-[10px] text-white/30">S{note.week}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Lista de Usuarios con estadísticas */}
        <div className="mb-4">
          <h3 className="text-xs tracking-[0.15em] text-white/70 mb-3">MIEMBROS DEL EQUIPO</h3>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id}>
              {/* Card de usuario */}
              <button
                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                  user.isActive ? "bg-electric-blue/5 border-electric-blue/20" : "bg-white/5 border-white/10",
                  selectedUser === user.id && "border-electric-blue/50",
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-medium",
                      user.isActive ? "bg-electric-blue/20 text-electric-blue" : "bg-white/10 text-white/50",
                    )}
                  >
                    {user.avatar}
                  </div>
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black",
                      user.isActive ? "bg-green-500" : "bg-white/30",
                    )}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-white/40">{user.currentStage}</p>
                </div>

                {/* Resumen de notas */}
                <div className="hidden sm:flex items-center gap-1">
                  {STAGES.map((stage) => (
                    <div
                      key={stage.key}
                      className={cn(
                        "w-5 h-5 rounded text-[8px] flex items-center justify-center",
                        user.notesByStage[stage.key] > 0 ? stage.color + "/30 text-white" : "bg-white/5 text-white/20",
                      )}
                      title={`${stage.label}: ${user.notesByStage[stage.key]} notas`}
                    >
                      {user.notesByStage[stage.key]}
                    </div>
                  ))}
                </div>

                {/* Tiempo total */}
                <span className="text-[10px] text-white/50">
                  {formatTimeShort(Object.values(user.timeByStage).reduce((a, b) => a + b, 0))}
                </span>
              </button>

              {/* Detalles expandidos */}
              {selectedUser === user.id && (
                <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
                  {/* Tiempo por etapa */}
                  <div>
                    <p className="text-[10px] text-white/50 mb-2">Tiempo invertido</p>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
                      {STAGES.map((stage) => {
                        const total = Object.values(user.timeByStage).reduce((a, b) => a + b, 0)
                        const percentage = total > 0 ? (user.timeByStage[stage.key] / total) * 100 : 0
                        if (percentage === 0) return null
                        return (
                          <div
                            key={stage.key}
                            className={cn(stage.color, "h-full")}
                            style={{ width: `${percentage}%` }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Notas por etapa */}
                  <div>
                    <p className="text-[10px] text-white/50 mb-2">Notas por etapa</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {STAGES.map((stage) => (
                        <div key={stage.key} className="text-center">
                          <div className={cn("w-full h-0.5 rounded-full mb-1", stage.color)} />
                          <p className="text-sm text-white font-medium">{user.notesByStage[stage.key]}</p>
                          <p className="text-[8px] text-white/40 truncate">{stage.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalle de tiempo */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {STAGES.map((stage) => (
                      <div key={stage.key} className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", stage.color)} />
                        <span className="text-[10px] text-white/40 flex-1 truncate">{stage.label}</span>
                        <span className="text-[10px] text-white/60">
                          {formatTimeShort(user.timeByStage[stage.key])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-white/30 mt-6">Conecta con Supabase para ver estadísticas reales</p>
      </div>
    </div>
  )
}
