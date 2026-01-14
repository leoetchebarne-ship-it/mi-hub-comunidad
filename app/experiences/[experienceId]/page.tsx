'use client';

import React, { useState, useEffect } from 'react';

export default function ArchitectedFrontEnd() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('focus'); // focus, community, history

  // Lógica de cronómetro local
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
      
      {/* BARRA DE NAVEGACIÓN LATERAL (Sidebar) */}
      <nav className="w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-black z-50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black">L</div>
        <div className="flex flex-col gap-6 flex-1">
          <button onClick={() => setView('focus')} className={`p-3 rounded-xl transition-all ${view === 'focus' ? 'bg-white/10 text-blue-400' : 'text-gray-600'}`}>⏱</button>
          <button onClick={() => setView('community')} className={`p-3 rounded-xl transition-all ${view === 'community' ? 'bg-white/10 text-blue-400' : 'text-gray-600'}`}>👥</button>
          <button onClick={() => setView('history')} className={`p-3 rounded-xl transition-all ${view === 'history' ? 'bg-white/10 text-blue-400' : 'text-gray-600'}`}>📊</button>
        </div>
        <button className="text-gray-700 text-xs">LOGOUT</button>
      </nav>

      <main className="flex-1 relative flex flex-col items-center justify-center p-6">
        {/* VISTA DE ENFOQUE */}
        {view === 'focus' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border border-white/5 flex flex-col items-center justify-center bg-black/50 shadow-2xl">
              <div className={`absolute inset-0 rounded-full border-t border-blue-500/20 ${isActive ? 'animate-spin-slow' : ''}`}></div>
              <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mb-4">Focus Mode</p>
              <h1 className="text-7xl md:text-9xl font-thin tracking-tighter tabular-nums mb-10">{formatTime(seconds)}</h1>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-10 py-4 rounded-full text-[10px] font-black tracking-widest transition-all ${isActive ? 'bg-white/10' : 'bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)]'}`}
                >
                  {isActive ? 'PAUSAR' : 'INICIAR'}
                </button>
                {seconds > 0 && (
                  <button className="px-6 py-4 rounded-full bg-red-900/20 text-red-500 text-[10px] font-black tracking-widest uppercase">
                    Terminar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA DE COMUNIDAD (Placeholder) */}
        {view === 'community' && (
          <div className="w-full max-w-md space-y-4 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-xl font-light tracking-tighter border-b border-white/5 pb-4">Operaciones en Vivo</h2>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                <div>
                  <p className="text-xs font-bold">Usuario_{i}</p>
                  <p className="text-[10px] text-blue-500 uppercase tracking-widest">Diseñando • 01:24:00</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PANEL EXPANDIBLE (FLECHITA) */}
        <div className={`fixed right-0 top-0 h-full bg-[#0a0a0a] border-l border-white/5 transition-all duration-500 z-40 ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -left-10 top-1/2 -translate-y-1/2 bg-[#0a0a0a] border border-white/5 p-3 rounded-l-xl text-blue-500"
          >
            {isSidebarOpen ? '→' : '←'}
          </button>
          
          <div className={`p-8 w-80 space-y-8 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <h3 className="text-xs font-black tracking-widest text-gray-500 uppercase">Configuración de Tarea</h3>
            <div className="space-y-4">
              <input type="text" className="w-full bg-transparent border-b border-white/5 py-3 text-sm outline-none focus:border-blue-500" placeholder="¿Cuál es el objetivo?" />
              <button className="w-full bg-blue-600 py-4 rounded-xl text-[10px] font-black uppercase">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
