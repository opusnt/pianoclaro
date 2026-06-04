import { notFound } from "next/navigation";

import { contentRepository } from "@/lib/content";
import { getPlayableModuleRegistration, isPlayableModuleId } from "@/lib/modules/playable-modules";

type ModulePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return contentRepository
    .getDetailedLearningModules()
    .filter((module) => isPlayableModuleId(module.id))
    .map((module) => ({
      id: module.id,
    }));
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { id } = await params;
  const module = contentRepository.getDetailedLearningModuleById(id);

  return {
    title: module ? `${module.name} | Piano Claro` : "Módulo | Piano Claro",
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { id } = await params;
  const module = contentRepository.getDetailedLearningModuleById(id);

  if (!module) {
    notFound();
  }

  const registration = getPlayableModuleRegistration(module.id);

  if (!registration) {
    notFound();
  }

  return registration.render(module);
}
