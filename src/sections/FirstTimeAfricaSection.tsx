import { useRef } from "react";
import { gsap, pinConfig, useScrollScene } from "../animation/useScrollScene";
import { MotionCanvas } from "../MotionCanvas";
import { img4, img03, img04, img05 } from "../design/assets";
import "./FirstTimeAfricaSection.css";
const states = [
  {
    title: "РАССКАЖЕТЕ, КАКИМ ВИДИТЕ ПУТЕШЕСТВИЕ",
    text: "Вы просто рассказываете, каким представляете путешествие, а мы берём на себя всё остальное — от маршрута и отелей до деталей на месте. Что хочется увидеть, сколько дней есть и с кем едете. Учтём пожелания и подскажем, что действительно стоит включить в маршрут.",
    image: img4,
    alt: "Первое путешествие в Африку",
  },
  {
    title: "ВИЗА И ДОКУМЕНТЫ",
    text: "Заранее объясним, какие документы понадобятся и что проверить перед вылетом.",
    image: img03,
    alt: "Из Африки с любовью",
  },
  {
    title: "СОБЕРЁМ САФАРИ, ОКЕАН И ОТЕЛИ",
    text: "Подберём национальные парки, формат сафари, проверенные отели и пляжи. Вам не придётся самостоятельно сравнивать десятки вариантов.",
    image: img04,
    alt: "Друзья в отпуске",
  },
  {
    title: "ВСТРЕЧА В АФРИКЕ",
    text: "Согласуем прилёт, трансфер и первые дни, чтобы вы спокойно начали путешествие.",
    image: img05,
    alt: "Первый раз в Африку",
  },
];
export function FirstTimeAfricaSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref, ({ desktop, motion }) => {
    const section = ref.current!;
    section.classList.toggle("is-static", !desktop || !motion);
    if (!desktop || !motion) return;
    const texts = section.querySelectorAll(".first-step-copy"),
      photos = section.querySelectorAll(".first-step-photo");
    gsap.set([...texts, ...photos], { autoAlpha: 0 });
    gsap.set([texts[0], photos[0]], { autoAlpha: 1 });
    const config = pinConfig(
      section,
      section.querySelector(".pin-stage")!,
      "first-africa",
      4,
    );
    const tl = gsap.timeline({
      scrollTrigger: {
        ...config,
        onUpdate: (self) => {
          config.onUpdate(self);
          section.dataset.active = String(
            Math.round(gsap.utils.clamp(0, 3, self.progress * 4 - 0.5)),
          );
        },
      },
    });
    tl.to({}, { duration: 0.7 });
    for (let i = 1; i < 4; i++) {
      const at = i - 0.3;
      tl.to(
        texts[i - 1],
        { y: -40, autoAlpha: 0, duration: 0.25, ease: "none" },
        at,
      )
        .fromTo(
          texts[i],
          { y: 60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35, ease: "none" },
          at + 0.25,
        )
        .to(
          photos[i - 1],
          { y: -80, autoAlpha: 0, duration: 0.6, ease: "none" },
          at,
        )
        .fromTo(
          photos[i],
          { y: 180, autoAlpha: 0, clipPath: "inset(18% 0 0 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.6,
            ease: "none",
          },
          at,
        );
    }
    tl.to({}, { duration: 0.7 });
  });
  return (
    <section
      ref={ref}
      id="first-africa"
      className="interactive-section first-africa"
      data-sequence="first-africa"
      aria-label="Впервые в Африку"
    >
      <div className="pin-stage">
        <MotionCanvas>
          <h2 className="first-title">
            ВПЕРВЫЕ
            <br />
            <span>В АФРИКУ?</span>
          </h2>
          <div className="first-steps">
            {states.map((state, i) => (
              <article key={state.title} className="first-step" data-step={i}>
                <div className="first-step-copy">
                  <h3>{state.title}</h3>
                  <p>{state.text}</p>
                </div>
                <figure className="first-step-photo">
                  <img
                    src={state.image}
                    alt={state.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </article>
            ))}
          </div>
          <p className="first-note">
            Даже если это ваше первое сафари —<br />
            вы в надёжных руках.
          </p>
          <button className="first-cta" data-action="request">
            СОБРАТЬ МОЙ МАРШРУТ
          </button>
        </MotionCanvas>
      </div>
    </section>
  );
}
