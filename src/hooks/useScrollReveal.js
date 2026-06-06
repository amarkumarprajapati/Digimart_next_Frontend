import { useEffect, useRef } from "react";

/**
 * Hook that uses IntersectionObserver to add a
 * "revealed" class to elements with section-reveal / section-scale etc.
 * Attach the returned ref to a wrapper element.
 * 
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref} className="section-reveal"> ... </section>
 */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px 0px -40px 0px",
      }
    );

    // Observe the ref element itself plus any child section-reveal elements
    const targets = el.querySelectorAll(
      ".section-reveal, .section-reveal-left, .section-reveal-right, .section-scale, .stagger-children"
    );

    if (
      el.classList.contains("section-reveal") ||
      el.classList.contains("section-reveal-left") ||
      el.classList.contains("section-reveal-right") ||
      el.classList.contains("section-scale") ||
      el.classList.contains("stagger-children")
    ) {
      observer.observe(el);
    }

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
};

/**
 * Standalone initializer — call once in a top-level component
 * to auto-observe all .section-reveal elements on the page.
 */
export const initScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  const targets = document.querySelectorAll(
    ".section-reveal, .section-reveal-left, .section-reveal-right, .section-scale, .stagger-children"
  );
  targets.forEach((t) => observer.observe(t));

  return () => observer.disconnect();
};

export default useScrollReveal;
