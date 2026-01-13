'use client'; // Obligatorio para la lógica del cronómetro

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Supabase con las llaves que ya tienes en Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PomodoroPage() {
  const [seconds, setSeconds] = useState(1500); // 25 minutos
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      saveSession(); // Guardar en Supabase al terminar
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const saveSession = async () => {
    // Aquí es donde guardamos el progreso en tu base de datos
    const { error } = await supabase
      .from('focus_sessions')
      .insert([{ duration: 1500, status: 'completed' }]);
    
    if (error) console.error("Error guardando:", error);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000] text-white font-sans">
      <div className="text-center space-y-8">
        <h1 className="text-sm uppercase tracking-[0.3em] text-blue-400 font-bold">Modo Enfoque</h1>
        
        {/* Círculo de Progreso Minimalista */}
        <div className="relative w-72 h-72 flex items-center justify-center border-[1px] border-blue-500/30 rounded-full shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
          <span className="text-7xl font-light tracking-tighter tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex gap-6 justify-center">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="px-10 py-3 bg-white text-black rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            {isActive ? 'PAUSA' : 'INICIAR'}
          </button>
          <button 
            onClick={() => {setIsActive(false); setSeconds(1500);}}
            className="px-10 py-3 bg-transparent border border-white/20 rounded-full font-bold hover:bg-white/10 transition-all"
          >
            RESETEAR
          </button>
        </div>
      </div>
    </div>
  );
}
