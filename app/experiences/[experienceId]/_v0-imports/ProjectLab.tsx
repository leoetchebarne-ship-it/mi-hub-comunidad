'use client';

import React, { useState } from 'react';
import { FocusTimer } from './FocusTimer';
import { CommunityPanel } from './CommunityPanel';
import { AchievementsPanel } from './AchievementsPanel';
import { RightDrawer } from './RightDrawer';
import type { Session, Note, Stage } from '@/lib/types';

export function ProjectLab({ experienceId }: { experienceId: string }) {
  const [view, setView] = useState<'focus' | 'community' | 'achievements'>('focus');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Estados para datos
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentStage] = useState<Stage>('planificacion');
  const [currentWeek] = useState(1);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Layout de v0 */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md">
          <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Project Lab | {experienceId.slice(0,5)}</span>
          <div className="flex gap-4">
            <button onClick={() => setView('focus')} className="text-xs hover:text-blue-400 transition-colors">ENFOQUE</button>
            <button onClick={() => setView('community')} className="text-xs hover:text-blue-400 transition-colors">COMUNIDAD</button>
            <button onClick={() => setView('achievements')} className="text-xs hover:text-blue-400 transition-colors">LOGROS</button>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-[10px] tracking-widest bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full hover:bg-blue-600/40 transition-all"
          >
            PLANIFICADOR
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {view === 'focus' && (
            <FocusTimer 
              onSessionComplete={(s) => setSessions([...sessions, s])} 
              currentWeek={currentWeek} 
              currentStage={currentStage} 
            />
          )}
          {view === 'community' && <CommunityPanel />}
          {view === 'achievements' && <AchievementsPanel sessions={sessions} />}
        </div>

        <RightDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          notes={notes} 
          onAddNote={(n) => setNotes([...notes, n])} 
          selectedWeek={currentWeek} 
          currentStage={currentStage} 
        />
      </main>
    </div>
  );
}
