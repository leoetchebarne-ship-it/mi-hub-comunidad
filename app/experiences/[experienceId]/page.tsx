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

  // Valores temporales para que el componente profesional no falle
  const handleSessionComplete = (data: any) => {
    console.log("Sesión completada:", data);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden font-sans">
      
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
        <div className="flex-1 overflow-y-auto">
          {/* Aquí pasamos las props que TypeScript exigía en tu error de Vercel */}
          {view === 'focus' && (
            <FocusTimer 
              onSessionComplete={handleSessionComplete} 
              currentWeek={1} 
              currentStage="planificacion" 
            />
          )}
          
          {view === 'community' && <CommunityPanel />}
          
          {view === 'achievements' && <AchievementsPanel />}
        </div>

        <RightDrawer experienceId={experienceId} />
      </main>
    </div>
  );
}
