import { useRef } from "react";
import { gsap, pinConfig, useScrollScene } from "../animation/useScrollScene";
import { MotionCanvas } from "../MotionCanvas";
import {
  imgPhotoToursGallery2,
  imgPhotoToursGallery3,
  imgPhotoToursGallery5,
  imgPhotoToursGallery1,
  imgPhotoToursGallery4,
  imgPhotoToursGallery6,
} from "../design/assets";
import "./PhotoChronicleSection.css";
const frames = [
  { src: imgPhotoToursGallery2, alt: "Прогулка на яхте по Индийскому океану" },
  { src: imgPhotoToursGallery3, alt: "Восхождение к вулкану" },
  { src: imgPhotoToursGallery5, alt: "Подводный мир" },
  { src: imgPhotoToursGallery1, alt: "Полёт над Килиманджаро" },
  { src: imgPhotoToursGallery4, alt: "Пляжи и отели Занзибара" },
  { src: imgPhotoToursGallery6, alt: "Момент путешествия над облаками" },
];
export function PhotoChronicleSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    const section = ref.current!;
    section.classList.toggle("is-static", !desktop || !motion);
    if (!desktop || !motion) return;
    const rail = section.querySelector(".vertical-film");
    const count = section.querySelector(".chronicle-count")!;
    const progress = section.querySelector(".chronicle-progress");
    gsap.set(progress, { scaleX: 1 / 6, transformOrigin: "left" });
    const config = pinConfig(
      section,
      section.querySelector(".pin-stage")!,
      "chronicle",
      6,
    );
    const tl = gsap.timeline({
      scrollTrigger: {
        ...config,
        onUpdate: (self) => {
          config.onUpdate(self);
          const index = gsap.utils.clamp(0, 5, self.progress * 6 - 0.5);
          count.textContent =
            String(Math.round(index) + 1).padStart(2, "0") + " / 06";
          gsap.set(progress, { scaleX: (index + 1) / 6 });
          section.dataset.active = String(Math.round(index));
        },
      },
    });
    tl.to({}, { duration: 0.5 })
      .to(rail, { y: -5 * 620, ease: "none", duration: 5 })
      .to({}, { duration: 0.5 });
  });
  return (
    <section
      id="chronicle"
      className="interactive-section chronicle-section"
      ref={ref}
      data-sequence="chronicle"
      aria-label="Фотохроника путешествия"
    >
      <div className="pin-stage">
        <MotionCanvas>
          <div className="chronicle-window">
            <div className="vertical-film">
              {frames.map((frame, i) => (
                <figure
                  key={frame.src}
                  className="chronicle-shot"
                  data-photo={i}
                >
                  <img
                    src={frame.src}
                    alt={frame.alt}
                    width="2080"
                    height="1010"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
          <span className="chronicle-count">01 / 06</span>
          <div className="chronicle-track">
            <div className="chronicle-progress" />
          </div>
        </MotionCanvas>
      </div>
    </section>
  );
}
