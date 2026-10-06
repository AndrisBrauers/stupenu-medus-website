import { useEffect, type RefObject } from "react";

export function useScrollScene(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (innerHeight - bounds.top) / (bounds.height + innerHeight)),
      );
      element.style.setProperty(
        "--scene",
        reduced.matches ? "0.5" : progress.toFixed(4),
      );
      element.style.setProperty(
        "--travel",
        reduced.matches ? "0" : String(Math.max(0, -bounds.top)),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          element.classList.add("is-seen");
          schedule();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}

export function useDialog(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const element = ref.current;
    const focusable = () =>
      Array.from(
        element.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, [tabindex="0"]',
        ),
      ).filter((el) => el.offsetParent !== null);
    const timer = window.setTimeout(() => focusable()[0]?.focus(), 100);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !element.contains(document.activeElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !element.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", keyboard);
      previous?.focus();
    };
  }, [open, ref, close]);
}
