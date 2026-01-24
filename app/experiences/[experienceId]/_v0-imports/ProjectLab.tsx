"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
// Importamos tus componentes base
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
} from "./index" 

// Importamos los nuevos componentes tácticos
import { NextStepsPanel } from "./next-steps-panel"
import { MobileNotesList } from "./mobile-notes-list"
import { CommandCenterModal } from "./command-center-modal"
import { ActiveObjectivePanel } from "./active-objective-panel"
import { MobileFocusConfirmation } from "./mobile-focus-confirmation"
import { OnboardingWizard } from "./onboarding-wizard"
import { FocusBreadcrumb } from "./focus-breadcrumb"
import { QuickActionButton } from "./quick-action-button"

// Utilidades y Supabase
import { Command } from "lucide-react"
import {
  insertSession,
  insertNote,
  updateNote as updateNoteDb,
  deleteNote as deleteNoteDb,
  upsertNoteTimeStats,
  insertProject,
  fetchNotes,
  fetchSessions,
  isSupabaseConfigured,
} from "@/lib/supabase"
import type { Session, Note, Stage, DrawerFilter, NoteTimeStats, Project } from "@/lib/types"

export function ProjectLab({ experienceId }: { experienceId: string }) {
  const [activeTab, setActiveTab] = useState<"focus" | "community" | "achievements" | "settings">("focus")
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState<Stage>("planificacion")
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [stagesOpen, setStagesOpen] = useState(false)
  const [commandCenterOpen, setCommandCenterOpen] = useState(false)

  const [project, setProject] = useState<Project | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [lastActiveNote, setLastActiveNote] = useState<Note | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showMobileFocusConfirmation, setShowMobileFocusConfirmation] = useState(false)
  const [pendingActiveNote, setPendingActiveNote] = useState<Note | null>(null)

  const [drawerFilter, setDrawerFilter] = useState<DrawerFilter>({
    stage: null,
    fromCommunity: false,
  })

  const [sessions, setSessions] = useState<Session[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [noteTimeStats, setNoteTimeStats] = useState<NoteTimeStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadInitialData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false)
        return
      }
      try {
        const [notesResult, sessionsResult] = await Promise.all([fetchNotes(), fetchSessions()])
        if (notesResult.data) setNotes(notesResult.data)
        if (sessionsResult.data) setSessions(sessionsResult.data)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialData()
  }, [])

  const handleSaveSession = useCallback(async (session: Session) => {
    setSessions((prev) => [...prev, session])
    await insertSession(session)
    
    if (session.noteId) {
      setNoteTimeStats((prev) => {
        const existing = prev.find((s) => s.noteId === session.noteId)
        const updated = existing 
          ? { ...existing, totalTime: existing.totalTime + session.duration, sessionsCount: existing.sessionsCount + 1 }
          : { noteId: session.noteId!, totalTime: session.duration, sessionsCount: 1 }
        
        upsertNoteTimeStats(updated)
        return existing ? prev.map(s => s.noteId === session.noteId ? updated : s) : [...prev, updated]
      })
      const note = notes.find((n) => n.id === session.noteId)
      if (note) setLastActiveNote(note)
    }
    setActiveNote(null)
  }, [notes])

  const handleAddNote = useCallback(async (note: Note) => {
    setNotes((prev) => [...prev, note])
    await insertNote(note)
  }, [])

  const handleCreateProject = useCallback(async (newProject: Project) => {
    setProject(newProject)
    await insertProject(newProject)
    if (newProject.activeStages.length > 0) setCurrentStage(newProject.activeStages[0])
  }, [])

  const handleOpenDrawer = useCallback(() => {
    setDrawerFilter({ stage: null, fromCommunity: false })
    setDrawerOpen(true)
  }, [])

  const weekNotes = useMemo(() => notes.filter((n) => n.week === selectedWeek), [notes, selectedWeek])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="flex-1 flex flex-col relative pb-16 md:pb-0">
        <MobileHeader
          selectedWeek={selectedWeek}
          currentStage={currentStage}
          onOpenTimeline={() => setTimelineOpen(true)}
          onOpenStages={() => setStagesOpen(true)}
          onOpenDrawer={handleOpenDrawer}
        />

        <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h1 className="text-sm font-medium tracking-[0.3em] text-white uppercase">PROJECT LAB</h1>
            <p className="text-[10px] tracking-[0.2em] text-amber-500/80 uppercase">
              EXP: {experienceId.slice(0, 8)} • OPERATIVO ACTIVO
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandCenterOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-electric-blue/30 bg-electric-blue/10 text-electric-blue text-[10px] tracking-wider hover:bg-electric-blue/20 transition-all"
            >
              <Command size={12} />
              CENTRO DE MANDO
            </button>
            <span className="text-xs tracking-[0.15em] text-white/60">SEMANA {selectedWeek}</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {activeTab === "focus" && (
            <>
              <div className="hidden md:block border-r border-white/5">
                <Timeline selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
              </div>

              <div className="flex-1 flex flex-col overflow-y-auto">
                <FocusBreadcrumb 
                   project={project} 
                   selectedWeek={selectedWeek} 
                   currentStage={currentStage} 
                   activeNote={activeNote}
                   onWeekClick={() => setTimelineOpen(true)}
                   onStageClick={() => setStagesOpen(true)}
                />

                <div className="flex-shrink-0 flex items-center justify-center px-4 py-8">
                  <FocusTimer
                    onSessionComplete={handleSaveSession}
                    onTimerStateChange={setIsTimerRunning}
                    currentWeek={selectedWeek}
                    currentStage={currentStage}
                    activeNote={activeNote}
                  />
                </div>

                {activeNote && (
                  <div className="px-4 pb-6 max-w-2xl mx-auto w-full">
                    <ActiveObjectivePanel
                      note={activeNote}
                      onClear={() => setActiveNote(null)}
                      isTimerRunning={isTimerRunning}
                    />
                  </div>
                )}

                <div className="hidden md:block border-t border-white/5 pt-4">
                  <NextStepsPanel
                    notes={weekNotes}
                    currentStage={currentStage}
                    activeNote={activeNote}
                    onNoteClick={(n) => { setDrawerFilter({ stage: n.stage, fromCommunity: false }); setDrawerOpen(true); }}
                    onNoteDoubleClick={(n) => setActiveNote(n)}
                    onViewAll={handleOpenDrawer}
                  />
                </div>

                <div className="md:hidden flex-1">
                  <MobileNotesList
                    notes={notes}
                    currentStage={currentStage}
                    selectedWeek={selectedWeek}
                    activeNote={activeNote}
                    onNoteClick={handleOpenDrawer}
                    onNoteLongPress={(n) => { setPendingActiveNote(n); setShowMobileFocusConfirmation(true); }}
                    onAddNote={handleOpenDrawer}
                  />
                </div>
              </div>

              <div className="hidden md:block border-l border-white/5">
                <StagesPanel currentStage={currentStage} onStageChange={setCurrentStage} />
              </div>
            </>
          )}

          {activeTab === "community" && (
            <CommunityPanel 
              notes={notes} 
              sessions={sessions} 
              onStageClick={(s) => { 
                setDrawerFilter({ stage: s, fromCommunity: true }); 
                setDrawerOpen(true); 
              }}
              globalNoteStats={useMemo(() => {
                const stats: Record<Stage, number> = {
                  planificacion: 0, 
                  diseno: 0, 
                  ejecucion: 0, 
                  monitoreo: 0, 
                  ajuste: 0, 
                  cierre: 0
                };
                notes.forEach(note => {
                  if (stats[note.stage] !== undefined) {
                    stats[note.stage]++;
                  }
                });
                return stats;
              }, [notes])}
            />
          )}
          {activeTab === "achievements" && <AchievementsPanel sessions={sessions} />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>

        <footer className="hidden md:flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Whop Ecosystem Active</span>
          <button
            onClick={handleOpenDrawer}
            className="text-[10px] tracking-[0.1em] text-white/60 hover:text-electric-blue transition-colors border border-white/10 px-3 py-1 rounded"
          >
            NOTAS Y BASE DE DATOS
          </button>
        </footer>
      </main>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isMobile={true} />

      <OnboardingWizard isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} onComplete={handleCreateProject} />
      
      <CommandCenterModal 
        isOpen={commandCenterOpen} 
        onClose={() => setCommandCenterOpen(false)} 
        notes={notes} 
        sessions={sessions}
        selectedWeek={selectedWeek}
        currentStage={currentStage}
        onStartNewProject={() => setShowOnboarding(true)}
      />

      <MobileFocusConfirmation 
        isOpen={showMobileFocusConfirmation} 
        note={pendingActiveNote} 
        onConfirm={() => { if(pendingActiveNote) setActiveNote(pendingActiveNote); setShowMobileFocusConfirmation(false); }} 
        onCancel={() => setShowMobileFocusConfirmation(false)} 
      />

      <RightDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        allNotes={notes}
        weekNotes={weekNotes}
        onAddNote={handleAddNote}
        onUpdateNote={async (n) => { setNotes(prev => prev.map(old => old.id === n.id ? n : old)); await updateNoteDb(n); }}
        onDeleteNote={async (id) => { setNotes(prev => prev.filter(n => n.id !== id)); await deleteNoteDb(id); }}
        selectedWeek={selectedWeek}
        currentStage={currentStage}
        drawerFilter={drawerFilter}
      />

      {!isTimerRunning && activeTab === "focus" && (
        <QuickActionButton 
          lastActiveNote={lastActiveNote} 
          currentWeek={selectedWeek} 
          currentStage={currentStage} 
          onSessionComplete={handleSaveSession}
          onSetActiveNote={setActiveNote}
        />
      )}
    </div>
  )
}
