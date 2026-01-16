'use client';

import React, { useState, useEffect, use } from 'react';
import { Timer, Users, BarChart3, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils'; 

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);
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
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* SIDEBAR PROFESIONAL */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black/50 backdrop-blur-xl z-50">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group cursor-pointer transition-transform active:scale-95">
          <span className="font-black text-white text-lg tracking-tighter italic">PL</span>
        </div>
        
        <div className="flex flex-col gap-4 flex-1">
          <button onClick={() => setView('focus')} className={cn("p-4 rounded-2xl transition-all duration-300", view === 'focus' ? 'bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}>
            <Timer size={24} strokeWidth={1.5} />
          </button>
          <button onClick={() => setView('community')} className={cn("p-4 rounded-2xl transition-all duration-300", view === 'community' ? 'bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}>
            <Users size={24} strokeWidth={1.5} />
          </button>
          <button onClick={() => setView('history')} className={cn("p-4 rounded-2xl transition-all duration-300", view === 'history' ? 'bg-blue-500/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-600 hover:text-gray-400')}>
            <BarChart3 size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
        
        {view === 'focus' && (
          <div className="flex flex-col items-center">
            {/* ANILLO DE LUZ SUTIL */}
            <div className="relative group">
              <div className={cn("absolute -inset-1 rounded-full bg-blue-500/20 blur-2xl transition-opacity duration-1000", isActive ? "opacity-100" : "opacity-0")}></div>
              
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border border-white/5 flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl shadow-2xl">
                <p className="text-[10px] text-blue-500/50 tracking-[0.6em] uppercase mb-6 font-bold">Deep Focus Active</p>
                <h1 className="text-8xl md:text-[120px] font-extralight tracking-[ -0.05em] tabular-nums mb-12 text-white/90">
                  {formatTime(seconds)}
                </h1>
                
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className={cn("w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500", 
                      isActive ? 'bg-white/5 border border-white/10 text-white' : 'bg-blue-600 text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105')}
                  >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                  </button>
                  
                  {seconds > 0 && (
                    <button onClick={() => {setIsActive(false); setSeconds(0)}} className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                      <RotateCcw size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER DERECHO ESTILIZADO */}
        <div className={cn("fixed right-0 top-0 h-full bg-black/80 backdrop-blur-2xl border-l border-white/5 transition-all duration-700 ease-in-out z-40 shadow-2xl", isSidebarOpen ? 'w-[350px]' : 'w-0')}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-24 bg-black/80 backdrop-blur-2xl border border-r-0 border-white/5 flex items-center justify-center rounded-l-3xl text-blue-500 hover:text-blue-400 transition-colors"
          >
            {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className={cn("p-10 w-[350px] space-y-10 transition-opacity duration-500", isSidebarOpen ? 'opacity-100 delay-300' : 'opacity-0')}>
             <div className="space-y-2">
               <h3 className="text-xs font-black text-blue-500 tracking-[0.2em] uppercase">Misión Actual</h3>
               <p className="text-gray-500 text-[11px]">Define tu objetivo para esta sesión de laboratorio.</p>
             </div>
             <div className="space-y-6">
                <input className="bg-transparent border-b border-white/10 w-full py-4 outline-none text-lg font-light focus:border-blue-500 transition-colors placeholder:text-gray-800" placeholder="¿Qué estás construyendo?" />
                <button className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase text-blue-500 hover:bg-blue-600 hover:text-white transition-all">Sincronizar Meta</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
