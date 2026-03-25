// Shared button styling utilities to avoid copy-paste patterns

export const BUTTON_BASE_CLASSES = "group inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95";

export const BUTTON_RESPONSIVE_CLASSES = "px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center min-h-[44px]";

export const BUTTON_VARIANTS = {
  primary: "bg-[#25D366] hover:bg-[#1da851] text-white shadow-2xl hover:shadow-green-500/30",
  secondary: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg border border-white/20",
  navigation: "bg-white/10 hover:bg-white/20 backdrop-blur text-white px-3 py-3 rounded-full text-sm border border-white/20 min-h-[44px] min-w-[44px] justify-center"
};

export const createButtonClasses = (variant: keyof typeof BUTTON_VARIANTS, responsive = true) => {
  return `${BUTTON_BASE_CLASSES} ${responsive ? BUTTON_RESPONSIVE_CLASSES : ''} ${BUTTON_VARIANTS[variant]}`.trim();
};