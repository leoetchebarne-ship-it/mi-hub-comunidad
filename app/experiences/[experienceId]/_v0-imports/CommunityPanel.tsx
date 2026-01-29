"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { ActivityHeatmap } from "./activity-heatmap" // Import relativo corregido
import type { Stage, Note, Session } from "@/lib/types"

interface CommunityPanelProps {
  notes: Note[]
  sessions: Session[]
  globalNoteStats?: Record<Stage, number> // Hecho opcional para evitar errores de compilación
  onStageClick: (stage: Stage) => void
}

const STAGES: { key: Stage; label: string; color: string; textColor: string }[] = [
  { key: "planificacion", label: "Planificación", color: "bg-blue-500", textColor: "text-blue-400" },
  { key: "diseno", label: "Diseño", color: "bg-purple-500", textColor: "text-purple-400" },
  { key: "ejecucion", label: "Ejecución", color: "bg-green-500", textColor: "text-green-400" },
  { key: "monitoreo", label: "Monitoreo", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { key: "ajuste", label: "Ajuste", color: "bg-orange-500", textColor: "text-orange-400" },
  { key: "cierre", label: "Cierre", color: "bg-red-500", textColor: "text-red-400" },
]

// ... (mockUsers y formatTime se mantienen igual)
const mockUsers: UserStats[] = [ /* tus datos mock */ ]
function formatTime(seconds: number) { /* tu función */ }
function formatTimeShort(seconds: number) { /* tu función */ }

export function CommunityPanel({ 
  notes, 
  sessions, 
  globalNoteStats = { 
    planificacion: 0, diseno: 0, ejecucion: 0, monitoreo: 0, ajuste: 0, cierre: 0 
  }, 
  onStageClick 
}: CommunityPanelProps) {
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

  const globalTimeByStage = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        totalTime: users.reduce((acc, user) => acc + (user.timeByStage[stage.key] || 0), 0),
      })),
    [users],
  )

  const realNotesByStage = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        totalNotes: globalNoteStats[stage.key] || 0,
      })),
    [globalNoteStats],
  )

  const totalGlobalTime = globalTimeByStage.reduce((acc, s) => acc + s.totalTime, 0)
  const totalGlobalNotes = Object.values(globalNoteStats).reduce((a, b) => a + b, 0)
  const activeUsers = users.filter((u) => u.isActive).length

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl tracking-[0.2em] text-white mb-2">COMUNIDAD</h2>
          <p className="text-[10px] md:text-xs text-white/40">{activeUsers} usuarios activos ahora</p>
        </div>

        <div className="mb-6">
          <ActivityHeatmap sessions={sessions} userSessions={sessions} />
        </div>

        {/* ... El resto del JSX se mantiene igual ... */}
        {/* Asegúrate de cerrar bien todos los divs al final */}
      </div>
    </div>
  )
}
