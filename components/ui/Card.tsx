import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-8",
};

export function Card({ children, className = "", hover = true, padding = "md" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${
        hover ? "hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 card-hover" : ""
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardLinkProps extends CardProps {
  href: string;
}

export function CardLink({ children, href, className = "", padding = "md" }: CardLinkProps) {
  return (
    <Link
      href={href}
      className={`group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 card-hover block ${paddings[padding]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function CardIcon({ children, color = "from-[#25D366] to-[#1da851]" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${color} mb-4 shadow-lg`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`font-bold text-[#002147] text-sm sm:text-base mb-2 group-hover:text-[#25D366] transition-colors ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 mt-3 text-[#25D366] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
      {children}
      <ArrowRight className="w-3 h-3" />
    </div>
  );
}

export function CardGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 1 | 2 | 3 | 4 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <div className={`grid ${gridCols[cols]} gap-4 sm:gap-5`}>
      {children}
    </div>
  );
}