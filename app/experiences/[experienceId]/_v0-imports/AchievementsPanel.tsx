"use client"

import type { Session } from "@/lib/types"

interface AchievementsPanelProps {
  sessions: Session[]
}

export function AchievementsPanel({ sessions }: AchievementsPanelProps) {
  const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0)
  const totalSessions = sessions.length

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const stageStats = sessions.reduce(
    (acc, session) => {
      acc[session.stage] = (acc[session.stage] || 0) + session.duration
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl tracking-[0.2em] text-white mb-2">LOGROS</h2>
          <p className="text-[10px] md:text-xs text-white/40">Tu historial de sesiones</p>
        </div>

        {/* Stats principales - responsive grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="text-center p-4 md:p-6 border border-white/10 rounded-lg bg-white/5">
            <p className="text-xl md:text-3xl font-light text-electric-blue mb-1 md:mb-2">
              {formatTotalTime(totalTime)}
            </p>
            <p className="text-[10px] md:text-xs tracking-wider text-white/50">TIEMPO TOTAL</p>
          </div>
          <div className="text-center p-4 md:p-6 border border-white/10 rounded-lg bg-white/5">
            <p className="text-xl md:text-3xl font-light text-white mb-1 md:mb-2">{totalSessions}</p>
            <p className="text-[10px] md:text-xs tracking-wider text-white/50">SESIONES</p>
          </div>
        </div>

        {/* Stats por etapa */}
        {Object.keys(stageStats).length > 0 && (
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-[10px] md:text-xs tracking-[0.15em] text-white/50 mb-3 md:mb-4">TIEMPO POR ETAPA</h3>
            {Object.entries(stageStats).map(([stage, time]) => (
              <div
                key={stage}
                className="flex items-center justify-between p-2.5 md:p-3 border border-white/10 rounded"
              >
                <span className="text-xs md:text-sm text-white/70 capitalize">{stage}</span>
                <span className="text-xs md:text-sm text-electric-blue">{formatTotalTime(time)}</span>
              </div>
            ))}
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center py-8 md:py-12 border border-dashed border-white/10 rounded-lg">
            <p className="text-white/30 text-xs md:text-sm">Aún no tienes sesiones registradas</p>
            <p className="text-white/20 text-[10px] md:text-xs mt-2">Inicia una sesión de enfoque para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}
