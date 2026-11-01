import { useRef, type ReactNode } from "react";
import { gsap, pinConfig, useScrollScene } from "../animation/useScrollScene";
import { LazyVideo } from "../LazyVideo";
import "./LodgeAlbumSection.css";
type Item = {
  image: string;
  alt: string;
  video?: string;
  height: number;
  source?: string;
  hero?: boolean;
};
const columns: Item[][] = [
  [
    {
      image: "sunset.webp",
      alt: "Лодка в океане на закате",
      source: "339:241",
      height: 568.889,
    },
    {
      image: "flamingos.webp",
      alt: "Фламинго на озере Натрон",
      source: "339:223",
      height: 758.519,
    },
    { image: "meal.webp", alt: "Обед во время путешествия", height: 527.231 },
  ],
  [
    { image: "migration.webp", alt: "Стада в саванне на закате", height: 320 },
    {
      image: "dolphins-gallery-poster.jpg",
      video: "dolphins-gallery.mp4",
      alt: "Дельфины в Индийском океане",
      height: 758.519,
      hero: true,
    },
    {
      image: "elephants-poster.webp",
      alt: "Слоны в саванне",
      video: "elephants.mp4",
      height: 758.519,
    },
  ],
  [
    { image: "starfish.webp", alt: "Морская звезда на Занзибаре", height: 640 },
    { image: "antelope.webp", alt: "Газель вблизи", height: 568.889 },
    {
      image: "giraffes-poster.webp",
      alt: "Жираф в зарослях",
      video: "giraffes.mp4",
      height: 700,
    },
  ],
];
export function LodgeAlbumSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    const root = ref.current!;
    root.classList.toggle("has-film-transition", desktop && motion);
    if (!motion) return;
    const section = root.querySelector<HTMLElement>("#lodge")!;
    const stage = root.querySelector<HTMLElement>(".lodge-pin-stage")!;
    const lanes = gsap.utils.toArray<HTMLElement>(".lodge-lane", root);
    const slot = root.querySelector<HTMLElement>(".lodge-video-slot")!;
    const hero = root.querySelector<HTMLElement>(".lodge-shot--hero")!;
    const next = root.querySelector<HTMLElement>(".lodge-next")!;
    const amount = desktop ? 1 : 0.2;
    // The focus point is derived from the layout slot, never from the animated video.
    const focus = () =>
      Math.max(
        0,
        slot.offsetTop +
          lanes[1].offsetTop +
          120 -
          (innerHeight - slot.offsetHeight) / 2,
      );
    const sizeStage = () => {
      stage.style.height =
        focus() + Math.max(innerHeight, next.offsetHeight) + "px";
      next.style.top = focus() + "px";
    };
    if (desktop) sizeStage();
    lanes.forEach((lane, i) => {
      const direction = i === 1 ? -1 : 1;
      gsap.fromTo(
        lane,
        { y: direction * 70 * amount },
        {
          y: -direction * 120 * amount,
          ease: "none",
          scrollTrigger: {
            id: "lodge-" + i,
            trigger: section,
            start: "top bottom",
            endTrigger: desktop ? root : section,
            end: desktop ? () => "top -" + focus() : "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    if (!desktop) {
      gsap.fromTo(
        hero,
        { scale: 0.96 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: slot,
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
      return;
    }
    gsap.set(lanes[1], { zIndex: 3 });
    const config = pinConfig(root, stage, "lodge-focus", 2.6);
    const tl = gsap.timeline({
      scrollTrigger: {
        ...config,
        start: () => "top -" + focus(),
        onRefreshInit: sizeStage,
      },
    });
    tl.to({}, { duration: 0.2 })
      .fromTo(
        hero,
        {
          width: () => slot.offsetWidth,
          height: () => slot.offsetHeight,
          x: 0,
          y: 0,
        },
        {
          width: () => innerWidth,
          height: () => innerHeight,
          x: () => -slot.getBoundingClientRect().left,
          y: () => -(slot.offsetTop + lanes[1].offsetTop + 120 - focus()),
          duration: 1.3,
          ease: "none",
        },
        0.2,
      )
      .to(
        root.querySelectorAll(".lodge-shot:not(.lodge-shot--hero)"),
        { autoAlpha: 0, y: -60, duration: 1.1, ease: "none" },
        0.2,
      )
      .fromTo(
        next,
        { y: () => innerHeight },
        { y: 0, duration: 1.1, ease: "none" },
        1.85,
      )
      .to({}, { duration: 0.2 });
    return () => {
      stage.style.removeProperty("height");
      next.style.removeProperty("top");
    };
  });
  const photo = (item: Item) => (
    <figure
      className={"lodge-shot" + (item.hero ? " lodge-shot--hero" : "")}
      data-source-node={item.source}
    >
      {item.video ? (
        <LazyVideo
          src={"/assets/video/" + item.video}
          poster={"/assets/lodge/" + item.image}
          label={item.alt}
        />
      ) : (
        <img
          src={"/assets/lodge/" + item.image}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
      )}
    </figure>
  );
  return (
    <div ref={ref} id="lodge-journey" className="lodge-journey">
      <div className="lodge-pin-stage">
        <section
          id="lodge"
          className="lodge-album"
          data-sequence="lodge"
          aria-label="Фотохроника путешествия: сафари и океан"
        >
          <div className="lodge-columns">
            {columns.map((column, i) => (
              <div
                className="lodge-lane"
                key={i}
                data-direction={i === 1 ? "down" : "up"}
              >
                {column.map((item) => (
                  <div
                    key={item.image}
                    className={item.hero ? "lodge-video-slot" : "lodge-slot"}
                    style={{ aspectRatio: `426.666667 / ${item.height}` }}
                  >
                    {photo(item)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        <div className="lodge-next">{children}</div>
      </div>
    </div>
  );
}
