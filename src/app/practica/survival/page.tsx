"use client";

import { TrainingArena } from "@/components/training/TrainingArena";
import { SiteHeader } from "@/components/SiteHeader";
import { useRouter } from "next/navigation";

export default function SurvivalModePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
        <TrainingArena
          mode={9} // Mode 9 will be random Ear Training / Random stuff
          survival={true}
          onExit={() => router.push("/perfil")}
        />
      </main>
    </div>
  );
}
