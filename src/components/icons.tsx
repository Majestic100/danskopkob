import { cn } from "@/lib/utils";

export function DanishFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 37 28" aria-hidden="true">
      <rect width="37" height="28" fill="#C8102E" />
      <rect x="12" width="4" height="28" fill="#fff" />
      <rect y="12" width="37" height="4" fill="#fff" />
    </svg>
  );
}

export function TrustpilotStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1l2.9 7.6H23l-6.6 4.9 2.6 7.6L12 16.7 5 21.1l2.6-7.6L1 8.6h8.1z"
        fill="#00B67A"
      />
    </svg>
  );
}

export function TrustStars({
  size = "sm",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const cls = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  return (
    <span
      className={cn("flex", className)}
      aria-label="Trustpilot 5 ud af 5 stjerner"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cls}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ marginRight: 2 }}
        >
          <rect width="24" height="24" rx="3" fill="#00B67A" />
          <path
            d="M12 4l2.06 5.4 5.77.3-4.5 3.62 1.5 5.58L12 15.9 6.67 18.9l1.5-5.58-4.5-3.62 5.77-.3z"
            fill="#fff"
          />
        </svg>
      ))}
    </span>
  );
}
