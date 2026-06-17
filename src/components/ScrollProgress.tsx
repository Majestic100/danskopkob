import { useEffect, useState } from "react";

// Tynd fremdriftslinje øverst, der viser hvor langt man er scrollet.
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1">
      <div
        className="h-full bg-gradient-to-r from-brand to-[#ff5b66]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
