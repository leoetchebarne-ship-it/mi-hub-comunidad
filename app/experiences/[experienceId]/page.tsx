'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STAGES = ['PLANIFICACIÓN', 'DISEÑO', 'EJECUCIÓN', 'MONITOREO', 'AJUSTE', 'CIERRE'];

export default function ProjectLabPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState<any[]>([]);

  // Cronómetro ascendente
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans">
      {/* HEADER: PROJECT LAB */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tighter italic">PROJECT LAB | OPERACIONES</h1>
        <p className="text-[10px] text-emerald-500 tracking-[0.4em] uppercase">Gestión de proyectos profesional</p>
      </div>

      {/* SECCIÓN 1: CRONÓMETRO */}
      <div className="bg-[#111] border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-400">Cronómetro de Sesión</h2>
          <span className="text-4xl font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            {formatTime(seconds)}
          </span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2 rounded flex items-center gap-2 font-bold text-xs transition-all ${isActive ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'}`}
          >
            {isActive ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button onClick={() => {setIsActive(false); setSeconds(0)}} className="px-6 py-2 bg-gray-800 rounded text-xs font-bold uppercase">Reset</button>
        </div>
      </div>

      {/* SECCIÓN 2: PLANIFICADOR 12 SEMANAS */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-[#111] border border-white/5 rounded-xl p-4">
          <h2 className="text-xs font-black mb-4 text-gray-500 uppercase tracking-widest">Plan 12 Semanas</h2>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[...Array(12)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedWeek(i + 1)}
                className={`py-2 text-[10px] rounded border ${selectedWeek === i + 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/5 text-gray-600'}`}
              >
                S{i + 1}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 italic">Notas de la Semana {selectedWeek}:</p>
            <textarea className="w-full bg-black/50 border border-white/5 rounded p-3 text-xs h-32 focus:outline-none focus:border-emerald-500/50" placeholder="Escribe tus objetivos aquí..."></textarea>
          </div>
        </div>

        {/* SECCIÓN 3: KANBAN DE 6 ETAPAS */}
        <div className="col-span-9">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Flujo de Proyecto</h2>
            <button className="bg-emerald-600 text-[10px] px-3 py-1 rounded font-bold">+ Nueva Tarea</button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {STAGES.map((stage) => (
              <div key={stage} className="bg-[#111]/50 border-t-2 border-emerald-500/30 rounded-t p-3 min-h-[300px]">
                <p className="text-[9px] font-black text-center mb-4 text-gray-400">{stage}</p>
                <div className="bg-white/5 border border-white/5 rounded p-2 text-[10px] cursor-pointer hover:border-emerald-500/50 transition-colors">
                  Ejemplo de tarea...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
