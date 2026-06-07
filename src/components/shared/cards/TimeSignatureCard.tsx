"use client";

export function TimeSignatureCard() {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-12 w-full max-w-2xl mx-auto">
      {/* Visualización de la fracción */}
      <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl w-40">
        <span className="text-6xl font-black text-slate-800 leading-none">4</span>
        <div className="w-16 h-2 bg-slate-300 rounded-full my-3" />
        <span className="text-6xl font-black text-slate-500 leading-none">4</span>
      </div>

      {/* Explicación intuitiva */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2 mb-2">
            <span className="bg-slate-800 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">
              4
            </span>
            El número de arriba
          </h3>
          <p className="text-slate-500">
            Nos dice el **tamaño de la caja**. Significa que en cada compás caben exactamente 4
            pulsos (Tiempos).
          </p>
        </div>

        <div className="h-px w-full bg-slate-800" />

        <div className="opacity-60">
          <h3 className="font-bold text-lg text-slate-500 flex items-center gap-2 mb-2">
            <span className="bg-slate-700 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">
              4
            </span>
            El número de abajo
          </h3>
          <p className="text-slate-500 text-sm">
            Nos dice el tipo de pulso (por ahora, sólo debes saber que el 4 significa "Negras").
          </p>
        </div>
      </div>
    </div>
  );
}
