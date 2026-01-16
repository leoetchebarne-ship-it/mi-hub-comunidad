'use client';

import React from 'react';

// Intentamos una importación relativa directa para evitar errores de alias
// Si 'lib' está dos niveles arriba de 'experiences/[id]', usa ../../
export default function ExperiencePage({ params }: any) {
  // Usamos un try-catch básico visual
  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', padding: '20px' }}>
      <h1>Project Lab Status: Operativo</h1>
      <p>Si ves esto, la estructura básica funciona.</p>
      <button 
        onClick={() => alert('Interactividad funcionando')}
        style={{ padding: '10px', background: 'blue', borderRadius: '5px' }}
      >
        Probar Botón
      </button>
    </div>
  );
}
