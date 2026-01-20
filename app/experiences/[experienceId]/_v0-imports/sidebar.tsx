"use client"

import { cn } from "@/lib/utils"
import { Timer, Users, Trophy, Settings } from "lucide-react"

type Tab = "focus" | "community" | "achievements" | "settings"

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  isMobile?: boolean
}

const tabs = [
  { id: "focus" as Tab, icon: Timer, label: "Enfoque" },
  { id: "community" as Tab, icon: Users, label: "Comunidad" },
  { id: "achievements" as Tab, icon: Trophy, label: "Logros" },
  { id: "settings" as Tab, icon: Settings, label: "Ajustes" },
]

export function Sidebar({ activeTab, onTabChange, isMobile = false }: SidebarProps) {
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-black border-t border-white/10 px-2 py-2 z-30">
        <div className="flex items-center justify-around">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
                activeTab === id ? "text-electric-blue" : "text-white/40",
              )}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    )
  }

  // Desktop sidebar
  return (
    <aside className="w-14 bg-black border-r border-white/5 flex flex-col items-center py-6 gap-6">
      {/* Logo */}
      <div className="w-8 h-8 rounded-full border border-electric-blue/50 flex items-center justify-center mb-4">
        <span className="text-xs font-bold text-electric-blue">PL</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              activeTab === id
                ? "bg-electric-blue/20 text-electric-blue"
                : "text-white/40 hover:text-white/70 hover:bg-white/5",
            )}
            title={label}
          >
            <Icon size={20} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </aside>
  )
}
