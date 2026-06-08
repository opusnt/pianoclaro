"use client";

import { Library, Music, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { builtInRepertoire, type RepertoireSong } from "@/data/repertoire/songs";
import { deleteUserScore, getAllUserScores, saveUserScore } from "@/lib/storage/userScores";

export default function RepertoirePage() {
  const [userSongs, setUserSongs] = useState<RepertoireSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserScores();
  }, []);

  const loadUserScores = async () => {
    try {
      const scores = await getAllUserScores();
      setUserSongs(scores);
    } catch (error) {
      console.error("Failed to load user scores", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const newSong: RepertoireSong = {
      id: `user_${Date.now()}`,
      title: file.name.replace(/\.(xml|mxl|musicxml)$/i, ""),
      composer: "Usuario",
      difficulty: "intermediate",
      xmlData: text,
    };

    await saveUserScore(newSong);
    await loadUserScores();

    // Clear input
    event.target.value = "";
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("¿Estás seguro de eliminar esta partitura?")) {
      await deleteUserScore(id);
      await loadUserScores();
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-20 pt-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Repertorio</h1>
        <p className="text-lg text-slate-500">
          Practica con partituras clásicas o sube tus propios archivos MusicXML.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Library className="w-6 h-6 text-blue-deep" />
            Obras Clásicas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builtInRepertoire.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Music className="w-6 h-6 text-fuchsia-500" />
            Tus Partituras
          </h2>
          <div>
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-transform active:scale-95 bg-blue-deep text-white shadow hover:bg-blue-deep/90 h-11 px-6">
              <Upload className="w-4 h-4" />
              Subir MusicXML
              <input
                type="file"
                accept=".xml,.musicxml,.mxl"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando tus partituras...</div>
        ) : userSongs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no tienes partituras</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Sube archivos .xml o .mxl exportados desde MuseScore, Finale o Sibelius para
              practicarlos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSongs.map((song) => (
              <SongCard key={song.id} song={song} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SongCard({
  song,
  onDelete,
}: {
  song: RepertoireSong;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <Link href={`/repertorio/${song.id}`}>
      <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-deep/20 transition-all cursor-pointer h-full flex flex-col">
        {onDelete && (
          <button
            type="button"
            onClick={(e) => onDelete(song.id, e)}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-deep transition-colors flex items-center justify-center mb-5">
          <Music className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-xl text-slate-800 line-clamp-1 mb-1">{song.title}</h3>
        <p className="text-slate-500 text-sm">{song.composer}</p>
        <div className="mt-auto pt-6 flex justify-between items-center">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase
            ${
              song.difficulty === "beginner"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : song.difficulty === "intermediate"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-red-50 text-red-700 border border-red-200"
            }
          `}
          >
            {song.difficulty === "beginner"
              ? "Básico"
              : song.difficulty === "intermediate"
                ? "Intermedio"
                : "Avanzado"}
          </span>
          <span className="text-blue-deep text-sm font-bold group-hover:underline">Estudiar →</span>
        </div>
      </div>
    </Link>
  );
}
