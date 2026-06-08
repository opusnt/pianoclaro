import { del, get, keys, set } from "idb-keyval";
import type { RepertoireSong } from "@/data/repertoire/songs";

const USER_SCORES_KEY_PREFIX = "user_score_";

export async function saveUserScore(song: RepertoireSong): Promise<void> {
  await set(`${USER_SCORES_KEY_PREFIX}${song.id}`, song);
}

export async function getUserScore(id: string): Promise<RepertoireSong | undefined> {
  return await get(`${USER_SCORES_KEY_PREFIX}${id}`);
}

export async function getAllUserScores(): Promise<RepertoireSong[]> {
  const allKeys = await keys();
  const scoreKeys = allKeys.filter(
    (k) => typeof k === "string" && k.startsWith(USER_SCORES_KEY_PREFIX),
  );

  const scores: RepertoireSong[] = [];
  for (const key of scoreKeys) {
    const score = await get(key as string);
    if (score) {
      scores.push(score as RepertoireSong);
    }
  }
  return scores;
}

export async function deleteUserScore(id: string): Promise<void> {
  await del(`${USER_SCORES_KEY_PREFIX}${id}`);
}
