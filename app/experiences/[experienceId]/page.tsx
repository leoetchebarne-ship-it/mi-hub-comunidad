'use client';

import { use } from 'react';
import { ProjectLab } from './_v0-imports';
// Importamos herramientas de Whop para lógica real
import { validateExperienceAccess } from '@/lib/whop'; 

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);

  // Aquí es donde añadiríamos en el futuro:
  // 1. const user = await getWhopUser();
  // 2. const access = await validateAccess(experienceId);

  return (
    <div className="whop-container h-screen bg-black">
      {/* Pasamos el ID para que los componentes puedan guardar datos en Whop más tarde */}
      <ProjectLab experienceId={experienceId} />
    </div>
  );
}
