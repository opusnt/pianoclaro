import { IProgressProvider, ProgressState } from "./types";
import { createClient } from "../supabase/client";

export class SupabaseProgressProvider implements IProgressProvider {
  private getSupabase() {
    try {
      return createClient();
    } catch (e) {
      console.warn("Supabase no está configurado correctamente. Usando fallback local.");
      return null;
    }
  }

  async loadState(): Promise<ProgressState | null> {
    if (typeof window === "undefined") return null;

    try {
      const supabase = this.getSupabase();
      
      if (!supabase) {
        // Fallback al localStorage si Supabase falla
        const local = localStorage.getItem("piano_claro_global_state");
        return local ? JSON.parse(local) : null;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        // Fallback al localStorage si no está logueado
        const local = localStorage.getItem("piano_claro_global_state");
        return local ? JSON.parse(local) : null;
      }

      // Usuario logueado, buscar en Supabase
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Rows not found", which is expected for new users
        console.error("Error fetching from Supabase:", error);
      }

      if (data) {
        return {
          mastery: data.mastery,
          stats: data.stats,
          badges: data.badges || [],
          completedLessons: data.completed_lessons || []
        };
      }

      // Si no hay datos en la DB pero sí en local, migramos a la DB
      const local = localStorage.getItem("piano_claro_global_state");
      if (local) {
        const localState = JSON.parse(local);
        await this.saveState(localState);
        return localState;
      }

      return null;
    } catch (error) {
      console.error("Error in Supabase loadState", error);
      return null;
    }
  }

  async saveState(state: ProgressState): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Siempre guardamos en local como respaldo/optimismo
      localStorage.setItem("piano_claro_global_state", JSON.stringify(state));

      const supabase = this.getSupabase();
      if (!supabase) return;

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) return; // Si no hay usuario, solo se queda en local

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          mastery: state.mastery,
          stats: state.stats,
          badges: state.badges,
          completed_lessons: state.completedLessons,
          updated_at: new Date().toISOString()
        });
        
    } catch (error) {
      console.error("Error saving progress to Supabase", error);
    }
  }
}
