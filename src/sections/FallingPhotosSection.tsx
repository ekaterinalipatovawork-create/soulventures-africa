import { useRef } from "react";
import { gsap, useScrollScene } from "../animation/useScrollScene";
import "./FallingPhotosSection.css";
const rows = [
  {
    wide: {
      file: "gt-exp-1",
      node: "342:228",
      alt: "Сафари из джипа: слон на дороге",
      width: 721,
      height: 481,
    },
    falling: {
      file: "gt-exp-3",
      node: "342:230",
      alt: "Путешественница кормит жирафа",
      width: 721,
      height: 1052,
    },
  },
  {
    wide: {
      file: "gt-exp-5",
      node: "342:233",
      alt: "Лодки и пляж у Индийского океана",
      width: 721,
      height: 721,
    },
    falling: {
      file: "gt-exp-4",
      node: "342:232",
      alt: "Встреча с местными жителями",
      width: 721,
      height: 1023,
    },
  },
  {
    wide: {
      file: "gt-exp-6",
      node: "342:234",
      alt: "Килиманджаро над саванной",
      width: 496,
      height: 496,
    },
  },
];
export function FallingPhotosSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    if (!motion) return;
    const section = ref.current!;
    section
      .querySelectorAll<HTMLElement>(".falling-photo-portrait")
      .forEach((photo, i) => {
        const row = photo.closest<HTMLElement>(".falling-photo-row")!;
        gsap.fromTo(
          photo,
          { y: desktop ? -50 : -20, rotation: i % 2 ? -3 : 4 },
          {
            y: () => row.offsetHeight * (desktop ? 0.84 : 0.42),
            rotation: i % 2 ? 5 : -5,
            ease: "none",
            scrollTrigger: {
              id: "falling-photo-" + i,
              trigger: row,
              start: "top 48%",
              end: () => "+=" + row.offsetHeight * (desktop ? 0.84 : 0.6),
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
  });
  return (
    <section
      id="falling-photos"
      ref={ref}
      className="falling-photos"
      aria-label="Впечатления, которые запомнятся на всю жизнь"
    >
      <div className="falling-photos-heading">
        <h2>
          ВПЕЧАТЛЕНИЯ,
          <br />
          КОТОРЫЕ
          <br />
          ЗАПОМНЯТСЯ
          <br />
          <span>НА ВСЮ ЖИЗНЬ</span>
        </h2>
      </div>
      <div className="falling-photos-rows">
        {rows.map((row, i) => (
          <div key={row.wide.file} className="falling-photo-row" data-row={i}>
            <figure
              className={
                "falling-photo-wide" + (i === 2 ? " falling-photo-square" : "")
              }
              data-source-node={row.wide.node}
            >
              <img
                src={"/assets/falling/" + row.wide.file + ".webp"}
                alt={row.wide.alt}
                width={row.wide.width}
                height={row.wide.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
            {row.falling && (
              <figure
                className="falling-photo-portrait"
                data-source-node={row.falling.node}
                style={{ zIndex: 20 + i }}
              >
                <img
                  src={"/assets/falling/" + row.falling.file + ".webp"}
                  alt={row.falling.alt}
                  width={row.falling.width}
                  height={row.falling.height}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
