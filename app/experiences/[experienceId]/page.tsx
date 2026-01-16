'use client';

import React, { useState, useEffect, use } from 'react';
import { cn } from '@/lib/utils'; 

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  // CORRECCIÓN NEXT.JS 16: Desempaquetamos los params de forma segura
  const resolvedParams = use(params);
  const experienceId = resolvedParams.experienceId;

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('focus');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      
      {/* BARRA DE NAVEGACIÓN LATERAL */}
      <nav className="w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black z-50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs">
          {experienceId.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col gap-6 flex-1">
          <button onClick={() => setView('focus')} className={cn("p-3 rounded-xl transition-all", view === 'focus' ? 'bg-white/10 text-blue-400' : 'text-gray-500')}>⏱</button>
          <button onClick={() => setView('community')} className={cn("p-3 rounded-xl transition-all", view === 'community' ? 'bg-white/10 text-blue-400' : 'text-gray-500')}>👥</button>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col items-center justify-center p-6">
        {view === 'focus' && (
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border border-white/5 flex flex-col items-center justify-center bg-black/50 shadow-2xl">
              <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mb-4">Focus Mode</p>
              <h1 className="text-7xl md:text-9xl font-thin tracking-tighter tabular-nums mb-10">{formatTime(seconds)}</h1>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={cn("px-10 py-4 rounded-full text-[10px] font-black tracking-widest transition-all", 
                    isActive ? 'bg-white/10' : 'bg-blue-600')}
                >
                  {isActive ? 'PAUSAR' : 'INICIAR'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL LATERAL DERECHO */}
        <div className={cn("fixed right-0 top-0 h-full bg-[#0a0a0a] border-l border-white/5 transition-all duration-500 z-40", isSidebarOpen ? 'w-80' : 'w-0')}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -left-10 top-1/2 -translate-y-1/2 bg-[#0a0a0a] border border-white/5 p-3 rounded-l-xl text-blue-500"
          >
            {isSidebarOpen ? '→' : '←'}
          </button>
          <div className={cn("p-8 w-80", isSidebarOpen ? 'opacity-100' : 'opacity-0')}>
             <h3 className="text-xs font-black text-gray-500 uppercase mb-4">Objetivo</h3>
             <input className="bg-transparent border-b border-white/10 w-full py-2 outline-none text-sm" placeholder="Escribe aquí..." />
          </div>
        </div>
      </main>
    </div>
  );
}
