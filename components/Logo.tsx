import Image from "next/image";

interface LogoProps {
  variant?: "horizontal" | "square" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  horizontal: {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-10 w-auto",
    xl: "h-12 w-auto"
  },
  square: {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  },
  icon: {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }
};

const logoSources = {
  horizontal: "/icons/logo-horizontal.png",
  square: "/logo.png", // Use the full logo for square variant
  icon: "/icons/logo-icon.png"
};

export default function Logo({
  variant = "horizontal",
  size = "md",
  className,
  priority = false
}: LogoProps) {
  const sizeClass = sizeClasses[variant][size];
  const src = logoSources[variant];

  return (
    <Image
      src={src}
      alt="SucceviaHub Logo"
      width={variant === "horizontal" ? 1000 : variant === "square" ? 1000 : 400}
      height={variant === "horizontal" ? 290 : variant === "square" ? 290 : 400}
      className={className ? `${sizeClass} ${className}` : sizeClass}
      priority={priority}
    />
  );
}