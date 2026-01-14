'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STAGES = ['PLANIFICACIÓN', 'DISEÑO', 'EJECUCIÓN', 'MONITOREO', 'AJUSTE', 'CIERRE'];

export default function MobileOptimizedPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // Lógica de cronómetro corregida
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans flex flex-col overflow-x-hidden">
      {/* HEADER DINÁMICO */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20">L</div>
          <div>
            <h1 className="text-[10px] md:text-xs font-bold tracking-widest uppercase">LEONARDO</h1>
            <p className="text-[7px] text-blue-500 tracking-[0.3em] uppercase">PROJECT LEAD</p>
          </div>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span className="text-[9px] font-black text-blue-400">SEMANA {selectedWeek} / 12</span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: RESPONSIVE */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-around">
        
        {/* SEMANAS (Ocultas en móviles pequeños o compactadas) */}
        <div className="w-full md:w-auto order-2 md:order-1">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-3 text-center md:text-left">Timeline</p>
          <div className="flex md:grid md:grid-cols-2 gap-1 overflow-x-auto pb-2 md:pb-0">
            {[...Array(12)].map((_, i) => (
              <button key={i} onClick={() => setSelectedWeek(i + 1)} className={`min-w-[40px] py-2 text-[9px] rounded border transition-all ${selectedWeek === i + 1 ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/5 text-gray-700'}`}>
                S{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* CÍRCULO CENTRAL: EL CORAZÓN */}
        <div className="relative order-1 md:order-2">
          <div className={`w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full bg-black border border-blue-500/10 shadow-[0_0_60px_-20px_rgba(59,130,246,0.3)] transition-all ${isActive ? 'scale-105' : 'scale-100'}`}>
            <div className={`absolute inset-0 rounded-full border-t border-blue-500/30 ${isActive ? 'animate-spin-slow' : ''}`}></div>
            <div className="text-center">
              <p className="text-[8px] text-gray-500 tracking-widest uppercase mb-1">Focus Time</p>
              <span className="text-6xl md:text-7xl font-thin tabular-nums">{formatTime(seconds)}</span>
              <div className="mt-6">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-8 py-3 rounded-full text-[9px] font-black tracking-widest transition-all active:scale-90 ${isActive ? 'bg-transparent border border-white/20' : 'bg-blue-600 shadow-xl shadow-blue-900/40'}`}
                >
                  {isActive ? 'PAUSAR' : 'INICIAR'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ETAPAS (Vertical en Desktop, Horizontal en Móvil) */}
        <div className="w-full md:w-auto order-3 space-y-4">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center md:text-right">Fases del Ciclo</p>
          <div className="flex md:flex-col justify-between md:gap-4 overflow-x-auto">
            {STAGES.slice(0, 3).map((stage) => ( // Mostramos solo 3 en móvil para no saturar
              <div key={stage} className="text-[8px] text-gray-500 border-b border-white/5 pb-1 px-2">{stage}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER: FORMULARIO MEJORADO */}
      <div className="mt-6 border-t border-white/5 pt-4">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full py-4 text-[9px] font-black text-blue-500 uppercase tracking-widest bg-white/5 rounded-lg border border-dashed border-white/10">
            + PLANIFICAR NUEVA ETAPA
          </button>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-bottom-2">
            <input type="text" placeholder="¿Objetivo de la etapa?" className="w-full bg-transparent border-b border-white/10 py-2 text-xs outline-none focus:border-blue-500" />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-[8px] font-bold text-gray-500 uppercase">Cerrar</button>
              <button className="flex-[2] bg-blue-600 py-3 rounded text-[9px] font-black uppercase">REGISTRAR EN SUPABASE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
