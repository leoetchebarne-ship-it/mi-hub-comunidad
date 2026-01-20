'use client';

import React, { useState, use } from 'react'; 
import { Timer, Users, BarChart3, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session, Note, Stage } from '@/lib/types';

// Importaciones de tus componentes
import { CommunityPanel } from './_v0-imports/CommunityPanel';
import { FocusTimer } from './_v0-imports/FocusTimer';
import { RightDrawer } from './_v0-imports/RightDrawer';
import { AchievementsPanel } from './_v0-imports/AchievementsPanel';

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);
  
  // ESTADOS PRINCIPALES
  const [view, setView] = useState<'focus' | 'community' | 'achievements'>('focus');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // DATOS MOCK (Para que los componentes tengan qué mostrar)
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage>('planificacion');
  const [currentWeek] = useState(1);

  // MANEJADORES DE EVENTOS
  const handleSessionComplete = (newSession: Session) => {
    setSessions((prev) => [...prev, newSession]);
    console.log("Sesión guardada:", newSession);
  };

  const handleAddNote = (newNote: Note) => {
    setNotes((prev) => [...prev, newNote]);
    console.log("Nota agregada:", newNote);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden font-sans">
      
      {/* NAVEGACIÓN LATERAL */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black/50 backdrop-blur-xl z-50">
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => setView('focus')} 
            className={cn("p-4 rounded-2xl transition-all duration-300", 
              view === 'focus' ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}
          >
            <Timer size={24} />
          </button>
          <button 
            onClick={() => setView('community')} 
            className={cn("p-4 rounded-2xl transition-all duration-300", 
              view === 'community' ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}
          >
            <Users size={24} />
          </button>
          <button 
            onClick={() => setView('achievements')} 
            className={cn("p-4 rounded-2xl transition-all duration-300", 
              view === 'achievements' ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}
          >
            <BarChart3 size={24} />
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <header className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-xs tracking-[0.3em] text-white/40 uppercase">Project Lab</h1>
            <p className="text-sm text-blue-400/80 font-light">Semana {currentWeek} • {currentStage}</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-[10px] tracking-[0.2em] text-white/50 hover:text-white border border-white/10 px-4 py-2 rounded-full transition-all"
          >
            PLANIFICADOR
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {view === 'focus' && (
            <div className="h-full flex items-center justify-center p-4">
              <FocusTimer 
                onSessionComplete={handleSessionComplete} 
                currentWeek={currentWeek} 
                currentStage={currentStage} 
              />
            </div>
          )}
          
          {view === 'community' && <CommunityPanel />}
          
          {view === 'achievements' && (
            <AchievementsPanel sessions={sessions} />
          )}
        </div>

        {/* COMPONENTE LATERAL (DERECHA) */}
        <RightDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          notes={notes} 
          onAddNote={handleAddNote}
          selectedWeek={currentWeek}
          currentStage={currentStage}
        />
      </main>
    </div>
  );
}
