import { ProfileDashboard } from "./ProfileDashboard";

export const metadata = {
  title: "Perfil - Piano Claro",
  description: "Tu progreso y estadísticas de estudio en Piano Claro.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <ProfileDashboard />
      </main>
    </div>
  );
}
