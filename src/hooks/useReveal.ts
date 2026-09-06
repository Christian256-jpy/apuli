import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>(stagger = 40) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    root.classList.add("reveal-ready");

    if (reduce) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const index = Number(el.dataset.revealIndex || 0);
          el.style.transitionDelay = `${index * stagger}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((el, i) => {
      el.dataset.revealIndex = String(i);
      io.observe(el);
    });

    return () => io.disconnect();
  }, [stagger]);

  return ref;
}
