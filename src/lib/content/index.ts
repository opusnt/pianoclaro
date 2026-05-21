import { mockContentRepository } from "@/lib/content/mock-content-repository";

// TODO: reemplazar este adaptador mock por CMS/base de datos cuando el catálogo deje de vivir en TypeScript.
export const contentRepository = mockContentRepository;

export type { ContentRepository } from "@/lib/content/types";
