"use client"

import { useState } from "react"
import { 
  Sidebar, 
  FocusTimer, 
  Timeline, 
  StagesPanel, 
  RightDrawer, 
  CommunityPanel, 
  AchievementsPanel, 
  SettingsPanel, 
  MobileHeader 
} from "./index" // Importamos todo desde el index local
import type { Session, Note, Stage } from "@/lib/types"

// Añadimos el experienceId como prop para Whop
export function ProjectLab({ experienceId }: { experienceId: string }) {
  const [activeTab, setActiveTab] = useState<"focus" | "community" | "achievements" | "settings">("focus")
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState<Stage>("planificacion")
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [stagesOpen, setStagesOpen] = useState(false)

  const [sessions, setSessions] = useState<Session[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)

  const handleSaveSession = (session: Session) => {
    setSessions((prev) => [...prev, session])
    setCurrentSession(null)
  }

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note])
  }

  const weekNotes = notes.filter((n) => n.week === selectedWeek)

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="flex-1 flex flex-col relative pb-16 md:pb-0">
        <MobileHeader
          selectedWeek={selectedWeek}
          currentStage={currentStage}
          onOpenTimeline={() => setTimelineOpen(true)}
          onOpenStages={() => setStagesOpen(true)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h1 className="text-sm font-medium tracking-[0.3em] text-white uppercase">PROJECT LAB</h1>
            <p className="text-[10px] tracking-[0.2em] text-amber-500/80">EXP: {experienceId.slice(0, 8)}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-[0.15em] text-white/60">SEMANA {selectedWeek}</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {activeTab === "focus" && (
            <>
              <div className="hidden md:block border-r border-white/5">
                <Timeline selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
              </div>

              <div className="flex-1 flex items-center justify-center px-4">
                <FocusTimer
                  onSessionComplete={handleSaveSession}
                  currentWeek={selectedWeek}
                  currentStage={currentStage}
                />
              </div>

              <div className="hidden md:block border-l border-white/5">
                <StagesPanel currentStage={currentStage} onStageChange={setCurrentStage} />
              </div>
            </>
          )}

          {activeTab === "community" && <CommunityPanel />}
          {activeTab === "achievements" && <AchievementsPanel sessions={sessions} />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>

        {/* Footer con info de Whop */}
        <footer className="hidden md:flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Connected to Whop Experience</span>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-[10px] tracking-[0.1em] text-white/60 hover:text-electric-blue transition-colors border border-white/10 px-3 py-1 rounded"
          >
            NOTAS Y PLANIFICACIÓN
          </button>
        </footer>
      </main>

      {/* Sidebar Mobile */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isMobile={true} />

      {/* Modales Mobile */}
      <Timeline
        selectedWeek={selectedWeek}
        onWeekChange={(week) => {
          setSelectedWeek(week)
          setTimelineOpen(false)
        }}
        isSheet={true}
        isOpen={timelineOpen}
        onClose={() => setTimelineOpen(false)}
      />

      <StagesPanel
        currentStage={currentStage}
        onStageChange={(stage) => {
          setCurrentStage(stage)
          setStagesOpen(false)
        }}
        isSheet={true}
        isOpen={stagesOpen}
        onClose={() => setStagesOpen(false)}
      />

      <RightDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notes={weekNotes}
        onAddNote={handleAddNote}
        selectedWeek={selectedWeek}
        currentStage={currentStage}
      />
    </div>
  )
}
