import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ButtonLink";
import type { PricingPlan } from "@/types/learning";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={`flex h-full flex-col rounded-lg border p-6 ${
        plan.highlighted
          ? "border-blue-deep bg-blue-deep text-white shadow-soft"
          : "border-blue-deep/10 bg-white/78 text-ink"
      }`}
    >
      <div>
        <p
          className={`text-sm font-bold ${plan.highlighted ? "text-gold-soft" : "text-blue-deep"}`}
        >
          {plan.name}
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className={plan.highlighted ? "text-white/70" : "text-muted"}>{plan.period}</span>
        </div>
        <p
          className={`mt-4 text-sm leading-6 ${plan.highlighted ? "text-white/78" : "text-muted"}`}
        >
          {plan.description}
        </p>
      </div>
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-5">
            <Check
              aria-hidden="true"
              className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-gold-soft" : "text-teal-soft"}`}
            />
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href="/rutas"
        variant={plan.highlighted ? "secondary" : "primary"}
        className={`mt-7 ${plan.highlighted ? "bg-white text-blue-deep hover:bg-cream" : ""}`}
      >
        {plan.cta}
      </ButtonLink>
    </article>
  );
}
