'use client';

// Agregamos 'use' al import de React explícitamente
import React, { useState, use } from 'react'; 
import { Timer, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importaciones de tus componentes
import { CommunityPanel } from './_v0-imports/CommunityPanel';
import { FocusTimer } from './_v0-imports/FocusTimer';
import { RightDrawer } from './_v0-imports/RightDrawer';
import { AchievementsPanel } from './_v0-imports/AchievementsPanel';

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  // Ahora sí reconocerá 'use' para desenvolver el Promise de params
  const { experienceId } = use(params);
  const [view, setView] = useState('focus');

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden font-sans">
      
      {/* SIDEBAR (Lo mantengo simple para que pruebes el deploy) */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black/50 backdrop-blur-xl z-50">
        <div className="flex flex-col gap-4">
          <button onClick={() => setView('focus')} className={cn("p-4 rounded-2xl", view === 'focus' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <Timer size={24} />
          </button>
          <button onClick={() => setView('community')} className={cn("p-4 rounded-2xl", view === 'community' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <Users size={24} />
          </button>
          <button onClick={() => setView('achievements')} className={cn("p-4 rounded-2xl", view === 'achievements' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-600')}>
            <BarChart3 size={24} />
          </button>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col">
        {/* Renderizado condicional */}
        <div className="flex-1 overflow-y-auto">
          {view === 'focus' && <FocusTimer />}
          {view === 'community' && <CommunityPanel />}
          {view === 'achievements' && <AchievementsPanel />}
        </div>

        {/* Drawer derecho pasándole el ID */}
        <RightDrawer experienceId={experienceId} />
      </main>
    </div>
  );
}
