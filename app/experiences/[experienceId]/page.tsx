'use client';

import React, { useState, useEffect } from 'react';

const STAGES = ['PLANIFICACIÓN', 'DISEÑO', 'EJECUCIÓN', 'MONITOREO', 'AJUSTE', 'CIERRE'];

export default function AdvancedFrontEnd() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  // Datos locales para simular el Front-End
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Investigación de Mercado', week: 1, stage: 'PLANIFICACIÓN', subtasks: ['Google Trends', 'Análisis Competencia'] },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-10 flex flex-col overflow-hidden">
      
      {/* 1. HEADER: PROGRESS TRACKER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(59,130,246,0.3)]">L</div>
          <div className="hidden md:block">
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80">Leonardo</h2>
            <div className="flex gap-1 mt-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-3 h-1 rounded-full ${i < selectedWeek ? 'bg-blue-500' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Semana {selectedWeek} <span className="text-gray-600">/ 12</span></p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-10 items-center">
        
        {/* 2. TIMELINE: MINI CALENDARIO */}
        <div className="col-span-12 md:col-span-2 space-y-3 order-2 md:order-1">
          <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] mb-4">Estructura Temporal</p>
          <div className="grid grid-cols-6 md:grid-cols-2 gap-2">
            {[...Array(12)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedWeek(i + 1)}
                className={`py-3 text-[9px] rounded-lg border transition-all ${selectedWeek === i + 1 ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-white/5 text-gray-800 hover:text-gray-500'}`}
              >
                S{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 3. CORE: EL CRONÓMETRO */}
        <div className="col-span-12 md:col-span-8 flex flex-col items-center order-1 md:order-2">
          <div className="relative group p-10">
            {/* Resplandor dinámico según el tiempo */}
            <div className={`absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-0 transition-opacity duration-1000 ${isActive ? 'opacity-10' : ''}`}></div>
            
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border border-white/5 flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl shadow-2xl">
              <p className="text-[10px] text-gray-500 tracking-[0.6em] uppercase mb-4">Deep Work Session</p>
              <h3 className="text-8xl md:text-[120px] font-thin tracking-tighter tabular-nums mb-10 text-white/90">{formatTime(seconds)}</h3>
              
              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-16 py-4 rounded-full text-[10px] font-black tracking-[0.4em] transition-all transform active:scale-95 ${isActive ? 'bg-white/5 border border-white/20 text-white hover:bg-white/10' : 'bg-blue-600 text-white shadow-[0_15px_30px_-10px_rgba(59,130,246,0.5)]'}`}
                >
                  {isActive ? 'PAUSAR' : 'INICIAR ENFOQUE'}
                </button>
                
                {seconds > 0 && (
                  <button 
                    onClick={() => {setIsActive(false); setSeconds(0)}}
                    className="text-[9px] font-bold text-gray-600 hover:text-red-500 transition-colors uppercase tracking-widest"
                  >
                    Descartar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. KANBAN VERTICAL: STATUS */}
        <div className="col-span-12 md:col-span-2 h-full flex flex-col order-3">
          <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] mb-6 text-right">Flujo de Operación</p>
          <div className="space-y-6">
            {STAGES.map((stage, idx) => (
              <div key={stage} className="text-right group">
                <div className="flex items-center justify-end gap-3 mb-1">
                  <span className={`text-[10px] transition-colors ${idx === 0 ? 'text-blue-400 font-black' : 'text-gray-700 group-hover:text-gray-400'}`}>{stage}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-white/5'}`}></div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-l from-white/10 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ACCIÓN FINAL */}
      <div className="mt-auto pt-10 flex flex-col items-center gap-4">
        <button 
          onClick={() => setShowPlanModal(true)}
          className="group relative flex items-center gap-4 px-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all"
        >
          <span className="text-blue-500 text-xl font-light">+</span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Registrar Nueva Tarea en Ciclo</span>
        </button>
        <p className="text-[8px] text-gray-700 font-medium">LOS DATOS SE SINCRONIZARÁN AL FINALIZAR LA SESIÓN</p>
      </div>

      {/* MODAL DE PLANIFICACIÓN */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-black border border-white/10 p-10 rounded-[40px] shadow-2xl space-y-10">
            <header>
              <h2 className="text-2xl font-light tracking-tighter">Planificación Estratégica</h2>
              <p className="text-[9px] text-blue-500 uppercase tracking-[0.4em] mt-2">Configuración de Tarea</p>
            </header>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[8px] uppercase text-gray-500 font-black tracking-widest">Definición de Objetivo</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-blue-500 text-lg font-light transition-all" placeholder="Ej: Diseño de Interfaz de Usuario" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[8px] uppercase text-gray-500 font-black tracking-widest">Resultado de Éxito (Métrica)</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-blue-500 text-lg font-light transition-all" placeholder="Ej: 3 pantallas terminadas en Figma" />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <button onClick={() => setShowPlanModal(false)} className="py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">Cerrar</button>
                <button className="bg-blue-600 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-transform">Guardar en Ciclo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
