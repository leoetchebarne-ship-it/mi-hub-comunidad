"use client"

import { useState } from "react"

export function SettingsPanel() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")

  return (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl tracking-[0.2em] text-white mb-2">AJUSTES</h2>
          <p className="text-[10px] md:text-xs text-white/40">Configura tu conexión con Supabase</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Configuración de Supabase */}
          <div className="p-4 md:p-6 border border-white/10 rounded-lg bg-white/5 space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-green-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424a.396.396 0 0 0 .32.63h9.362v8.958a.396.396 0 0 0 .716.233l9.081-12.261a.396.396 0 0 0-.32-.63z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs md:text-sm text-white">Supabase</h3>
                <p className="text-[10px] md:text-xs text-white/40">Base de datos y autenticación</p>
              </div>
            </div>

            <div className="space-y-2.5 md:space-y-3">
              <div>
                <label className="block text-[10px] md:text-xs text-white/50 mb-1">URL del Proyecto</label>
                <input
                  type="text"
                  placeholder="https://xxx.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs text-white/50 mb-1">Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJI..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue/50"
                />
              </div>
            </div>

            <button className="w-full py-2.5 text-[10px] md:text-xs tracking-wider border border-electric-blue/30 text-electric-blue rounded hover:bg-electric-blue/10 transition-colors">
              CONECTAR
            </button>
          </div>

          {/* Información del MVP */}
          <div className="p-3 md:p-4 border border-amber-500/20 rounded-lg bg-amber-500/5">
            <p className="text-[10px] md:text-xs text-amber-500/80 leading-relaxed">
              <strong>MVP Mode:</strong> Actualmente los datos se guardan localmente. Conecta Supabase desde Vercel para
              persistir sesiones, notas y sincronizar con otros usuarios.
            </p>
          </div>

          {/* Estructura de tablas sugerida */}
          <div className="p-3 md:p-4 border border-white/10 rounded-lg">
            <h4 className="text-[10px] md:text-xs tracking-wider text-white/50 mb-2 md:mb-3">TABLAS SUGERIDAS</h4>
            <div className="space-y-1.5 md:space-y-2 font-mono text-[10px] md:text-xs text-white/40">
              <p>• sessions (id, user_id, week, stage, duration...)</p>
              <p>• notes (id, user_id, week, stage, title...)</p>
              <p>• checklist_items (id, note_id, text, completed)</p>
              <p>• users (id, name, avatar_url, current_stage...)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
