import { frostedThemePlugin } from "@whop/react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // El color principal de tus botones y cronómetro
        "electric-blue": "#3b82f6", 
        // Colores para las etapas (Stages)
        "planificacion": "#3b82f6",
        "diseno": "#a855f7",
        "ejecucion": "#22c55e",
        "monitoreo": "#eab308",
        "ajuste": "#f97316",
        "cierre": "#ef4444",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.35)',
        'glow-strong': '0 0 60px rgba(59, 130, 246, 0.5)',
      },
      fontFamily: {
        // v0 suele usar una fuente sans limpia, esto ayuda al look pro
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [frostedThemePlugin()],
};
