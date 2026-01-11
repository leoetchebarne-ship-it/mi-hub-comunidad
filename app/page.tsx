import { validateToken } from '@/lib/auth'; // Usando el auth del template de Whop

export default async function CronometroPage({ params }: { params: { experienceId: string } }) {
  // 1. Validamos que el usuario viene de Whop
  const { userId } = await validateToken(); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-8">Cronómetro de Enfoque</h1>
      
      <div className="relative w-64 h-64 flex items-center justify-center border-4 border-blue-500 rounded-full">
        <span className="text-5xl font-mono">25:00</span>
      </div>

      <div className="flex gap-4 mt-10">
        <button className="px-8 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition">
          Iniciar
        </button>
        <button className="px-8 py-2 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition">
          Reiniciar
        </button>
      </div>

      <p className="mt-8 text-gray-500 text-sm">Usuario: {userId}</p>
    </div>
  );
}
