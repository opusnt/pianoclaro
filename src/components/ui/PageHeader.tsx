import type { ElementType } from "react";
import { Heading, Text } from "./Typography";

interface PageHeaderProps {
  icon?: ElementType;
  badge?: string;
  title: string;
  description?: string;
  iconColor?: "fuchsia" | "cyan" | "emerald";
  className?: string;
}

export function PageHeader({
  icon: Icon,
  badge,
  title,
  description,
  iconColor = "cyan",
  className = "",
}: PageHeaderProps) {
  const colors = {
    fuchsia: { bg: "bg-fuchsia-100", text: "text-fuchsia-500", border: "border-fuchsia-200" },
    cyan: { bg: "bg-sky-100", text: "text-sky-500", border: "border-sky-200" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-500", border: "border-emerald-200" },
  };

  const c = colors[iconColor];

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {Icon && (
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${c.bg} ${c.text}`}
        >
          <Icon className="w-10 h-10" />
        </div>
      )}
      {badge && (
        <Text variant="label" className="mb-2">
          {badge}
        </Text>
      )}
      <Heading level={1}>{title}</Heading>
      {description && (
        <Text variant="body" className="max-w-md mx-auto">
          {description}
        </Text>
      )}
    </div>
  );
}
