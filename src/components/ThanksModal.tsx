import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

// Tak-modal med dialog-semantik, fokus-fælde og fokus-retur.
export function ThanksModal({
  plate,
  onClose,
}: {
  plate: string | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const open = plate !== null;

  useEffect(() => {
    if (!open) return;
    const prevFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const f = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thanks-title"
    >
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-softlg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-tp/10">
          <Check className="h-8 w-8 text-tp" strokeWidth={2.5} />
        </div>
        <h3 id="thanks-title" className="text-2xl font-extrabold text-ink">
          Tak for din henvendelse
        </h3>
        <p className="mt-3 text-ink/70">
          Vi har modtaget din nummerplade{" "}
          <strong className="text-ink">{plate}</strong> og vender tilbage med
          dit uforpligtende tilbud inden for få timer.
        </p>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="btn-cta mt-6 w-full rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
        >
          Luk
        </button>
      </div>
    </div>
  );
}
