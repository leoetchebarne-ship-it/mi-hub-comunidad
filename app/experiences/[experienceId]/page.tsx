'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STAGES = ['PLANIFICACIÓN', 'DISEÑO', 'EJECUCIÓN', 'MONITOREO', 'AJUSTE', 'CIERRE'];

export default function HybridProjectPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);

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
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans overflow-hidden flex flex-col">
      {/* HEADER MINIMALISTA */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h1 className="text-xl font-light tracking-[0.3em] text-white/90">PROJECT LAB</h1>
          <p className="text-[9px] text-blue-500 tracking-[0.5em] uppercase mt-1">Operaciones Especiales</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400">SEMANA {selectedWeek}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-12 items-center">
        {/* IZQUIERDA: 12 SEMANAS (Sutil) */}
        <div className="col-span-2 space-y-4">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6">Timeline</p>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(12)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedWeek(i + 1)}
                className={`py-3 text-[10px] rounded-lg border transition-all ${selectedWeek === i + 1 ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/5 text-gray-700 hover:border-white/20'}`}
              >
                S{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* CENTRO: EL CÍRCULO QUE TE GUSTABA */}
        <div className="col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-96 h-96 flex items-center justify-center rounded-full bg-black border border-blue-500/20 shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)]">
            {/* Anillo de progreso visual */}
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500/40 animate-spin-slow"></div>
            
            <div className="text-center">
              <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mb-4">Focus Time</p>
              <span className="text-8xl font-extralight tracking-tighter tabular-nums text-blue-50">
                {formatTime(seconds)}
              </span>
              <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-10 py-3 rounded-full text-[10px] font-black tracking-[0.2em] transition-all ${isActive ? 'bg-white/5 text-white border border-white/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'}`}
                >
                  {isActive ? 'PAUSAR SESIÓN' : 'INICIAR ENFOQUE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA: KANBAN VERTICAL */}
        <div className="col-span-2 flex flex-col gap-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 text-right">Etapa Actual</p>
          {STAGES.map((stage) => (
            <button key={stage} className="group text-right">
              <p className="text-[10px] text-gray-500 group-hover:text-blue-400 transition-colors tracking-tighter">{stage}</p>
              <div className="h-[2px] w-full bg-white/5 mt-1 group-focus:bg-blue-500"></div>
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER: NOTA RÁPIDA */}
      <div className="mt-auto border-t border-white/5 pt-6 flex justify-between items-center">
        <div className="flex-1 max-w-2xl">
          <input 
            type="text" 
            placeholder="¿En qué estás trabajando ahora?" 
            className="bg-transparent border-none text-sm text-gray-400 focus:ring-0 w-full placeholder:text-gray-800"
          />
        </div>
        <button className="text-[10px] font-black text-blue-500 hover:text-blue-300 tracking-widest uppercase">
          Finalizar y Registrar en Supabase
        </button>
      </div>
    </div>
  );
}
