'use client';
// ... otros imports
import { CommunityPanel } from './_v0-imports/CommunityPanel';
import { FocusTimer } from './_v0-imports/FocusTimer';
import { RightDrawer } from './_v0-imports/RightDrawer';
import { AchievementsPanel } from './_v0-imports/AchievementsPanel';

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params);
  const [view, setView] = useState('focus'); // 'focus', 'community', 'achievements'

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden">
      {/* Tu NAV lateral se queda igual */}
      
      <main className="flex-1 relative">
        {/* Renderizado condicional de componentes de v0 */}
        {view === 'focus' && <FocusTimer />}
        {view === 'community' && <CommunityPanel />}
        {view === 'achievements' && <AchievementsPanel />}

        {/* El Drawer derecho siempre presente o controlado por un estado */}
        <RightDrawer experienceId={experienceId} />
      </main>
    </div>
  );
}
