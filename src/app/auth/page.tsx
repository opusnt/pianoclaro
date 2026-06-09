import { Music2 } from "lucide-react";
import { login, signup } from "./actions";
import Link from "next/link";

export default async function LoginPage(
  props: {
    searchParams: Promise<{ error?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Music2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black text-white">Piano Claro</span>
      </Link>

      <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Bienvenido</h1>
          <p className="text-slate-400 mb-8">Inicia sesión para guardar tu progreso en la nube.</p>

          {searchParams?.error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 flex gap-3 flex-col sm:flex-row">
              <button
                formAction={login}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              >
                Ingresar
              </button>
              <button
                formAction={signup}
                className="flex-1 bg-slate-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
