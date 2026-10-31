import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export type SceneConditions = { desktop: boolean; motion: boolean };
/** Each section owns its timeline and cleanup; GSAP shares one scroll scheduler. */
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  setup: (conditions: SceneConditions) => void | (() => void),
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => setup(ctx.conditions as SceneConditions),
      );
      return () => media.revert();
    }, ref);
    return () => context.revert();
  }, deps);
}
export function useMediaRefresh() {
  useLayoutEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let live = true;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (live) ScrollTrigger.refresh();
      }, 120);
    };
    let anchorTimer: ReturnType<typeof setTimeout>;
    document.fonts.ready.then(() => {
      if (!live) return;
      refresh();
      // Native hash jumps can happen before pin spacers have their final height.
      if (location.hash)
        anchorTimer = setTimeout(() => {
          if (!live) return;
          const target = document.getElementById(
            decodeURIComponent(location.hash.slice(1)),
          );
          if (!target) return;
          ScrollTrigger.refresh();
          const pin = ScrollTrigger.getAll().find(
            (trigger) => trigger.trigger === target && trigger.pin,
          );
          window.scrollTo(
            0,
            pin ? pin.start : target.getBoundingClientRect().top + scrollY,
          );
        }, 250);
    });
    document.addEventListener("load", refresh, true);
    addEventListener("pageshow", refresh);
    refresh();
    return () => {
      live = false;
      clearTimeout(timer);
      clearTimeout(anchorTimer);
      document.removeEventListener("load", refresh, true);
      removeEventListener("pageshow", refresh);
    };
  }, []);
}
export function pinConfig(
  section: HTMLElement,
  stage: HTMLElement,
  id: string,
  steps: number,
) {
  return {
    id,
    trigger: section,
    pin: stage,
    start: "top top",
    end: () => "+=" + Math.round(innerHeight * steps),
    scrub: true,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onRefresh: (self: ScrollTrigger) => {
      section.dataset.pinStart = String(self.start);
      section.dataset.pinEnd = String(self.end);
    },
    onUpdate: (self: ScrollTrigger) => {
      section.dataset.progress = self.progress.toFixed(5);
    },
  };
}
