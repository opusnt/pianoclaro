import React from "react";

export interface AccidentalBadgeProps {
  type?: "sharp" | "flat" | "natural";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AccidentalBadge({
  type = "sharp",
  size = "md",
  className = "",
}: AccidentalBadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all shrink-0";

  const variants = {
    sharp:
      "bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.2)]",
    flat: "bg-sky-100 text-sky-600 border border-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.2)]",
    natural:
      "bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  };

  const sizes = {
    sm: "w-8 h-8 rounded-lg text-lg",
    md: "w-12 h-12 rounded-xl text-2xl",
    lg: "w-16 h-16 rounded-2xl text-4xl",
  };

  const getSymbol = () => {
    switch (type) {
      case "sharp":
        return "♯";
      case "flat":
        return "♭";
      case "natural":
        return "♮";
      default:
        return "";
    }
  };

  return (
    <div className={`${baseStyles} ${variants[type]} ${sizes[size]} ${className}`}>
      <span className="translate-y-[-5%]">{getSymbol()}</span>
    </div>
  );
}
