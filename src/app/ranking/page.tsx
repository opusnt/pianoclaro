"use client";

import { createClient } from "@/lib/supabase/client";
import { Trophy, Star, Medal, User } from "lucide-react";
import { useEffect, useState } from "react";

type RankUser = {
  user_id: string;
  email: string;
  total_xp: number;
};

export default function RankingPage() {
  const [leaders, setLeaders] = useState<RankUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const loadLeaders = async () => {
      const { data, error } = await supabase.from("leaderboard").select("*").limit(10);
      if (!error && data) {
        setLeaders(data);
      }
      setIsLoading(false);
    };
    loadLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-500 rounded-full mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Salón de la Fama</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Los 10 estudiantes con mayor maestría y experiencia (XP) en la plataforma. ¡Practica todos los días para escalar en el ranking!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
              Cargando tabla de posiciones...
            </div>
          ) : leaders.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {leaders.map((user, index) => {
                let badge = null;
                if (index === 0) badge = <Medal className="w-8 h-8 text-amber-400" />;
                else if (index === 1) badge = <Medal className="w-8 h-8 text-slate-300" />;
                else if (index === 2) badge = <Medal className="w-8 h-8 text-amber-700" />;

                return (
                  <div key={user.user_id} className={`flex items-center gap-6 p-6 transition-colors hover:bg-slate-50 ${index < 3 ? 'bg-amber-50/30' : ''}`}>
                    <div className="w-12 text-center font-black text-2xl text-slate-300">
                      #{index + 1}
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {badge || <User className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg">
                        {user.email.split("@")[0]}
                      </div>
                      <div className="text-sm text-slate-500">Pianista Activo</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-2xl text-fuchsia-500 flex items-center gap-1 justify-end">
                        {user.total_xp} <Star className="w-5 h-5 fill-fuchsia-500" />
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP Total</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Aún no hay usuarios en el ranking. ¡Sé el primero en jugar!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
