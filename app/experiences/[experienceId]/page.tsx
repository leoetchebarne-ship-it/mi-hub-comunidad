'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión a tu Supabase original
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FocusPage({ params }: { params: { experienceId: string } }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Estos datos se llenarán con tu info de Whop
  const [userData, setUserData] = useState({
    nickname: "Cargando...",
    avatar: ""
  });

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1); // El tiempo sube
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 && hrs > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStop = async () => {
    setIsActive(false);
    // Guardamos la sesión en Supabase al detener
    if (seconds > 0) {
      const { error } = await supabase
        .from('focus_sessions')
        .insert([{ duration: seconds, status: 'completed' }]);
      if (error) console.error("Error guardando:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000] text-white p-6 font-sans">
      {/* Perfil del Usuario arriba */}
      <div className="absolute top-10 flex items-center gap-4 bg-white/5 p-2 pr-8 rounded-full border border-white/10 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-400 overflow-hidden flex items-center justify-center text-xl font-bold">
          {userData.avatar ? <img src={userData.avatar} alt="Avatar" /> : "L"}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Enfoque de</p>
          <p className="text-lg font-medium tracking-tight">Leonardo</p>
        </div>
      </div>

      <div className="text-center space-y-12">
        <h2 className="text-xs uppercase tracking-[0.6em] text-gray-500 font-semibold">Sesión de Productividad</h2>
        
        {/* Contador Central */}
        <div className="relative w-85 h-85 flex items-center justify-center rounded-full bg-black border border-blue-500/30 shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)]">
          <span className="text-8xl font-extralight tracking-tighter tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-48 py-4 rounded-full font-bold transition-all duration-300 transform active:scale-95 ${
              isActive ? 'bg-transparent border border-white/20 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isActive ? 'PAUSAR' : 'COMENZAR'}
          </button>
          
          {seconds > 0 && (
            <button 
              onClick={handleStop}
              className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Terminar y Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
