import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: "bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] text-white shadow-lg hover:shadow-green-500/30",
  secondary: "bg-[#002147] hover:bg-[#003580] text-white shadow-md",
  outline: "bg-white text-[#002147] border-2 border-[#002147] hover:bg-[#002147] hover:text-white",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-md",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg min-h-[32px]",
  md: "px-4 py-2.5 text-sm rounded-xl min-h-[40px]",
  lg: "px-6 py-3 text-sm rounded-xl min-h-[48px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export function Badge({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const colors = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}