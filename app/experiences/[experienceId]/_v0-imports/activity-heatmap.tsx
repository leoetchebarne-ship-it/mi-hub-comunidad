"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { Session } from "@/lib/types"

interface ActivityHeatmapProps {
  sessions: Session[]
  userSessions: Session[]
}

// Generar últimos 12 semanas de datos
function generateWeekDates(): { week: number; days: string[] }[] {
  const weeks: { week: number; days: string[] }[] = []
  const today = new Date()

  for (let w = 0; w < 12; w++) {
    const days: string[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (11 - w) * 7 - (6 - d))
      days.push(date.toISOString().split("T")[0])
    }
    weeks.push({ week: w + 1, days })
  }

  return weeks
}

function getActivityLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes === 0) return 0
  if (minutes < 30) return 1
  if (minutes < 60) return 2
  if (minutes < 120) return 3
  return 4
}

const LEVEL_COLORS = {
  0: "bg-white/5",
  1: "bg-electric-blue/20",
  2: "bg-electric-blue/40",
  3: "bg-electric-blue/60",
  4: "bg-electric-blue",
}

const LEVEL_LABELS = ["Sin actividad", "< 30 min", "30-60 min", "1-2 horas", "> 2 horas"]

export function ActivityHeatmap({ sessions, userSessions }: ActivityHeatmapProps) {
  const weeks = useMemo(() => generateWeekDates(), [])

  // Calcular minutos por día del usuario
  const userActivityByDay = useMemo(() => {
    const activity: Record<string, number> = {}
    userSessions.forEach((session) => {
      const date = session.startedAt.split("T")[0]
      activity[date] = (activity[date] || 0) + Math.floor(session.duration / 60)
    })
    return activity
  }, [userSessions])

  // Calcular minutos por día de la comunidad (promedio)
  const communityActivityByDay = useMemo(() => {
    const activity: Record<string, number[]> = {}
    sessions.forEach((session) => {
      const date = session.startedAt.split("T")[0]
      if (!activity[date]) activity[date] = []
      activity[date].push(Math.floor(session.duration / 60))
    })

    const avgActivity: Record<string, number> = {}
    Object.entries(activity).forEach(([date, minutes]) => {
      avgActivity[date] = Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
    })
    return avgActivity
  }, [sessions])

  // Stats comparativos
  const userTotalMinutes = Object.values(userActivityByDay).reduce((a, b) => a + b, 0)
  const communityAvgMinutes = Object.values(communityActivityByDay).reduce((a, b) => a + b, 0) / Math.max(Object.keys(communityActivityByDay).length, 1)
  const comparison = communityAvgMinutes > 0 ? Math.round((userTotalMinutes / (communityAvgMinutes * Object.keys(userActivityByDay).length || 1)) * 100) : 100

  return (
    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs tracking-[0.15em] text-white/70">MAPA DE ACTIVIDAD</h3>
          <p className="text-[10px] text-white/40 mt-0.5">Últimas 12 semanas de esfuerzo</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-light text-electric-blue">
            {Math.floor(userTotalMinutes / 60)}h {userTotalMinutes % 60}m
          </p>
          <p className="text-[10px] text-white/40">tiempo total</p>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[600px]">
          {/* Week labels */}
          <div className="flex gap-1 mb-1 pl-8">
            {weeks.map((w) => (
              <div key={w.week} className="flex-1 text-center">
                <span className="text-[8px] text-white/30">S{w.week}</span>
              </div>
            ))}
          </div>

          {/* Days grid */}
          {["L", "M", "X", "J", "V", "S", "D"].map((dayLabel, dayIndex) => (
            <div key={dayLabel} className="flex gap-1 items-center">
              <span className="w-6 text-[8px] text-white/30 text-right pr-1">{dayLabel}</span>
              <div className="flex gap-1 flex-1">
                {weeks.map((week) => {
                  const date = week.days[dayIndex]
                  const minutes = userActivityByDay[date] || 0
                  const level = getActivityLevel(minutes)
                  return (
                    <div
                      key={date}
                      className={cn(
                        "flex-1 aspect-square rounded-sm transition-all hover:ring-1 hover:ring-white/30",
                        LEVEL_COLORS[level],
                      )}
                      title={`${date}: ${minutes} min`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/40">Menos</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn("w-3 h-3 rounded-sm", LEVEL_COLORS[level as 0 | 1 | 2 | 3 | 4])}
              title={LEVEL_LABELS[level]}
            />
          ))}
          <span className="text-[9px] text-white/40">Más</span>
        </div>

        {/* Comparison badge */}
        <div
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-medium",
            comparison >= 100
              ? "bg-green-500/20 text-green-400"
              : comparison >= 75
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-orange-500/20 text-orange-400",
          )}
        >
          {comparison >= 100 ? "Por encima" : `${comparison}%`} del promedio
        </div>
      </div>

      {/* Community comparison */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded bg-white/5 border border-white/10 text-center">
          <p className="text-sm text-white font-light">{Math.round(communityAvgMinutes)} min</p>
          <p className="text-[9px] text-white/40">Promedio comunidad/día</p>
        </div>
        <div className="p-3 rounded bg-electric-blue/10 border border-electric-blue/30 text-center">
          <p className="text-sm text-electric-blue font-light">
            {Object.keys(userActivityByDay).length > 0
              ? Math.round(userTotalMinutes / Object.keys(userActivityByDay).length)
              : 0}{" "}
            min
          </p>
          <p className="text-[9px] text-electric-blue/70">Tu promedio/día</p>
        </div>
      </div>
    </div>
  )
}
