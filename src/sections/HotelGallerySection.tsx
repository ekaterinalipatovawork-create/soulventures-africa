import { useRef } from "react";
import { gsap, pinConfig, useScrollScene } from "../animation/useScrollScene";
import { MotionCanvas } from "../MotionCanvas";
import { hotelPhotos as hotels } from "./hotel-photos";
export function HotelGallerySection() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    const section = ref.current!;
    section.classList.toggle("is-static", !desktop || !motion);
    if (!desktop || !motion) return;
    const cards = gsap.utils.toArray<HTMLElement>(".hotel-film-card", section);
    // A photograph holds in place while the next rises over it, as in the
    // restaurant spread in the supplied ibicheskiy reference. No side exit.
    const pose = (i: number) => ({
      x: 468 + (i % 2 ? -8 : 8),
      y: 278 + (i % 2 ? 8 : 0),
      rotation: i % 2 ? 2 : -2.5,
    });
    cards.forEach((card, i) => {
      gsap.set(card, {
        ...pose(i),
        y: i === 0 ? pose(i).y : 1050,
        zIndex: i + 1,
      });
    });
    const config = pinConfig(
      section,
      section.querySelector(".pin-stage")!,
      "hotels",
      hotels.length * 0.65,
    );
    const tl = gsap.timeline({ scrollTrigger: config });
    tl.to({}, { duration: 0.4 });
    for (let i = 1; i < cards.length; i++) {
      const at = 0.4 + (i - 1) * 0.95;
      tl.to(
        cards[i - 1],
        {
          y: 258,
          x: 460,
          scale: 0.97,
          rotation: i % 2 ? -4 : 4,
          duration: 0.75,
          ease: "none",
        },
        at,
      )
        .to(cards[i], { ...pose(i), duration: 0.75, ease: "none" }, at)
        .to({}, { duration: 0.2 });
    }
    tl.to({}, { duration: 0.35 });
  });
  return (
    <section
      ref={ref}
      id="hotels"
      className="interactive-section hotel-gallery"
      data-sequence="hotels"
      aria-label="Лучшие отели и лоджи"
    >
      <div className="pin-stage">
        <MotionCanvas>
          <div className="hotel-heading">
            <h2>ЛУЧШИЕ ОТЕЛИ И ЛОДЖИ,</h2>
            <p>КОТОРЫЕ МЫ ПРОВЕРИЛИ ЛИЧНО</p>
          </div>
          <p className="hotel-note">
            Здесь продолжается
            <br />
            путешествие
          </p>
          <div className="hotel-film">
            {hotels.map((h, i) => (
              <figure
                key={h.src}
                className="hotel-film-card"
                data-photo={i}
                data-source-node={h.node}
              >
                <img
                  src={h.src}
                  alt={h.alt}
                  width={h.dimensions[0]}
                  height={h.dimensions[1]}
                  loading="lazy"
                />
                <figcaption>{h.name}</figcaption>
              </figure>
            ))}
          </div>
          <button className="hotel-cta" data-action="request">
            Подобрать путешествие
          </button>
        </MotionCanvas>
      </div>
    </section>
  );
}
