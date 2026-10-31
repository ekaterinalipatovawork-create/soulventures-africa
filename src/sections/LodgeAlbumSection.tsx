import { useRef } from "react";
import { gsap, useScrollScene } from "../animation/useScrollScene";
import { LazyVideo } from "../LazyVideo";
import "./LodgeAlbumSection.css";
type Item = { image: string; alt: string; video?: string; height: number };
const columns: Item[][] = [
  [
    { image: "lions.webp", alt: "Львица с львятами", height: 568.889 },
    {
      image: "giraffe-poster.webp",
      alt: "Жираф у дерева",
      video: "giraffe.mp4",
      height: 758.519,
    },
    { image: "meal.webp", alt: "Обед во время путешествия", height: 527.231 },
  ],
  [
    { image: "migration.webp", alt: "Стада в саванне на закате", height: 320 },
    { image: "dolphins.webp", alt: "Дельфины и пловец", height: 758.519 },
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
export function LodgeAlbumSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    if (!motion) return;
    const section = ref.current!;
    const lanes = section.querySelectorAll(".lodge-lane");
    const amount = desktop ? 1 : 0.2;
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
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });
  return (
    <section
      id="lodge"
      className="lodge-album"
      ref={ref}
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
              <figure
                className="lodge-shot"
                key={item.image}
                style={{ aspectRatio: `426.666667 / ${item.height}` }}
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
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
