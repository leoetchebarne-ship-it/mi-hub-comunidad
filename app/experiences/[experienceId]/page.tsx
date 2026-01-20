'use client';

import { use } from 'react';
import { ProjectLab } from './_v0-imports';

// COMENTAMOS ESTA LÍNEA HASTA QUE CREEMOS EL ARCHIVO EN LIB
// import { validateExperienceAccess } from '@/lib/whop'; 

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Tu diseño de v0 ahora vive dentro de ProjectLab */}
      <ProjectLab experienceId={experienceId} />
    </div>
  );
}
