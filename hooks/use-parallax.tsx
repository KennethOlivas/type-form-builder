"use client";
import { useEffect, useRef } from "react";

export default function useParallax(strength = 20) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const tx = dx * strength;
      const ty = dy * strength;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`;
    }

    function onLeave() {
      const el = ref.current;
      if (!el) return;
      el.style.transform = "translate3d(0,0,0) scale(1)";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref as React.RefObject<HTMLDivElement>;
}
