const VARIANTS = {
  page: "flex justify-center py-20",
  inline: "flex justify-center py-4",
  fullscreen: "min-h-screen flex items-center justify-center",
} as const;

interface SpinnerProps {
  variant?: keyof typeof VARIANTS;
  label?: string;
}

export function Spinner({ variant = "page", label = "Loading..." }: SpinnerProps) {
  return (
    <div className={VARIANTS[variant]}>
      <div
        className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full"
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
