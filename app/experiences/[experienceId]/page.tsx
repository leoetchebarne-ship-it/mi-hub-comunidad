'use client';

import React, { useState, use } from 'react'; 
import { Timer, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CommunityPanel } from './_v0-imports/CommunityPanel';
import { FocusTimer } from './_v0-imports/FocusTimer';
import { RightDrawer } from './_v0-imports/RightDrawer';
import { AchievementsPanel } from './_v0-imports/AchievementsPanel';

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);
  const [view, setView] = useState('focus');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSessionComplete = (session: any) => console.log(session);
  const mockSessions: any[] = []; 

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black/50 backdrop-blur-xl z-50">
        <div className="flex flex-col gap-4">
          <button onClick={() => setView('focus')} className={cn("p-4 rounded-2xl transition-all", view === 'focus' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <Timer size={24} />
          </button>
          <button onClick={() => setView('community')} className={cn("p-4 rounded-2xl transition-all", view === 'community' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <Users size={24} />
          </button>
          <button onClick={() => setView('achievements')} className={cn("p-4 rounded-2xl transition-all", view === 'achievements' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <BarChart3 size={24} />
          </button>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {view === 'focus' && (
            <FocusTimer 
              onSessionComplete={handleSessionComplete} 
              currentWeek={1} 
              currentStage="planificacion" 
            />
          )}
          
          {view === 'community' && <CommunityPanel />}
          
          {view === 'achievements' && (
            <AchievementsPanel sessions={mockSessions} />
          )}
        </div>

        {/* AJUSTE FINAL: Quitamos las props que daban error y dejamos las básicas de v0 */}
        <RightDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          notes={[]} 
          onAddNote={() => {}} 
          onDeleteNote={() => {}} 
        />
        
        {/* Botón para abrir el drawer */}
        {!isDrawerOpen && (
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600/20 border border-blue-500/30 p-2 rounded-l-xl text-blue-400 hover:bg-blue-600/40 transition-all"
          >
            ‹
          </button>
        )}
      </main>
    </div>
  );
}
