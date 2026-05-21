import { CreditCard } from "lucide-react";

import { PricingCard } from "@/components/PricingCard";
import { contentRepository } from "@/lib/content";

export const metadata = {
  title: "Pricing | Piano Claro",
};

export default function PricingPage() {
  const pricingPlans = contentRepository.getPricingPlans();

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg border border-blue-deep/10 bg-white/78 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-soft text-blue-deep">
            <CreditCard aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Planes para validar el MVP
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Una estructura simple para probar adquisición, valor educativo y una futura capa de
            revisión humana.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </main>
  );
}
