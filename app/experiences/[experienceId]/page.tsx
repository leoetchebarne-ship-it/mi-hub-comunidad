'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STAGES = ['PLANIFICACIÓN', 'DISEÑO', 'EJECUCIÓN', 'MONITOREO', 'AJUSTE', 'CIERRE'];

export default function RefinedProjectPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // ARREGLO DEL CONTADOR: Ahora sí cuenta
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans overflow-hidden flex flex-col">
      {/* HEADER: AHORA CON TU PERFIL */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            L
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.2em] text-white/90 uppercase">Leonardo</h1>
            <p className="text-[8px] text-blue-500 tracking-[0.4em] uppercase">Project Lead | Operaciones</p>
          </div>
        </div>
        <div className="bg-white/5 p-2 px-6 rounded-full border border-white/10 shadow-2xl">
          <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Semana {selectedWeek} / 12</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-12 items-center">
        {/* TIMELINE IZQUIERDA */}
        <div className="col-span-2 space-y-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Planificación Temporal</p>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(12)].map((_, i) => (
              <button key={i} onClick={() => setSelectedWeek(i + 1)} className={`py-3 text-[9px] rounded-md border transition-all ${selectedWeek === i + 1 ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/5 text-gray-700'}`}>
                S{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* CENTRO: EL CRONÓMETRO */}
        <div className="col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-80 h-80 flex items-center justify-center rounded-full bg-black border border-blue-500/20 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
            <div className={`absolute inset-0 rounded-full border-t-2 border-blue-500/40 ${isActive ? 'animate-spin-slow' : ''}`}></div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 tracking-[0.3em] uppercase mb-2">Focus Time</p>
              <span className="text-7xl font-light tabular-nums text-white">
                {formatTime(seconds)}
              </span>
              <div className="mt-8">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-8 py-3 rounded-full text-[9px] font-black tracking-widest transition-all ${isActive ? 'bg-white/5 border border-white/20 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'}`}
                >
                  {isActive ? 'DETENER' : 'INICIAR ENFOQUE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA: ESTADOS KANBAN */}
        <div className="col-span-2 flex flex-col gap-6">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Fase de Proyecto</p>
          {STAGES.map((stage) => (
            <div key={stage} className="text-right group cursor-pointer">
              <p className="text-[10px] text-gray-500 group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{stage}</p>
              <div className="h-[1px] w-full bg-white/5 mt-1 group-hover:bg-blue-500/50"></div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER: FORMULARIO DE PLANIFICACIÓN */}
      <div className="mt-auto border-t border-white/5 pt-6 bg-black">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="text-[10px] font-black text-blue-500 hover:text-blue-300 tracking-widest uppercase">
            + Abrir Planificador de Tarea (Etapa de Investigación)
          </button>
        ) : (
          <div className="flex gap-8 items-end animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 space-y-4">
              <input type="text" placeholder="¿Cuál es el objetivo de esta etapa?" className="bg-transparent border-b border-white/10 w-full text-sm py-2 focus:border-blue-500 outline-none" />
              <input type="text" placeholder="¿Qué resultado esperas obtener?" className="bg-transparent border-b border-white/10 w-full text-sm py-2 focus:border-blue-500 outline-none" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowForm(false)} className="text-[10px] text-gray-500 uppercase font-bold">Cancelar</button>
              <button className="bg-blue-600 px-6 py-2 rounded text-[10px] font-black uppercase">Registrar en Ciclo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
